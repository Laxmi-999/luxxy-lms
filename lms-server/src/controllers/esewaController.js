// src/controllers/esewaController.js
import crypto from 'crypto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import Transaction from '../models/transaction.js';
import Borrow from '../models/borrow.js';

const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE;
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY;
const ESEWA_PAYMENT_URL = process.env.ESEWA_PAYMENT_URL;
const ESEWA_VERIFICATION_URL = process.env.ESEWA_VERIFICATION_URL;
const FRONTEND_URL = process.env.FRONTEND_NGROK_URL;

const generateEsewaSignature = (params) => {
    const { tAmt, txNfId, scd, su, fu } = params;
    if (!tAmt || !txNfId || !scd || !su || !fu) {
        throw new Error("Missing parameters for eSewa signature generation. Check tAmt, txNfId, scd, su, fu.");
    }
    const dataToSign = `${tAmt},${txNfId},${scd},${su},${fu}`;
    const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY);
    hmac.update(dataToSign);
    return hmac.digest('base64');
};

export const EsewaInitiatePayment = async (req, res) => {
    const { amount, userId, borrowIds } = req.body;
    let actualTotalFine = 0;

    try {
        const borrows = await Borrow.find({
            _id: { $in: borrowIds },
            user: userId,
            status: { $nin: ['returned', 'fine_paid'] }
        });

        if (borrows.length === 0 || borrows.some(b => b.user.toString() !== userId.toString())) {
            return res.status(400).json({ message: 'No active borrows found for payment or unauthorized.' });
        }
        for (const borrow of borrows) {
            actualTotalFine += (borrow.fine || 0);
        }

        if (actualTotalFine === 0) {
            return res.status(400).json({ message: 'No outstanding fines for selected borrows.' });
        }
        if (Math.abs(actualTotalFine - amount) > 0.01) {
            console.warn(`Amount mismatch for user ${userId}: Frontend ${amount}, Backend ${actualTotalFine}`);
            return res.status(400).json({ message: 'Fine amount mismatch. Please refresh and try again.' });
        }

    } catch (dbError) {
        console.error('Database error during fine calculation:', dbError);
        return res.status(500).json({ message: 'Internal server error during fine calculation.' });
    }

    const transactionUuid = uuidv4();

    try {
        const newPayment = new Transaction({
            transactionUuid: transactionUuid,
            amount: actualTotalFine,
            userId: userId,
            borrowIds: borrowIds,
            status: 'INITIATED',
        });
        await newPayment.save();
        console.log(`Transaction ${transactionUuid} initiated and saved to DB.`);

        // Ensure FRONTEND_URL does NOT have a trailing slash in .env
        const successRedirectUrl = `${FRONTEND_URL}/success`;
        const failureRedirectUrl = `${FRONTEND_URL}/fines?status=failed`;

        const esewaParams = {
            amt: actualTotalFine.toFixed(2),
            txNfId: transactionUuid,
            psc: '0',
            pdc: '0',
            tAmt: actualTotalFine.toFixed(2),
            scd: ESEWA_MERCHANT_CODE,
            su: successRedirectUrl,
            fu: failureRedirectUrl,
        };

        esewaParams.signature = generateEsewaSignature(esewaParams);

        // --- CORRECTED THIS LINE ---
        esewaParams.signed_field_names = "tAmt,txNfId,scd,su,fu"; // <--- This MUST match generateEsewaSignature fields
        // --- END CORRECTION ---

        console.log("DEBUG: eSewa Parameters for HTML Form Submission:");
        console.log("  esewaUrl:", ESEWA_PAYMENT_URL);
        console.log("  esewaParams:", esewaParams);

        res.json({
            esewaUrl: ESEWA_PAYMENT_URL,
            esewaParams: esewaParams,
        });

    } catch (error) {
        console.error("Error in EsewaInitiatePayment:", error);
        return res.status(500).json({ message: "Internal server error during payment initiation.", error: error.message });
    }
};

export const paymentStatus = async (req, res) => {
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).json({ message: "Missing transaction ID." });
    }

    try {
        const transaction = await Transaction.findOne({ transactionUuid: product_id });

        if (!transaction) {
            console.warn(`Transaction record not found for transactionUuid: ${product_id}`);
            return res.status(404).json({ message: "Transaction record not found." });
        }

        if (transaction.status === 'COMPLETE') {
            console.log(`Transaction ${product_id} already marked as COMPLETE. Skipping re-verification.`);
            return res.status(200).json({ message: "Payment already processed and successful." });
        }

        const verificationData = new URLSearchParams();
        verificationData.append('scd', ESEWA_MERCHANT_CODE);
        verificationData.append('rid', transaction.esewaRefId || product_id);
        verificationData.append('oid', product_id);
        verificationData.append('amt', transaction.amount.toFixed(2));

        console.log("DEBUG: Direct eSewa Verification Request Parameters:");
        console.log("  URL:", ESEWA_VERIFICATION_URL);
        console.log("  Body:", verificationData.toString());

        const verificationResponse = await axios.post(ESEWA_VERIFICATION_URL, verificationData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const verificationResult = verificationResponse.data;
        console.log('eSewa Verification Response (Raw):', verificationResult);

        let esewaStatus = 'FAILED';
        let esewaRefId = null;

        if (typeof verificationResult === 'string') {
            if (verificationResult.includes('<status>COMPLETE</status>')) {
                esewaStatus = 'COMPLETE';
            } else if (verificationResult.includes('<status>PENDING</status>')) {
                esewaStatus = 'PENDING';
            }
            const refIdMatch = verificationResult.match(/<refId>(.*?)<\/refId>/);
            if (refIdMatch && refIdMatch[1]) {
                esewaRefId = refIdMatch[1];
            }
        } else if (typeof verificationResult === 'object' && verificationResult.status) {
            esewaStatus = verificationResult.status;
            esewaRefId = verificationResult.refId;
        }

        console.log(`eSewa status for ${product_id}: ${esewaStatus}`);

        if (esewaStatus === 'COMPLETE') {
            await Transaction.updateOne(
                { transactionUuid: product_id },
                {
                    status: 'COMPLETE',
                    esewaRefId: esewaRefId,
                    verifiedAt: new Date(),
                    esewaCallbackData: verificationResult
                }
            );

            if (transaction.borrowIds && transaction.borrowIds.length > 0) {
                await Borrow.updateMany(
                    { _id: { $in: transaction.borrowIds } },
                    { $set: { fine: 0, status: 'returned', finePaidAt: new Date() } }
                );
                console.log(`Fines for borrows ${transaction.borrowIds.join(', ')} updated to 0.`);
            }
            return res.status(200).json({ message: "Payment successful and fines updated." });

        } else if (esewaStatus === 'PENDING') {
            await Transaction.updateOne({ transactionUuid: product_id }, { status: 'PENDING', verifiedAt: new Date(), esewaCallbackData: verificationResult });
            return res.status(200).json({ message: "Transaction is still PENDING at eSewa." });
        } else {
            await Transaction.updateOne({ transactionUuid: product_id }, { status: 'FAILED', verifiedAt: new Date(), esewaCallbackData: verificationResult });
            return res.status(400).json({ message: `Payment not complete: ${esewaStatus}` });
        }

    } catch (error) {
        console.error("Error in paymentStatus (outer catch):", error);
        const errorMessage = error.response?.data || error.message;
        await Transaction.updateOne({ transactionUuid: product_id }, { status: 'FAILED', verifiedAt: new Date(), esewaCallbackData: errorMessage.toString() });
        return res.status(500).json({ message: "Server error during payment status check.", error: errorMessage });
    }
};
