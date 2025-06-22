'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { approveReservation, getPendingReservations, rejectReservation } from '@/Redux/slices/reservationSlice';

const PendingReservations = () => {
  const dispatch = useDispatch();
  const { pendingReservations, loading, error } = useSelector((state) => state.reservations);
  console.log('pending reservations are', pendingReservations);
  
  useEffect(() => {
    dispatch(getPendingReservations());
  }, [dispatch]);

  const handleApprove = (reservationId) => {
    dispatch(approveReservation(reservationId));
    // dispatch(getPendingReservations());
  };

  const handleReject = (id) => {
    dispatch(rejectReservation(id));
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Pending Reservation Requests</h2>

      {/* {loading && (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" />
          <span>Loading reservations...</span>
        </div>
      )} */}

      {error && <p className="text-red-500">{error}</p>}

      {pendingReservations?.length === 0 && !loading && <p>No pending reservations.</p>}

      {pendingReservations?.map((reservation) => (
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
              <strong>Book:</strong> {reservation.book.title} by {reservation.book.author}
            </p>

            <div className="flex gap-3 mt-2">
              <Button className='bg-yellow-500 pointer-cursor' onClick={() => handleApprove(reservation._id)}>
                Approve
              </Button>
              <Button variant="destructive" onClick={() => handleReject(reservation._id)}>
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PendingReservations;
