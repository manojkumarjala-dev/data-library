"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import userIcon from "@/public/user.svg";

export default function Navbar() {
  const pathname = usePathname(); // gives current route
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="w-full h-auto px-[var(--Utilities-Spacing-20,80px)] py-[var(--Utilities-Spacing-7_5,30px)] flex items-center justify-between bg-white">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image
          src="/logo.avif"
          alt="HCN Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="text-xl font-semibold text-blue-600">
          Data Library Project
        </span>
      </div>

      {/* Right group (Nav + Buttons) */}
      <div className="flex items-center space-x-6">
        {/* Nav Links */}
        <div className="flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`pb-1 transition-colors ${
                pathname === link.href
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <span className="w-px h-6 bg-gray-300"></span>

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <Link href="/login">
            <button
              type="button"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none "
            >
              <Image src={userIcon} alt="Login" width={16} height={16} />
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button
              type="button"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
