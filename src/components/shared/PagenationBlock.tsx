import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export default function PagenationBlock({
  totalPages,
  currentPage,
  setCurrentPage,
  goToPrevPage,
  goToNextPage,
}: {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
}) {
  // Generate pagination items with ellipsis
  const getPaginationItems = () => {
    const items = [];
    const showEllipsisThreshold = 7; // Show ellipsis when more than 7 pages
    const siblingCount = 1; // Number of pages to show on each side of current page

    if (totalPages <= showEllipsisThreshold) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show first page
      items.push(1);

      // Calculate range around current page
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
      const rightSiblingIndex = Math.min(
        currentPage + siblingCount,
        totalPages - 1
      );

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        // Show more pages on the left when near the start
        const leftItemCount = 3 + 2 * siblingCount;
        for (let i = 2; i <= leftItemCount; i++) {
          items.push(i);
        }
        items.push("right-ellipsis");
      } else if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
        // Show more pages on the right when near the end
        items.push("left-ellipsis");
        const rightItemCount = 3 + 2 * siblingCount;
        for (
          let i = totalPages - rightItemCount + 1;
          i <= totalPages - 1;
          i++
        ) {
          items.push(i);
        }
      } else {
        // Show ellipsis on both sides
        items.push("left-ellipsis");
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          items.push(i);
        }
        items.push("right-ellipsis");
      }

      // Always show last page
      items.push(totalPages);
    }

    return items;
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={goToPrevPage}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {getPaginationItems().map((item, index) => {
          if (item === "left-ellipsis" || item === "right-ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${item}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const page = item as number;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={goToNextPage}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
