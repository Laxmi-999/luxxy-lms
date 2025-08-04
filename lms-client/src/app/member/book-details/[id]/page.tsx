'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Calendar, Hash, Library, User } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { getSingleBook } from '@/Redux/slices/bookSlice';
import { createBorrowRequest, getUserBorrows } from '@/Redux/slices/borrowSlice';
import { createReservation, getUserReservations } from '@/Redux/slices/reservationSlice';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {socket} from '@/lib/socket';

const BookDetails = () => {
  const { selectedBook } = useSelector((state) => state.books);
  const { userReservations } = useSelector((state) => state.reservations);
  const { userInfo } = useSelector((state) => state.auth);
  const { borrows } = useSelector((state) => state.borrows);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [newNotification, setNewNotification] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getSingleBook(id));
      dispatch(getUserReservations());
      dispatch(getUserBorrows());
    }
  }, [dispatch, id]);


    useEffect(()=>{
    socket.on('connection')
    socket.on('notificationId', (notificationId) => {
      setNewNotification(true)
    })

  },[])

  // Debug logs
  console.log('selectedBook:', selectedBook);
  console.log('userInfo:', userInfo);
  console.log('userReservations:', userReservations);
  console.log('borrows:', borrows);

  if (!selectedBook || !userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isAlreadyReserved = userReservations?.some(
    (reservation) =>
      reservation.book === selectedBook._id &&
      reservation.user === userInfo?._id &&
      reservation.status === 'pending'
  );

  const isAlreadyBorrow = borrows?.some(
    (borrow) =>
      borrow.book === selectedBook._id &&
      borrow.user === userInfo?._id &&
      borrow.status === 'pending'
  );

  const handleBorrowClick = (bookId) => {
    dispatch(createBorrowRequest(bookId))
      .unwrap()
      .then(() =>
        toast.success('Borrow request sent successfully!', {
          position: 'top-center',
          duration: 3000,
        })
      )
      .catch((err) =>
        toast.error(err?.message || 'Failed to send borrow request', {
          position: 'top-center',
          duration: 3000,
        })
      );
       socket.emit('notification', bookId);
  };

  const handleReservationClick = (bookId) => {
    dispatch(createReservation(bookId))
      .unwrap()
      .then(() =>
        toast.success('Reservation request sent successfully!', {
          position: 'top-center',
          duration: 3000,
        })
      )
      .catch((err) =>
        toast.error(err?.message || 'Failed to send reservation request', {
          position: 'top-center',
          duration: 3000,
        })
      );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/member/find-book">
          <Button
            className="mb-6 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Books
          </Button>
        </Link>

        <Card className="overflow-hidden shadow-xl border-0 bg-white">
          <div className="md:flex">
            <div className="md:w-1/3 p-6">
              <div className="relative aspect-[3/4] w-full">
                <img
                  src={selectedBook.coverImage || '/placeholder-book.jpg'}
                  alt={selectedBook.title || 'Book cover'}
                  className="object-cover rounded-lg shadow-md w-full h-full transition-transform duration-300 hover:scale-105"
                />
                <Badge
                  className={`absolute top-4 right-4 ${
                    selectedBook.availableCopies > 0
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  {selectedBook.availableCopies > 0 ? 'Available' : 'Not Available'}
                </Badge>
              </div>
            </div>

            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedBook?.title || 'Untitled'}</h1>
              <p className="text-xl text-gray-600 mb-4">
                by {typeof selectedBook?.author === 'string' ? selectedBook?.author : selectedBook?.author?.name || 'Unknown'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Hash className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">ISBN</p>
                    <p className="font-medium">{selectedBook?.isbn || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Library className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Total Copies</p>
                    <p className="font-medium">{selectedBook?.totalCopies || 0}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Available Copies</p>
                    <p className="font-medium">{selectedBook?.availableCopies || 0}</p>
                  </div>
                </div>
                {selectedBook.publishedDate && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Published</p>
                      <p className="font-medium">{selectedBook?.publishedDate}</p>
                    </div>
                  </div>
                )}
                {selectedBook.genre && (
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Genre</p>
                      <p className="font-medium">{selectedBook?.genre}</p>
                    </div>
                  </div>
                )}
                {selectedBook.publisher && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Publisher</p>
                      <p className="font-medium">{selectedBook?.publisher}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedBook.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedBook?.description}</p>
                </div>
              )}

              <div className="flex space-x-4">
                {selectedBook.availableCopies > 0 ? (
                  <Button
                    onClick={() => handleBorrowClick(selectedBook?._id)}
                    disabled={isAlreadyBorrow}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAlreadyBorrow ? 'Borrow Request Pending' : 'Borrow Now'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleReservationClick(selectedBook?._id)}
                    disabled={isAlreadyReserved}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAlreadyReserved ? 'Reservation Pending' : 'Reserve Book'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {selectedBook?.reviews && selectedBook?.reviews.length > 0 && (
          <Card className="mt-6 p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
            <div className="space-y-4">
              {selectedBook.reviews.map((review, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-600">{review.comment || 'No comment'}{newNotification}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    - {typeof review.user === 'string' ? review.user : review.user?.name || 'Anonymous'}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookDetails;