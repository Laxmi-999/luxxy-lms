const { v4: uuidv4 } = require('uuid');
const { EsewaPaymentGateway, EsewaCheckStatus } = require('esewajs');

// --- Import your Mongoose Models ---
const Transaction = require('../models/Transaction'); // Your updated Transaction model
const Borrow = require('../models/Borrow');         // Your Borrow model

const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE;
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY;
const ESEWA_PAYMENT_URL = process.env.ESEWA_PAYMENT_URL;
const ESEWA_PAYMENT_STATUS_CHECK_URL = process.env.ESEWA_PAYMENT_STATUS_CHECK_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

const EsewaInitiatePayment = async (req, res) => {
    const { amount, userId, borrowIds } = req.body;

    const amountFromFrontend = parseFloat(amount);

    if (isNaN(amountFromFrontend) || amountFromFrontend <= 0) {
        return res.status(400).json({ message: 'Invalid payment amount.' });
    }

    const transactionUuid = uuidv4();

    try {
        // --- Save pending transaction to your database ---
        const newPayment = new Transaction({
            transactionUuid: transactionUuid,
            amount: amountFromFrontend,
            userId: userId, // Assuming userId is a valid ObjectId from your auth system
            borrowIds: borrowIds, // Assuming borrowIds are valid ObjectIds
            status: 'INITIATED',
        });
        await newPayment.save();
        console.log(`Transaction ${transactionUuid} initiated and saved to DB.`);

        const reqPayment = await EsewaPaymentGateway(
            amountFromFrontend.toFixed(2),
            0,
            0,
            0,
            transactionUuid,
            ESEWA_MERCHANT_CODE,
            ESEWA_SECRET_KEY,
            `${FRONTEND_URL}/success`,
            `${FRONTEND_URL}/fines?status=failed`,
            ESEWA_PAYMENT_URL,
            undefined,
            undefined
        );

        if (!reqPayment || reqPayment.status !== 200 || !reqPayment.request?.res?.responseUrl) {
            console.error("EsewaPaymentGateway failed or returned unexpected status:", reqPayment);
            // Optionally update transaction status to FAILED if initiation truly failed
            // await Transaction.updateOne({ transactionUuid }, { status: 'FAILED' });
            return res.status(400).json({ message: "Failed to initiate payment with eSewa." });
        }

        return res.send({
            url: reqPayment.request.res.responseUrl,
        });

    } catch (error) {
        console.error("Error in EsewaInitiatePayment:", error);
        return res.status(500).json({ message: "Internal server error during payment initiation." });
    }
};

const paymentStatus = async (req, res) => {
    const { product_id } = req.body; // product_id is our transactionUuid

    if (!product_id) {
        return res.status(400).json({ message: "Missing transaction ID." });
    }

    try {
        // 1. Find the transaction record in your database using our internal transactionUuid
        const transaction = await Transaction.findOne({ transactionUuid: product_id });

        if (!transaction) {
            console.warn(`Transaction record not found for product_id (transactionUuid): ${product_id}`);
            return res.status(404).json({ message: "Transaction record not found." });
        }

        // 2. Check for idempotency: If the transaction is already COMPLETE, do nothing.
        if (transaction.status === 'COMPLETE') {
            console.log(`Transaction ${product_id} already marked as COMPLETE. Skipping re-verification.`);
            return res.status(200).json({ message: "Payment already processed and successful." });
        }

        // 3. Call EsewaCheckStatus to verify payment with eSewa
        // Use the amount from your stored transaction, not a placeholder
        const paymentStatusCheck = await EsewaCheckStatus(
            transaction.esewaRefId || product_id, // Use eSewa's refId if available, else our product_id
            product_id,
            transaction.amount.toFixed(2), // Use the amount from your DB transaction record
            ESEWA_MERCHANT_CODE,
            ESEWA_PAYMENT_STATUS_CHECK_URL
        );

        if (paymentStatusCheck.status !== 200) {
            console.error("EsewaCheckStatus failed or returned unexpected status:", paymentStatusCheck);
            // Update transaction status to FAILED if eSewa check fails
            await Transaction.updateOne({ transactionUuid: product_id }, { status: 'FAILED', verifiedAt: new Date() });
            return res.status(400).json({ message: "Payment verification failed with eSewa." });
        }

        const esewaStatus = paymentStatusCheck.data.status;
        const esewaRefId = paymentStatusCheck.data.refId; // Get eSewa's refId from the verification response

        console.log(`eSewa status for ${product_id}: ${esewaStatus}`);

        // 4. Update your database based on eSewa's confirmed status
        if (esewaStatus === 'COMPLETE') {
            // Update the Transaction record
            await Transaction.updateOne(
                { transactionUuid: product_id },
                {
                    status: 'COMPLETE',
                    esewaRefId: esewaRefId, // Store eSewa's reference ID
                    verifiedAt: new Date(),
                    esewaCallbackData: paymentStatusCheck.data // Store full response for audit
                }
            );

            // --- CRUCIAL: Update the associated Borrow records (set fine to 0) ---
            if (transaction.borrowIds && transaction.borrowIds.length > 0) {
                await Borrow.updateMany(
                    { _id: { $in: transaction.borrowIds } },
                    { $set: { fine: 0, status: 'returned', finePaidAt: new Date() } } // Assuming 'returned' is suitable, adjust as needed
                );
                console.log(`Fines for borrows ${transaction.borrowIds.join(', ')} updated to 0.`);
            }

            return res.status(200).json({ message: "Payment successful and fines updated." });

        } else if (esewaStatus === 'PENDING') {
            // Update the Transaction record to reflect pending status from eSewa
            await Transaction.updateOne({ transactionUuid: product_id }, { status: 'PENDING', verifiedAt: new Date() });
            return res.status(200).json({ message: "Transaction is still PENDING at eSewa." });
        } else { // FAILED or other statuses
            // Update the Transaction record to FAILED
            await Transaction.updateOne({ transactionUuid: product_id }, { status: 'FAILED', verifiedAt: new Date() });
            return res.status(400).json({ message: `Payment not complete: ${esewaStatus}` });
        }

    } catch (error) {
        console.error("Error in paymentStatus:", error);
        return res.status(500).json({ message: "Server error during payment status check.", error: error.message });
    }
};

module.exports = {
    EsewaInitiatePayment,
    paymentStatus
};
