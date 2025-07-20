'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { approveReservation, getPendingReservations, rejectReservation } from '@/Redux/slices/reservationSlice';
import { getPendingBorrows, getPendingReturns } from '@/Redux/slices/borrowSlice';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';

const PendingRequests = () => {
  const dispatch = useDispatch();
  const { pendingReservations } = useSelector((state: any) => state.reservations);
  const { pendingBorrows, pendingReturns } = useSelector((state: any) => state.borrows);

  useEffect(() => {
    dispatch(getPendingReservations());
    dispatch(getPendingBorrows());
    dispatch(getPendingReturns());
  }, [dispatch]);

  const router = useRouter();
  console.log('pending returns are', pendingReturns);

  const handleApproveReservation = async (reservationId: string) => {
    try {
      await dispatch(approveReservation(reservationId)).unwrap();
      dispatch(getPendingReservations());
    } catch (err) {
      console.error('Failed to approve reservation:', err);
    }
  };

  const handleRejectReservation = (id: string) => {
    dispatch(rejectReservation(id));
  };

  const handleApproveBorrow = async (borrowId: string) => {
    router.push(`/librarian/dashboard?borrowId=${borrowId}`);
  };

  
  const handleConfirmReturn = async(borrowId) => {

    try{
        const {data} = await axiosInstance.put('/borrow/confirm-return/'+ borrowId)
        console.log('data is', data);
        
     if(data){
      toast.success('Return approved successfully')
      dispatch(getPendingReturns());

     }

    }catch(error){
          console.log('error while confirming returns', error);

        }
      }

  return (
    <div className="p-6 gap-[5rem] flex justify-between">
      {/* Pending Reservations Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Pending Reservation Requests</h2>
        {pendingReservations?.length === 0 && <p>No pending reservation requests.</p>}
        {pendingReservations?.map((reservation: any) => (
          <Card key={reservation._id} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{reservation.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-md font-medium">{reservation.user.name}</h4>
                    <p className="text-sm text-muted-foreground">{reservation.user.email}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-500">
                  Requested: {new Date(reservation.createdAt).toLocaleDateString()}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p>
                <strong>Book:</strong> {reservation?.book?.title} by {reservation?.book?.author}
              </p>
              <div className="flex gap-3 mt-2">
                <Button className="bg-yellow-500 pointer-cursor" onClick={() => handleApproveReservation(reservation._id)}>
                  Approve
                </Button>
                <Button variant="destructive" onClick={() => handleRejectReservation(reservation._id)}>
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Borrow Requests Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Pending Borrow Requests</h2>
        {pendingBorrows?.length === 0 && <p>No pending borrow requests.</p>}
        {pendingBorrows?.map((borrow: any) => (
          <Card key={borrow._id} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{borrow.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-md font-medium">{borrow.user.name}</h4>
                    <p className="text-sm text-muted-foreground">{borrow.user.email}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-500">
                  Requested: {new Date(borrow.createdAt).toLocaleDateString()}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p>
                <strong>Book:</strong> {borrow.book.title} by {borrow.book.author}
              </p>
              <div className="flex gap-3 mt-2">
                <Button
                  className="bg-yellow-500 pointer-cursor"
                  onClick={() => handleApproveBorrow(borrow._id)}
                >
                  Approve
                </Button>
                <Button variant="destructive">
                  {/* onClick={() => handleRejectBorrow(borrow._id)} */}
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Return Requests */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Pending return requests</h2>
        {pendingReturns?.length === 0 && <p>No pending borrow requests.</p>}
        {pendingReturns?.map((ret: any) => (
          <Card key={ret._id} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{ret.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-md font-medium">{ret.user.name}</h4>
                    <p className="text-sm text-muted-foreground">{ret.user.email}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-500">
                  Requested: {new Date(ret.createdAt).toLocaleDateString()}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p>
                <strong>Book:</strong> {ret.book.title} by {ret.book.author}
              </p>
              <div className="flex gap-3 mt-2">
                <Button
                  className="bg-yellow-500 pointer-cursor"
                  onClick={() => handleConfirmReturn(ret._id)}
                >
                  Confirm Return
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PendingRequests;
