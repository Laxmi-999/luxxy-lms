'use client';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getSingleBook } from '@/Redux/slices/bookSlice'
import { createReservation, getUserReservations } from '@/Redux/slices/reservationSlice';
import Link from 'next/link'
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner';




const BookDetails = () => {
    const {selectedBook} = useSelector((state) => state.books)
    const {userReservations} = useSelector((state) => state.reservations)
  const {userInfo} = useSelector((state) => state.auth)

      console.log('reservations:', userReservations);


    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        if (id) {
            dispatch(getSingleBook(id));
            dispatch(getUserReservations())
        }
    }, [dispatch, id]);
    console.log('selected book is', selectedBook);

    if (!selectedBook) {
        return <p className="p-4">Loading book details...</p>;
    }

    const handleReservationClick = (bookId) => {
      console.log('request for reservation');
      
      dispatch(createReservation(bookId));
      toast('Reservation request sent successfully');
      
    }

    // Check if the current user has already requested this book
    const isAlreadyRequested = userReservations?.some( // some is js array mthd tht tst at least one elmt in the arr satisfies the condition provided by cb fntn, returns boolean
        (reservation) => 
            reservation.book === selectedBook._id && 
            reservation.user === userInfo?._id && 
            reservation.status === 'pending'
    );
    console.log('book status is', isAlreadyRequested);
    

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
                            <Button>Request to Borrow</Button>
                            <p className="text-green-600">Available Now</p>
                        </div>
                    ) : (
                         <div>
                            <Button
                                onClick={() => handleReservationClick(selectedBook._id)}
                                disabled={isAlreadyRequested}
                            >
                                {isAlreadyRequested ? 'Requesting for reservation...' : 'Request for Reservation'}
                            </Button>
                            <p className="text-red-600">Not Available Now</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default BookDetails