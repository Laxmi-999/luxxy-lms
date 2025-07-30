'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationControls = ({ 
  currentPage,
  totalPages,
  onPageChange,
  limit,
  totalItems,
  className = ''
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    // Always show first page
    pageNumbers.push(1);

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxVisiblePages / 2));

    // Adjust if near start
    if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
      endPage = Math.min(maxVisiblePages + 1, totalPages - 1);
    }
    
    // Adjust if near end
    if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
      startPage = Math.max(2, totalPages - maxVisiblePages);
    }

    // Add first ellipsis if needed
    if (startPage > 2) {
      pageNumbers.push('...');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add second ellipsis if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }

    // Always show last page if there is one
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between ${className}`}>
      <div className="mb-2 sm:mb-0">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * limit, totalItems)}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </p>
      </div>
      
      <nav className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span 
              key={`ellipsis-${index}`} 
              className="px-3 py-1 text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md border ${
                page === currentPage 
                  ? 'bg-orange-500 border-orange-500 text-white' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
};

export default PaginationControls;