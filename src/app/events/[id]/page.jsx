import Link from "next/link";
import { headers } from "next/headers";
import { Calendar, MapPin, ArrowLeft, Sparkles, User, ShieldCheck, Share2, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import EventActions from "@/components/EventActions";

export default async function SingleEventPage({ params }) {
    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    let event = null;

    const jweToken = await auth.api.getToken({
        headers: await headers(),
    });
    const token = jweToken?.token || jweToken;

    try {
        const res = await fetch(`http://localhost:8000/events/${eventId}`, {
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store"
        });
        if (res.ok) {
            event = await res.json();
        }
    } catch (err) {
        console.error("Failed to fetch event details:", err);
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-[#030215] text-white flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-400 text-sm">Event not found or failed to load.</p>
                <Link href="/events">
                    <Button className="bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white">Back to Events</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#030215] text-white flex flex-col items-center justify-start p-4 sm:p-8 relative overflow-y-auto select-none">
            <div className="w-full max-w-5xl relative z-10 space-y-6 mb-12">
                
                <div className="flex items-center justify-between">
                    <Link href="/events" className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition">
                        <ArrowLeft size={15} />
                        <span>Back to Events</span>
                    </Link>
                </div>

                <div className="bg-[#070b19]/85 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
                    <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-black/40 to-transparent z-10" />
                        <img 
                            src={event.imageUrl && event.imageUrl.startsWith("http") ? event.imageUrl : "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9"} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        
                        <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-[#030215]/80 border border-white/15 backdrop-blur-md text-xs font-mono text-[#79dce8] flex items-center gap-1.5 shadow-lg">
                            <Sparkles size={13} className="text-[#af136a]" />
                            <span>{event.category || "Community Drive"}</span>
                        </div>

                        <EventActions event={event} session={session} resolvedParamsId={eventId} type="top-actions" />

                        <div className="absolute bottom-6 left-6 right-6 z-20 space-y-3">
                            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-gray-300 font-mono">
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={16} className="text-[#af136a]" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={16} className="text-[#79dce8]" />
                                    <span>{event.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#030215]/40">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-2xl bg-[#554bb9]/20 border border-[#554bb9]/40 flex items-center justify-center text-[#79dce8]">
                                <HeartHandshake size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold text-white">Active Social Initiative</h4>
                                <p className="text-[11px] text-gray-400">Join hands to support this community drive</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <Button variant="outline" className="h-11 px-4 rounded-xl bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer">
                                <Share2 size={16} />
                            </Button>
                            
                            <EventActions event={event} session={session} resolvedParamsId={eventId} type="join-button" />
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-3">
                                    About this Social Initiative
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#030215]/50 border border-white/5 p-5 rounded-2xl whitespace-pre-line">
                                    {event.description}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-[#030215]/60 border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-md">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">
                                    Initiative Organizer
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#554bb9] to-[#af136a] flex items-center justify-center text-white font-bold text-base shadow-md">
                                        <User size={22} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-sm font-bold text-white truncate">CareBD Coordinator</h4>
                                        <p className="text-[11px] font-mono text-gray-400 truncate">{event.organizerEmail || "organizer@carebd.org"}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-[#79dce8] font-mono">
                                    <ShieldCheck size={15} />
                                    <span>Verified Platform Member</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}