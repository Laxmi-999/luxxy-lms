'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBooks } from '@/Redux/slices/bookSlice';

const FindBook = () => {
  const { books } = useSelector((state) => state.books);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white w-full">
      {/* Main Content */}
      <main className="p-6 w-full">
        <div className="w-full">
          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-10 w-full max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-600" />
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border-2 border-yellow-500 rounded-lg focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 bg-white text-gray-900 font-medium shadow-md transition-all duration-300"
              />
            </div>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>

          {filteredBooks.length === 0 ? (
            <p className="text-center text-gray-500 text-xl font-semibold py-10">No books found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 w-full" style={{ alignItems: 'start' }}>
              {filteredBooks.map((book) => (
                <Card
                  key={book.id}
                  className={`bg-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl border border-gray-100 ${getRandomHeightClass()}`}
                  style={{ minHeight: '0', height: 'auto' }}
                >
                  <CardHeader className="p-0">
                    <div className="relative w-full h-[60vh]">
                      <img
                        src={book.coverImage || 'https://via.placeholder.com/150x200?text=Book+Cover'}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <CardTitle className="text-white text-lg font-bold line-clamp-1">{book.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 bg-gray-50">
                    <p className="text-sm text-gray-700 font-medium">{book.author || 'Unknown'}</p>
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