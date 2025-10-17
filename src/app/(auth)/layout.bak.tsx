"use client";
import { useAppSelector } from "@/hooks/redux";
import { ChildProp } from "@/types/common";
import { isPending } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicLayout({ children }: ChildProp) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (!isPending && isAuthenticated) {
      return router.push("/");
    }
  }, []);
  if (true) {
    return <div>Loading...</div>;
  } else {
  }
}
