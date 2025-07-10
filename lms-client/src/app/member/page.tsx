// Dashboard.jsx
'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, BookOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBooks } from '@/Redux/slices/bookSlice';
import Link from 'next/link';
import Header from '../../components/MemberHeader';
import { getUserReservations } from '@/Redux/slices/reservationSlice';
import { getUserBorrows } from '@/Redux/slices/borrowSlice';
import BorrowedBooks from '@/components/BorrowedBooks';
import axiosInstance from '@/lib/axiosInstance';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const { books } = useSelector((state) => state.books);
  const { userInfo, isLoggedIn } = useSelector((state) => state.auth);
  const { userReservations } = useSelector((state) => state.reservations);
  const { userBorrows, loading, error } = useSelector((state) => state.borrows);
  const dispatch = useDispatch();
  const [showBorrowedBooks, setShowBorrowedBooks] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);

  console.log('recent activities are', recentActivities);

  const fetchActivities = async () => {
    try {
      const { data } = await axiosInstance.get('/activity');
      console.log('recent activites are', data);
      setRecentActivities(data);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load recent activities.');
    }
  };

  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(getUserReservations());
    dispatch(getUserBorrows());
    fetchActivities();
  }, [dispatch]);

  const activeBorrows = userBorrows.filter((b) => b.status === 'approved');
  const totalReturns = userBorrows.filter((b) => b.status === 'returned');

  const getBadgeStyle = (type) => {
    switch (type.toLowerCase()) {
      case 'issued':
        return 'text-black border-white border-1 bg-green-500';
      case 'reserved':
        return 'text-black bg-yellow-400';
      case 'returned':
        return 'text-black bg-red-500';
      default:
        return 'text-gray-600 border-gray-400';
    }
  };

  const generateActivityMessage = (activity) => {
    const bookTitle = activity.book?.title || 'a book';
    switch (activity.type.toLowerCase()) {
      case 'issued':
        return `You have borrowed "${bookTitle}"`;
      case 'pending':
        return `You have requested "${bookTitle}"`;
      case 'returned':
        return `You have returned "${bookTitle}"`;
      default:
        return `You performed an action on "${bookTitle}"`;
    }
  };

  return (
    <div className="min-h-screen  mx-5 my-8 rounded-lg w-full  flex">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-black/80 rounded-md p-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card 
            className="bg-black/40 text-white hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setShowBorrowedBooks(true)}
          >
            <CardHeader>
              <CardTitle className="text-lg">Total Borrowed Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userBorrows.length || 0}</p>
              <p className="text-sm text-white">Books you have borrowed</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 text-white hover:shadow-lg transition-shadow">
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

          <Link href="/member/find-book">
            <Card className="bg-black/40 text-white hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Total Overdue Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{0}</p>
                <p className="text-sm text-white">Active overdues</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Third Row: Recent Activities */}
        <Card className="bg-orange-400 mt-10 shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Your Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-black/50 items-center border-b pb-6 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-2xl text-black font-bold">
                      {generateActivityMessage(activity)}
                    </p>
                    <p className="text-sm text-white">
                      {new Date(activity.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getBadgeStyle(activity.type)}
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-white">No recent activities found.</p>
            )}
          </CardContent>
        </Card>

        {showBorrowedBooks && (
          <BorrowedBooks onClose={() => setShowBorrowedBooks(false)} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;