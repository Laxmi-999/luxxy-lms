'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileEdit, Trash2 } from 'lucide-react';

const ManageAllBooks = () => {
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
                <Button className="flex items-center gap-2 mt-3" onClick={handleAddBookClick}>
                    <PlusCircle className="w-4 h-4" />
                    Add Book
                </Button>
            </CardContent>
        </Card>
    );
};

export default ManageAllBooks;