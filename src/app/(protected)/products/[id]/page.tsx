"use client";
import ErrorMessage from "@/components/shared/ErrorMessage";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ProductDeleteModal from "@/components/shared/ProductDeleteModal";
import { currency, dateView, serializeError } from "@/lib/utils";
import { useGetProductQuery } from "@/services/api";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

function App() {
  const { id } = useParams();
  const { data: product, isLoading, isError, error } = useGetProductQuery(id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product?.images?.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product?.images?.length) % product?.images?.length
    );
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-md my-10">
        <ErrorMessage
          message={serializeError(error) || "Something went wrong"}
          title="Error 404"
          description="Product not found"
        />
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-md my-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8  max-w-7xl mx-auto">
      <Link
        href="/products"
        className="inline-flex items-center text-primary hover:text-accent transition-colors mb-3"
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Back to products
      </Link>
      <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-12 bg-card rounded-lg shadow-sm overflow-hidden border border-border">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
            {/* main image */}
            <img
              src={
                product?.images?.[currentImageIndex] || "/images/no_image.png"
              }
              alt={`${product?.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* next prev buttons */}
            {product?.images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-background transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-background transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </>
            )}
            {/* mini controllers */}
            {product?.images?.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product?.images.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-primary w-6"
                        : "bg-background/60 hover:bg-background/80"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Image Thumbnails */}

          {product?.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product?.images
                .slice(0, 4)
                .map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-primary shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product?.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col">
          <div className="flex-1 space-y-6">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2">
              <span className="px-3 py-1 bg-muted text-muted-foreground text-sm font-medium rounded-full">
                {product?.category.name}
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 leading-tight">
                {product?.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                slug: {product?.slug}
              </p>
            </div>

            <div className="py-4 border-y border-border">
              <p className="text-4xl font-bold text-primary">
                {currency(product?.price)}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                Description
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                {product?.description}
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-semibold text-foreground">Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">
                    {dateView(product?.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium text-foreground">
                    {dateView(product?.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-border">
            <Link
              href={`/products/${product?.slug}/update`}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Edit2 className="w-5 h-5" />
              Edit Product
            </Link>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground font-medium rounded-lg hover:bg-destructive/90 transition-colors shadow-sm"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <ProductDeleteModal
        deleteDialogOpen={deleteDialogOpen}
        dialogOpenChange={setDeleteDialogOpen}
        product={product}
      />
    </div>
  );
}

export default App;
