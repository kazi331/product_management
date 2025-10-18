"use client";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { capitalizeFirstLetter, currency, getImageSrc } from "@/lib/utils";
import { Product } from "@/types/products";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductCard({
  product,
  handleDeleteClick,
  isDeleting,
}: {
  product: Product;
  handleDeleteClick: (product: Product) => void;
  isDeleting: boolean;
}) {
  const [imgSrc, setImgSrc] = useState("/images/no_image.png");
  useEffect(() => {
    setImgSrc(getImageSrc(product.images?.[0]));
  }, [product.images]);

  return (
    <Card
      key={product.id}
      className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/40 group/link "
    >
      <div className="aspect-video relative rounded overflow-hidden bg-gray-100">
        <Image
          src={imgSrc}
          alt={product.name}
          width={500}
          height={500}
          className="object-cover w-full h-full p-1"
          onError={() => setImgSrc("/images/no_image.png")}
        />
      </div>
      <div className="py-4 flex-1 flex flex-col">
        <h3 className="text font-semibold text-gray-700 line-clamp-2 leading-tight">
          {capitalizeFirstLetter(product?.name as string) || ""}
        </h3>

        <p className="text-xs text-gray-600 line-clamp-2 my-2 flex-1">
          {product.description || ""}
        </p>

        {/* card meta and action */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-sm font-bold text-primary">
              {currency(product?.price || 0)}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {product.category.name}
            </p>
          </div>

          <ButtonGroup className="translate-y-4 group-hover/link:translate-y-0 transition opacity-0 group-hover/link:opacity-100">
            <Button variant="secondary" className="text-xs" size="sm">
              <Link href={`/products/${product.slug}`}>View Details</Link>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteClick(product)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              <Trash2 className="size-4" />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </Card>
  );
}
