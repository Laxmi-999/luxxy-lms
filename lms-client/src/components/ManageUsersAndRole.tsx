'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileEdit, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/Redux/hooks';
import UpdateUserForm from './Forms/UpdateUserForm';
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
import { addUser, deleteUser } from '@/Redux/slices/adminSlice';



const ManageUsersAndRoles = () => {
    const { users } = useAppSelector((state) => state.admin);
    const dispatch = useAppDispatch();

    // State for the update user dialog
    const [isUpdateUserDialogOpen, setIsUpdateUserDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [ addNewUserDialogOpen, setAddNewUserDialogOpen] = useState();
    const [newUser, setNewUser] = useState({

        name:'',
        email:'',
        password:""

    })

    // Filter users to only include 'member' roles
    const memberUsers = users.filter(user => user.role === 'member'); 

    const handleEditClick = (user) => {
        setSelectedUser(user); 
        setIsUpdateUserDialogOpen(true); 
    };

    const handleDeleteClick = (user) => {
        console.log('Delete user:', user);
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            dispatch(deleteUser(user._id)); 
        }
    };

    const handleAddUserClick = () => {
        console.log('Add new user functionality will be here, perhaps another dialog.');
    };

    const handleCloseUpdateDialog = () => {
        setIsUpdateUserDialogOpen(false);
        setSelectedUser(null);
    };

     const handleNewUserChange = (e) => {
        const { id, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

   const  handleAddUserSubmit = (e) => {
    e.preventDefault();
    console.log('Registering new Member user',newUser );
    dispatch(addUser(newUser));

    setNewUser({
        name:'',
        email:'',
        password:''
    })
    setAddNewUserDialogOpen(false);
    

   }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Users & Roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {memberUsers && memberUsers.length > 0 ? (
                    memberUsers.map((user) => (
                        <div key={user._id} className="flex items-center justify-between border rounded p-3">
                            <div>
                                <p className="font-medium">{user.name} ({user.role})</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleEditClick(user)}
                                    size="sm"
                                    variant="outline"
                                >
                                    <FileEdit className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => handleDeleteClick(user)}
                                    size="sm"
                                    variant="destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground">No users found.</p>
                )}


                 {/* DialogTrigger for the "Add Librarian" button */}
                <Dialog open={addNewUserDialogOpen} onOpenChange={setAddNewUserDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2 mt-3" onClick={handleAddUserClick}>
                            <PlusCircle className="w-4 h-4" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Enter the details for the new user account.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddUserSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Username
                                </Label>
                                <Input
                                    id="name"
                                    value={newUser.name}
                                    onChange={handleNewUserChange}
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
                                    value={newUser.email}
                                    onChange={handleNewUserChange}
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
                                    value={newUser.password}
                                    onChange={handleNewUserChange}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Add User</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>


                
            </CardContent>

            {/* Update User Form Dialog */}
            {selectedUser && ( 
                <UpdateUserForm
                    user={selectedUser}
                    isOpen={isUpdateUserDialogOpen}
                    onClose={handleCloseUpdateDialog}
                />
            )}
        </Card>
    );
};

export default ManageUsersAndRoles;