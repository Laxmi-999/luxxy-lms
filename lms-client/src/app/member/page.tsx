'use client';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, BookOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBooks } from '@/Redux/slices/bookSlice';
import Link from 'next/link';
import Header from '../../components/MemberHeader';
import { getUserReservations } from '@/Redux/slices/reservationSlice';

const Dashboard = () => {
  const { books } = useSelector((state) => state.books);
  const {userReservations} = useSelector((state) =>  state.reservations)
  const dispatch = useDispatch();
  console.log('user reservation are', userReservations);
  console.log('books are', books);
  
  

  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(getUserReservations());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="p-6 space-y-6 w-full">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">Borrowed Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">4</p>
              <p className="text-sm text-gray-500">Active Borrows</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">Reserved Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{userReservations.length || 0}</p>
              <p className="text-sm text-gray-500">On Hold</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">Due Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">1</p>
              <p className="text-sm text-gray-500">Return Due in 3 Days</p>
            </CardContent>
          </Card>

          <Link href="/member/find-book">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg text-gray-700">Total Books</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{books.length || '0'}</p>
                <p className="text-sm text-gray-500">Available for you</p>
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
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium text-gray-800">
                  You borrowed <span className="font-semibold">"The Great Gatsby"</span>
                </p>
                <p className="text-sm text-gray-500">June 10, 2025</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">Borrowed</Badge>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium text-gray-800">
                  You reserved <span className="font-semibold">"Atomic Habits"</span>
                </p>
                <p className="text-sm text-gray-500">June 8, 2025</p>
              </div>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">Reserved</Badge>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">
                  You returned <span className="font-semibold">"1984"</span>
                </p>
                <p className="text-sm text-gray-500">June 6, 2025</p>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-600">Returned</Badge>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default Dashboard;