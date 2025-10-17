"use client";
import { closeSideBar, toggleSideBar } from "@/features/sidebar/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useIsMobile } from "@/hooks/useMobile";
import { sidebarCollapsedWidth, sidebarExpandedWidth } from "@/lib/config";
import { Files, Home, SidebarClose, SidebarOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const sidebarItems = [
  { name: "Products", link: "/", icon: <Home /> },
  { name: "Categories", link: "/categories", icon: <Files /> },
];

export default function Sidebar() {
  const { isOpen } = useAppSelector((state) => state.sidebar);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  console.log({ isMobile });
  const pathname = usePathname();

  //   auto close sidebar if mobile device detected
  useEffect(() => {
    if (isMobile) dispatch(closeSideBar());
  }, [isMobile]);

  return (
    <nav
      className={`fixed top-0 left-0 h-full min-h-screen bg-gray-800 backdrop-blur text-white overflow- z-10 transition-all ${
        isOpen ? sidebarExpandedWidth : sidebarCollapsedWidth
      }`}
    >
      <div className="relative">
        {/* sidebar header */}
        <div className="py-4 w-full overflow-hidden">
          <span
            className={`text-2xl font-bold block px-4 ml-10 ${
              isOpen ? "block" : "invisible"
            }`}
          >
            Dashboard
          </span>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-3 bg-gray-700 backdrop-blur-2xl p-2 rounded-full shadow-lg cursor-pointer"
            onClick={() => dispatch(toggleSideBar())}
          >
            {isOpen ? (
              <SidebarClose className="size-5" />
            ) : (
              <SidebarOpen className="size-5" />
            )}
          </button>
        </div>
      </div>
      {/* sidebar items */}
      <div
        className={`mb-8 text-2xl font-bold flex flex-col gap-2 ${
          isOpen ? "" : "mx-2"
        }`}
      >
        {sidebarItems.map((item) => (
          <Link key={item.name} href={item.link}>
            <div
              className={`flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer ${
                isOpen ? "justify-start border-l-2 px-3.5" : "justify-start "
              } ${
                pathname === item.link ? "border-l-white" : "border-transparent"
              } ${pathname === item.link ? "bg-gray-700" : ""}`}
            >
              <span className="size-6"> {item.icon}</span>
              <span className={`text-sm ${isOpen ? "block" : "hidden"}`}>
                {item.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
      {/* sidebar footer */}

      <div className="absolute bottom-4 left-0 right-0 text-2xl font-bold flex flex-col gap-2 mx-2">
        <div
          className={`flex items-center gap-3 p-2 hover:bg-gray-700 rounded ${
            isOpen ? "rounded" : "rounded-full"
          } cursor-pointer justify-start  border-l-white bg-gray-700`}
        >
          <img
            data-slot="avatar-image"
            className="aspect-square size-6"
            alt="logo"
            src="logo_brand.png"
          />
          <div
            className={`grid flex-1 text-left text-sm leading-tight ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <span className="truncate font-medium">Kazi Shariful Islam</span>
            <span className="text-muted-foreground truncate text-xs">
              kazisharif.dev@gmail.com
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
