import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { ButtonGroup } from "../ui/button-group";

export default function SearchArea({
  searchQuery,
  setSearchQuery,
  refetch,
  debouncedSearch,
}: {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  refetch: () => void;
  debouncedSearch: string;
}) {
  return (
    <div className="">
      <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-between mb-4 w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <Input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus-visible:ring-0"
          />
        </div>
        <ButtonGroup className="w-full flex items-center justify-end ml-auto">
          <Button asChild>
            <Link href="/add-product">
              Add Product
              <Plus />
            </Link>
          </Button>
          <Button className="cursor-pointer" onClick={() => refetch()}>
            Refresh
          </Button>
        </ButtonGroup>
      </div>
      <div className="h-5 flex items-center justify-between">
        <span>{debouncedSearch ? `Results for: ${debouncedSearch}` : ""}</span>
      </div>
    </div>
  );
}
