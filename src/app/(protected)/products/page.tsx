"use client";

import ProductCard from "@/components/products/ProductCard";
import SearchArea from "@/components/products/SearchArea";
import ErrorMessage from "@/components/shared/ErrorMessage";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PagenationBlock from "@/components/shared/PagenationBlock";
import ProductDeleteModal from "@/components/shared/ProductDeleteModal";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  useGetProductCategoriesQuery,
  useGetProductsQuery,
} from "@/services/api";
import { Category, Product } from "@/types/products";
import { useEffect, useState } from "react";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [category, setCategory] = useState<string | null>(null);

  const baseQuery = `offset=${offset}&limit=${itemsPerPage}`;
  const [queryString, setQueryString] = useState(`?${baseQuery}`);

  useEffect(() => {
    const string = debouncedSearch
      ? `/search?searchedText=${debouncedSearch}&${baseQuery}`
      : category
      ? `?categoryId=${category}&${baseQuery}`
      : `?${baseQuery}`;
    setQueryString(string);
  }, [debouncedSearch, offset, itemsPerPage, category]);

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery(queryString);

  const { data: categories } = useGetProductCategoriesQuery({});

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  // Handle page navigation
  const goToNextPage = () => setOffset((pre) => pre + itemsPerPage);

  const goToPrevPage = () =>
    setOffset((pre) => Math.max(pre - itemsPerPage, 0));

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
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Search Bar */}
      <SearchArea
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        refetch={refetch}
        debouncedSearch={debouncedSearch}
      />
      <ScrollArea className="max-w-full">
        <div className="flex items-center gap-2">
          {categories?.map((category: Category) => (
            <Button key={category.id} onClick={() => setCategory(category.id)}>
              {category?.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
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
            {products.map((product: Product, i: number) => (
              <ProductCard
                key={product.id}
                product={product}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}

      <PagenationBlock
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
        setItemsPerPage={setItemsPerPage}
        offset={offset}
        itemsPerPage={itemsPerPage}
        fetchedItems={products?.length}
      />

      {/* Delete Confirmation Dialog */}
      <ProductDeleteModal
        deleteDialogOpen={deleteDialogOpen}
        dialogOpenChange={setDeleteDialogOpen}
        product={productToDelete || ({} as Product)}
      />
    </div>
  );
}
