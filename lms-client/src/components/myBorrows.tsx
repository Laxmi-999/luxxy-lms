import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const MyBorrows = ({ onClose }) => {
  const { userBorrows, loading, error } = useSelector((state) => state.borrows);

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'approved':
      case 'pending':
      case 'pending-return':
        return 'bg-green-500 text-white';
      case 'returned':
        return 'bg-red-500 text-white';
      case 'overdue':
        return 'bg-yellow-500 text-black';
      case 'rejected':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex justify-center items-start p-4 z-50 overflow-y-auto">
      <Card className="bg-white w-full max-w-7xl mx-4 rounded-lg shadow-lg my-4">
        <CardHeader className="bg-orange-500 text-white p-4 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">
            Your All Borrows Until Today
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="mb-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            Close
          </Button>
          {loading ? (
            <p className="text-center text-gray-600 text-lg">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600 text-lg">Error: {error}</p>
          ) : userBorrows.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">You have no borrow records yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBorrows.map((borrow) => (
                <Card
                  key={borrow._id}
                  className="shadow-lg rounded-xl overflow-hidden border border-gray-200 bg-white text-black"
                >
                  <CardHeader className="p-4">
                    <CardTitle className="flex justify-between items-center text-lg font-semibold text-gray-900">
                      <span>{borrow.book?.title || 'Unknown Title'}</span>
                      <Badge
                        className={`text-sm px-3 py-1 rounded-full capitalize ${getStatusBadgeClasses(borrow.status)}`}
                      >
                        {borrow.status.replace('-', ' ')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2 text-gray-800">
                    <p>
                      <strong>Author:</strong> {borrow.book?.author || 'Unknown Author'}
                    </p>
                    <p>
                      <strong>Borrowed On:</strong>{' '}
                      {borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : 'N/A'}
                    </p>
                    {borrow.dueDate && (
                      <p>
                        <strong>Due Date:</strong> {new Date(borrow.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    {borrow.returnDate && (
                      <p>
                        <strong>Return Requested/Confirmed On:</strong>{' '}
                        {new Date(borrow.returnDate).toLocaleDateString()}
                      </p>
                    )}
                    {borrow.fine !== undefined && borrow.fine > 0 && (
                      <p className="text-red-600 font-semibold">
                        <strong>Fine:</strong> ${borrow.fine.toFixed(2)}
                      </p>
                    )}
                    {borrow.issuedBy && borrow.issuedBy.email && (
                      <p className="text-sm text-gray-600">
                        <strong>Issued by:</strong> {borrow.issuedBy.email}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBorrows;