import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { PaginationControlsProps } from "@/lib/types";

export const PaginationControls = ({
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
  const totalPages = Math.ceil(totalItems / pageSize);
  const showingFrom = currentPage * pageSize + 1;
  const showingTo = Math.min((currentPage + 1) * pageSize, totalItems);
  const [maxVisible, setMaxVisible] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      setMaxVisible(window.innerWidth < 640 ? 2 : 5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage < maxVisible) {
        for (let i = 0; i < maxVisible; i++) {
          pages.push(i);
        }
        if (totalPages > maxVisible) {
          pages.push({ type: 'ellipsis', target: 'last' as 'last'}); 
          pages.push(totalPages - 1);
        }
      } else if (currentPage > totalPages - maxVisible) {
        pages.push(0);
        pages.push({ type: 'ellipsis', target: 'first' as 'first' }); 
        for (let i = totalPages - maxVisible; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(0);
        pages.push({ type: 'ellipsis', target: 'first' as 'first' });
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push({ type: 'ellipsis', target: 'last' as 'last' });
        pages.push(totalPages - 1);
      }
    }
    return pages;
  };

  const handlePageClick = (pageNum: number) => {
    if (pageNum === currentPage) return;
    if (onPageJump) {
      onPageJump(pageNum);
    } else {
      const diff = pageNum - currentPage;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          setTimeout(() => onNext(), i * 50);
        }
      } else {
        for (let i = 0; i < Math.abs(diff); i++) {
          setTimeout(() => onPrev(), i * 50);
        }
      }
    }
  };

  const handleEllipsisClick = (target: 'first' | 'last') => {
    if (target === 'last') {
      handlePageClick(totalPages - 1); 
    } else {
      handlePageClick(0); 
    }
  };

return (
    <div className="space-y-4 mb-12">
      {/* Results summary */}
      <div className="flex flex-col-2 items-center justify-between gap-4 py-4 border-t">
        <div className="text-sm">
          <span className="font-medium">
            {showingFrom}-{showingTo}
          </span>{" "}
          /{totalItems.toLocaleString()} sonuç
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

      {/* Amazon-style pagination */}
      <div className="flex items-center justify-center gap-1 py-4">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={currentPage === 0 || loading}
          className="h-8 px-3 mr-4 text-sm border-gray-300 hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {generatePageNumbers().map((page, index) => {
  if (typeof page === 'object' && page.type === 'ellipsis') {
    return (
      <button
        key={`ellipsis-${index}`}
        onClick={() => handleEllipsisClick(page.target)}
        disabled={loading}
        className="px-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        title={`Son sayfaya atla`}
      >
        ...
      </button>
    );
  }
  return (
    <Button
      key={page as number} 
      variant={page === currentPage ? "default" : "outline"}
      size="sm"
      onClick={() => handlePageClick(page as number)}
      disabled={loading}
      className={`h-8 w-8 p-0 text-sm ${
        page === currentPage 
          ? "bg-blue-500 hover:bg-blue-600 border-blue-500 text-white" 
          : "border-gray-300 hover:bg-gray-50"
      }`}
    >
      {(page as number) + 1}
    </Button>
  );
})}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!hasNextPage || loading}
          className="h-8 px-3 ml-4 text-sm border-gray-300 hover:bg-gray-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};