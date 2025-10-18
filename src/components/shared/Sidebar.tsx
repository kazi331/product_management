"use client";
import { logout } from "@/features/auth/authSlice";
import { closeSideBar, toggleSideBar } from "@/features/sidebar/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useIsMobile } from "@/hooks/useMobile";
import { sidebarCollapsedWidth, sidebarExpandedWidth } from "@/lib/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Bell,
  CreditCard,
  Files,
  Home,
  LogOut,
  SidebarClose,
  SidebarOpen,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const sidebarItems = [
  { name: "Products", link: "/products", icon: <Home /> },
  { name: "Categories", link: "/categories", icon: <Files /> },
];

export default function Sidebar() {
  const { isOpen } = useAppSelector((state) => state.sidebar);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isMobile) dispatch(closeSideBar());
  }, [isMobile]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 h-full min-h-screen 
      bg-sidebar text-sidebar-foreground
      backdrop-blur z-10 transition-all border-r border-border
      ${isOpen ? sidebarExpandedWidth : sidebarCollapsedWidth}`}
    >
      <div className="relative">
        {/* Sidebar header */}
        <div className="py-4 w-full overflow-hidden">
          <span
            className={`text-2xl font-bold block px-4 ml-10 transition-opacity ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Dashboard
          </span>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-3 
            bg-muted text-foreground
            hover:bg-primary hover:text-white
            p-2 -full shadow-lg transition-colors"
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

      {/* Sidebar items */}
      <div
        className={`mb-8 text-2xl font-bold flex flex-col gap-1 ${
          isOpen ? "mx-1" : "mx-2"
        }`}
      >
        {sidebarItems.map((item) => {
          let active = pathname === item.link;
          if (item.name === "Products" && pathname === "/") active = true;
          return (
            <Link
              key={item.name}
              href={item.link}
              className={`flex items-center gap-3 p-2  cursor-pointer transition-colors
                ${
                  active
                    ? "bg-primary text-white"
                    : "hover:bg-muted hover:text-foreground"
                }
                
                ${active ? "border-primary" : "border-transparent"}`}
            >
              <div className="block"> {item.icon}</div>
              <span className={`text-sm ${isOpen ? "block" : "hidden"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Sidebar footer */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="absolute bottom-4 left-0 right-0 text-2xl font-bold flex flex-col gap-2 mx-2">
            <div
              className={`flex items-center gap-3 p-2  cursor-pointer justify-start
              bg-muted hover:bg-primary text-foreground hover:text-white
              ${isOpen ? "" : "-full"} transition-colors`}
            >
              <Image
                width={24}
                height={24}
                className="aspect-square size-6 -full"
                alt="logo"
                src="/logo_brand.png"
              />
              <div
                className={`grid flex-1 text-left text-sm leading-tight ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <span className="truncate font-medium">
                  Kazi Shariful Islam
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  kazisharif.dev@gmail.com
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="end"
          className="w-52 space-y-0.5 mb-2 bg-white p-2 text-foreground shadow-lg"
        >
          <DropdownMenuItem className="flex items-center gap-3 p-2  cursor-pointer text-sm hover:bg-muted transition-colors">
            <User className="size-4" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-3 p-2  cursor-pointer text-sm hover:bg-muted transition-colors">
            <CreditCard className="size-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-3 p-2  cursor-pointer text-sm hover:bg-muted transition-colors">
            <Bell className="size-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 h-px bg-border" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-3 p-2  cursor-pointer text-sm text-destructive hover:bg-destructive hover:text-white transition-colors"
          >
            <LogOut className="size-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
