'use client';
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname(); // gives current route
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="w-full h-auto py-8 px-15 flex items-center justify-between bg-white">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image
          src="/logo.avif"
          alt="HCN Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="text-xl font-semibold text-blue-600">Data Library Project</span>
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
          <Link
            href="/login"
            className={`px-4 py-2 rounded-lg border transition-colors ${
              pathname === "/login"
                ? "border-blue-600 text-blue-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={`px-4 py-2 rounded-lg transition-colors ${
              pathname === "/signup"
                ? "bg-blue-700 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
