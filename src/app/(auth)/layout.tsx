"use client";
import { useAppSelector } from "@/hooks/redux";
import { ChildProp } from "@/types/common";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicLayout({ children }: ChildProp) {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (!!token) {
      return router.push("/");
    }
  }, []);
  return <>{children}</>;
}
