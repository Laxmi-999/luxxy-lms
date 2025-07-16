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



const LibrarianDashboard = () => {
    const [selectedBorrow, setSelectedBorrow] = useState(null);
   const [bookDetails, setBookDetails] = useState(null);
   const [userDetails, setUserDetails] = useState(null);
   const [recentActivities, setRecentActivities] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [selectedDueDate, setSelectedDueDate] = useState('');
   const [selectedBorrowDate, setSelectedBorrowDate] = useState(''); // New state for borrow date

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
    // Use selectedDueDate and selectedBorrowDate if set
    const dueDateToSend = selectedDueDate ? new Date(selectedDueDate) : undefined;
    const borrowDateToSend = selectedBorrowDate ? new Date(selectedBorrowDate) : undefined;

    const { data } = await axiosInstance.put(`/borrow/approve/${borrowId}`, {
      dueDate: dueDateToSend,
      borrowDate: borrowDateToSend,
    });

    const message = `${bookDetails.title} book is issued to ${userDetails.name} user`;

    toast.success(message, {
      position: 'top-center',
    });

    // Clear state
    setSelectedBorrow(null);
    setBookDetails(null);
    setUserDetails(null);
    setSelectedDueDate(''); // Clear selected due date after issuing
    setSelectedBorrowDate(''); // Clear selected borrow date after issuing

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
            <Card className="flex flex-col md:flex-row items-center bg-black/80  justify-between p-4">
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
            <div className="grid bg-black/50 grid-cols-1 md:grid-cols-2 gap-4">
                <Card className='bg-black/70'>
                    <CardHeader>
                        <CardTitle className='text-white'>Total Books Issued</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl text-yellow-500 font-bold">124</p>
                        <p className="text-muted-foreground text-sm text-white">Currently borrowed by users</p>
                    </CardContent>
                </Card>

                <Card className='bg-black/70'>
                    <CardHeader>
                        <CardTitle className='text-white'>Overdue Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold  text-red-600">8</p>
                        <p className="text-white text-sm">Books not returned on time</p>
                    </CardContent>
                </Card>

                <Card className='bg-black/70'>
                    <CardHeader>
                        <CardTitle className='text-white'>Active Reservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl text-green-500 font-bold">17</p>
                        <p className="text-muted-foreground  text-white text-sm">Waiting for pickup</p>
                    </CardContent>
                </Card>
            </div>
                   

              <div className="flex gap-2 w-full  bg-black/70 p-5 ">
                    {/* Book Details Section */}
                    <Card className='w-1/2 bg-orange-400 '>
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
                            {/* Borrow Date Picker or Display */}
                            {selectedBorrow?.status === 'pending' ? (
                                <input
                                type="date"
                                value={selectedBorrowDate}
                                onChange={e => setSelectedBorrowDate(e.target.value)}
                                placeholder="Borrow Date"
                                className="w-full border rounded px-4 py-2"
                                />
                            ) : (
                                <input
                                type="text"
                                value={selectedBorrow?.status === 'approved' ? formatDate(selectedBorrow?.borrowDate) : ''}
                                placeholder="Borrow Date"
                                className="w-full border rounded px-4 py-2"
                                readOnly
                                />
                            )}
                            {/* Due Date Picker */}
                            <input
                                type="date"
                                value={selectedDueDate || (selectedBorrow?.dueDate ? new Date(selectedBorrow.dueDate).toISOString().split('T')[0] : '')}
                                onChange={e => setSelectedDueDate(e.target.value)}
                                placeholder="Due Date"
                                className="w-full border rounded px-4 py-2"
                            />
                            </div>
                        </div>
                        </CardContent>
                    </Card>

                    {/* Borrowing Member Section */}
                    <Card className='w-1/2 bg-orange-600 '>
                        <CardHeader>
                        <CardTitle >Borrowing Member</CardTitle>
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
           <Card className='bg-black/50'>
                <CardHeader>
                    <CardTitle className='text-white text-3xl'>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 bg-orange-400 rounded-md">
                    {recentActivities.length === 0 ? (
                    <p className="text-white text-2xl">No recent activity</p>
                    ) : (
                    recentActivities.map((activity, index) => (
                        <div
                        key={activity?._id || index}
                        className="flex items-center justify-between border rounded p-3"
                        >
                        <div>
                            <p className="text-xl text-white">
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
                            <p className="text-xs text-white">
                            {new Date(activity?.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <Badge
                            variant="outline"
                            className={
                            activity?.type === 'issued'
                                ? 'bg-green-600 text-white'
                                : 'bg-blue-600 text-white'
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