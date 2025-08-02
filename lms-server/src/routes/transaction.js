// -----------------------------------------------------------------------------
// routes/transaction.js
// This file handles eSewa payment initiation, callbacks, and database updates.
// Updated for eSewa ePay V2 API based on official documentation.
// -----------------------------------------------------------------------------

import express from 'express';
import axios from 'axios';
import crypto from 'crypto'; // Node.js built-in crypto module
// For ePay V2, verification response is JSON, so xml2js is not needed for parsing.
// import { Parser as XMLParser } from 'xml2js'; // No longer needed for V2 JSON responses
import dotenv from 'dotenv'; // Load environment variables

// Load environment variables
dotenv.config();

// Assuming you have your Mongoose models defined
// Adjust paths based on your models directory structure (e.g., ../models/Borrow.js)
import Borrow from '../models/Borrow.js';
import PaymentAttempt from '../models/payment.js';

const esewaRouter = express.Router();

// eSewa configuration from environment variables
const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE;
const ESEWA_SUCCESS_URL = process.env.ESEWA_SUCCESS_URL;
const ESEWA_FAILURE_URL = process.env.ESEWA_FAILURE_URL;
const ESEWA_VERIFICATION_URL = process.env.ESEWA_VERIFICATION_URL; // V2 verification URL
const ESEWA_PAYMENT_URL = process.env.ESEWA_PAYMENT_URL; // V2 payment form URL
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBmKtGs2g'; // Use a default for UAT if not set

// Helper function to generate eSewa V2 signature (HMAC SHA256)
// As per ePay V2 documentation, the message string is a comma-separated list
// of specific field values, and `signed_field_names` must match this order.
const generateEsewaV2Signature = (params, secretKey) => {
  // Fields for signature generation as per ePay V2 documentation:
  // total_amount, transaction_uuid, product_code, success_url, failure_url, tax_amount, product_service_charge, product_delivery_charge
  const fieldsToSign = [
    params.total_amount,
    params.transaction_uuid,
    params.product_code,
    params.success_url,
    params.failure_url,
    params.tax_amount,
    params.product_service_charge,
    params.product_delivery_charge,
  ];

  const message = fieldsToSign.join(','); // Join values with commas
  const hash = crypto.createHmac('sha256', secretKey)
                     .update(message)
                     .digest('base64');
  return hash;
};

// -----------------------------------------------------------------------------
// API Endpoint to Initiate eSewa Payment (Called by your frontend)
// POST /api/esewa/initiate-payment
// -----------------------------------------------------------------------------
esewaRouter.post('/initiate-payment', async (req, res) => {
  const { amount, userId, borrowIds } = req.body;

  if (!amount || amount <= 0 || !userId || !borrowIds || borrowIds.length === 0) {
    return res.status(400).json({ message: 'Invalid payment details provided.' });
  }

  // Generate a unique transaction UUID for this payment attempt
  const transactionUuid = crypto.randomUUID();

  try {
    // Step 1: Save a pending payment record in your database
    const newPaymentAttempt = await PaymentAttempt.create({
      userId,
      amount: parseFloat(amount), // Store as number
      borrowIds,
      transactionUuid,
      status: 'pending',
      initiatedAt: new Date(),
    });

    // eSewa V2 requires specific parameters for the form submission.
    const productCode = 'fine_payment_lms';
    const totalAmount = parseFloat(amount).toFixed(2); // Ensure amount is float with 2 decimal places
    const taxAmount = (0).toFixed(2); // Example: no tax
    const serviceCharge = (0).toFixed(2); // Example: no service charge
    const deliveryCharge = (0).toFixed(2); // Example: no delivery charge

    // Parameters used to generate the signature
    const paramsForSignature = {
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      success_url: ESEWA_SUCCESS_URL,
      failure_url: ESEWA_FAILURE_URL,
      tax_amount: taxAmount,
      product_service_charge: serviceCharge,
      product_delivery_charge: deliveryCharge,
    };

    const signature = generateEsewaV2Signature(paramsForSignature, ESEWA_SECRET_KEY);

    // Define the signed_field_names as per eSewa V2 documentation.
    // This string must contain the names of the fields used in the signature in the exact order.
    const signedFieldNames = 'total_amount,transaction_uuid,product_code,success_url,failure_url,tax_amount,product_service_charge,product_delivery_charge';

    // Parameters to be sent in the POST form to eSewa V2 payment URL
    const esewaParams = {
      amount: totalAmount, // V2 uses 'amount' for product amount
      tax_amount: taxAmount,
      product_service_charge: serviceCharge,
      product_delivery_charge: deliveryCharge,
      total_amount: totalAmount, // This is the final total amount including all charges
      merchant_code: ESEWA_MERCHANT_CODE, // V2 uses 'merchant_code'
      transaction_uuid: transactionUuid, // V2 uses 'transaction_uuid'
      success_url: ESEWA_SUCCESS_URL,
      failure_url: ESEWA_FAILURE_URL,
      signature: signature, // V2 uses 'signature'
      signed_field_names: signedFieldNames, // Crucial new parameter for V2
    };

    console.log("eSewa V2 Params to send to frontend:", esewaParams);

    res.json({
      esewaUrl: ESEWA_PAYMENT_URL, // This is the V2 form submission URL
      esewaParams: esewaParams,
    });

  } catch (error) {
    console.error("Error initiating eSewa payment (V2):", error);
    res.status(500).json({ message: 'Failed to initiate payment. Please try again.' });
  }
});

