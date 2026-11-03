"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Search, Plus, ArrowRight, Sparkles, User, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Navbar Component integrated directly or you can import it
function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#030215] text-white border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          
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

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/events"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10 text-sm font-medium text-gray-300 hover:text-white"
            >
              <Calendar size={16} className="text-[#79dce8]" />
              <span>Upcoming Events</span>
            </Link>

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

export default function UpcomingEventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        "All",
        "Donation & Relief",
        "Winter Clothes Distribution",
        "Blanket Relief Drive",
        "Environmental Cleanup",
        "Food Distribution",
        "Tree Plantation"
    ];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("http://localhost:8000/events");
                const data = await res.json();
                setEvents(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch events:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = events.filter((event) => {
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              event.location?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen w-full bg-[#030215] text-white flex flex-col relative overflow-y-auto select-none">
            
            {/* Navbar Integrated */}
            <Navbar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 relative overflow-hidden">

                {/* Floating Bubbles / Orbs Background Animation */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-[#554bb9]/70 rounded-full blur-[60px] animate-bubble-one shadow-[0_0_90px_rgba(85,75,185,0.5)]" />
                    <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] bg-[#af136a]/60 rounded-full blur-[70px] animate-bubble-two shadow-[0_0_120px_rgba(175,19,106,0.4)]" />
                    <div className="absolute top-[40%] right-[30%] w-80 h-80 bg-[#79dce8]/50 rounded-full blur-[50px] animate-bubble-three shadow-[0_0_80px_rgba(121,220,232,0.3)]" />
                </div>

                <div className="w-full max-w-7xl relative z-10 space-y-8 mb-12 mt-4">

                    {/* Top Section: Header & Create Event Button */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#070b19]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#554bb9]/20 border border-[#554bb9]/40 text-[#79dce8] text-xs font-mono mb-3">
                                <Sparkles size={13} />
                                <span>Future Community Drives</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                                Upcoming Events
                            </h1>
                            <p className="text-gray-400 text-xs sm:text-sm mt-1.5 max-w-xl">
                                Discover verified volunteer initiatives scheduled for upcoming dates. Past events are automatically excluded so you can focus on active drives that need support.
                            </p>
                        </div>

                        <Link href="/dashboard/create-event">
                            <Button className="py-6 px-6 rounded-2xl bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white font-medium text-sm flex items-center gap-2 hover:opacity-95 transition transform hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(85,75,185,0.4)] border-0 cursor-pointer">
                                <Plus size={18} />
                                <span>Create Event</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Filter & Search Bar Section */}
                    <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-[#070b19]/60 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                        
                        <div className="flex flex-wrap items-center gap-2 w-full">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer ${
                                        selectedCategory === cat
                                            ? "bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white shadow-lg shadow-[#554bb9]/30"
                                            : "bg-[#030215]/80 text-gray-400 hover:text-white hover:bg-white/5 border border-white/5"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full xl:w-80 shrink-0">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <Input
                                type="text"
                                placeholder="Search events or areas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#030215]/80 border-white/10 rounded-xl pl-10 pr-4 py-2.5 h-10 text-xs text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#af136a] transition"
                            />
                        </div>
                    </div>

                    {/* Events Grid Section */}
                    {loading ? (
                        <div className="text-center py-20 text-gray-400 font-mono text-sm animate-pulse">
                            Loading active community drives...
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center py-20 bg-[#070b19]/40 border border-white/5 rounded-3xl backdrop-blur-md">
                            <p className="text-gray-400 text-sm">No community events found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map((event, index) => (
                                <div 
                                    key={index}
                                    className="group bg-[#070b19]/85 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:border-[#554bb9]/60 transition-all duration-500 hover:shadow-[0_0_35px_rgba(85,75,185,0.25)] hover:-translate-y-1.5 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="relative h-52 w-full overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-transparent to-transparent z-10 opacity-80" />
                                            <img 
                                                src={event.imageUrl && event.imageUrl.startsWith("http") ? event.imageUrl : "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9"} 
                                                alt={event.title}
                                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9"; }}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-[#030215]/80 border border-white/15 backdrop-blur-md text-[11px] font-mono text-[#79dce8] flex items-center gap-1.5 shadow-md">
                                                <Sparkles size={11} className="text-[#af136a]" />
                                                <span>{event.category}</span>
                                            </div>

                                            <div className="absolute bottom-3 left-3 z-20 px-3 py-1 rounded-xl bg-[#030215]/85 border border-white/10 backdrop-blur-md text-xs font-mono text-white flex items-center gap-1.5 shadow-md">
                                                <Calendar size={13} className="text-[#79dce8]" />
                                                <span>{event.date}</span>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-4">
                                            <h3 className="text-xl font-bold font-serif text-white group-hover:text-[#79dce8] transition-colors line-clamp-1">
                                                {event.title}
                                            </h3>

                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <MapPin size={14} className="text-[#af136a]" />
                                                <span>{event.location}</span>
                                            </div>

                                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <User size={14} className="text-gray-500" />
                                            <span className="truncate font-mono text-[11px] text-gray-300">{event.organizerEmail}</span>
                                        </div>

                                        <Link href={`/events/${event._id || index}`} className="block">
                                            <Button className="w-full py-5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-[#554bb9] group-hover:to-[#af136a] group-hover:border-0 transition-all duration-300 cursor-pointer">
                                                <span>View Event</span>
                                                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}