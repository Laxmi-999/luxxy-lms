'use client';
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { updateBook } from '@/Redux/slices/bookSlice';
// import { updateBook } from '@/Redux/slices/bookSlice'; // Uncomment and create accordingly

const UpdateBookForm = ({ book, isOpen, onClose }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        category: '',
        coverImage: '',
        isAvailable: true,
        totalCopies: 0,
    });

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '',
                author: book.author || '',
                isbn: book.isbn || '',
                category: book.category || '',
                coverImage: book.coverImage || '',
                isAvailable: book.isAvailable ?? true,
                totalCopies: book.totalCopies || 0,
            });
        }
    }, [book]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updating book with data:', formData);
        dispatch(updateBook({ bookId: book._id, bookData: formData }));
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Book: {book?.title}</DialogTitle>
                    <DialogDescription>
                        Update book details below. Click "Save Changes" to apply updates.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {['title', 'author', 'isbn', 'category', 'coverImage'].map((field) => (
                        <div key={field} className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={field} className="text-right capitalize">
                                {field}
                            </Label>
                            <Input
                                id={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="col-span-3"
                                required={field !== 'coverImage'} // coverImage optional
                            />
                        </div>
                    ))}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="totalCopies" className="text-right">Total Copies</Label>
                        <Input
                            id="totalCopies"
                            type="number"
                            value={formData.totalCopies}
                            onChange={handleChange}
                            className="col-span-3"
                            min="0"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="isAvailable" className="text-right">Available</Label>
                        <input
                            id="isAvailable"
                            type="checkbox"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                            className="col-span-3 h-5 w-5"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateBookForm;
