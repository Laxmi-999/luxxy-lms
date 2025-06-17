'use client';

import React, { useState } from 'react';
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
import { addLibrarian } from '@/app/Redux/slices/adminSlice';
import { useAppDispatch, useAppSelector } from '@/app/Redux/hooks';

const AssignLibrarians = () => {
    const dispatch = useAppDispatch();
    const { users } = useAppSelector((state) => state.admin);

    const [isAddLibrarianDialogOpen, setIsAddLibrarianDialogOpen] = useState(false);
    const [newLibrarian, setNewLibrarian] = useState({
        name: '',
        email: '',
        password: '',
    });

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

        setNewLibrarian({
            name: '',
            email: '',
            password: '',
        });
        setIsAddLibrarianDialogOpen(false);
    };

  
    // Filter users who are not yet librarians for potential assignment
    const activeLibrarians = users.filter(user => user.role === 'librarian');


    return (
        <Card>
            <CardHeader>
                <CardTitle>Assign Librarians</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                 <h3 className="text-lg font-semibold">Current Librarians</h3>
                {activeLibrarians.length > 0 ? (
                    activeLibrarians.map((librarian) => (
                        <div key={librarian._id} className="flex items-center justify-between border rounded p-3 bg-green-50/50">
                            <div>
                                <p className="font-medium">{librarian.name}</p>
                                <p className="text-sm text-muted-foreground">{librarian.email}</p>
                            </div>
                            {/* You might want a button to revoke librarian role here */}
                              <Button variant="default" size="sm" onClick={() => handleAssignClick(user)}>
                                <ShieldCheck className="w-4 h-4 mr-1" /> Assign
                            </Button>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground">No active librarians.</p>
                )}

                {/* DialogTrigger for the "Add Librarian" button */}
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