'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axiosInstance';

const FindBook = () => {
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 6;

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const fetchBooksDirectly = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `/book/get-all-books?page=${currentPage}&limit=${limit}`
      );
      console.log('API response:', response.data); // Debug API response
      setBooks(response.data.books || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalBooks(response.data.totalBooks || 0);
    } catch (err) {
      console.error('FindBook: Error fetching books:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to fetch books');
      setBooks([]);
      setTotalBooks(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchBooksDirectly();
  }, [fetchBooksDirectly]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      router.push(`?${params.toString()}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    pageNumbers.push(1);

    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxVisiblePages / 2));

    if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
      endPage = Math.min(maxVisiblePages + 1, totalPages - 1);
    }

    if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
      startPage = Math.max(2, totalPages - maxVisiblePages);
    }

    if (startPage > 2) {
      pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const filteredBooks = Array.isArray(books)
    ? books.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof book.author === 'string'
            ? book.author.toLowerCase()
            : book.author?.name?.toLowerCase() || ''
          ).includes(searchTerm.toLowerCase())
      )
    : [];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (loading && books.length === 0 && !searchTerm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading books...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white w-full">
      <main className="p-6 w-full">
        <div className="w-full max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-10 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search books on current page..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Book Grid or No Books Message */}
          {filteredBooks.length === 0 ? (
            <p className="text-center text-gray-500 text-xl font-semibold py-10">
              {searchTerm ? 'No matching books found on this page.' : 'No books found in the library.'}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {filteredBooks?.map((book) => (
                  <Card
                    key={book?._id}
                    onClick={() => router.push(`/member/book-details/${book._id}`)}
                    className="overflow-hidden shadow-md hover:shadow-lg transition duration-300 rounded-xl cursor-pointer border border-gray-200"
                  >
                    <div className="h-[220px] bg-gray-100 flex justify-center items-center">
                      <img
                        src={book.coverImage || 'https://via.placeholder.co/150x200?text=Book+Cover'}
                        alt={book.title || 'Book cover'}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{book.title || 'Untitled'}</h2>
                      <p className="text-sm text-gray-500">
                        {typeof book.author === 'string' ? book.author : book.author?.name || 'Unknown Author'}
                      </p>
                      <div className="mt-3">
                        {book.availableCopies > 0 ? (
                          <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                            Available ({book.availableCopies})
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

              {/* Pagination Section */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-10 shadow-md rounded-lg">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <Link
                      href={`?page=${currentPage - 1}`}
                      scroll={false}
                      className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                        currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      Previous
                    </Link>
                    <Link
                      href={`?page=${currentPage + 1}`}
                      scroll={false}
                      className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                        currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      Next
                    </Link>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * limit, totalBooks)}</span> of{' '}
                        <span className="font-medium">{totalBooks}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <Link
                          href={`?page=${currentPage - 1}`}
                          scroll={false}
                          className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                            currentPage === 1 ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-orange-50'
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        {getPageNumbers().map((p, index) => (
                          p === '...' ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                            >
                              ...
                            </span>
                          ) : (
                            <Link
                              key={p}
                              href={`?page=${p}`}
                              scroll={false}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                p === currentPage
                                  ? 'bg-orange-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-orange-50 focus:outline-offset-0'
                              }`}
                            >
                              {p}
                            </Link>
                          )
                        ))}
                        <Link
                          href={`?page=${currentPage + 1}`}
                          scroll={false}
                          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                            currentPage === totalPages ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-orange-50'
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </Link>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default FindBook;