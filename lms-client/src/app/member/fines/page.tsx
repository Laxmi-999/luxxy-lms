// app/member/fines/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserBorrows } from '@/Redux/slices/borrowSlice';
import { RootState } from '@/Redux/store';
import { useAppDispatch } from '@/Redux/hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance'; // Still used for fine updates, not eSewa payment
import CryptoJS from 'crypto-js'; // For client-side signature generation

const FinesPage = () => {
  const dispatch = useAppDispatch();
  const { userBorrows, loading, error } = useSelector((state: RootState) => state.borrows);
  const currentUserId = useSelector((state: RootState) => state.auth.userInfo?._id);

  const [isPaying, setIsPaying] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isUpdatingFines, setIsUpdatingFines] = useState(false);

  const activeBorrows = userBorrows.filter((borrow) => borrow.status === 'approved' || borrow.status === 'overdue');
  const pastBorrows = userBorrows.filter((borrow) => borrow.status === 'returned' || borrow.status === 'fine_paid');

  const totalFine = activeBorrows.reduce((sum, borrow) => sum + (borrow.fine || 0), 0);

  useEffect(() => {
    const fetchAndCalculateFines = async () => {
      if (!currentUserId) {
        dispatch(getUserBorrows());
        return;
      }

      setIsUpdatingFines(true);
      try {
        // This call to backend is for updating fines in your DB, not eSewa payment
        await axiosInstance.post("http://localhost:8000/api/borrow/update-overdue", { userId: currentUserId });
        console.log("Backend fines updated successfully.");
      } catch (fineUpdateError) {
        console.error("Error updating fines on backend:", fineUpdateError);
        setPaymentMessage(`Failed to update fines: ${fineUpdateError.response?.data?.message || fineUpdateError.message}`);
      } finally {
        setIsUpdatingFines(false);
        dispatch(getUserBorrows());
      }
    };

    fetchAndCalculateFines();

    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');
    if (status === 'failed') {
      setPaymentMessage(message || 'Payment failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [dispatch, currentUserId]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (totalFine <= 0) {
      setPaymentMessage('No fines to pay.');
      return;
    }
    if (!currentUserId) {
        setPaymentMessage('User not authenticated. Please log in to pay fines.');
        return;
    }

    setIsPaying(true);
    setPaymentMessage('');

    try {
      // --- Client-side eSewa Payment Initiation (FOR TESTING ONLY) ---
      // ⚠️ WARNING: DO NOT USE IN PRODUCTION - SECRET KEY EXPOSED
      const ESEWA_MERCHANT_CODE = 'EPAYTEST';
      const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q'; // <--- Your eSewa Test Secret Key

      // --- MISMATCH FIX 1: Action URL as per guide ---
      const ESEWA_PAYMENT_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

      // --- MISMATCH FIX 2: transactionUuid generation as per guide ---
      const currentTime = new Date();
      const transactionUuid = currentTime.toISOString().slice(2, 10).replace(/-/g, '') + '-' +
                              currentTime.getHours() + currentTime.getMinutes() + currentTime.getSeconds();
      console.log("Generated transactionUuid (Product ID):", transactionUuid);


      // Define your success and failure redirect URLs
      const successUrl = 'https://google.com'; // Replace with your actual success page URL
      const failureUrl = 'https://facebook.com'; // Replace with your actual failure page URL

      // Prepare eSewa parameters object
      // --- MISMATCH FIX 4: Parameter names for signature as per guide ---
      const esewaParams = {
        amt: totalFine.toFixed(2),           // Amount of product
        txAmt: '0',                          // Tax amount
        psc: '0',                            // Product service charge
        pdc: '0',                            // Product delivery charge
        tAmt: totalFine.toFixed(2),          // Total payment amount (amt + txAmt + psc + pdc)
        transaction_uuid: transactionUuid,   // Mapped from txNfId to match guide's signature field name
        product_code: ESEWA_MERCHANT_CODE,   // Mapped from scd to match guide's signature field name
        su: successUrl,                      // Success URL
        fu: failureUrl,                      // Failure URL
      };

      // --- MISMATCH FIX 3: Generate signature client-side using CryptoJS as per guide ---
      // The string for signature generation MUST exactly match the guide's snippet.
      // `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`
      const dataToSign = `total_amount=${esewaParams.tAmt},transaction_uuid=${esewaParams.transaction_uuid},product_code=${esewaParams.product_code}`;
      const hash = CryptoJS.HmacSHA256(dataToSign, ESEWA_SECRET_KEY);
      const signature = CryptoJS.enc.Base64.stringify(hash);

      // Add signature and signed_field_names to the parameters
      esewaParams.signature = signature;
      // --- MISMATCH FIX 5: signed_field_names as per guide ---
      esewaParams.signed_field_names = "total_amount,transaction_uuid,product_code";

      console.log("DEBUG: ESEWA_SECRET_KEY (masked for security):", ESEWA_SECRET_KEY.substring(0, 4) + '...');
      console.log("DEBUG: Data string for signature generation (dataToSign):", dataToSign);
      console.log("DEBUG: Generated signature:", signature);
      console.log("DEBUG: signed_field_names parameter:", esewaParams.signed_field_names);
      console.log("DEBUG: Final eSewa Parameters for HTML Form Submission:", esewaParams);


      // Dynamically create a hidden form and submit it to eSewa
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = ESEWA_PAYMENT_URL;

      // --- MISMATCH FIX 6: Define the order of fields as per guide's implied order ---
      const orderedKeys = [
        'amt', 'txAmt', 'psc', 'pdc', 'tAmt', 'transaction_uuid', 'product_code', 'su', 'fu', 'signature', 'signed_field_names'
      ];

      // Append hidden fields to the form in the specified order
      orderedKeys.forEach(key => {
        if (esewaParams.hasOwnProperty(key)) {
          const hiddenField = document.createElement('input');
          hiddenField.type = 'hidden';
          hiddenField.name = key;
          hiddenField.value = esewaParams[key];
          form.appendChild(hiddenField);
        }
      });

      document.body.appendChild(form); // Temporarily append the form to the document body
      form.submit(); // Submit the form to redirect the user to eSewa
      document.body.removeChild(form); // Clean up the form element after submission

    } catch (error) {
      console.error("Error initiating payment (client-side):", error);
      setPaymentMessage(`Error initiating payment: ${error.message}`);
      setIsPaying(false);
    }
  };

  return (
    <div className="h-auto w-full p-5 flex flex-col items-center justify-start py-10 bg-gray-100 font-inter">
      <Card className="w-full max-w-8xl bg-white shadow-lg rounded-lg">
        <CardHeader className="p-6 border-b border-gray-200">
          <CardTitle className="text-3xl font-extrabold text-orange-600">Your Borrowed Books & Fines</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {(loading || isUpdatingFines) ? (
            <p className="text-center text-gray-600">Loading fines...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : userBorrows.length === 0 ? (
            <p className="text-gray-600 text-center">You have no borrowed books.</p>
          ) : (
            <>
              {paymentMessage && (
                <div className={`mb-4 p-3 rounded-md text-center ${paymentMessage.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {paymentMessage}
                </div>
              )}

              <div className="mb-8 p-4 bg-orange-50 rounded-md shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-orange-700">Active Borrows</h2>
                {activeBorrows.length === 0 ? (
                  <p className="text-gray-600">No active borrows with outstanding fines.</p>
                ) : (
                  <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-orange-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider rounded-tl-md">Book Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Borrow Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Due Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider rounded-tr-md">Current Fine</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeBorrows.map((borrow: any) => (
                          <tr key={borrow._id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-4 py-3 text-sm text-gray-800">{borrow.book?.title || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-800">{borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-800">{borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-800 capitalize">{borrow.status}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-red-600">{borrow.fine > 0 ? `R.s ${borrow.fine.toFixed(2)}` : 'No Fine'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {totalFine > 0 && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between p-4 bg-orange-200 rounded-md shadow-inner">
                    <p className="text-xl font-bold text-orange-800 mb-4 sm:mb-0">Total Outstanding Fine: R.s {totalFine.toFixed(2)}</p>
                    <Button
                      onClick={handlePayment}
                      disabled={isPaying || totalFine <= 0 || !currentUserId || loading || isUpdatingFines}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Initiating Payment...
                        </>
                      ) : (
                        'Pay Now with eSewa'
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-md shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Past Borrows</h2>
                {pastBorrows.length === 0 ? (
                  <p className="text-gray-600">No past borrows.</p>
                ) : (
                  <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-blue-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider rounded-tl-md">Book Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Borrow Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Due Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Return Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider rounded-tr-md">Fine Paid</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pastBorrows.map((borrow: any) => (
                          <tr key={borrow._id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-4 py-3 text-sm text-gray-800">{borrow.book?.title || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-800">{borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-800">{borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-800">{borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-800 capitalize">{borrow.status}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-600">{borrow.fine > 0 ? `R.s ${borrow.fine.toFixed(2)}` : 'No Fine'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinesPage;
