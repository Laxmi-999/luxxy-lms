'use client';
import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { addBook, deleteBook, fetchAllBooks, updateBook } from '@/Redux/slices/bookSlice';
import UpdateBookForm from '@/components/Forms/UpdateBookForm';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';


const ManageAllBooks = () => {

    const {books} = useSelector((state) => state.books);
    console.log('books are', books);

    const dispatch = useDispatch();
    const [selectedBook, setSelectedBook] = useState(null);
    const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
    const [isUpdateBookDialogOpen, setIsUpdateBookDialogOpen] = useState(false);
    const [genres, setGenres] = useState([]);


    const fetchAllGenres = async () => {
        const data = await axiosInstance.get('/genre');
        console.log('genres are', data);
        setGenres(data.data)

    }
   
    useEffect(() => {
        dispatch(fetchAllBooks());
        fetchAllGenres();
    }, [dispatch])
   

   
    
    

    const [newBook, setNewBook] = useState({
        title:'',
        author:'',
        isbn:'',
        genre:'',
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

            dispatch(addBook({
                ...newBook,
                totalCopies: Number(newBook.totalCopies),
                availableCopies: Number(newBook.availableCopies),
              }))
              
            .unwrap()
            .then(() => {
                toast.success('Book added successfully');
                console.log('data sent are', newBook);
                setIsAddBookDialogOpen(false);
                setNewBook({
                    title: '',
                    author: '',
                    isbn: '',
                    genre: '',
                    coverImage: '',
                    totalCopies: '',
                    availableCopies: ''
                });
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
        console.log('Delete book:', bookId);
        dispatch(deleteBook(bookId))
            .unwrap() // Use .unwrap() to handle success/failure of the thunk
            .then(() => {
                console.log('Book deleted successfully, re-fetching books...');
                dispatch(fetchAllBooks()); // Dispatch fetchAllBooks after successful deletion
            })
            .catch((err) => {
                console.error('Failed to delete book:', err);
                // Optionally show a toast notification or error message
            });
    };


  
     const handleCloseUpdateDialog = () => {
        setIsUpdateBookDialogOpen(false);
        setSelectedBook(null);
    };

   

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Manage All Books</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {books && books.length > 0 ? (
                    books.map((book) => (
                        <div key={book._id} className="flex items-center justify-between border rounded p-3">
                            <div>
                                <p className="font-medium">{book.title}</p>
                                <p className="text-sm text-muted-foreground">By {book.author}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditClick(book)}
                                >
                                    <FileEdit className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteBookClick(book._id)}
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
                    <Dialog
                        open={isAddBookDialogOpen}
                        onOpenChange={(open) => {
                            setIsAddBookDialogOpen(open);
                            if (open) fetchAllGenres();
                        }}
                    >
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
                                    <Label htmlFor="genre" className="text-right">
                                        Genre
                                    </Label>
                                    <select
                                        id="genre"
                                        name="genre"
                                        value={newBook.genre}
                                        onChange={handleNewBookChange}
                                        className="col-span-3 border rounded px-2 py-1"
                                        required
                                    >
                                        <option value="">Select a genre</option>
                                        {genres.map((genre) => (
                                            <option key={genre._id} value={genre._id}>
                                                {genre.name}
                                            </option>
                                        ))}
                                    </select>
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

                     {/* Update User Form Dialog */}
            {selectedBook && ( 
                <UpdateBookForm
                    book={selectedBook}
                    isOpen={isUpdateBookDialogOpen}
                    onClose={handleCloseUpdateDialog}
                />
            )}
            </CardContent>
        </Card>
    );
};

export default ManageAllBooks;