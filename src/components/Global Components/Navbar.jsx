"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ChevronDown, Menu, X, Calendar, PlusCircle, Settings, CheckCircle2, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Better Auth সেশন হুক
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

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
            
            {/* Upcoming Events Nav Item (টার্নারি অপারেটর ব্যবহার করে চেক করা হয়েছে) */}
            {session ? (
              <Link
                href="/events"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-sm font-medium text-gray-300 hover:text-white"
              >
                <Calendar size={16} className="text-[#79dce8]" />
                <span>Upcoming Events</span>
              </Link>
            ) : (
              <Link
                href="/register"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-sm font-medium text-gray-300 hover:text-white"
              >
                <Calendar size={16} className="text-[#79dce8]" />
                <span>Upcoming Events</span>
              </Link>
            )}

            {/* User Authentication & Profile Section */}
            {isPending ? (
              <div className="text-xs text-gray-400 font-mono">Loading...</div>
            ) : session ? (
              /* User Logged In Profile Dropdown (ছবি অনুযায়ী ডিজাইন করা) */
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10 focus:outline-none cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-r from-[#554bb9] to-[#af136a] flex items-center justify-center text-white border border-white/20">
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <span className="font-medium text-sm max-w-[120px] truncate">{session.user?.name}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 text-gray-400 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#070b19] border border-white/15 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-bold text-white truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{session.user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/events/create"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition"
                      >
                        <PlusCircle size={15} className="text-[#79dce8]" />
                        <span>Create Event</span>
                      </Link>
                      <Link
                        href="/events/manage"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition"
                      >
                        <Settings size={15} className="text-[#554bb9]" />
                        <span>Manage Events</span>
                      </Link>
                      <Link
                        href="/events/joined"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition"
                      >
                        <CheckCircle2 size={15} className="text-emerald-400" />
                        <span>Joined Events</span>
                      </Link>
                    </div>

                    <div className="border-t border-white/10 pt-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition cursor-pointer text-left"
                      >
                        <LogOut size={15} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* User Not Logged In Dropdown (Join With Us) */
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
            )}

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
          {session ? (
            <>
              <div className="py-2 border-b border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#554bb9] flex items-center justify-center text-white">
                  {session.user?.image ? (
                    <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{session.user?.name}</p>
                  <p className="text-[10px] text-gray-400">{session.user?.email}</p>
                </div>
              </div>
              <Link
                href="/events"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-gray-300 hover:text-white border-b border-white/5 text-sm font-medium"
              >
                <Calendar size={16} className="text-[#79dce8]" />
                <span>Upcoming Events</span>
              </Link>
              <Link
                href="/events/create"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-gray-300 hover:text-white border-b border-white/5 text-sm font-medium"
              >
                Create Event
              </Link>
              <Link
                href="/events/manage"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-gray-300 hover:text-white border-b border-white/5 text-sm font-medium"
              >
                Manage Events
              </Link>
              <Link
                href="/events/joined"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-gray-300 hover:text-white border-b border-white/5 text-sm font-medium"
              >
                Joined Events
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-red-400 text-sm font-medium cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
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
            </>
          )}
        </div>
      )}
    </nav>
  );
}