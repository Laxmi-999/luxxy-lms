// lms-client/app/member/dashboard/page.jsx
'use client'; // This is a Client Component

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, BookOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBooks } from '@/Redux/slices/bookSlice';
import Link from 'next/link';
import { getUserReservations } from '@/Redux/slices/reservationSlice';
import { getUserBorrows } from '@/Redux/slices/borrowSlice';
import BorrowedBooks from '@/components/BorrowedBooks';
import axiosInstance from '@/lib/axiosInstance';
import MyBorrows from '@/components/myBorrows';
import { toast } from 'sonner';

import NotificationBell from '@/components/notificationBell';

const DashboardPage = () => {
  const { books } = useSelector((state) => state.books);
  const { userInfo, isLoggedIn } = useSelector((state) => state.auth);
  const { userReservations } = useSelector((state) => state.reservations);
  const { userBorrows, loading, error: borrowError } = useSelector((state) => state.borrows);
  const dispatch = useDispatch();
  const [showBorrowedBooks, setShowBorrowedBooks] = useState(false);
  const [showMyBorrows, setShowMyBorrows] = useState(false);
  // NEW: State to control visibility of NotificationBell
  const [showNotificationBell, setShowNotificationBell] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activityError, setActivityError] = useState(null);

  console.log('recent activities are', recentActivities);

  const fetchActivities = async () => {
    try {
      const { data } = await axiosInstance.get('/activity');
      console.log('recent activites are', data);
      setRecentActivities(data);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setActivityError('Failed to load recent activities.');
      toast.error('Failed to load recent activities.');
    }
  };

  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(getUserReservations());
    dispatch(getUserBorrows());
    fetchActivities();
  }, [dispatch]);

  const overdueBorrows = userBorrows.filter(
    (b) => b.status === 'approved' && new Date(b.dueDate) < new Date()
  );
  const activeBorrows = userBorrows.filter((b) => b.status === 'approved');
  const totalReturns = userBorrows.filter((b) => b.status === 'returned');


  const getBadgeStyle = (type) => {
    switch (type.toLowerCase()) {
      case 'issued':
      case 'borrow-request':
        return 'text-black border-white border-1 bg-green-500';
      case 'reserved':
        return 'text-black bg-yellow-400';
      case 'returned':
      case 'return-confirmed':
        return 'text-black bg-red-500';
      case 'pending-return':
        return 'text-black bg-blue-400';
      case 'overdue-voice-note':
        return 'text-white bg-purple-600';
      default:
        return 'text-gray-600 border-gray-400';
    }
  };

  const generateActivityMessage = (activity) => {
    const bookTitle = activity.book?.title || 'a book';
    switch (activity.type.toLowerCase()) {
      case 'issued':
        return `You have borrowed "${bookTitle}"`;
      case 'borrow-request':
        return `You requested to borrow "${bookTitle}"`;
      case 'returned':
        return `You have returned "${bookTitle}"`;
      case 'return-confirmed':
        return `Return of "${bookTitle}" confirmed by librarian.`;
      case 'pending-return':
        return `You requested to return "${bookTitle}".`;
      case 'overdue-voice-note':
        return `Overdue reminder for "${bookTitle}" (Voice Note)`;
      default:
        return `You performed an action on "${bookTitle}"`;
    }
  };

  // Handler for clicking the "Total Overdue Returns" card
  const handleOverdueClick = () => {
    setShowNotificationBell(true); // Show the NotificationBell component
  };

  return (
    <div className="min-h-screen mx-5 my-8 rounded-lg w-full flex">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-black/80 rounded-md p-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card
            className="bg-black/40 text-white hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setShowMyBorrows(true)}
          >
            <CardHeader>
              <CardTitle className="text-lg">Total Borrowed Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userBorrows.length || 0}</p>
              <p className="text-sm text-white">Books you have borrowed</p>
            </CardContent>
          </Card>

          <Card
            className="bg-black/40 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setShowBorrowedBooks(true)}
          >
            <CardHeader>
              <CardTitle className="text-lg">Active Borrows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeBorrows.length || 0}</p>
              <p className="text-sm text-white">On hold</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 text-white hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Total Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalReturns.length || 0}</p>
              <p className="text-sm text-white">Books you have returned</p>
            </CardContent>
          </Card>

          {/* MODIFIED CARD: Added onClick to show NotificationBell */}
          <Card
            className="bg-black/40 text-white hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleOverdueClick} // NEW: Call handler to show NotificationBell
          >
            <CardHeader>
              <CardTitle className="text-lg">Total Overdue Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{overdueBorrows.length || 0}</p>
              <p className="text-sm text-white">Active overdues</p>
            </CardContent>
          </Card>
        </div>

        {/* Third Row: Recent Activities */}
        <Card className="mt-10 p-0 w-full shadow-md rounded-lg">
          <CardHeader className="w-full p-0 m-0">
            <CardTitle className="text-2xl w-full bg-orange-400 font-bold text-black text-center p-4">Your Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={activity._id || index}
                  className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="text-lg text-black font-bold">
                      {generateActivityMessage(activity)}
                    </p>
                    <p className="text-sm text-gray-700">
                      {new Date(activity.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Badge
                    className={getBadgeStyle(activity.type)}
                  >
                    {activity.type.replace('-', ' ')}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No recent activities found.</p>
            )}
          </CardContent>
        </Card>

        {showBorrowedBooks && (
          <BorrowedBooks onClose={() => setShowBorrowedBooks(false)} />
        )}

        {showMyBorrows && (
          <MyBorrows onClose={() => setShowMyBorrows(false)} />
        )}

        {/* NEW: Conditionally render NotificationBell */}
        {showNotificationBell && (
          <NotificationBell onClose={() => setShowNotificationBell(false)} />
        )}
      </main>
    </div>
  );
};

// Add a display name for easier debugging in React DevTools
DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
