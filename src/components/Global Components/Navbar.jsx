"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search, User, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-[#030215] text-white border-b border-white/10 sticky top-0 z-50">
      {/* Container sizing increased to max-w-[1500px] */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/carebd logo.png"
                alt="CareBD Logo"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right Section (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Join With Us Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#554bb9] to-[#af136a] flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                <span className="font-medium text-sm">Join With Us</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#030215] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                  <Link
                    href="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-[#554bb9]/20 hover:to-[#af136a]/20 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-[#554bb9]/20 hover:to-[#af136a]/20 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search here..."
                className="w-72 sm:w-80 pl-4 pr-10 py-2.5 rounded-lg bg-[#554bb9]/20 border border-[#554bb9]/40 focus:border-[#af136a] text-sm text-white placeholder-gray-400 focus:outline-none transition"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white">
                <Search size={18} />
              </button>
            </div>

          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
            >
              {isDropdownOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Search Overlay/Input */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-[#554bb9]/20 border border-[#554bb9]/40 text-sm text-white placeholder-gray-400 focus:outline-none"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
              <Search size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      {isDropdownOpen && (
        <div className="md:hidden bg-[#030215] border-t border-white/10 px-4 py-3 space-y-2">
          <Link
            href="/login"
            onClick={() => setIsDropdownOpen(false)}
            className="block py-2 text-gray-300 hover:text-white border-b border-white/5"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setIsDropdownOpen(false)}
            className="block py-2 text-gray-300 hover:text-white"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}