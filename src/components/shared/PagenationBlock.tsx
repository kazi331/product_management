import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  setItemsPerPage,
}: {
  goToPrevPage: () => void;
  goToNextPage: () => void;
  setItemsPerPage: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Select onValueChange={(value) => setItemsPerPage(parseInt(value))}>
        <SelectTrigger className="">
          <SelectValue placeholder="20" />
        </SelectTrigger>
        <SelectContent className="bg-slate-200">
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
        </SelectContent>
      </Select>
      <Pagination className="w-min mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={goToPrevPage}
              className={"cursor-pointer"}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={goToNextPage}
              className={"cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
