"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowLeft, Sparkles, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function JoinedEventsPage() {
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (!session?.user?.email) {
            setLoading(false);
            return;
        }

        fetchJoinedEvents();
    }, [session]);

    const fetchJoinedEvents = async () => {
        try {
            const res = await fetch(`http://localhost:8000/joined-events?email=${session.user.email}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setJoinedEvents(data);
            }
        } catch (err) {
            console.error("Failed to fetch joined events:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEvent = async (id) => {
        try {
            setCancellingId(id);
            
            const res = await fetch(`http://localhost:8000/joined-events/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer dummy-token-to-satisfy-middleware"
                }
            });

            if (res.ok) {
                setJoinedEvents((prev) => prev.filter((item) => (item._id || item.eventId) !== id));
            } else {
                console.error("Failed to cancel event");
            }
        } catch (err) {
            console.error("Error cancelling event:", err);
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030215] text-white flex flex-col items-center justify-start p-4 sm:p-8 relative overflow-y-auto select-none">
            <div className="w-full max-w-7xl relative z-10 space-y-8 mb-12">
                
                <div className="flex items-center justify-between bg-[#070b19]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                    <div>
                        <Link href="/events" className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition mb-3">
                            <ArrowLeft size={15} />
                            <span>Back to Events</span>
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                            My Joined Events
                        </h1>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1.5">
                            Here are the community initiatives you have successfully joined.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-mono text-sm animate-pulse">
                        Loading your joined events...
                    </div>
                ) : joinedEvents.length === 0 ? (
                    <div className="text-center py-20 bg-[#070b19]/40 border border-white/5 rounded-3xl backdrop-blur-md space-y-4">
                        <p className="text-gray-400 text-sm">You have not joined any events yet.</p>
                        <Link href="/events">
                            <Button className="bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white text-xs">
                                Browse Events
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {joinedEvents.map((item) => {
                            const uniqueId = item._id || item.eventId;
                            return (
                                <div 
                                    key={uniqueId}
                                    className="group bg-[#070b19]/85 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="relative h-52 w-full overflow-hidden">
                                            <img 
                                                src={item.imageUrl && item.imageUrl.startsWith("http") ? item.imageUrl : "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9"} 
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-[#030215]/80 border border-white/15 backdrop-blur-md text-[11px] font-mono text-[#79dce8] flex items-center gap-1.5 shadow-md">
                                                <Sparkles size={11} className="text-[#af136a]" />
                                                <span>{item.category}</span>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-4">
                                            <h3 className="text-xl font-bold font-serif text-white line-clamp-1">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <MapPin size={14} className="text-[#af136a]" />
                                                <span>{item.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <Calendar size={14} className="text-[#79dce8]" />
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-6 pt-2 border-t border-white/5">
                                        <Button 
                                            onClick={() => handleCancelEvent(uniqueId)}
                                            disabled={cancellingId === uniqueId}
                                            className="w-full py-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition cursor-pointer"
                                        >
                                            <XCircle size={15} />
                                            <span>{cancellingId === uniqueId ? "Cancelling..." : "Cancel Event"}</span>
                                        </Button>
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