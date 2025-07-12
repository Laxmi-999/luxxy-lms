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
    const { books } = useSelector((state) => state.books);

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
    }, [dispatch, userInfo, router]);

    const handleLogout = () => {
        dispatch(logout());
    };

    const totalLibrarians = users?.filter(user => user.role === 'librarian').length || 0;

    return (
        <div className="p-6 space-y-6 w-full bg-black/50 text-white">
            {/* Admin Profile Section */}
            <Card className="flex flex-col md:flex-row items-center justify-between p-4 bg-black/60 text-white">
                <div className="flex items-center gap-4">
                    <img
                        src="https://api.dicebear.com/7.x/initials/svg?seed=Admin"
                        alt="Profile"
                        className="w-16 h-16 rounded-full border"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">Admin - {userInfo?.name}</h2>
                        <p className="text-sm text-white/80">{userInfo?.email}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-white rounded-md border-white/50 bg-orange-500 hover:bg-orange-600 hover:text-black">Edit Profile</Button>
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                        Logout
                    </Button>
                </div>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-black/70 text-white">
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{users?.length || 0}</p>
                    </CardContent>
                </Card>

                <Card className="bg-black/70 text-white">
                    <CardHeader>
                        <CardTitle>Total Books</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{books?.length || 0}</p>
                    </CardContent>
                </Card>

                <Card className="bg-black/70 text-white">
                    <CardHeader>
                        <CardTitle>Active Librarians</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalLibrarians}</p>
                    </CardContent>
                </Card>

                <Card className="bg-black/70 text-white">
                    <CardHeader>
                        <CardTitle>Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-400">View</p>
                    </CardContent>
                </Card>
            </div>

            {/* View Reports */}
            <Card className="bg-black/80 text-white">
                <CardHeader>
                    <CardTitle>Reports & Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="secondary" className="flex items-center gap-2 bg-black/60 text-white hover:bg-black/70">
                        <BarChart2 className="w-4 h-4" /> View Monthly Report
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;