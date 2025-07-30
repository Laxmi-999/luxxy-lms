'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios'; // Import axios for API calls
// Assuming these components are available from your project's UI library
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

// IMPORTANT: Ensure process.env.NEXT_PUBLIC_API_URL is correctly set in your .env file
// Example: NEXT_PUBLIC_API_URL=http://localhost:8000/api

const FindBook = () => {
  // Local state to manage books, loading, error, and pagination
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1); // Current page for API request
  const limit = 6; // Books per page
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  // Function to fetch books directly from the API
  const fetchBooksDirectly = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // console.log(`FindBook: Fetching books directly from: ${baseUrl}/book/get-all-books?page=${page}&limit=${limit}`);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/book/get-all-books?page=${page}&limit=${limit}`);
      console.log('FindBook: API Response Data:', response.data);

      // Update local state with data from API response
      setBooks(response.data.books || []);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
      setTotalBooks(response.data.totalBooks || 0);

    } catch (err) {
      console.error('FindBook: Error fetching books directly:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to fetch books');
      setBooks([]); // Clear books on error
      setTotalBooks(0);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [page, limit]); // Re-run when 'page' or 'limit' changes

  // Effect to call the fetch function on component mount and when 'page' changes
  useEffect(() => {
    fetchBooksDirectly();
  }, [fetchBooksDirectly]);

  // Filter books based on search term (still client-side filtering on current page)
  const filteredBooks = Array.isArray(books)
    ? books.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleBookClick = (bookId) => {
    router.push(`/member/book-details/${bookId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage); // This state update will trigger fetchBooksDirectly via useEffect
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Generates an array of page numbers to display in the pagination.
   * Implements the logic: 1, ..., [current - N, current, current + N], ..., totalPages
   * with adjustments for pages near the start/end.
   */
  const getPageNumbers = () => {
    const pageNumbers = [];
    const adjacentPages = 2; // Number of pages to show directly around the current page (e.g., for page 50, show 48, 49, 51, 52)
    const boundaryPages = 1; // Number of fixed pages at the start/end (e.g., page 1 and totalPages)

    // Always add the first page if it exists
    if (totalPages > 0) {
      pageNumbers.push(1);
    }

    // Calculate the start and end of the "central" block of pages around currentPage
    let startBlock = Math.max(2, currentPage - adjacentPages);
    let endBlock = Math.min(totalPages - 1, currentPage + adjacentPages);

    // Adjust the central block if it's too close to the beginning
    // This ensures a consistent number of pages when near the start, e.g., 1, 2, 3, 4, 5, ...
    if (currentPage - 1 <= adjacentPages + boundaryPages && totalPages > (adjacentPages * 2 + boundaryPages * 2 + 1)) {
        endBlock = Math.min(totalPages - 1, 1 + adjacentPages * 2 + boundaryPages);
        startBlock = 2; // Ensure it starts from 2
    }
    // Adjust the central block if it's too close to the end
    // This ensures a consistent number of pages when near the end, e.g., ..., 96, 97, 98, 99, 100
    if (totalPages - currentPage <= adjacentPages + boundaryPages && totalPages > (adjacentPages * 2 + boundaryPages * 2 + 1)) {
        startBlock = Math.max(2, totalPages - (adjacentPages * 2 + boundaryPages));
        endBlock = totalPages - 1; // Ensure it ends before totalPages
    }


    // Add ellipsis if there's a gap after the first page
    if (startBlock > 2) {
      pageNumbers.push('...');
    }

    // Add pages within the calculated central block
    for (let i = startBlock; i <= endBlock; i++) {
      // Avoid duplicating page 1 or totalPages if they fall within the block
      if (i > 1 && i < totalPages) {
        pageNumbers.push(i);
      } else if (i === 1 && totalPages <= (adjacentPages * 2 + boundaryPages * 2 + 1)) {
        // If total pages are few, and 1 is in the block, add it if not already there
        if (!pageNumbers.includes(1)) pageNumbers.push(1);
      } else if (i === totalPages && totalPages <= (adjacentPages * 2 + boundaryPages * 2 + 1)) {
        // If total pages are few, and totalPages is in the block, add it if not already there
        if (!pageNumbers.includes(totalPages)) pageNumbers.push(totalPages);
      }
    }

    // Add ellipsis if there's a gap before the last page
    if (endBlock < totalPages - 1) {
      pageNumbers.push('...');
    }

    // Always add the last page if it exists and is not already included
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }

    // Remove any consecutive '...' to clean up the array
    const uniquePageNumbers = [];
    for (let i = 0; i < pageNumbers.length; i++) {
      if (pageNumbers[i] === '...' && uniquePageNumbers[uniquePageNumbers.length - 1] === '...') {
        continue;
      }
      uniquePageNumbers.push(pageNumbers[i]);
    }

    return uniquePageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // --- Conditional Rendering Logic ---
  if (error) {
    console.error("FindBook Component: Rendered with error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (loading && books.length === 0 && !searchTerm) {
    console.log("FindBook Component: Showing initial loading state.");
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
                {filteredBooks.map((book) => (
                  <Card
                    key={book._id}
                    onClick={() => handleBookClick(book._id)}
                    className="overflow-hidden shadow-md hover:shadow-lg transition duration-300 rounded-xl cursor-pointer border border-gray-200"
                  >
                    <div className="h-[220px] bg-gray-100 flex justify-center items-center">
                      <img
                        src={book.coverImage || 'https://via.placeholder.co/150x200?text=Book+Cover'}
                        alt={book.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{book.title}</h2>
                      <p className="text-sm text-gray-500">{book.author || 'Unknown Author'}</p>

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
                    {/* Mobile Previous Button */}
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1 || loading}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-white"
                    >
                      Previous
                    </Button>
                    {/* Mobile Next Button */}
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages || loading}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-white"
                    >
                      Next
                    </Button>
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
                        {/* Previous Button */}
                        <Button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1 || loading}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-orange-50 hover:text-white focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </Button>
                        {/* Page Numbers */}
                        {pageNumbers.map((p, index) => (
                          p === '...' ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                            >
                              ...
                            </span>
                          ) : (
                            <Button
                              key={p}
                              onClick={() => handlePageChange(p)}
                              aria-current={p === currentPage ? 'page' : undefined}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                                p === currentPage
                                  ? 'bg-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-orange-50 hover:text-white focus:outline-offset-0'
                              }`}
                              disabled={loading}
                            >
                              {p}
                            </Button>
                          )
                        ))}
                        {/* Next Button */}
                        <Button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === totalPages || loading}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-orange-50 hover:text-white focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </Button>
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
