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
import axios from 'axios'; // Or your configured axiosInstance if you use it globally
import axiosInstance from '@/lib/axiosInstance';

const FinesPage = () => {
  const dispatch = useAppDispatch();
  const { userBorrows, loading, error } = useSelector((state: RootState) => state.borrows);
  const currentUserId = useSelector((state: RootState) => state.auth.userInfo?._id); // Adjust path to your user ID

  const [isPaying, setIsPaying] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isUpdatingFines, setIsUpdatingFines] = useState(false); // State for fine update loading

  // Filter borrows based on status for display
  const activeBorrows = userBorrows.filter((borrow) => borrow.status === 'approved' || borrow.status === 'overdue');
  const pastBorrows = userBorrows.filter((borrow) => borrow.status === 'returned' || borrow.status === 'fine_paid');

  // Calculate total fine from active borrows displayed
  const totalFine = activeBorrows.reduce((sum, borrow) => sum + (borrow.fine || 0), 0);

  useEffect(() => {
    const fetchAndCalculateFines = async () => {
      if (!currentUserId) {
        // If user not logged in, just fetch borrows (they might be empty or show old data)
        dispatch(getUserBorrows());
        return;
      }

      setIsUpdatingFines(true); // Indicate that fine update is in progress
      try {
        // Step 1: Call backend to update overdue fines in the database
        // This ensures the fine values are current in DB before fetching them
        // Pass userId if your backend's /api/fines/update-overdue route is user-specific
        await axiosInstance.post("http://localhost:8000/api/borrow/update-overdue", { userId: currentUserId });
        console.log("Backend fines updated successfully.");
      } catch (fineUpdateError) {
        console.error("Error updating fines on backend:", fineUpdateError);
        // Optionally set an error message for the user here
        setPaymentMessage(`Failed to update fines: ${axios.isAxiosError(fineUpdateError) ? fineUpdateError.response?.data?.message : fineUpdateError.message}`);
      } finally {
        setIsUpdatingFines(false); // End loading for fine update
        // Step 2: Dispatch action to get the borrows (which now have updated fines from DB)
        dispatch(getUserBorrows());
      }
    };

    fetchAndCalculateFines(); // Call the async function

    // Handle failure redirect from eSewa (if backend's fu points to /fines?status=failed)
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');
    if (status === 'failed') {
      setPaymentMessage(message || 'Payment failed. Please try again.');
      // Clean up URL parameters to prevent message re-display on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [dispatch, currentUserId]); // Depend on dispatch and currentUserId

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

    setIsPaying(true); // Indicate payment initiation is in progress
    setPaymentMessage(''); // Clear any previous messages

    try {
      // Call your backend to initiate payment using the esewajs package
      // Your backend will return a redirect URL provided by esewajs
      const response = await axiosInstance.post(
        "http://localhost:8000/api/esewa/initiate-payment", // <--- Confirm this URL matches your backend route
        {
          amount: totalFine,
          userId: currentUserId,
          borrowIds: activeBorrows.map(borrow => borrow._id),
        }
      );

      // The esewajs backend should return a 'url' field for redirection
      if (response.data && response.data.url) {
        window.location.href = response.data.url; // Redirect the user's browser to eSewa
      } else {
        throw new Error("Backend did not provide a valid eSewa redirection URL.");
      }

    } catch (error) {
      console.error("Error initiating payment:", axios.isAxiosError(error) ? error.response?.data : error.message);
      setPaymentMessage(`Error initiating payment: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error.message}`);
      setIsPaying(false); // Reset payment state on error
    }
  };

  return (
    <div className="h-auto w-full p-5 flex flex-col items-center justify-start py-10 bg-gray-100 font-inter">
      <Card className="w-full max-w-8xl bg-white shadow-lg rounded-lg">
        <CardHeader className="p-6 border-b border-gray-200">
          <CardTitle className="text-3xl font-extrabold text-orange-600">Your Borrowed Books & Fines</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {(loading || isUpdatingFines) ? ( // Show loading if either data fetch or fine update is in progress
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
                      disabled={isPaying || totalFine <= 0 || !currentUserId || loading || isUpdatingFines} // Disable during loading states
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
