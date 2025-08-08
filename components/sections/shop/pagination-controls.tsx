import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, memo, useCallback } from "react";
import { PaginationControlsProps } from "@/lib/types";

const PageButton = memo(({
  pageNumber,
  isActive,
  loading,
  onClick
}: {
  pageNumber: number;
  isActive: boolean;
  loading: boolean;
  onClick: (pageNumber: number) => void;
}) => {
  const handleClick = useCallback(() => {
    if (!isActive && !loading) {
      onClick(pageNumber);
    }
  }, [pageNumber, isActive, loading, onClick]);

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className={`h-8 w-8 p-0 text-sm flex-shrink-0 ${
        isActive 
          ? "bg-blue-500 hover:bg-blue-600 border-blue-500 text-white" 
          : "border-gray-300 hover:bg-gray-50"
      }`}
    >
      {pageNumber + 1}
    </Button>
  );
});

PageButton.displayName = 'PageButton';

const EllipsisButton = memo(({
  target,
  loading,
  onClick
}: {
  target: 'first' | 'last';
  loading: boolean;
  onClick: (target: 'first' | 'last') => void;
}) => {
  const handleClick = useCallback(() => {
    if (!loading) {
      onClick(target);
    }
  }, [target, loading, onClick]);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
      title={`${target === 'last' ? 'Son' : 'İlk'} sayfaya atla`}
    >
      ...
    </button>
  );
});

EllipsisButton.displayName = 'EllipsisButton';

const PaginationControls = memo(({
  currentPage,
  pageSize,
  totalItems,
  hasNextPage,
  loading,
  onNext,
  onPrev,
  onPageSizeChange,
  onPageJump,
}: PaginationControlsProps) => {

  if (totalItems === 0) {
    return null;
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  const showingFrom = currentPage * pageSize + 1;
  const showingTo = Math.min((currentPage + 1) * pageSize, totalItems);

  const pageNumbers = useMemo(() => {
    const pages: Array<number | { type: 'ellipsis'; target: 'first' | 'last' }> = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage < 3) {
        for (let i = 0; i < Math.min(4, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push({ type: 'ellipsis', target: 'last' as const }); 
          pages.push(totalPages - 1);
        }
      } else if (currentPage > totalPages - 4) {
        pages.push(0);
        pages.push({ type: 'ellipsis', target: 'first' as const }); 
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(0);
        pages.push({ type: 'ellipsis', target: 'first' as const });
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push({ type: 'ellipsis', target: 'last' as const });
        pages.push(totalPages - 1);
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  const handlePageClick = useCallback((pageNum: number) => {
    if (pageNum === currentPage || !onPageJump) return;
    onPageJump(pageNum);
  }, [currentPage, onPageJump]);

  const handleEllipsisClick = useCallback((target: 'first' | 'last') => {
    const targetPage = target === 'last' ? totalPages - 1 : 0;
    handlePageClick(targetPage);
  }, [totalPages, handlePageClick]);

  const handlePrevClick = useCallback(() => {
    if (currentPage > 0 && onPrev) {
      onPrev();
    }
  }, [currentPage, onPrev]);

  const handleNextClick = useCallback(() => {
    if (hasNextPage && onNext) {
      onNext();
    }
  }, [hasNextPage, onNext]);

  const formattedTotal = useMemo(() => totalItems.toLocaleString(), [totalItems]);

  return (
    <div className="space-y-4 mb-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
        <div className="text-sm">
          <span className="font-medium">
            {showingFrom}-{showingTo}
          </span>{" "}
          /{formattedTotal} sonuç
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <span>Göster:</span>
          <Select 
            value={pageSize.toString()} 
            onValueChange={onPageSizeChange} 
            disabled={loading}
          >
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="36">36</SelectItem>
              <SelectItem value="64">64</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 py-4 overflow-x-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevClick}
          disabled={currentPage === 0 || loading}
          className="h-8 px-3 mr-2 sm:mr-4 text-sm border-gray-300 hover:bg-gray-50 flex-shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 min-w-0 overflow-x-auto scrollbar-hide">
          {pageNumbers.map((page, index) => {
            if (typeof page === 'object' && page.type === 'ellipsis') {
              return (
                <EllipsisButton
                  key={`ellipsis-${index}`}
                  target={page.target}
                  loading={loading}
                  onClick={handleEllipsisClick}
                />
              );
            }
            return (
              <PageButton
                key={page as number}
                pageNumber={page as number}
                isActive={page === currentPage}
                loading={loading}
                onClick={handlePageClick}
              />
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextClick}
          disabled={!hasNextPage || loading}
          className="h-8 px-3 ml-2 sm:ml-4 text-sm border-gray-300 hover:bg-gray-50 flex-shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

PaginationControls.displayName = 'PaginationControls';

export default PaginationControls;