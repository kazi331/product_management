"use client";
import ErrorMessage from "@/components/shared/ErrorMessage";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ProductForm } from "@/components/shared/ProductForm";
import { serializeError } from "@/lib/utils";
import { useGetProductQuery } from "@/services/api";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductQuery(id);

  const errorMsg = serializeError(error);

  if (error) {
    return (
      <div className="container mx-auto max-w-md my-10">
        <ErrorMessage
          message={errorMsg || "Something went wrong"}
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
    <div className="my-4">
      <ProductForm initialData={product} isLoading={isLoading} />
    </div>
  );
}
