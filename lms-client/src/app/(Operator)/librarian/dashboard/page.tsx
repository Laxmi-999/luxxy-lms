'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileEdit, Trash2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/Redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import ManageAllBooks from '@/components/ManageAllBooks';
import ManageUsersAndRoles from '@/components/ManageUsersAndRole';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { removePendingBorrow } from '@/Redux/slices/borrowSlice';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

const LibrarianDashboard = () => {
    const [selectedBorrow, setSelectedBorrow] = useState(null);
   const [bookDetails, setBookDetails] = useState(null);
   const [userDetails, setUserDetails] = useState(null);
   const [recentActivities, setRecentActivities] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const {pendingBorrows} = useSelector((state) => state.borrows);
    

    const {userInfo, isLoggedIn} = useSelector((state) => state.auth);
    const {users} = useSelector((state) =>  state.user);
    console.log('users are', users);





    const fetchActivities = async () => {
      try {
        const { data } = await axiosInstance.get('/activity');
        console.log('recent activites are', data);
        
        setRecentActivities(data);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load recent activities.');
      } finally {
        setLoading(false);
      }
    };

 

    

   useEffect(() => {
        
        fetchActivities();

        const borrowId = searchParams.get('borrowId');
        const foundBorrow = pendingBorrows?.find(b => b._id === borrowId);
        if (foundBorrow) {
            setSelectedBorrow(foundBorrow);
            setBookDetails(foundBorrow.book);
            setUserDetails(foundBorrow.user);
        }
        }, [searchParams, pendingBorrows]);
      

      

  
// Function to format ISO date to mm/dd/yyyy
    const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };


      

    const handleLogout = () => {
        dispatch(logout());

        router.push('/login');
    };



 const handleIssueBookClick = async(borrowId) => {
  try {
    const { data } = await axiosInstance.put(`/borrow/approve/${borrowId}`);

    const message = `${bookDetails.title} book is issued to ${userDetails.name} user`;

    toast.success(message, {
      position: 'top-center',
    });

    // Clear state
    setSelectedBorrow(null);
    setBookDetails(null);
    setUserDetails(null);

    // Clear URL
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete('borrowId');
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({}, '', newUrl);

  } catch (error) {
    console.log('Failed to issue book:', error);
    toast.error('Failed to issue the book', {
      position: 'top-center',
    });
  }
};


    return (
        <div className="p-6 space-y-6 w-full">
            {/* Librarian Profile Section */}
            <Card className="flex flex-col md:flex-row items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    <img
                        src="https://api.dicebear.com/7.x/initials/svg?seed=Librarian"
                        alt="Profile"
                        className="w-16 h-16 rounded-full border"
                    />
                    <div className='flex flex-col'>
                        {isLoggedIn && 
                         <div className=" ">
                            <div className='flex gap-3'>
                                <h2 className="text-xl font-extrabold text-green-600 ">Welcome : </h2> 
                                <h2 className="text-xl font-semibold text-orange-600 ">{userInfo.name}({userInfo.role})</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">{userInfo.email}</p>             
                       </div>}
                       
                    </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <Button variant="outline">Edit Profile</Button>
                    <Button variant="secondary">Change Password</Button>
                    <Button variant="destructive" className="flex items-center gap-2" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </Card>

            {/* Dashboard Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Books Issued</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">124</p>
                        <p className="text-muted-foreground text-sm">Currently borrowed by users</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Overdue Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">8</p>
                        <p className="text-muted-foreground text-sm">Books not returned on time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Reservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">17</p>
                        <p className="text-muted-foreground text-sm">Waiting for pickup</p>
                    </CardContent>
                </Card>
            </div>
                    {/* <ManageUsersAndRoles /> */}
                    {/* <ManageAllBooks /> */}

              <div className="flex gap-2 w-full ">
                    {/* Book Details Section */}
                    <Card className='w-1/2'>
                        <CardHeader>
                        <CardTitle>Borrowing Book Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div className="flex flex-col gap-4">
                            <input
                            type="text"
                            value={bookDetails?._id || ''}
                              placeholder="Book ID"
                            className="w-full border rounded px-4 py-2"
                            readOnly
                            />
                            <input
                            type="text"
                            value={bookDetails?.title || ''}
                            readOnly
                            placeholder="Book Title"
                            className="w-full border rounded px-4 py-2"
                            />
                            <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                value={formatDate(selectedBorrow?.borrowDate)}
                                placeholder="Borrow Date"
                                className="w-full border rounded px-4 py-2"
                                readOnly
                            />
                            <input
                                type="text"

                                value={formatDate(selectedBorrow?.dueDate)}
                                placeholder="Due Date"
                                className="w-full border rounded px-4 py-2"
                                readOnly
                            />
                            </div>
                        </div>
                        </CardContent>
                    </Card>

                    {/* Borrowing Member Section */}
                    <Card className='w-1/2'>
                        <CardHeader>
                        <CardTitle>Borrowing Member</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div className="flex flex-col gap-4">
                            <input
                            type="text"
                            value={userDetails?._id  || ''}
                            placeholder="User ID"
                            readOnly
                            className="w-full border rounded px-4 py-2"
                            />
                            <input
                            type="text"
                           value={userDetails?.name || ''}
                           readOnly

                            placeholder="User Name"
                            className="w-full border rounded px-4 py-2"
                            />
                            <input
                            type="email"
                            value={userDetails?.email || ''}
                            readOnly
                            placeholder="User Email"
                            className="w-full border rounded px-4 py-2"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button 
                            onClick={() => handleIssueBookClick(selectedBorrow._id)}
                            variant="default">Issue Book</Button>
                            <Button variant="secondary">Return Book</Button>
                        </div>
                        </CardContent>
                    </Card>
           </div>

            {/* Manage Users / Reservations */}
           <Card>
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {recentActivities.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No recent activity</p>
                    ) : (
                    recentActivities.map((activity, index) => (
                        <div
                        key={activity?._id || index}
                        className="flex items-center justify-between border rounded p-3"
                        >
                        <div>
                            <p className="text-sm text-muted-foreground">
                            {activity?.type === 'issued' && (
                                <>
                                "{activity?.book?.title}" was issued to {activity?.user?.email}
                                </>
                            )}
                            {activity?.type === 'returned' && (
                                <>
                                {activity?.user?.email} returned "{activity?.book?.title}"
                                </>
                            )}
                            </p>
                            <p className="text-xs text-gray-400">
                            {new Date(activity?.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <Badge
                            variant="outline"
                            className={
                            activity?.type === 'issued'
                                ? 'text-green-600'
                                : 'text-blue-600'
                            }
                        >
                            {activity?.type?.charAt(0).toUpperCase() + activity?.type?.slice(1)}
                        </Badge>
                        </div>
                    ))
                    )}
                </CardContent>
        </Card>


        </div>
    );
};

export default LibrarianDashboard;