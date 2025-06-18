'use client';
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { useRouter } from 'next/navigation';
import ManageUsersAndRoles from '@/components/ManageUsersAndRole';
import ManageAllBooks from '@/components/ManageAllBooks';
import AssignLibrarians from '@/components/AssignLibrarian';
import { logout } from '@/Redux/slices/authSlice';
import { fetchAllUsers } from '@/Redux/slices/adminSlice';
// Import the new components


const AdminDashboard = () => {
    const { userInfo } = useAppSelector((state) => state.auth);
    const { users } = useAppSelector((state) => state.admin);

    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if (userInfo && userInfo.token) {
            console.log("UserInfo and token present, dispatching fetchAllUsers.");
            dispatch(fetchAllUsers());
        } else {
            console.log("No user info found or token is missing. Redirecting to login.");
            router.push('/Login');
        }
    }, [dispatch, userInfo, router]); // Added router to dependency array

    const handleLogout = () => {
        dispatch(logout());
        router.push('/Login');
    };

    // Calculate total librarians for the summary card
    const totalLibrarians = users?.filter(user => user.role === 'librarian').length || 0;

    return (
        <div className="p-6 space-y-6">
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
                        <LogOut className="w-4 h-4" />
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
                        <p className="text-3xl font-bold">1,203</p>
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

            {/* Integrated Components */}
            <ManageUsersAndRoles />

            <ManageAllBooks />

            <AssignLibrarians />

            {/* View Reports - Kept here as it's a single button, or you could make a component */}
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