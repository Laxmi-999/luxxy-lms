'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileEdit, Trash2, User } from 'lucide-react';
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
import { addUser, deleteUser, fetchAllUsers } from '@/Redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import UpdateUserForm from '@/components/Forms/UpdateUserForm';
import { toast } from 'sonner';

const ManageUsers = () => {
  const { users } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isUpdateUserDialogOpen, setIsUpdateUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addNewUserDialogOpen, setAddNewUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  // Filter users to only include 'member' roles
  const memberUsers = users ? users.filter(user => user.role === 'member') : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        await dispatch(fetchAllUsers()).unwrap();
        console.log('Users:', users);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
        toast.error('Failed to load users', { position: 'top-center' });
      }
    };
    fetchData();
  }, [dispatch]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsUpdateUserDialogOpen(true);
  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm(`Are you sure you want to delete user ${userId}?`)) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success('User deleted successfully', { position: 'top-center' });
        await dispatch(fetchAllUsers()).unwrap();
      } catch (err) {
        console.error('Failed to delete user:', err);
        toast.error('Failed to delete user', { position: 'top-center' });
      }
    }
  };

  const handleNewUserChange = (e) => {
    const { id, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addUser(newUser)).unwrap();
      toast.success('User added successfully', { position: 'top-center' });
      setNewUser({ name: '', email: '', password: '' });
      setAddNewUserDialogOpen(false);
      await dispatch(fetchAllUsers()).unwrap();
    } catch (err) {
      console.error('Failed to add user:', err);
      toast.error('Failed to add user', { position: 'top-center' });
    }
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateUserDialogOpen(false);
    setSelectedUser(null);
    dispatch(fetchAllUsers());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans flex w-full">
      <Card className="w-full bg-white shadow-md rounded-xl border border-gray-200 h-[calc(100vh-2rem)] flex flex-col">
        <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-xl flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Manage Users & Roles
          </CardTitle>
          <Dialog open={addNewUserDialogOpen} onOpenChange={setAddNewUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 text-xs py-1 px-2 transition-all duration-200">
                <PlusCircle className="w-4 h-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-base font-semibold text-gray-800">Add New User</DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Enter the details for the new user account.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUserSubmit} className="grid gap-4 py-2">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="name" className="text-right text-xs font-medium text-gray-800">
                    Username
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    className="col-span-3 border-gray-200 focus:ring-orange-500 focus:border-orange-500 text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="email" className="text-right text-xs font-medium text-gray-800">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    className="col-span-3 border-gray-200 focus:ring-orange-500 focus:border-orange-500 text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="password" className="text-right text-xs font-medium text-gray-800">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    className="col-span-3 border-gray-200 focus:ring-orange-500 focus:border-orange-500 text-xs"
                    required
                  />
                </div>
                <DialogFooter className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-orange-500 text-orange-500 hover:bg-orange-50 text-xs py-0.5 px-2"
                    onClick={() => setAddNewUserDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-500 text-white hover:bg-orange-600 text-xs py-0.5 px-2"
                  >
                    Add User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {error && (
            <div className="bg-red-50 border-red-200 rounded-lg p-3 mb-3">
              <p className="text-red-600 text-sm">{error}</p>
              <Button
                variant="outline"
                className="mt-2 border-orange-500 text-orange-500 hover:bg-orange-50 text-xs py-1 px-2"
                onClick={() => dispatch(fetchAllUsers())}
              >
                Retry
              </Button>
            </div>
          )}
          {memberUsers.length > 0 ? (
            <div className="space-y-2">
              {memberUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2 hover:bg-orange-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{user.name} ({user.role})</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleEditClick(user)}
                      size="sm"
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-50 text-xs py-0.5 px-1"
                    >
                      <FileEdit className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(user._id)}
                      size="sm"
                      className="bg-red-500 text-white hover:bg-red-600 text-xs py-0.5 px-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No member users found.</p>
          )}
        </CardContent>
        {selectedUser && (
          <UpdateUserForm
            user={selectedUser}
            isOpen={isUpdateUserDialogOpen}
            onClose={handleCloseUpdateDialog}
          />
        )}
      </Card>
    </div>
  );
};

export default ManageUsers;