// -----------------------------------------------------------------------------
// API Endpoint for eSewa Success Callback (Server-to-Server Verification)
// GET /api/esewa/payment-success
// -----------------------------------------------------------------------------
// This route is called by eSewa after a successful payment.
// For ePay V2, this verification uses a JSON POST request to the verification URL.
esewaRouter.get('/payment-success', async (req, res) => {
  // Parameters received from eSewa's redirect after payment:
  // oid: our order ID (transaction_uuid)
  // amt: amount (total_amount)
  // refId: eSewa's unique reference ID for the transaction
  const { oid, amt, refId } = req.query;

  if (!oid || !amt || !refId) {
    console.error("Missing parameters in eSewa success callback:", req.query);
    return res.redirect(`${ESEWA_FAILURE_URL}&message=Payment verification failed: Missing parameters.`);
  }

  try {
    // Step 1: Find the pending payment attempt in your database using our transaction_uuid (oid)
    const paymentAttempt = await PaymentAttempt.findOne({ transactionUuid: oid });

    if (!paymentAttempt) {
      console.error(`Payment attempt with UUID ${oid} not found.`);
      return res.redirect(`${ESEWA_FAILURE_URL}&message=Payment record not found.`);
    }

    // Prevent double processing if the payment was already completed
    if (paymentAttempt.status === 'completed') {
      console.warn(`Payment attempt ${oid} already processed.`);
      return res.redirect(`${ESEWA_SUCCESS_URL}&message=Payment already processed.`);
    }

    // Ensure the amount matches what was initiated to prevent tampering
    if (parseFloat(amt) !== paymentAttempt.amount) {
        console.error(`Amount mismatch for OID ${oid}. Expected: ${paymentAttempt.amount}, Received: ${amt}`);
        paymentAttempt.status = 'failed';
        paymentAttempt.failedAt = new Date();
        paymentAttempt.esewaResponse = { query: req.query, error: 'Amount mismatch' };
        await paymentAttempt.save();
        return res.redirect(`${ESEWA_FAILURE_URL}&message=Payment verification failed: Amount mismatch.`);
    }

    // Step 2: Verify the transaction with eSewa's V2 server using a JSON payload.
    // The V2 documentation for transaction status check lists:
    // merchant_code, transaction_uuid, total_amount
    const verificationPayload = {
      merchant_code: ESEWA_MERCHANT_CODE,
      transaction_uuid: oid,
      total_amount: parseFloat(amt), // Ensure it's a number for JSON payload
    };

    console.log("eSewa V2 Verification Payload:", verificationPayload);

    const verificationResponse = await axios.post(ESEWA_VERIFICATION_URL, verificationPayload, {
      headers: {
        'Content-Type': 'application/json', // ePay V2 verification uses JSON
      },
    });

    const responseData = verificationResponse.data;
    console.log("eSewa V2 verification response:", responseData);

    // eSewa V2 verification response is JSON. Check `transaction_details.status`
    const status = responseData?.transaction_details?.status;

    if (status === 'COMPLETE' || status === 'SUCCESS') {
      // Step 3: Payment is verified. Update your database.
      // Mark associated borrows as fine_paid
      await Borrow.updateMany(
        { _id: { $in: paymentAttempt.borrowIds } },
        { $set: { status: 'fine_paid', fine: 0, finePaidDate: new Date() } }
      );

      // Update the payment attempt record to 'completed'
      paymentAttempt.status = 'completed';
      paymentAttempt.eSewaRefId = refId; // Store eSewa's reference ID
      paymentAttempt.completedAt = new Date();
      paymentAttempt.esewaResponse = responseData; // Store the full JSON response for auditing
      await paymentAttempt.save();

      console.log(`Fines for borrows ${paymentAttempt.borrowIds} paid successfully. PaymentAttempt ID: ${paymentAttempt._id}`);
      res.redirect(`${ESEWA_SUCCESS_URL}&message=Payment successful! Your fines have been cleared.`);
    } else {
      console.error(`eSewa V2 payment verification failed for OID: ${oid}. Status: ${status}. Response:`, responseData);
      // Update payment attempt status to 'failed'
      paymentAttempt.status = 'failed';
      paymentAttempt.failedAt = new Date();
      paymentAttempt.esewaResponse = responseData;
      await paymentAttempt.save();
      res.redirect(`${ESEWA_FAILURE_URL}&message=Payment verification failed with eSewa. Status: ${status}.`);
    }
  } catch (error) {
    console.error("Error during eSewa V2 payment verification:", error.message);
    // Attempt to update payment attempt status to 'failed' if it exists
    const paymentAttempt = await PaymentAttempt.findOne({ transactionUuid: oid });
    if (paymentAttempt) {
        paymentAttempt.status = 'failed';
        paymentAttempt.failedAt = new Date();
        paymentAttempt.esewaResponse = { query: req.query, error: error.message };
        await paymentAttempt.save();
    }
    res.redirect(`${ESEWA_FAILURE_URL}&message=An error occurred during payment verification.`);
  }
});

