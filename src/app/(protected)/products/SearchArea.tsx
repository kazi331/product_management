import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

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
      <div className="flex items-center justify-between mb-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <Input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="pl-10 focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center justify-between">
          <Button onClick={() => refetch()}>Refresh</Button>
        </div>
      </div>
      <p className="h-5">
        {debouncedSearch ? `Results for: ${debouncedSearch}` : ""}
      </p>
    </div>
  );
}
