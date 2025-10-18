import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export default function PagenationBlock({
  goToPrevPage,
  goToNextPage,
}: {
  goToPrevPage: () => void;
  goToNextPage: () => void;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={goToPrevPage}
            className={"cursor-pointer"}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext onClick={goToNextPage} className={"cursor-pointer"} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
