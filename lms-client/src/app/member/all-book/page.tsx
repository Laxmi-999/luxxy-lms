'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileEdit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAllBooks, getSingleBook } from '@/Redux/slices/bookSlice';
import { useRouter } from 'next/navigation';
import { createReservation, getPendingReservations } from '@/Redux/slices/reservationSlice';

const AllBook = () => {
  const { books } = useSelector((state) => state.books);
  const {userReservations} = useSelector((state) => state.reservations);

  console.log('user reservations are', userReservations);
  
  const dispatch = useDispatch();
  const router = useRouter();

const [reservingBookId, setReservingBookId] = useState(null);
const [isAlreadyPending, setIsAlreadyPending] = useState(false);

  const handleDetailClick = (id) => {
    router.push(`/member/book-details/${id}`);
  };
  
  useEffect(() =>{


    dispatch(fetchAllBooks());
  }, [dispatch])

 
const handleReservationClick = (bookId) => {
 
  dispatch(createReservation(bookId));
};
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Find and Reserve Books</CardTitle>
          <Link href="/member">
            <Button>Back</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {books && books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="flex items-center justify-between border rounded p-3">
              <div>
                <p className="font-medium">{book.title}</p>
                <p className="text-sm text-muted-foreground">By {book.author}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDetailClick(book._id)}
                  size="sm"
                  variant="outline"
                >
                  View Details
                </Button>
                
                <Button
                onClick={() => handleReservationClick(book._id)}
                
                className= {`${isAlreadyPending ? 'bg-white cursor-pointer text-gray-800 border-2 border-gray-800' : 'bg-gray-800 cursor-pointer'} `} size="sm">
                  Request for Reservation
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No books found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AllBook;
