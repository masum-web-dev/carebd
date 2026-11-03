"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User, ChevronDown, Menu, X, Calendar } from "lucide-react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#030215] text-white border-b border-white/10 sticky top-0 z-50">
      {/* Container sizing */}
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
            
            {/* Upcoming Events Nav Item */}
            <Link
              href="/events"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-sm font-medium text-gray-300 hover:text-white"
            >
              <Calendar size={16} className="text-[#79dce8]" />
              <span>Upcoming Events</span>
            </Link>

            {/* Join With Us Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 focus:outline-none cursor-pointer"
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

          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#030215] border-t border-white/10 px-4 py-4 space-y-3">
          <Link
            href="/events"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-gray-300 hover:text-white border-b border-white/5 text-sm font-medium"
          >
            <Calendar size={16} className="text-[#79dce8]" />
            <span>Upcoming Events</span>
          </Link>
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-gray-300 hover:text-white border-b border-white/5 text-sm font-medium"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-gray-300 hover:text-white text-sm font-medium"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}