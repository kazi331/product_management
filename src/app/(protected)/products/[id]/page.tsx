"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { currency } from "@/lib/utils";
import { useDeleteProductMutation, useGetProductQuery } from "@/services/api";
import { Product } from "@/types/products";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

function App() {
  const { id } = useParams();
  const { data: product, isLoading, isError, error } = useGetProductQuery(id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleEdit = () => {
    console.log("Edit product:", product?.id);
  };

  const handleDelete = () => {
    console.log("Delete product:", product?.id);
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product?.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product?.images.length) % product?.images.length
    );
  };

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDeleteClick = (product: Product) => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(id).unwrap();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-12 max-w-7xl mx-auto bg-card rounded-lg shadow-sm overflow-hidden border border-border">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
            {/* main image */}
            <img
              src={product?.images[currentImageIndex]}
              alt={`${product?.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* next prev buttons */}
            {product?.images.length > 1 && (
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
            {product?.images.length > 1 && (
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

          {product?.images.length > 1 && (
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
                    {new Date(product?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium text-foreground">
                    {new Date(product?.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-border">
            <button
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Edit2 className="w-5 h-5" />
              Edit Product
            </button>
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
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete " {product?.name} "? This action
              cannot be undone.
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
              variant="default"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
