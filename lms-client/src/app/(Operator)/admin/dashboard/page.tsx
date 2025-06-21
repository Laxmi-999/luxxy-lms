'use client';
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/Redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '@/Redux/slices/userSlice';
import Link from 'next/link';


const AdminDashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { users } = useSelector((state) => state.user);
    const {books} = useSelector((state) => state.books);


    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (userInfo && userInfo.token) {
            console.log("UserInfo and token present, dispatching fetchAllUsers.");
            dispatch(fetchAllUsers());
        } else {
            console.log("No user info found or token is missing. Redirecting to login.");
            router.push('/login');
        }
    }, [dispatch, userInfo, router]); // Addedp router to dependency array

    const handleLogout = () => {
        dispatch(logout());
        // router.push('/login');
    };

    // Calculate total librarians for the summary card
    const totalLibrarians = users?.filter(user => user.role === 'librarian').length || 0;

    return (
        <div className="p-6 space-y-6 w-full">
            {/* Admin Profile Section */}
            <Card className="flex flex-col md:flex-row items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    <img
                        src="https://api.dicebear.com/7.x/initials/svg?seed=Admin"
                        alt="Profile"
                        className="w-16 h-16 rounded-full border"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">Admin -{userInfo?.name} </h2>
                        <p className="text-sm text-muted-foreground">{userInfo?.email}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Edit Profile</Button>
                        <Button
                            onClick={handleLogout}
                            variant="destructive"
                            className="flex items-center gap-2"
                        >
                            Logout
                        </Button>
                </div>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{users?.length || 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Books</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* This number would ideally be dynamic from your books state/API */}
                        <p className="text-3xl font-bold">{books?.length || 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Librarians</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalLibrarians}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">View</p>
                    </CardContent>
                </Card>
            </div>

            {/* View Reports -*/}
            <Card>
                <CardHeader>
                    <CardTitle>Reports & Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="secondary" className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" /> View Monthly Report
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;