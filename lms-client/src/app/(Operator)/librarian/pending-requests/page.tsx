'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, BookOpen, User, Calendar } from 'lucide-react';
import { approveReservation, getPendingReservations, rejectReservation } from '@/Redux/slices/reservationSlice';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { getPendingBorrows, getPendingReturns } from '@/Redux/slices/borrowSlice';

const PendingRequests = () => {
  const dispatch = useDispatch();
  const { reservations: { pendingReservations }, borrows: { pendingBorrows, pendingReturns } } = useSelector((state) => state);
  const [loadingAction, setLoadingAction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        await Promise.all([
          dispatch(getPendingReservations()).unwrap(),
          dispatch(getPendingBorrows()).unwrap(),
          dispatch(getPendingReturns()).unwrap(),
        ]);
        console.log('Pending Reservations:', pendingReservations);
        console.log('Pending Borrows:', pendingBorrows);
        console.log('Pending Returns:', pendingReturns);
      } catch (err) {
        console.error('Error fetching pending requests:', err);
        setError('Failed to load pending requests. Please try again.');
        toast.error('Failed to load pending requests', { position: 'top-center' });
      }
    };
    fetchData();
  }, [dispatch]);

  const router = useRouter();

  const handleApproveReservation = async (reservationId) => {
    setLoadingAction(reservationId);
    try {
      await dispatch(approveReservation(reservationId)).unwrap();
      toast.success('Reservation approved successfully', { position: 'top-center' });
      dispatch(getPendingReservations());
    } catch (err) {
      console.error('Failed to approve reservation:', err);
      toast.error('Failed to approve reservation', { position: 'top-center' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectReservation = async (reservationId) => {
    setLoadingAction(reservationId);
    try {
      await dispatch(rejectReservation(reservationId)).unwrap();
      toast.success('Reservation rejected successfully', { position: 'top-center' });
      dispatch(getPendingReservations());
    } catch (err) {
      console.error('Failed to reject reservation:', err);
      toast.error('Failed to reject reservation', { position: 'top-center' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApproveBorrow = (borrowId) => {
    router.push(`/librarian/dashboard?borrowId=${borrowId}`);
  };

  const handleRejectBorrow = async (borrowId) => {
    setLoadingAction(borrowId);
    try {
      await dispatch(rejectBorrow(borrowId)).unwrap();
      toast.success('Borrow request rejected successfully', { position: 'top-center' });
      dispatch(getPendingBorrows());
    } catch (err) {
      console.error('Failed to reject borrow:', err);
      toast.error('Failed to reject borrow', { position: 'top-center' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConfirmReturn = async (borrowId) => {
    setLoadingAction(borrowId);
    try {
      const { data } = await axiosInstance.put(`/borrow/confirm-return/${borrowId}`);
      if (data) {
        toast.success('Return approved successfully', { position: 'top-center' });
        dispatch(getPendingReturns());
      }
    } catch (error) {
      console.error('Error while confirming return:', error);
      toast.error('Failed to confirm return', { position: 'top-center' });
    } finally {
      setLoadingAction(null);
    }
  };

  const renderRequestCard = (item, type, actions) => (
    <Card key={item._id} className="bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-xl">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-orange-500">
              <AvatarFallback className="bg-orange-100 text-orange-600">{item.user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">{item.user?.name || 'Unknown User'}</h4>
              <p className="text-xs text-gray-500">{item.user?.email || 'No email'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-orange-500" />
          <p className="text-sm text-gray-800">
            <strong>{item.book?.title || 'Unknown Book'}</strong> by {item.book?.author || 'Unknown Author'}
          </p>
        </div>
        <div className="flex gap-2">
          {actions.map(({ label, onClick, variant, className }, index) => (
            <Button
              key={index}
              size="sm"
              variant={variant}
              className={className}
              onClick={() => onClick(item._id)}
              disabled={loadingAction === item._id}
            >
              {loadingAction === item._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                label
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans flex w-full">
      <div className="w-full max-h-[calc(100vh-2rem)] grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending Reservations Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            Pending Reservations
          </h2>
          <Card className="bg-white shadow-md rounded-xl border border-gray-200 h-[calc(100vh-7rem)] flex flex-col">
            <CardContent className="p-3 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {!pendingReservations || pendingReservations.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No pending reservation requests.</p>
              ) : (
                <div className="space-y-2">
                  {pendingReservations.map((reservation) =>
                    renderRequestCard(reservation, 'reservation', [
                      {
                        label: 'Approve',
                        onClick: handleApproveReservation,
                        variant: 'default',
                        className: 'bg-orange-500 text-white hover:bg-orange-600 text-xs py-1 px-2',
                      },
                      {
                        label: 'Reject',
                        onClick: handleRejectReservation,
                        variant: 'destructive',
                        className: 'bg-red-500 text-white hover:bg-red-600 text-xs py-1 px-2',
                      },
                    ])
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Borrow Requests Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            Pending Borrows
          </h2>
          <Card className="bg-white shadow-md rounded-xl border border-gray-200 h-[calc(100vh-7rem)] flex flex-col">
            <CardContent className="p-3 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {!pendingBorrows || pendingBorrows.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No pending borrow requests.</p>
              ) : (
                <div className="space-y-2">
                  {pendingBorrows.map((borrow) =>
                    renderRequestCard(borrow, 'borrow', [
                      {
                        label: 'Approve',
                        onClick: handleApproveBorrow,
                        variant: 'default',
                        className: 'bg-orange-500 text-white hover:bg-orange-600 text-xs py-1 px-2',
                      },
                      {
                        label: 'Reject',
                        onClick: handleRejectBorrow,
                        variant: 'destructive',
                        className: 'bg-red-500 text-white hover:bg-red-600 text-xs py-1 px-2',
                      },
                    ])
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Return Requests Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            Pending Returns
          </h2>
          <Card className="bg-white shadow-md rounded-xl border border-gray-200 h-[calc(100vh-7rem)] flex flex-col">
            <CardContent className="p-3 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {!pendingReturns || pendingReturns.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No pending return requests.</p>
              ) : (
                <div className="space-y-2">
                  {pendingReturns.map((ret) =>
                    renderRequestCard(ret, 'return', [
                      {
                        label: 'Confirm Return',
                        onClick: handleConfirmReturn,
                        variant: 'default',
                        className: 'bg-orange-500 text-white hover:bg-orange-600 text-xs py-1 px-2',
                      },
                    ])
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PendingRequests;