"use client";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { getImageSrc } from "@/lib/utils";
import { Product } from "@/types/products";
import { Trash2 } from "lucide-react";
import Image from "next/image";

export default function ProductCard({
  product,
  handleDeleteClick,
  isDeleting,
}: {
  product: Product;
  handleDeleteClick: (product: Product) => void;
  isDeleting: boolean;
}) {
  return (
    <Card key={product.id} className="flex flex-col">
      <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
        <Image
          src={getImageSrc(product.images?.[0])}
          alt={product.name}
          width={500}
          height={500}
          className="object-contain w-full h-full p-4"
          onError={(e) => {
            console.log(e);
          }}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {product.category.name}
            </p>
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDeleteClick(product)}
            disabled={isDeleting}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
