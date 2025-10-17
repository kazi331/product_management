"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

const navLinks = [
  { href: "/", label: "Dashboard", description: "Go to main dashboard" },
  { href: "/posts", label: "Posts", description: "View all posts" },
  { href: "/users", label: "Users", description: "Manage users" },
];
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="bg-white shadow-lg border-b border-gray-200"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16">
          {/* Logo/Brand */}
          {/* <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex-shrink-0 flex items-center focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 rounded-md px-2 py-1"
                        >
                            <span className="text-xl font-bold text-gray-900">Dashboard</span>
                        </Link>
                    </div> */}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2" role="menubar">
            {navLinks.map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus:ring-primary/60 focus-visible:ring-offset-2 ${
                  isActive(menu.href)
                    ? "bg-primary/10 text-primary border-b-2 border-primary"
                    : "text-gray-700 hover:text-primary/90 hover:bg-gray-50"
                }`}
                role="menuitem"
                aria-current={isActive(menu.href) ? "page" : undefined}
              >
                {menu.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/60"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">
                {isMenuOpen ? "Close" : "Open"} main menu
              </span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`md:hidden transition-all duration-200 ease-in-out ${
          isMenuOpen
            ? "block opacity-100 translate-y-0"
            : "hidden opacity-0 -translate-y-2"
        }`}
        role="menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200 shadow-lg">
          {navLinks.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={closeMenu}
              className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 ${
                isActive(menu.href)
                  ? "bg-blue-100 text-primary border-l-4 border-primary"
                  : "text-gray-700 hover:text-accent hover:bg-white"
              }`}
              role="menuitem"
              aria-current={isActive(menu.href) ? "page" : undefined}
              tabIndex={isMenuOpen ? 0 : -1}
            >
              {menu.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
