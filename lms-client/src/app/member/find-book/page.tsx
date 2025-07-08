'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBooks } from '@/Redux/slices/bookSlice';
import { useRouter } from 'next/navigation';

const FindBook = () => {
  const { books } = useSelector((state) => state.books);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simulate varying heights for a pseudo-masonry effect
  const getRandomHeightClass = () => {
    const heights = ['h-64', 'h-80', 'h-96', 'h-72']; // Different height classes
    return heights[Math.floor(Math.random() * heights.length)];
  };

  const handleBookClick = (bookId) => {

     router.push(`/member/book-details/${bookId}`);    
   
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white w-full">
      {/* Main Content */}
      <main className="p-6 w-full">
          <div className="w-full max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-10 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Book Grid */}
            {filteredBooks.length === 0 ? (
              <p className="text-center text-gray-500 text-xl font-semibold py-10">
                No books found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <Card
                    key={book._id}
                    onClick={() => handleBookClick(book._id)}
                    className="overflow-hidden shadow-md hover:shadow-lg transition duration-300 rounded-xl cursor-pointer border border-gray-200"
                  >
                    <div className="h-[220px] bg-gray-100 flex justify-center items-center">
                      <img
                        src={book.coverImage || 'https://via.placeholder.com/150x200?text=Book+Cover'}
                        alt={book.title}
                        className="h-full object-contain"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{book.title}</h2>
                      <p className="text-sm text-gray-500">{book.author || 'Unknown Author'}</p>

                      {/* Availability Badge */}
                      <div className="mt-3">
                        {book.availableCopies > 0 ? (
                          <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                            Available
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full">
                            Reserve
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
    </main>

    </div>
  );
};

export default FindBook;