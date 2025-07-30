
'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileEdit, Trash2, BookOpen, User, Tag } from 'lucide-react';
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
import { addBook, deleteBook, fetchAllBooks } from '@/Redux/slices/bookSlice';
import UpdateBookForm from '@/components/Forms/UpdateBookForm';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { Pagination } from '@/components/Pagination';

const ManageAllBooks = () => {
    const dispatch = useDispatch();
    const [selectedBook, setSelectedBook] = useState(null);
    const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
    const [isUpdateBookDialogOpen, setIsUpdateBookDialogOpen] = useState(false);
    const [genres, setGenres] = useState([]);
    const [booksData, setBooksData] = useState({
        books: [],
        totalBooks: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 7,
    });

    const fetchAllGenres = async () => {
        try {
            const { data } = await axiosInstance.get('/genre');
            setGenres(data);
        } catch (err) {
            console.error('Error fetching genres:', err);
            toast.error('Failed to load genres');
        }
    };

    const fetchBooks = async (page = 1) => {
        try {
            const { data } = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/book/get-all-books?page=${page}&limit=${booksData.limit}`);
            setBooksData({
                books: data.books || [],
                totalBooks: data.totalBooks || 0,
                totalPages: data.totalPages || 1,
                currentPage: page,
                limit: booksData.limit,
            });
        } catch (err) {
            console.error('Error fetching books:', err);
            toast.error('Failed to load books');
        }
    };

    useEffect(() => {
        fetchBooks();
        fetchAllGenres();
        dispatch(fetchAllBooks());
    }, [dispatch]);

    const handleNewBookChange = (e) => {
        const { id, value } = e.target;
        setNewBook((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        coverImage: '',
        totalCopies: '',
        availableCopies: '',
    });

    const handleAddNewBookSubmit = (e) => {
        e.preventDefault();
        dispatch(
            addBook({
                ...newBook,
                totalCopies: Number(newBook.totalCopies),
                availableCopies: Number(newBook.availableCopies),
            })
        )
            .unwrap()
            .then(() => {
                toast.success('Book added successfully');
                setIsAddBookDialogOpen(false);
                setNewBook({
                    title: '',
                    author: '',
                    isbn: '',
                    genre: '',
                    coverImage: '',
                    totalCopies: '',
                    availableCopies: '',
                });
                fetchBooks(booksData.currentPage);
            })
            .catch((err) => {
                toast.error('Failed to add book: ' + err);
            });
    };

    const handleEditClick = (book) => {
        setSelectedBook(book);
        setIsUpdateBookDialogOpen(true);
    };

    const handleDeleteBookClick = (bookId) => {
        dispatch(deleteBook(bookId))
            .unwrap()
            .then(() => {
                toast.success('Book deleted successfully');
                fetchBooks(booksData.currentPage);
            })
            .catch((err) => {
                console.error('Failed to delete book:', err);
                toast.error('Failed to delete book');
            });
    };

    const handleCloseUpdateDialog = () => {
        setIsUpdateBookDialogOpen(false);
        setSelectedBook(null);
        fetchBooks(booksData.currentPage);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 w-full">
            <Card className="w-full bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-200 relative">
                <CardHeader className="flex flex-row items-center justify-between p-6 bg-white rounded-t-xl">
                    <CardTitle className="text-lg font-semibold text-gray-800">Manage All Books</CardTitle>
                    <Dialog
                        open={isAddBookDialogOpen}
                        onOpenChange={(open) => {
                            setIsAddBookDialogOpen(open);
                            if (open) fetchAllGenres();
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200">
                                <PlusCircle className="w-4 h-4" />
                                Add New Book
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold text-gray-800">Add New Book</DialogTitle>
                                <DialogDescription className="text-sm text-gray-500">
                                    Enter the details for the new book.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddNewBookSubmit} className="grid gap-6 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right text-sm font-medium text-gray-800">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={newBook.title}
                                        onChange={handleNewBookChange}
                                        className="col-span-3 border-gray-200 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-800"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="author" className="text-right text-sm font-medium text-gray-800">
                                        Author
                                    </Label>
                                    <Input
                                        id="author"
                                        name="author"
                                        value={newBook.author}
                                        onChange={handleNewBookChange}
                                        className="col-span-3 border-gray-200 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-800"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="isbn" className="text-right text-sm font-medium text-gray-800">
                                        ISBN
                                    </Label>
                                    <Input
                                        id="isbn"
                                        name="isbn"
                                        value={newBook.isbn}
                                        onChange={handleNewBookChange}
                                        className="col-span-3 border-gray-200 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-800"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="genre" className="text-right text-sm font-medium text-gray-800">
                                        Genre
                                    </Label>
                                    <select
                                        id="genre"
                                        name="genre"
                                        value={newBook.genre}
                                        onChange={handleNewBookChange}
                                        className="col-span-3 border border-gray-200 rounded px-2 py-1 text-sm text-gray-800 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    >
                                        <option value="" className="text-gray-500">Select a genre</option>
                                        {genres.map((genre) => (
                                            <option key={genre._id} value={genre._id} className="text-gray-800">
                                                {genre.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="coverImage" className="text-right text-sm font-medium text-gray-800">
                                        Cover Image URL
                                    </Label>
                                    <Input
                                        id="coverImage"
                                        name="coverImage"
                                        value={newBook.coverImage}
                                        onChange={handleNewBookChange}
                                        className="col-span-3 border-gray-200 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-800"
                                        type="url"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="totalCopies" className="text-right text-sm font-medium text-gray-800">
                                        Total Copies
                                    </Label>
                                    <Input
                                        id="totalCopies"
                                        name="totalCopies"
                                        value={newBook.totalCopies}
                                        onChange={handleNewBookChange}
                                        className="col-span-3 border-gray-200 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-800"
                                        type="number"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="availableCopies" className="text-right text-sm font-medium text-gray-800">
                                        Available Copies
                                    </Label>
                                    <Input
                                        id="availableCopies"
                                        name="availableCopies"
                                        value={newBook.availableCopies}
                                        onChange={handleNewBookChange}
                                        className="col-span-3 border-gray-200 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-800"
                                        type="number"
                                        required
                                    />
                                </div>
                                <DialogFooter className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-orange-500 text-orange-500 hover:bg-orange-50 transition-all duration-200"
                                        onClick={() => setIsAddBookDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200"
                                    >
                                        Add New Book
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="p-6  space-y-4 h-[700px]">
                    {booksData.books && booksData.books.length > 0 ? (
                        <div className="space-y-3 animate-fade-in">
                            {booksData.books.map((book) => (
                                <div
                                    key={book._id}
                                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-orange-50 transition-all duration-200"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-orange-500" />
                                            <p className="font-medium text-gray-800 text-sm">{book.title}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-orange-500" />
                                            <p className="text-sm text-gray-500">By {book.author}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-orange-500" />
                                            <p className="text-sm text-gray-500">{book.genre?.name || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-orange-500 text-orange-500 hover:bg-orange-50 transition-all duration-200"
                                            onClick={() => handleEditClick(book)}
                                        >
                                            <FileEdit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200"
                                            onClick={() => handleDeleteBookClick(book._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm text-center">No books found.</p>
                    )}
                </CardContent>
                {booksData.totalPages > 1 && (
                    <div className="absolute bottom-0 bg-gray-50 w-full left-0 border-t border-gray-200 p-4 shadow-sm">
                        <Pagination
                            currentPage={booksData.currentPage}
                            totalPages={booksData.totalPages}
                            totalItems={booksData.totalBooks}
                            itemsPerPage={booksData.limit}
                            onPageChange={(newPage) => fetchBooks(newPage)}
                        />
                    </div>
                )}
                {selectedBook && (
                    <UpdateBookForm
                        book={selectedBook}
                        isOpen={isUpdateBookDialogOpen}
                        onClose={handleCloseUpdateDialog}
                    />
                )}
            </Card>
        </div>
    );
};

export default ManageAllBooks;
