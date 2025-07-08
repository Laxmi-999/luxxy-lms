import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, BookOpen } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { getUserBorrows } from '@/Redux/slices/borrowSlice';

const BorrowedBooks = ({ onClose }) => {
   const {books} = useSelector((state) => state.books) 
  const { userBorrows, loading, error } = useSelector((state) => state.borrows);
  const dispatch = useDispatch();
 console.log('borrowed books are', userBorrows);
 console.log('books are', books);
 
 
const activeBorrows = userBorrows.filter((b) => b.status === 'approved');
console.log('active borrows are', activeBorrows);
 

  const handleReturnClick = async(borrowId) => {
    try {
        
    const {data} = await axiosInstance.put('/borrow/return/' + borrowId)
    toast.success('Book Returned successfully');
     dispatch(getUserBorrows());

    } catch (error) {
    console.log('error while returining book', error);
        
    }
  }

   const bookTitle = (bookId) => {
    const book = books.find((book) => book._id === bookId)
    console.log('book title is', book?.title);
    
    return book ? book.title : 'unknown title';
   }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-gray-700">Borrowed Books</CardTitle>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-gray-500">Loading borrowed books...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && userBorrows.length === 0 && (
            <p className="text-gray-500">No books currently borrowed</p>
          )}
          {!loading && !error && activeBorrows.length > 0 && (
            <div className="space-y-4">
              {activeBorrows.map((borrow) => (
                <div
                  key={borrow._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {bookTitle(borrow.book)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Borrowed on: {new Date(borrow.borrowDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(borrow.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Borrowed
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReturnClick(borrow._id)}
                    >
                      Return
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowedBooks;