
'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileEdit, Trash2, LogOut } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { logout } from '@/Redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import ManageAllBooks from '@/components/ManageAllBooks';
import ManageUsersAndRoles from '@/components/ManageUsersAndRole';
import Link from 'next/link';
import axios from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { removePendingBorrow } from '@/Redux/slices/borrowSlice';
import { Pagination } from '@/components/Pagination';
import { fetchAllBooks } from '@/Redux/slices/bookSlice';

const LibrarianDashboard = () => {
    const [selectedBorrow, setSelectedBorrow] = useState(null);
    const [bookDetails, setBookDetails] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDueDate, setSelectedDueDate] = useState('');
    const [selectedBorrowDate, setSelectedBorrowDate] = useState('');

    const [activitiesData, setActivitiesData] = useState({
        activities: [],
        totalActivities: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
    });

    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const { pendingBorrows } = useSelector((state) => state.borrows);
    const { userInfo, isLoggedIn } = useSelector((state) => state.auth);
    const { users } = useSelector((state) => state.user);

    const fetchActivities = async (page = 1) => {
        try {
            setLoading(true);
            setError('');
            const { data } = await axiosInstance.get(`/activity?page=${page}&limit=${activitiesData.limit}`);
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
        fetchActivities();
        const borrowId = searchParams.get('borrowId');
        const foundBorrow = pendingBorrows?.find((b) => b._id === borrowId);
        if (foundBorrow) {
            setSelectedBorrow(foundBorrow);
            setBookDetails(foundBorrow.book);
            setUserDetails(foundBorrow.user);
        }
    }, [searchParams, pendingBorrows]);

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
    };

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    const handleIssueBookClick = async (borrowId) => {
        try {
            const dueDateToSend = selectedDueDate ? new Date(selectedDueDate) : undefined;
            const borrowDateToSend = selectedBorrowDate ? new Date(selectedBorrowDate) : undefined;

            const { data } = await axiosInstance.put(`/borrow/approve/${borrowId}`, {
                dueDate: dueDateToSend,
                borrowDate: borrowDateToSend,
            });

            toast.success(`${bookDetails.title} book is issued to ${userDetails.name}`, {
                position: 'top-center',
            });

            setSelectedBorrow(null);
            setBookDetails(null);
            setUserDetails(null);
            setSelectedDueDate('');
            setSelectedBorrowDate('');

            const newParams = new URLSearchParams(window.location.search);
            newParams.delete('borrowId');
            const newUrl = `${window.location.pathname}?${newParams.toString()}`;
            window.history.replaceState({}, '', newUrl);
        } catch (error) {
            console.error('Failed to issue book:', error);
            toast.error('Failed to issue the book', {
                position: 'top-center',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Librarian Profile Section */}
                    <Card className="bg-white shadow-md rounded-lg border border-gray-100">
                        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://api.dicebear.com/7.x/initials/svg?seed=Librarian"
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full border-2 border-orange-500"
                                />
                                <div className="flex flex-col">
                                    {isLoggedIn && (
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-semibold text-gray-800">Welcome, {userInfo.name}</h2>
                                                <Badge className="bg-orange-500 text-white text-xs">{userInfo.role}</Badge>
                                            </div>
                                            <p className="text-xs text-gray-500">{userInfo.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3 sm:mt-0">
                                <Button
                                    variant="outline"
                                    className="border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors text-sm py-1"
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-1 text-sm py-1"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dashboard Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
                        <Card className="bg-white shadow-sm rounded-md border border-gray-100 hover:shadow-md transition-shadow">
                            <CardHeader className="p-2">
                                <CardTitle className="text-xs font-medium text-gray-800">Total Books Issued</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <p className="text-lg font-bold text-orange-500">124</p>
                                <p className="text-[10px] text-gray-500">Currently borrowed</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white shadow-sm rounded-md border border-gray-100 hover:shadow-md transition-shadow">
                            <CardHeader className="p-2">
                                <CardTitle className="text-xs font-medium text-gray-800">Overdue Returns</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <p className="text-lg font-bold text-red-600">8</p>
                                <p className="text-[10px] text-gray-500">Not returned on time</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white shadow-sm rounded-md border border-gray-100 hover:shadow-md transition-shadow">
                            <CardHeader className="p-2">
                                <CardTitle className="text-xs font-medium text-gray-800">Active Reservations</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <p className="text-lg font-bold text-orange-500">17</p>
                                <p className="text-[10px] text-gray-500">Waiting for pickup</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white shadow-sm rounded-md border border-gray-100 hover:shadow-md transition-shadow">
                            <CardHeader className="p-2">
                                <CardTitle className="text-xs font-medium text-gray-800">Active Users</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <p className="text-lg font-bold text-orange-500">{users.length}</p>
                                <p className="text-[10px] text-gray-500">Registered users</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Book and Member Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Card className="bg-white shadow-sm rounded-lg border border-gray-100">
                            <CardHeader className="p-3">
                                <CardTitle className="text-sm font-medium text-gray-800">Borrowing Book Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-3">
                                <input
                                    type="text"
                                    value={bookDetails?._id || ''}
                                    placeholder="Book ID"
                                    className="w-full border border-gray-200 rounded-md px-3 py-1 bg-gray-50 text-gray-800 text-sm"
                                    readOnly
                                />
                                <input
                                    type="text"
                                    value={bookDetails?.title || ''}
                                    placeholder="Book Title"
                                    className="w-full border border-gray-200 rounded-md px-3 py-1 bg-gray-50 text-gray-800 text-sm"
                                    readOnly
                                />
                                <div className="flex flex-col md:flex-row gap-3">
                                    {selectedBorrow?.status === 'pending' ? (
                                        <input
                                            type="date"
                                            value={selectedBorrowDate}
                                            onChange={(e) => setSelectedBorrowDate(e.target.value)}
                                            placeholder="Borrow Date"
                                            className="w-full border border-gray-200 rounded-md px-3 py-1 bg-gray-50 text-gray-800 text-sm"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={selectedBorrow?.status === 'approved' ? formatDate(selectedBorrow?.borrowDate) : ''}
                                            placeholder="Borrow Date"
                                            className="w-full border border-gray-200 rounded-md px-3 py-1 bg-gray-50 text-gray-800 text-sm"
                                            readOnly
                                        />
                                    )}
                                    <input
                                        type="date"
                                        value={selectedDueDate || (selectedBorrow?.dueDate ? new Date(selectedBorrow.dueDate).toISOString().split('T')[0] : '')}
                                        onChange={(e) => setSelectedDueDate(e.target.value)}
                                        placeholder="Due Date"
                                        className="w-full border border-gray-200 rounded-md px-3 py-1 bg-gray-50 text-gray-800 text-sm"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white shadow-sm rounded-lg border border-gray-100">
                            <CardHeader className="p-3">
                                <CardTitle className="text-sm font-medium text-gray-800">Borrowing Member</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-3">
                                <input
                                    type="text"
                                    value={userDetails?._id || ''}
                                    placeholder="User ID"
                                    className="w-full border border-gray-200 rounded-md px-3 py-1 bg-gray-50 text-gray-800 text-sm"
                                    readOnly
                                />
                                <input
                                    type="text"
                                    value={userDetails?.name || ''}
                                    placeholder="User Name"
                                    className="w-full border border-gray-200 rounded-md px-3 py-1 bg-gray-50 text-gray-800 text-sm"
                                    readOnly
                                />
                                <input
                                    type="email"
                                    value={userDetails?.email || ''}
                                    placeholder="User Email"
                                    className="w-full border border-gray-200 rounded-md px-3 py-1 bg-gray-50 text-gray-800 text-sm"
                                    readOnly
                                />
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => handleIssueBookClick(selectedBorrow?._id)}
                                        className="bg-orange-500 text-white hover:bg-orange-600 transition-colors text-sm py-1"
                                    >
                                        Issue Book
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors text-sm py-1"
                                    >
                                        Return Book
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Activities Sidebar */}
                <Card className="bg-white shadow-md rounded-lg border border-gray-100 lg:sticky lg:top-0 lg:w-[550px]">
                    <CardHeader className="bg-orange-500 rounded-t-lg p-3">
                        <CardTitle className="text-base font-semibold text-white">Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 flex flex-col h-[520px] relative">
                        <div className="flex-1 space-y-2">
                            {loading && activitiesData.activities.length === 0 ? (
                                <div className="flex justify-center items-center h-full">
                                    <p className="text-gray-600 text-sm">Loading activities...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col justify-center items-center h-full">
                                    <p className="text-red-500 text-sm">{error}</p>
                                    <Button
                                        variant="outline"
                                        className="mt-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors text-sm py-1"
                                        onClick={() => fetchActivities()}
                                    >
                                        Retry
                                    </Button>
                                </div>
                            ) : activitiesData.activities.length > 0 ? (
                                <div className="space-y-2">
                                    {activitiesData.activities.map((activity) => (
                                        <div
                                            key={activity._id}
                                            className="flex items-center justify-between border border-gray-200 rounded-md p-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <div>
                                                <p className="text-xs font-medium text-gray-800">
                                                    {activity.type === 'issued' ? (
                                                        <span>"{activity.book?.title}" issued to {activity.user?.email}</span>
                                                    ) : (
                                                        <span>"{activity.book?.title}" returned by {activity.user?.email}</span>
                                                    )}
                                                </p>
                                                <p className="text-[10px] text-gray-500">
                                                    {new Date(activity.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <Badge
                                                className={
                                                    activity.type === 'issued'
                                                        ? 'bg-orange-500 text-white text-xs'
                                                        : 'bg-gray-200 text-gray-800 text-xs'
                                                }
                                            >
                                                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-full">
                                    <p className="text-gray-600 text-sm">No recent activity found</p>
                                </div>
                            )}
                        </div>
                     
                    </CardContent>
                       {activitiesData.totalPages > 1 && (
                            <div className="absolute   bottom-0 left-0 right-0  border-t border-gray-200">
                                <Pagination
                                    currentPage={activitiesData.currentPage}
                                    totalPages={activitiesData.totalPages}
                                    totalItems={activitiesData.totalActivities}
                                    itemsPerPage={activitiesData.limit}
                                    onPageChange={(newPage) => fetchActivities(newPage)}
                                />
                            </div>
                        )}
                </Card>
            </div>
        </div>
    );
};

export default LibrarianDashboard;
