import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/(frontend)/core/components/atoms/Pagination/Pagination";

interface DataGridPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  createPageUrl: (page: number) => string;
  className?: string;
}

export default function DataGridPagination({
  currentPage,
  totalPages,
  onPageChange,
  createPageUrl,
  className = "mt-6",
}: DataGridPaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
            onClick={(e) => {
              if (currentPage <= 1) {
                e.preventDefault();
                return;
              }
              e.preventDefault();
              onPageChange(currentPage - 1);
            }}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageUrl(page)}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href={
              currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"
            }
            onClick={(e) => {
              if (currentPage >= totalPages) {
                e.preventDefault();
                return;
              }
              e.preventDefault();
              onPageChange(currentPage + 1);
            }}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
