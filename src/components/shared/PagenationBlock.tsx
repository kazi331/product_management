import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";

export default function PagenationBlock({
  goToPrevPage,
  goToNextPage,
  itemsPerPage,
  setItemsPerPage,
  offset,
  fetchedItems,
}: {
  goToPrevPage: () => void;
  goToNextPage: () => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  offset: number;
  fetchedItems: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-20">
      <Select onValueChange={(value) => setItemsPerPage(parseInt(value))}>
        <SelectTrigger className="">
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent className="bg-slate-200">
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="40">40</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
      <Pagination className="w-min mx-0">
        <PaginationContent>
          <PaginationItem>
            <Button
              aria-label="Go to previous page"
              onClick={goToPrevPage}
              className={"cursor-pointer"}
              disabled={offset === 0}
            >
              <ChevronLeft /> Previous
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              aria-label="Go to next page"
              onClick={goToNextPage}
              className={"cursor-pointer"}
              disabled={fetchedItems < itemsPerPage}
            >
              Next <ChevronRight />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
