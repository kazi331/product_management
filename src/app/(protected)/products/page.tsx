"use client";

import ErrorMessage from "@/components/shared/ErrorMessage";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PagenationBlock from "@/components/shared/PagenationBlock";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDeleteProductMutation, useGetProductsQuery } from "@/services/api";
import { Product } from "@/types/products";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const ITEMS_PER_PAGE = 10;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery(
    debouncedSearch ? `searchedText=${debouncedSearch}` : ""
  );

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
  const goToNextPage = () => {};

  const goToPrevPage = () => {};

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
        <ErrorMessage
          title="Error"
          message="Failed to load products. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Search Bar */}
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <Input
              type="text"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Products Grid */}
      {products.length === 0 ? (
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
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                handleDeleteClick={handleDeleteClick}
                isDeleting={isDeleting}
              />
            ))}
          </div>

          {/* Pagination */}
          {products.length > 10 && (
            <PagenationBlock
              goToPrevPage={goToPrevPage}
              goToNextPage={goToNextPage}
            />
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
