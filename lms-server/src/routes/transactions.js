// src/controllers/esewaController.js
import { v4 as uuidv4 } from 'uuid'; // For generating unique transaction IDs

// Import the esewajs package
import { EsewaPaymentGateway, EsewaCheckStatus } from 'esewajs';

// --- Import your Mongoose Models ---
import Transaction from '../models/transaction.js'; // Your updated Transaction model
import Borrow from '../models/borrow.js';         // Your Borrow model

// eSewa configuration from environment variables
// IMPORTANT: Ensure these variable names EXACTLY match your .env file
const ESEWA_MERCHANT_CODE = process.env.MERCHANT_ID;
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY;
const ESEWA_PAYMENT_URL = process.env.ESEWAPAYMENT_URL; // For redirecting to eSewa payment page
const ESEWA_VERIFICATION_URL = process.env.ESEWAPAYMENT_STATUS_CHECK_URL; // For server-to-server status check
const FRONTEND_URL = process.env.FRONTEND_URL; // Your frontend's public URL (ngrok for local)

// --- 1. Initiate Payment Endpoint (Called by Frontend) ---
export const EsewaInitiatePayment = async (req, res) => {
    // Data coming from frontend: amount (total fine), userId, borrowIds
    const { amount, userId, borrowIds } = req.body;

    // --- IMPORTANT: Server-Side Validation & Recalculation ---
    // Fetch the actual borrow records from your database to prevent tampering.
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
        // Optional: Compare `actualTotalFine` with `amount` from frontend
        if (Math.abs(actualTotalFine - amount) > 0.01) {
            console.warn(`Amount mismatch for user ${userId}: Frontend ${amount}, Backend ${actualTotalFine}`);
            return res.status(400).json({ message: 'Fine amount mismatch. Please refresh and try again.' });
        }

    } catch (dbError) {
        console.error('Database error during fine calculation:', dbError);
        return res.status(500).json({ message: 'Internal server error during fine calculation.' });
    }

    // Generate a unique transaction ID for your system.
    const transactionUuid = uuidv4();

    try {
        // Save pending transaction to your database
        const newPayment = new Transaction({
            transactionUuid: transactionUuid,
            amount: actualTotalFine,
            userId: userId,
            borrowIds: borrowIds,
            status: 'INITIATED',
        });
        await newPayment.save();
        console.log(`Transaction ${transactionUuid} initiated and saved to DB.`);

        // --- DEBUGGING LOGS ---
        const successRedirectUrl = `${FRONTEND_URL}/success`;
        const failureRedirectUrl = `${FRONTEND_URL}/fines?status=failed`; // Or `${FRONTEND_URL}/failure` if you prefer a dedicated page
        console.log("DEBUG: eSewa Parameters for EsewaPaymentGateway:");
        console.log("  amount:", actualTotalFine.toFixed(2));
        console.log("  product_code (txNfId):", transactionUuid);
        console.log("  merchant_id (scd):", ESEWA_MERCHANT_CODE);
        console.log("  secret_key:", ESEWA_SECRET_KEY ? "LOADED" : "UNDEFINED");
        console.log("  success_url:", successRedirectUrl);
        console.log("  failure_url:", failureRedirectUrl);
        console.log("  esewa_url (Gateway):", ESEWA_PAYMENT_URL);
        // --- END DEBUGGING LOGS ---

        // Call EsewaPaymentGateway from the esewajs package
        // Parameters: (amount, tax_amount, service_charge, delivery_charge,
        //              product_code, merchant_id, secret_key,
        //              success_url, failure_url, esewa_url,
        //              signature, signed_field_names)
        const reqPayment = await EsewaPaymentGateway(
            actualTotalFine.toFixed(2), // amount
            0,                          // tax_amount
            0,                          // service_charge
            0,                          // delivery_charge
            transactionUuid,            // product_code (your unique transaction ID)
            ESEWA_MERCHANT_CODE,        // merchant_id
            ESEWA_SECRET_KEY,           // secret_key
            successRedirectUrl,         // success_url (points to your frontend SuccessPage)
            failureRedirectUrl,         // failure_url (points to your FinesPage or dedicated FailurePage)
            ESEWA_PAYMENT_URL,          // esewa_url (e.g., https://rc.esewa.com.np/epay/main)
            undefined,                  // signature (esewajs generates internally)
            undefined                   // signed_field_names (esewajs handles internally)
        );

        if (!reqPayment) {
            console.error("EsewaPaymentGateway returned no response.");
            return res.status(400).json({ message: "Error sending data to eSewa." });
        }

        // The esewajs package should return the URL to which eSewa will redirect the user.
        // This structure assumes esewajs correctly returns a redirect URL.
        if (reqPayment.status === 200 && reqPayment.request && reqPayment.request.res && reqPayment.request.res.responseUrl) {
            return res.send({
                url: reqPayment.request.res.responseUrl, // This is the URL for frontend redirection
            });
        } else {
            console.error("EsewaPaymentGateway failed or returned unexpected status:", reqPayment);
            // Optionally update transaction status to FAILED if initiation truly failed
            // await Transaction.updateOne({ transactionUuid }, { status: 'FAILED' });
            return res.status(400).json({ message: "Failed to initiate payment with eSewa." });
        }

    } catch (error) {
        console.error("Error in EsewaInitiatePayment:", error);
        return res.status(500).json({ message: "Internal server error during payment initiation." });
    }
};

