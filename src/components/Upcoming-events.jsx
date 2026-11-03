"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Search, Plus, ArrowRight, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UpcomingEvents() {
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
        <div className="min-h-screen w-full bg-[#030215] text-white flex flex-col items-center justify-start p-4 sm:p-8 relative overflow-y-auto select-none">

            {/* Floating Bubbles / Orbs Background Animation */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-[#554bb9]/70 rounded-full blur-[60px] animate-bubble-one shadow-[0_0_90px_rgba(85,75,185,0.5)]" />
                <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] bg-[#af136a]/60 rounded-full blur-[70px] animate-bubble-two shadow-[0_0_120px_rgba(175,19,106,0.4)]" />
                <div className="absolute top-[40%] right-[30%] w-80 h-80 bg-[#79dce8]/50 rounded-full blur-[50px] animate-bubble-three shadow-[0_0_80px_rgba(121,220,232,0.3)]" />
            </div>

            {/* Main Wrapper */}
            <div className="w-full max-w-7xl relative z-10 space-y-8 mb-12">

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

                {/* Filter & Search Bar Section (Fixed Overlap & Layout) */}
                <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-[#070b19]/60 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                    
                    {/* Category Tabs */}
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

                    {/* Search Input */}
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
                                    {/* Card Image & Badge */}
                                    <div className="relative h-52 w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-transparent to-transparent z-10 opacity-80" />
                                        <img 
                                            src={event.imageUrl || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9"} 
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-[#030215]/80 border border-white/15 backdrop-blur-md text-[11px] font-mono text-[#79dce8] flex items-center gap-1.5 shadow-md">
                                            <Sparkles size={11} className="text-[#af136a]" />
                                            <span>{event.category}</span>
                                        </div>

                                        {/* Date Tag */}
                                        <div className="absolute bottom-3 left-3 z-20 px-3 py-1 rounded-xl bg-[#030215]/85 border border-white/10 backdrop-blur-md text-xs font-mono text-white flex items-center gap-1.5 shadow-md">
                                            <Calendar size={13} className="text-[#79dce8]" />
                                            <span>{event.date}</span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
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

                                {/* Card Footer / Organizer & Action */}
                                <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <User size={14} className="text-gray-500" />
                                        <span className="truncate font-mono text-[11px] text-gray-300">{event.organizerEmail}</span>
                                    </div>

                                    <Link href={`/events/${event._id || index}`} className="block">
                                        <Button className="w-full py-5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-[#554bb9] group-hover:to-[#af136a] group-hover:border-0 transition-all duration-300 cursor-pointer">
                                            <span>View Event</span>
                                            <ArrowRight size= {15} className="group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}