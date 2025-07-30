import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  loading = false
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const adjacentPages = 2;
    const boundaryPages = 1;

    if (totalPages === 0) return [];

    // Always include first page
    if (totalPages > 0) {
      pageNumbers.push(1);
    }

    let startBlock = Math.max(2, currentPage - adjacentPages);
    let endBlock = Math.min(totalPages - 1, currentPage + adjacentPages);

    // Adjust blocks for edge cases
    if (currentPage - 1 <= adjacentPages + boundaryPages && totalPages > (adjacentPages * 2 + boundaryPages * 2 + 1)) {
      endBlock = Math.min(totalPages - 1, 1 + adjacentPages * 2 + boundaryPages);
      startBlock = 2;
    }

    if (totalPages - currentPage <= adjacentPages + boundaryPages && totalPages > (adjacentPages * 2 + boundaryPages * 2 + 1)) {
      startBlock = Math.max(2, totalPages - (adjacentPages * 2 + boundaryPages));
      endBlock = totalPages - 1;
    }

    // Add ellipsis if there's a gap after the first page
    if (startBlock > 2) {
      pageNumbers.push('...');
    }

    // Add pages within the calculated central block
    for (let i = startBlock; i <= endBlock; i++) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(i);
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

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border bg-card px-4 py-4 sm:px-6 mt-8 shadow-pagination rounded-lg">
      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="pagination"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="text-sm"
        >
          Previous
        </Button>
        <Button
          variant="pagination"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="text-sm"
        >
          Next
        </Button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{startItem}</span> to{' '}
            <span className="font-medium text-foreground">{endItem}</span> of{' '}
            <span className="font-medium text-foreground">{totalItems}</span> results
          </p>
        </div>
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {/* Previous Button */}
            <Button
              variant="pagination"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="rounded-l-md rounded-r-none px-2 py-2"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>

            {/* Page Numbers */}
            {pageNumbers.map((pageNum, index) => (
              pageNum === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-muted-foreground border border-muted-foreground/20 bg-background"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "pagination-active" : "pagination"}
                  onClick={() => onPageChange(pageNum as number)}
                  disabled={loading}
                  className="rounded-none px-4 py-2 text-sm font-semibold"
                  aria-current={pageNum === currentPage ? 'page' : undefined}
                >
                  {pageNum}
                </Button>
              )
            ))}

            {/* Next Button */}
            <Button
              variant="pagination"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="rounded-r-md rounded-l-none px-2 py-2"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}