'use client';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, BookOpen, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/Redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBooks } from '@/Redux/slices/bookSlice';
import Link from 'next/link';


const page = () => {
  const {userInfo, isLoggedIn} = useSelector((state) => state.auth);
  const {books} = useSelector((state) => state.books)

  const dispatch = useDispatch();
  const router = useRouter();
   
  useEffect(() => {

    dispatch(fetchAllBooks());
  }, [dispatch])


  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');

  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <Card>
        <CardHeader>
          { isLoggedIn && 
          <div>
            <CardTitle className="text-2xl font-semibold text-green-600">Welcome, <span className='text-2xl font-semibold text-orange-600'>{userInfo.name}</span></CardTitle>
            <p className='text-orange-800'>{userInfo.email}</p>
          </div>
          }
          

        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-muted-foreground">Here's a quick overview of your library activity.</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              View Profile
            </Button>
            <Button variant="destructive" className="flex items-center gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Borrowed Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">4</p>
            <p className="text-muted-foreground text-sm">Active Borrows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reserved Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2</p>
            <p className="text-muted-foreground text-sm">On Hold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Due Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">1</p>
            <p className="text-muted-foreground text-sm">Return Due in 3 Days</p>
          </CardContent>
        </Card>
       
       <Link href='/member/all-book'>
          <Card  className='cursor-pointer'>
            <CardHeader>
              <CardTitle className="text-lg">Total Books </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">{books.length ||  '0'}</p>
              <p className="text-muted-foreground text-sm">Available for you</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">You borrowed <span className="font-semibold">"The Great Gatsby"</span></p>
              <p className="text-sm text-muted-foreground">June 10, 2025</p>
            </div>
            <Badge variant="outline" className="text-green-600">Borrowed</Badge>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">You reserved <span className="font-semibold">"Atomic Habits"</span></p>
              <p className="text-sm text-muted-foreground">June 8, 2025</p>
            </div>
            <Badge variant="outline" className="text-yellow-600">Reserved</Badge>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">You returned <span className="font-semibold">"1984"</span></p>
              <p className="text-sm text-muted-foreground">June 6, 2025</p>
            </div>
            <Badge variant="outline" className="text-blue-600">Returned</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Search Books
        </Button>
        <Button variant="secondary" className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          My Reservations
        </Button>
      </div>
    </div>
  );
};

export default page;