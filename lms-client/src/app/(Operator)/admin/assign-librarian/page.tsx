'use client';

import React, { useState, useEffect } from 'react'; // Import useEffect
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShieldCheck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { addLibrarian, fetchAllUsers, updateUser } from '@/Redux/slices/userSlice'; // Import fetchAllUsers and updateUser

const AssignLibrarians = () => {
    const dispatch = useDispatch();
    const { users, status: userStatus } = useSelector((state) => state.user); // Get status from Redux state

    const [isAddLibrarianDialogOpen, setIsAddLibrarianDialogOpen] = useState(false);
    const [newLibrarian, setNewLibrarian] = useState({
        name: '',
        email: '',
        password: '',
    });

    // Fetch users when the component mounts
    useEffect(() => {
        if (userStatus === 'idle') { // Only fetch if not already loading or succeeded
            dispatch(fetchAllUsers());
        }
    }, [dispatch, userStatus]);


    const handleNewLibrarianChange = (e) => {
        const { id, value } = e.target;
        setNewLibrarian((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleAddLibrarianSubmit = async (e) => { // Make it async
        e.preventDefault();
        console.log('Registering new librarian:', newLibrarian);
        // The addLibrarian action in userSlice should automatically set role: 'librarian' and status: 'idle'
        await dispatch(addLibrarian({ ...newLibrarian, role: 'librarian' })); // Ensure role is set
        setNewLibrarian({
            name: '',
            email: '',
            password: '',
        });
        setIsAddLibrarianDialogOpen(false);
        // Re-fetch users to get the updated list, including the new librarian
        dispatch(fetchAllUsers());
    };

    // Filter users who are currently librarians
    const librarians = users.filter(user => user.role === 'librarian');

    const handleAssignClick = async (librarian) => {
        const newStatus = librarian.status === 'idle' ? 'assigned' : 'idle';
        if (window.confirm(`Are you sure you want to change ${librarian.name}'s status to ${newStatus}?`)) {
            console.log(`Updating ${librarian.name} status to ${newStatus}`);
              await dispatch(updateUser({ id: librarian._id, userData: { status: newStatus } })); //   
        }
    };


    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Manage Librarians & Their Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6"> {/* Increased spacing for clarity */}

                {/* Section for Current Librarians */}
                <h3 className="text-lg font-semibold">Current Librarians</h3>
                <div className="space-y-3">
                    {librarians.length > 0 ? (
                        librarians.map((librarian) => (
                            <div key={librarian._id} className="flex items-center justify-between border rounded p-3">
                                <div>
                                    <p className="font-medium">{librarian.name}</p>
                                    <p className="text-sm text-muted-foreground">{librarian.email}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Status: <span className={`font-semibold ${librarian.status === 'idle' ? 'text-gray-500' : 'text-green-600'}`}>{librarian.status}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={librarian.status === 'idle' ? 'default' : 'secondary'}
                                        size="sm"
                                        onClick={() => handleAssignClick(librarian)}
                                        title={librarian.status === 'idle' ? 'Mark as Assigned' : 'Mark as Idle'}
                                    >
                                        <ShieldCheck className="w-4 h-4 mr-1" />
                                        {librarian.status === 'idle' ? 'Assign' : 'Unassign'}
                                    </Button>
                                    {/* You might want edit/delete buttons for librarians here too, similar to ManageUsersRole */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground">No librarians found.</p>
                    )}
                </div>

                {/* DialogTrigger for the "Add New Librarian" button */}
                <Dialog open={isAddLibrarianDialogOpen} onOpenChange={setIsAddLibrarianDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2 mt-3">
                            <PlusCircle className="w-4 h-4" />
                            Add New Librarian
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Librarian</DialogTitle>
                            <DialogDescription>
                                Enter the details for the new librarian account.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddLibrarianSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
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
    );
};

export default AssignLibrarians;