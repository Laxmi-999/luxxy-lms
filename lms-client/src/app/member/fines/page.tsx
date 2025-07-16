'use client';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserBorrows } from '@/Redux/slices/borrowSlice';
import { RootState } from '@/Redux/store';
import { useAppDispatch } from '@/Redux/hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const FinesPage = () => {
  const dispatch = useAppDispatch();
  const { userBorrows, loading, error } = useSelector((state: RootState) => state.borrows);

  // Separate borrows by status
  const activeBorrows = userBorrows.filter((borrow: any) => borrow.status === 'approved');
  const pastBorrows = userBorrows.filter((borrow: any) => borrow.status === 'returned');

  useEffect(() => {
    dispatch(getUserBorrows());
  }, [dispatch]);

  return (
    <div className="h-auto w-full  p-5 flex flex-col items-center justify-start py-10 bg-gray-100">
      <Card className="w-full max-w-8xl  bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-600">Your Borrowed Books & Fines</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : userBorrows.length === 0 ? (
            <p className="text-gray-600">You have no borrowed books.</p>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Active Borrows</h2>
                {activeBorrows.length === 0 ? (
                  <p className="text-gray-600">No active borrows.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current Fine</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeBorrows.map((borrow: any) => (
                          <tr key={borrow._id}>
                            <td className="px-4 py-2">{borrow.book?.title || 'N/A'}</td>
                            <td className="px-4 py-2">{borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-2">{borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-2 capitalize">{borrow.status}</td>
                            <td className="px-4 py-2 font-semibold text-red-600">{borrow.fine > 0 ? `R.s${borrow.fine}` : 'No Fine'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Past Borrows</h2>
                {pastBorrows.length === 0 ? (
                  <p className="text-gray-600">No past borrows.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current Fine</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pastBorrows.map((borrow: any) => (
                          <tr key={borrow._id}>
                            <td className="px-4 py-2">{borrow.book?.title || 'N/A'}</td>
                            <td className="px-4 py-2">{borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-2">{borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : '-'}</td>
                            <td className="px-4 py-2 capitalize">{borrow.status}</td>
                            <td className="px-4 py-2 font-semibold text-red-600">{borrow.fine > 0 ? `R.s ${borrow.fine}` : 'No Fine'}</td>
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
