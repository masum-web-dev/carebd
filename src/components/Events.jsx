"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Search, Plus, ArrowRight, Sparkles, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function Home() {
    const [events, setEvents] = useState([]);
    const [joinedEventIds, setJoinedEventIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: session } = authClient.useSession();

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
        let isMounted = true;

        const fetchData = async () => {
            try {
                const eventsRes = await fetch("http://localhost:8000/events");
                const eventsData = await eventsRes.json();
                
                if (isMounted) {
                    const eventsList = Array.isArray(eventsData) ? eventsData : [];
                    
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    eventsList.sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        
                        const diffA = Math.abs(dateA - today);
                        const diffB = Math.abs(dateB - today);

                        return diffA - diffB;
                    });

                    setEvents(eventsList);
                }

                if (session?.user?.email) {
                    const joinedRes = await fetch(`http://localhost:8000/joined-events?email=${session.user.email}`);
                    const joinedData = await joinedRes.json();
                    if (isMounted && Array.isArray(joinedData)) {
                        const ids = new Set(joinedData.map((item) => item.eventId));
                        setJoinedEventIds(ids);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch events:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [session]);

    const filteredEvents = events.filter((event) => {
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.location?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="w-full bg-[#030215] text-white py-10 px-4 sm:px-8 selection:bg-[#af136a] selection:text-white">
            <div className="w-full max-w-7xl mx-auto space-y-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#070b19]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#554bb9]/20 border border-[#554bb9]/40 text-[#79dce8] text-xs font-mono mb-3">
                            <Sparkles size={13} />
                            <span>Future Community Drives</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                            Explore Events
                        </h1>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1.5 max-w-xl">
                            Discover verified volunteer initiatives scheduled for upcoming dates. Closest dates are prioritized automatically.
                        </p>
                    </div>

                    <Link href="/create-event">
                        <Button className="py-6 px-6 rounded-2xl bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white font-medium text-sm flex items-center gap-2 hover:opacity-95 transition transform hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(85,75,185,0.4)] border-0 cursor-pointer">
                            <Plus size={18} />
                            <span>Create Event</span>
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-[#070b19]/60 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                    
                    <div className="flex flex-wrap items-center gap-2 w-full">
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
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

                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-mono text-sm animate-pulse">
                        Loading active community drives...
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20 bg-[#070b19]/40 border border-white/5 rounded-3xl backdrop-blur-md">
                        <p className="text-gray-400 text-sm">No community events found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                        {filteredEvents.map((event) => {
                            const eventId = event._id;
                            const isJoined = joinedEventIds.has(eventId);

                            return (
                                <div 
                                    key={eventId}
                                    className="group bg-[#070b19]/85 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:border-[#554bb9]/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(85,75,185,0.2)] hover:-translate-y-1 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="relative h-52 w-full overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-transparent to-transparent z-10 opacity-80" />
                                            <img 
                                                src={event.imageUrl && event.imageUrl.startsWith("http") ? event.imageUrl : "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9"} 
                                                alt={event.title}
                                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9"; }}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                                        <Link href={`/events/${eventId}`} className="block">
                                            <Button className={`w-full py-5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                                                isJoined 
                                                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20" 
                                                    : "bg-white/5 border border-white/10 text-white group-hover:bg-gradient-to-r group-hover:from-[#554bb9] group-hover:to-[#af136a] group-hover:border-0"
                                            }`}>
                                                {isJoined ? (
                                                    <>
                                                        <CheckCircle2 size={15} />
                                                        <span>Joined</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>View Event</span>
                                                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}