// / Verify your environment variables are loaded
// Debug: Verify environment variables
console.log('eSewa Configuration:', {
    merchantId: process.env.MERCHANT_ID,
    secretKey: process.env.ESEWA_SECRET_KEY ? '*****' : 'MISSING',
    paymentUrl: process.env.ESEWAPAYMENT_URL,
    statusCheckUrl: process.env.ESEWAPAYMENT_STATUS_CHECK_URL
});

export const paymentStatus = async (req, res) => {
    const { product_id, refId, amount } = req.body;

    console.log('Verification request received:', {
        product_id,
        refId: refId || 'N/A',
        amount: amount || 'N/A'
    });

    // Validate required fields
    if (!product_id) {
        return res.status(400).json({
            success: false,
            message: "Missing transaction ID",
            received_data: req.body
        });
    }

    try {
        // 1. Find the transaction record
        const transaction = await Transaction.findOne({ transactionUuid: product_id });
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction record not found"
            });
        }

        // 2. Validate environment variables
        if (!process.env.ESEWAPAYMENT_STATUS_CHECK_URL) {
            throw new Error('ESEWAPAYMENT_STATUS_CHECK_URL is not configured');
        }

        if (!process.env.MERCHANT_ID) {
            throw new Error('MERCHANT_ID is not configured');
        }

        // 3. Prepare verification parameters
        const verificationParams = {
            transaction_code: refId || product_id,
            product_code: product_id,
            total_amount: amount || transaction.amount,
            merchant_id: process.env.MERCHANT_ID,
            esewa_status_check_url: process.env.ESEWAPAYMENT_STATUS_CHECK_URL
        };

        console.log('Calling EsewaCheckStatus with:', verificationParams);

        // 4. Verify with eSewa API
        const verificationResponse = await EsewaCheckStatus(
            verificationParams.transaction_code,
            verificationParams.product_code,
            verificationParams.total_amount,
            verificationParams.merchant_id,
            verificationParams.esewa_status_check_url
        );

        console.log('eSewa verification response:', verificationResponse);

        // 5. Handle verification response
        if (!verificationResponse || verificationResponse.status !== 'COMPLETE') {
            throw new Error(verificationResponse?.message || 'Payment not confirmed by eSewa');
        }

        // 6. Update transaction status
        await Transaction.updateOne(
            { transactionUuid: product_id },
            {
                status: 'COMPLETE',
                esewaRefId: refId,
                verifiedAt: new Date(),
                esewaResponse: verificationResponse
            }
        );

        // 7. Update associated borrow records
        if (transaction.borrowIds?.length > 0) {
            await Borrow.updateMany(
                { _id: { $in: transaction.borrowIds } },
                {
                    $set: {
                        fine: 0,
                        status: 'returned',
                        finePaidAt: new Date()
                    }
                }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            transactionId: product_id,
            refId,
            amount: transaction.amount
        });

    } catch (error) {
        console.error('Payment verification failed:', {
            error: error.message,
            stack: error.stack,
            product_id,
            timestamp: new Date().toISOString()
        });

        // Update transaction as failed
        await Transaction.updateOne(
            { transactionUuid: product_id },
            {
                status: 'FAILED',
                error: error.message,
                verifiedAt: new Date()
            }
        );

        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message,
            transactionId: product_id
        });
    }
};
