'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, BookOpen, Library, Clock, Archive } from 'lucide-react';
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
    limit: 10,
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
        return 'bg-yellow-400 text-gray-900 border border-yellow-500';
      case 'returned':
      case 'return-confirmed':
        return 'bg-red-500 text-white border border-red-600';
      case 'pending-return':
        return 'bg-blue-500 text-white border border-blue-600';
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
        return `You borrowed "${bookTitle}"`;
      case 'borrow-request':
        return `You requested "${bookTitle}"`;
      case 'returned':
        return `You returned "${bookTitle}"`;
      case 'return-confirmed':
        return `"${bookTitle}" return confirmed`;
      case 'pending-return':
        return `Pending return for "${bookTitle}"`;
      case 'overdue-voice-note':
        return `Overdue: "${bookTitle}" (Voice Note)`;
      default:
        return `Action on "${bookTitle}"`;
    }
  };

  const handleOverdueClick = () => {
    setShowNotificationBell(true);
  };

  return (
    <>
      <style jsx>{`
        .wrapper {
          transition: box-shadow 0.3s ease;
        }
        .wrapper:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          animation: card-slide-in 0.5s ease-in-out forwards;
          animation-delay: calc(var(--index) * 0.1s);
        }
        .card:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          border-color: rgba(249, 115, 22, 0.5);
        }
        .card:active {
          transform: scale(0.95);
        }
        .activity-item {
          transition: background-color 0.2s ease;
        }
        .activity-item:hover {
          background-color: #f9fafb;
        }
        .pagination-container {
          background: linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0));
        }
        @keyframes card-slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="w-full my-1 rounded-lg flex">
        {/* Main Content */}
        <main className="flex-1 p-1 lg:flex lg:space-x-2">
          <div className="bg-gray-50 rounded-lg p-1 lg:flex lg:space-x-2 w-full wrapper">
            <div className="bg-gradient-to-br from-gray-50 to-orange-100 rounded-lg p-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 lg:w-1/2 border-b border-gray-200">
              {[
                {
                  title: 'Total Borrowed',
                  icon: <Library className="w-5 h-5 text-orange-700 group-hover:text-orange-600 transition-colors" />,
                  value: userBorrows.length || 0,
                  subtext: 'Books Borrowed',
                  onClick: () => setShowMyBorrows(true),
                  ariaLabel: 'View all borrowed books',
                },
                {
                  title: 'Active Borrows',
                  icon: <BookOpen className="w-5 h-5 text-orange-700 group-hover:text-orange-600 transition-colors" />,
                  value: activeBorrows.length || 0,
                  subtext: 'Books on Hold',
                  onClick: () => setShowBorrowedBooks(true),
                  ariaLabel: 'View all active borrows',
                },
                {
                  title: 'Total Returns',
                  icon: <Archive className="w-5 h-5 text-orange-700 group-hover:text-orange-600 transition-colors" />,
                  value: totalReturns.length || 0,
                  subtext: 'Books Returned',
                  ariaLabel: 'View total returns',
                },
                {
                  title: 'Overdue Returns',
                  icon: <Clock className="w-5 h-5 text-orange-700 group-hover:text-orange-600 transition-colors" />,
                  value: overdueBorrows.length || 0,
                  subtext: 'Active Overdues',
                  onClick: handleOverdueClick,
                  ariaLabel: 'View all overdue returns',
                },
              ].map((card, index) => (
                <Card
                  key={card.title}
                  className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl card rounded-xl border-2 border-gray-200 flex flex-col justify-center items-center min-h-[80px] cursor-pointer group"
                  onClick={card.onClick}
                  aria-label={card.ariaLabel}
                  style={{ '--index': index }}
                >
                  <CardHeader className="flex flex-col items-center gap-0 p-1.5">
                    <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-1.5 rounded-full">
                      {card.icon}
                    </div>
                    <CardTitle className="text-sm font-bold text-orange-700">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-1.5 text-center">
                    <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-600 font-medium">{card.subtext}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activities */}
            <Card className="bg-white shadow-lg rounded-lg lg:w-1/2">
              <CardHeader className="p-0">
                <CardTitle className="text-base font-semibold text-orange-600 bg-gradient-to-r from-gray-50 to-orange-200 p-1 text-center">
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1.5 space-y-1">
                {loading && activitiesData.activities.length === 0 ? (
                  <div className="flex justify-center items-center h-16 animate-pulse">
                    <p className="text-gray-600 text-sm font-medium">Loading activities...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-3 space-y-1">
                    <p className="text-red-500 text-sm font-medium">{error}</p>
                    <Button
                      variant="outline"
                      className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors duration-200 text-sm px-3 py-0.5"
                      onClick={() => fetchActivities()}
                      aria-label="Retry loading activities"
                    >
                      Retry
                    </Button>
                  </div>
                ) : activitiesData.activities.length > 0 ? (
                  <div className="space-y-1">
                    {activitiesData.activities.slice(0, 10).map((activity, index) => (
                      <div
                        key={activity._id || index}
                        className="flex justify-between items-center bg-gray-50 p-1.5 rounded-md shadow-sm hover:shadow-md activity-item transition-shadow duration-200"
                      >
                        <div>
                          <p className="text-xs text-gray-900 font-medium">
                            {generateActivityMessage(activity)}
                          </p>
                          <p className="text-xs text-gray-600 font-light">
                            {new Date(activity.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <Badge
                          className={`px-1.5 py-0 font-medium text-xs ${getBadgeStyle(activity.type)}`}
                          aria-label={`Activity type: ${activity.type.replace('-', ' ')}`}
                        >
                          {activity.type.replace('-', ' ')}
                        </Badge>
                      </div>
                    ))}
                    {activitiesData.totalPages > 1 && (
                      <div className="pt-1 -mx-1.5 px-1.5 pagination-container">
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
                  <div className="flex justify-center items-center h-16">
                    <p className="text-gray-600 text-sm font-medium">No recent activities found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

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
    </>
  );
};

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;