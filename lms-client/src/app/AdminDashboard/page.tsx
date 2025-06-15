'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, PlusCircle, FileEdit, Trash2, BarChart2, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { logout } from '../Redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { addLibrarian, fetchAllUsers } from '../Redux/slices/adminSlice';

// Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter, // Often useful for buttons inside the dialog
} from '@/components/ui/dialog';

// Import Input and Label for the form
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminDashboard = () => {
    const {userInfo} = useAppSelector((state) => state.auth)
    const {users} = useAppSelector((state) => state.admin)
    console.log('users are', users);

    console.log(userInfo);

    const dispatch = useAppDispatch();
    const router = useRouter();

    // State to control the dialog's open/close state
    const [isAddLibrarianDialogOpen, setIsAddLibrarianDialogOpen] = useState(false);

    // State for the new librarian form
    const [newLibrarian, setNewLibrarian] = useState({
        name: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        if (userInfo && userInfo.token) {
            console.log("UserInfo and token present, dispatching fetchAllUsers and fetchAdminProfile.");
            dispatch(fetchAllUsers());
        } else {
            console.log("No user info found or token is missing. Not dispatching admin data fetch.");
            //  redirect to login if not authenticated
            router.push('/Login');
        }
    }, [dispatch, userInfo]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/Login');
    }

    const handleNewLibrarianChange = (e) => {
        const { id, value } = e.target;
        setNewLibrarian((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleAddLibrarianSubmit = (e) => {
        e.preventDefault();
        
        console.log('Registering new librarian:', newLibrarian);
         dispatch(addLibrarian(newLibrarian));

        // Reset the form
        setNewLibrarian({
            name: '',
            email: '',
            password: '',
        });
        // Close the dialog
        setIsAddLibrarianDialogOpen(false);
    };

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
                        <h2 className="text-xl font-semibold">Admin -{userInfo?.name} </h2> {/* Added optional chaining */}
                        <p className="text-sm text-muted-foreground">{userInfo?.email}</p> {/* Added optional chaining */}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Edit Profile</Button>
                    <Button
                    onClick={handleLogout}
                    variant="destructive" className="flex items-center gap-2">
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
                        <p className="text-3xl font-bold">{users?.length || 0}</p> {/* Dynamically show user count */}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Books</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">1,203</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Librarians</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">6</p>
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

            {/* Manage Users & Roles */}
            <Card>
                <CardHeader>
                    <CardTitle>Manage Users & Roles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Map through your users to display them dynamically */}
                    {users && users.length > 0 ? (
                        users.map((user) => (
                            <div key={user._id} className="flex items-center justify-between border rounded p-3">
                                <div>
                                    <p className="font-medium">{user.name} ({user.role})</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline"><FileEdit className="w-4 h-4" /></Button>
                                    <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground">No users found.</p>
                    )}

                    <Button className="flex items-center gap-2 mt-3">
                        <PlusCircle className="w-4 h-4" />
                        Add User
                    </Button>
                </CardContent>
            </Card>

            {/* Manage All Books */}
            <Card>
                <CardHeader>
                    <CardTitle>Manage All Books</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between border rounded p-3">
                        <div>
                            <p className="font-medium">Deep Work</p>
                            <p className="text-sm text-muted-foreground">Available</p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline"><FileEdit className="w-4 h-4" /></Button>
                            <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    </div>
                    <Button className="flex items-center gap-2 mt-3">
                        <PlusCircle className="w-4 h-4" />
                        Add Book
                    </Button>
                </CardContent>
            </Card>

            {/* View Reports */}
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

            {/* Assign Librarians */}
            <Card>
                <CardHeader>
                    <CardTitle>Assign Librarians</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between border rounded p-3">
                        <div>
                            <p className="font-medium">Suresh Pandey</p>
                            <p className="text-sm text-muted-foreground">Not Assigned</p>
                        </div>
                        <Button variant="default" size="sm">
                            <ShieldCheck className="w-4 h-4 mr-1" /> Assign
                        </Button>
                    </div>

                    {/* DialogTrigger for the "Add Librarian" button */}
                    <Dialog open={isAddLibrarianDialogOpen} onOpenChange={setIsAddLibrarianDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2 mt-3">
                                <PlusCircle className="w-4 h-4" />
                                Add Librarian
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Librarian</DialogTitle>
                                <DialogDescription>
                                    Enter the details for the new librarian.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddLibrarianSubmit} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Username
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newLibrarian.name}
                                        onChange={handleNewLibrarianChange}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newLibrarian.email}
                                        onChange={handleNewLibrarianChange}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="password" className="text-right">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={newLibrarian.password}
                                        onChange={handleNewLibrarianChange}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Add Librarian</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;