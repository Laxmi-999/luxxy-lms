'use client';
import React from 'react';
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

const LibrarianDashboard = () => {
    const {userInfo, isLoggedIn} = useSelector((state) => state.auth);
    const {users} = useSelector((state) =>  state.user);
    console.log('users are', users);
    

    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());

        router.push('/login');
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
                <Link href='/member/pending-reservations'>
                    <Card className='cursor-pointer'>
                        <CardHeader>
                            <CardTitle>Pending Reservations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">6</p>
                            <p className="text-muted-foreground text-sm">Waiting for Approvals</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
            {/* <ManageUsersAndRoles /> */}
            {/* <ManageAllBooks /> */}

            {/* Issue / Return Books */}
            <Card>
                <CardHeader>
                    <CardTitle>Issue / Return Book</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="User ID"
                            className="w-full border rounded px-4 py-2"
                        />
                        <input
                            type="text"
                            placeholder="Book ID"
                            className="w-full border rounded px-4 py-2"
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button variant="default">Issue Book</Button>
                        <Button variant="secondary">Return Book</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Manage Users / Reservations */}
            <Card>
                <CardHeader>
                    <CardTitle>Manage Users & Reservations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between border rounded p-3">
                        <div>
                            <p className="font-medium">Jane Doe (User123)</p>
                            <p className="text-sm text-muted-foreground">Reserved: "Atomic Habits"</p>
                        </div>
                        <Badge variant="outline" className="text-yellow-600">Reserved</Badge>
                    </div>

                    <div className="flex items-center justify-between border rounded p-3">
                        <div>
                            <p className="font-medium">John Smith (User456)</p>
                            <p className="text-sm text-muted-foreground">Borrowed: "1984"</p>
                        </div>
                        <Badge variant="outline" className="text-green-600">Issued</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LibrarianDashboard;