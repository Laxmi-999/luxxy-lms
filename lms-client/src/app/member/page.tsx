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




const Dashboard = () => {
  const { books } = useSelector((state) => state.books);
  const { userReservations } = useSelector((state) => state.reservations);
  const { userBorrows, loading, error } = useSelector((state) => state.borrows);
  const dispatch = useDispatch();
  const [showBorrowedBooks, setShowBorrowedBooks] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  // const [loading, setLoading] = useState(false);

  console.log('recent activities are', recentActivities);
  


   const fetchActivities = async () => {
      try {
        const { data } = await axiosInstance.get('/activity');
        console.log('recent activites are', data);
        
        setRecentActivities(data);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load recent activities.');
      } finally {
        // setLoading(false);
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
    case 'borrowed':
      return 'text-green-600 border-green-600';
    case 'reserved':
      return 'text-yellow-600 border-yellow-600';
    case 'returned':
      return 'text-blue-600 border-blue-600';
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
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="p-6 space-y-6 w-full">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setShowBorrowedBooks(true)}
          >
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">Total Borrowed Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{userBorrows.length || 0}</p>
              <p className="text-sm text-gray-500">Books you have  Borrowed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">Active Borrows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{activeBorrows.length || 0}</p>
              <p className="text-sm text-gray-500">On Hold</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">Total Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">{totalReturns.length || 0}</p>
              <p className="text-sm text-gray-500">Books you have returned</p>
            </CardContent>
          </Card>

          <Link href="/member/find-book">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg text-gray-700">Total over due returns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{0}</p>
                <p className="text-sm text-gray-500">Active over dues</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Activity Timeline */}
      <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-700">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      <p className="font-medium text-gray-800">
                        {generateActivityMessage(activity)}
                      </p>                    
                      <span className="font-semibold">
                        "{activity.book?.title || 'a book'}"
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
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
              <p className="text-gray-500">No recent activities found.</p>
            )}
          </CardContent>  
      </Card>


      </main>

      {showBorrowedBooks && (
        <BorrowedBooks onClose={() => setShowBorrowedBooks(false)} />
      )}
    </div>
  );
};

export default Dashboard;