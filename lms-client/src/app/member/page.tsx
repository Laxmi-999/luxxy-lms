
'use client'; 

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, BookOpen, Library, Clock, Archive } from 'lucide-react'; // Added Library, Clock, Archive
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
import { Pagination } from '@/components/Pagination';

const DashboardPage = () => {
  const { books } = useSelector((state) => state.books);
  const { userInfo, isLoggedIn } = useSelector((state) => state.auth);
  const { userReservations } = useSelector((state) => state.reservations);
  const { userBorrows, loading: borrowLoading, error: borrowError } = useSelector((state) => state.borrows);
  const dispatch = useDispatch();
  const [showBorrowedBooks, setShowBorrowedBooks] = useState(false);
  const [showMyBorrows, setShowMyBorrows] = useState(false);
  const [showNotificationBell, setShowNotificationBell] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activitiesData, setActivitiesData] = useState({
    activities: [],
    totalActivities: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 8,
  });

  const fetchActivities = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axiosInstance.get(`/activity?userId=${userInfo._id}&page=${page}&limit=${activitiesData.limit}`);
      console.log('API Response:', data);

      setActivitiesData({
        activities: data.activities || data.items || [],
        totalActivities: data.totalActivities || data.total || 0,
        totalPages: data.totalPages || Math.ceil((data.totalActivities || data.total || 0) / activitiesData.limit) || 1,
        currentPage: data.currentPage || page,
        limit: data.limit || activitiesData.limit,
      });
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err.response?.data?.message || 'Failed to load recent activities.');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(getUserReservations());
    dispatch(getUserBorrows());
    fetchActivities();
  }, [dispatch]);

  useEffect(() => {
    console.log('Updated activitiesData:', activitiesData);
  }, [activitiesData]);

  const overdueBorrows = userBorrows.filter(
    (b) => b.status === 'approved' && new Date(b.dueDate) < new Date()
  );
  const activeBorrows = userBorrows.filter((b) => b.status === 'approved');
  const totalReturns = userBorrows.filter((b) => b.status === 'returned');

  const getBadgeStyle = (type) => {
    switch (type.toLowerCase()) {
      case 'issued':
      case 'borrow-request':
        return 'bg-green-500 text-white border border-green-600';
      case 'reserved':
        return 'bg-yellow-400 text-black border border-yellow-500';
      case 'returned':
      case 'return-confirmed':
        return 'bg-red-500 text-white border border-red-600';
      case 'pending-return':
        return 'bg-blue-400 text-white border border-blue-500';
      case 'overdue-voice-note':
        return 'bg-purple-600 text-white border border-purple-700';
      default:
        return 'bg-gray-200 text-gray-600 border border-gray-300';
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
        return `Return of "${bookTitle}" confirmed by librarian`;
      case 'pending-return':
        return `You requested to return "${bookTitle}"`;
      case 'overdue-voice-note':
        return `Overdue reminder for "${bookTitle}" (Voice Note)`;
      default:
        return `You performed an action on "${bookTitle}"`;
    }
  };

  const handleOverdueClick = () => {
    setShowNotificationBell(true);
  };

  return (
    <div className="min-h-screen mx-5 my-8 rounded-lg w-full flex">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-gradient-to-br from-gray-100 to-orange-50 rounded-lg p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card
            className="bg-gray-100 text-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer rounded-lg border border-gray-200"
            onClick={() => setShowMyBorrows(true)}
            aria-label="View total borrowed books"
          >
            <CardHeader className="flex items-center gap-2">
              <Library className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-lg font-semibold text-orange-500">Total Borrowed Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{userBorrows.length || 0}</p>
              <p className="text-sm text-gray-600">Books you have borrowed</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gray-100 text-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer rounded-lg border border-gray-200"
            onClick={() => setShowBorrowedBooks(true)}
            aria-label="View active borrows"
          >
            <CardHeader className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-lg font-semibold text-orange-500">Active Borrows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{activeBorrows.length || 0}</p>
              <p className="text-sm text-gray-600">Books on hold</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gray-100 text-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg border border-gray-200"
            aria-label="View total returns"
          >
            <CardHeader className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-lg font-semibold text-orange-500">Total Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{totalReturns.length || 0}</p>
              <p className="text-sm text-gray-600">Books you have returned</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gray-100 text-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer rounded-lg border border-gray-200"
            onClick={handleOverdueClick}
            aria-label="View total overdue returns"
          >
            <CardHeader className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-lg font-semibold text-orange-500">Total Overdue Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{overdueBorrows.length || 0}</p>
              <p className="text-sm text-gray-600">Active overdues</p>
            </CardContent>
          </Card>
        </div>

        {/* Third Row: Recent Activities */}
        <Card className="mt-10 bg-gray-100 shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-bold text-orange-500 bg-gradient-to-r from-gray-100 to-orange-50 p-4 text-center">
              Your Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 min-h-[300px] relative">
            {loading && activitiesData.activities.length === 0 ? (
              <div className="flex justify-center items-center h-full animate-pulse">
                <p className="text-gray-800 text-lg font-medium">Loading activities...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10 space-y-4">
                <p className="text-red-500 text-lg font-medium">{error}</p>
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-200"
                  onClick={() => fetchActivities()}
                  aria-label="Retry loading activities"
                >
                  Retry
                </Button>
              </div>
            ) : activitiesData.activities.length > 0 ? (
              <div className="space-y-4">
                {activitiesData.activities.map((activity, index) => (
                  <div
                    key={activity._id || index}
                    className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in"
                  >
                    <div>
                      <p className="text-lg text-gray-800 font-semibold">
                        {generateActivityMessage(activity)}
                      </p>
                      <p className="text-sm text-gray-600">
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
                      className={`px-3 py-1 font-medium ${getBadgeStyle(activity.type)}`}
                      aria-label={`Activity type: ${activity.type.replace('-', ' ')}`}
                    >
                      {activity.type.replace('-', ' ')}
                    </Badge>
                  </div>
                ))}
                {activitiesData.totalPages > 1 && (
                  <div className="sticky bottom-0 bg-gray-100 pt-4 pb-2 -mx-6 px-6">
                    <Pagination
                      currentPage={activitiesData.currentPage}
                      totalPages={activitiesData.totalPages}
                      totalItems={activitiesData.totalActivities}
                      itemsPerPage={activitiesData.limit}
                      onPageChange={(newPage) => fetchActivities(newPage)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-800 text-lg font-medium">No recent activities found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {showBorrowedBooks && (
          <BorrowedBooks onClose={() => setShowBorrowedBooks(false)} />
        )}

        {showMyBorrows && (
          <MyBorrows onClose={() => setShowMyBorrows(false)} />
        )}

        {showNotificationBell && (
          <NotificationBell onClose={() => setShowNotificationBell(false)} />
        )}
      </main>
    </div>
  );
};

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
