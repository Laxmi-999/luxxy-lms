'use client';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import axiosInstance from '@/lib/axiosInstance';
import { getSingleBook } from '@/Redux/slices/bookSlice'
import { createBorrowRequest, getUserBorrows } from '@/Redux/slices/borrowSlice';
import { createReservation, getUserReservations } from '@/Redux/slices/reservationSlice';
import axios from 'axios';
import Link from 'next/link'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner';

const BookDetails = () => {
  const { selectedBook } = useSelector((state) => state.books)
  const { userReservations } = useSelector((state) => state.reservations)
  const { userInfo } = useSelector((state) => state.auth)
  const {borrows} = useSelector((state) => state.borrows);

  console.log('reservations:', userReservations);

  const dispatch = useDispatch();
  const { id } = useParams();


    // getting borrow books
  // const getBorrowsBooks = async() => {
  //   try {
      
  //     const {data} = await axiosInstance.get('/borrow/request');
  //     setBorrows(data);
  //     console.log('borrow books are', data);
      

      
  //   } catch (error) {
  //     console.error('error while getting borrow books', error);
  //     toast.error('error while getting borrow books');
      
  //   }

  // }

  useEffect(() => {
    if (id) {
      dispatch(getSingleBook(id));
      dispatch(getUserReservations());
      dispatch(getUserBorrows());  
    }
  }, [dispatch, id]);
  console.log('selected book is', selectedBook);
  console.log('borrows are', borrows);
  

  if (!selectedBook) {
    return <p className="p-4">Loading book details...</p>;
  }

  const handleReservationClick = (bookId) => {
    console.log('request for reservation');
    dispatch(createReservation(bookId));
    toast('Reservation request sent successfully');
  }

  // Check if the current user has already requested this book
  const isAlreadyReserved = userReservations?.some(
    (reservation) =>
      reservation.book === selectedBook._id &&
      reservation.user === userInfo?._id &&
      reservation.status === 'pending'
  );
  // console.log('book status is', isAlreadyReserved);

  // check if the current user has already requested to borrow this book
  const isAlreadyBorrow = borrows?.some((borrow) => 
    borrow.book === selectedBook?._id &&
    borrow.user === userInfo?._id &&
    borrow.status === 'pending'
  );
  console.log('book status is ', isAlreadyBorrow);
  

const handleBorrowClick = (bookId) => {
     dispatch(createBorrowRequest(bookId))
    .unwrap()
    .then(() => toast.success('Borrow request sent successfully!'))
    .catch((err) => toast.error(err));
};


  return (
    <div>
      <Link href='/member/find-book'>
        <Button className='mt-5 mx-auto'>Back</Button>
      </Link>
      <Card>
        <div className='justify-center align-center items-center mx-auto'>
          <img src={selectedBook.coverImage} className='h-[30vh]' />
          <h1>{selectedBook.title}</h1>
          <p>By: {selectedBook.author}</p>
          <p>ISBN: {selectedBook.isbn}</p>
          <p>Total Copies: {selectedBook.totalCopies}</p>
          <p>Available Copies: {selectedBook.availableCopies}</p>
          {selectedBook.availableCopies > 0 ? (
            <div>
              <Button
                onClick={() => handleBorrowClick(selectedBook._id)}
                disabled = {isAlreadyBorrow}
              >
                {isAlreadyBorrow ? 'Requesting for borrow...' : 'Request to Borrow'}
              </Button>
              <p className="text-green-600">Available Now</p>
            </div>
          ) : (
            <div>
              <Button
                onClick={() => handleReservationClick(selectedBook._id)}
                disabled={isAlreadyReserved}
              >
                {isAlreadyReserved ? 'Requesting for reservation...' : 'Request for Reservation'}
              </Button>
              <p className="text-red-600">Not Available Now</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default BookDetails;
