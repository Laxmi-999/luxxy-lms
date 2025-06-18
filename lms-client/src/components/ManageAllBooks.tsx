'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileEdit, Trash2 } from 'lucide-react';
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
import { addBook } from '@/Redux/slices/bookSlice';
import { useDispatch } from 'react-redux';



const ManageAllBooks = () => {

    const dispatch = useDispatch();
    const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);

    const [newBook, setNewBook] = useState({
        title:'',
        author:'',
        isbn:'',
        category:'',
        coverImage:'',
        totalCopies:'',
        availableCopies:'',

    })

      const handleNewBookChange = (e) => {
        const { id, value } = e.target;
        setNewBook((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

     const handleAddNewBookSubmit = (e) => {
            e.preventDefault();
            console.log('Registering new book:', newBook);
            dispatch(addBook(newBook));
    
            setNewBook({
                     title:'',
                     author:'',
                     isbn:'',
                     category:'',
                     coverImage:'',
                     totalCopies:'',
                     availableCopies:'',
                
            });
            setIsAddBookDialogOpen(false);
        };

    const handleEditBookClick = (book) => {
        console.log('Edit book:', book);
        // Implement edit book logic
    };

    const handleDeleteBookClick = (book) => {
        console.log('Delete book:', book);
        // Implement delete book logic
    };

    const handleAddBookClick = () => {
        console.log('Add new book');
        // Implement add book logic
    };

    // This would ideally come from your Redux store or an API call
    const books = [
        { _id: '1', title: 'Deep Work', status: 'Available' },
        { _id: '2', title: 'The Lean Startup', status: 'Borrowed' },
        { _id: '3', title: 'Atomic Habits', status: 'Available' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage All Books</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {books && books.length > 0 ? (
                    books.map((book) => (
                        <div key={book._id} className="flex items-center justify-between border rounded p-3">
                            <div>
                                <p className="font-medium">{book.title}</p>
                                <p className="text-sm text-muted-foreground">{book.status}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditBookClick(book)}
                                >
                                    <FileEdit className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteBookClick(book)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground">No books found.</p>
                )}
                {/* DialogTrigger for the "Add New Book" button */}
                    <Dialog open={isAddBookDialogOpen} onOpenChange={setIsAddBookDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2 mt-3">
                                <PlusCircle className="w-4 h-4" />
                                Add New Book
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Book</DialogTitle>
                                <DialogDescription>
                                    Enter the details for the new book.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddNewBookSubmit} className="grid gap-4 py-4">
                                {/* Title Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title" // Add name prop for consistent handling in onChange
                                        value={newBook.title}
                                        onChange={handleNewBookChange}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                {/* Author Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="author" className="text-right">
                                        Author
                                    </Label>
                                    <Input
                                        id="author"
                                        name="author"
                                        value={newBook.author}
                                        onChange={handleNewBookChange}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                {/* ISBN Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="isbn" className="text-right">
                                        ISBN
                                    </Label>
                                    <Input
                                        id="isbn"
                                        name="isbn"
                                        value={newBook.isbn}
                                        onChange={handleNewBookChange}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                {/* Category Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category" className="text-right">
                                        Category
                                    </Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        value={newBook.category}
                                        onChange={handleNewBookChange}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                {/* Cover Image URL Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="coverImage" className="text-right">
                                        Cover Image URL
                                    </Label>
                                    <Input
                                        id="coverImage"
                                        name="coverImage"
                                        value={newBook.coverImage}
                                        onChange={handleNewBookChange}
                                        className="col-span-3"
                                        type="url" // Suggest type="url" for image URLs
                                    />
                                </div>
                                {/* Total Copies Input */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="totalCopies" className="text-right">
                                        Total Copies
                                    </Label>
                                    <Input
                                        id="totalCopies"
                                        name="totalCopies"
                                        value={newBook.totalCopies}
                                        onChange={handleNewBookChange}
                                        className="col-span-3"
                                        type="number" // Suggest type="number" for numerical input
                                        required
                                    />
                                </div>
                                {/* Available Copies Input - this would typically be derived or set automatically, but included as per request */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="availableCopies" className="text-right">
                                        Available Copies
                                    </Label>
                                    <Input
                                        id="availableCopies"
                                        name="availableCopies"
                                        value={newBook.availableCopies}
                                        onChange={handleNewBookChange}
                                        className="col-span-3"
                                        type="number"
                                        required
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Add New Book</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
            </CardContent>
        </Card>
    );
};

export default ManageAllBooks;