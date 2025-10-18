"use client";
import { useGetProductQuery } from "@/services/api";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const { data: product, isLoading, isError, error } = useGetProductQuery(id);
  return <div>Page</div>;
}
