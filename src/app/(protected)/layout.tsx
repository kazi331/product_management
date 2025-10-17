"use client";
import Sidebar from "@/components/shared/Sidebar";
import { useAppSelector } from "@/hooks/redux";
import { collapsedMarginLeft, expandedMarginLeft } from "@/lib/config";
import { ChildProp } from "@/types/common";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: ChildProp) {
  const { isOpen } = useAppSelector((state) => state.sidebar);
  const { token } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (!token) {
      return window.location.replace("/login");
    }
  }, []);
  return (
    <div className="min-h-full">
      <Sidebar />
      <main
        className={`flex-1 min-h-screen transition-all ${
          isOpen ? expandedMarginLeft : collapsedMarginLeft
        }`}
      >
        {children}
      </main>
    </div>
  );
}
