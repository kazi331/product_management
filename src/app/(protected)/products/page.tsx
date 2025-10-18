"use client";

import ErrorMessage from "@/components/shared/ErrorMessage";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDeleteProductMutation, useGetProductsQuery } from "@/services/api";
import { Product } from "@/types/products";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import SearchArea from "./SearchArea";

const ITEMS_PER_PAGE = 20;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Fetch products with RTK Query
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery("");
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter products based on search
  const filteredProducts = products.filter((product: Product) =>
    product?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id).unwrap();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      // RTK Query will automatically invalidate cache and refetch
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ErrorMessage message="Failed to load products. Please try again later." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Search Bar */}
      <SearchArea
        refetch={refetch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        debouncedSearch={debouncedSearch}
      />
      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {debouncedSearch
              ? "No products found matching your search."
              : "No products available."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                handleDeleteClick={handleDeleteClick}
                isDeleting={isDeleting}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