// -----------------------------------------------------------------------------
// API Endpoint for eSewa Failure Callback
// GET /api/esewa/payment-failure
// -----------------------------------------------------------------------------
// This route is called by eSewa if the payment fails or is cancelled by the user.
esewaRouter.get('/payment-failure', async (req, res) => {
  const { oid, amt, refId } = req.query; // Parameters might vary for failure

  console.log(`eSewa payment failed or cancelled for OID: ${oid}, Amount: ${amt}, RefId: ${refId}.`);

  try {
    // Update the status of your pending payment record to 'failed' or 'cancelled'
    const paymentAttempt = await PaymentAttempt.findOne({ transactionUuid: oid });
    if (paymentAttempt && paymentAttempt.status === 'pending') {
      paymentAttempt.status = 'cancelled'; // Or 'failed' depending on your interpretation
      paymentAttempt.failedAt = new Date();
      paymentAttempt.esewaResponse = { query: req.query }; // Store query params for context
      await paymentAttempt.save();
      console.log(`Payment attempt ${oid} marked as cancelled/failed.`);
    } else if (paymentAttempt) {
      console.warn(`Payment attempt ${oid} already processed or not found as pending.`);
    } else {
        console.warn(`No payment attempt found for OID: ${oid} on failure callback.`);
    }
  } catch (error) {
    console.error("Error updating payment attempt on failure:", error.message);
  }

  res.redirect(`${ESEWA_FAILURE_URL}&message=Payment cancelled or failed. Please try again.`);
});

export default esewaRouter;
