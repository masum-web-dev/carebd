"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, ArrowLeft, Sparkles, User, ShieldCheck, Share2, HeartHandshake, CheckCircle2, Edit3, Trash2, AlertTriangle, Type, Tag, Image as ImageIcon, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

export default function SingleEventPage({ params }) {
    const [resolvedParams, setResolvedParams] = useState(null);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isJoined, setIsJoined] = useState(false);
    
    // Edit & Delete States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteInputText, setDeleteInputText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const router = useRouter();

    const { data: session } = authClient.useSession();

    const [eventData, setEventData] = useState({
        title: "",
        category: "Donation & Relief",
        date: "",
        location: "",
        imageUrl: "",
        description: "",
        organizerEmail: "",
    });

    const categories = [
        "Donation & Relief",
        "Winter Clothes Distribution",
        "Blanket Relief Drive",
        "Environmental Cleanup",
        "Food Distribution",
        "Tree Plantation",
        "Medical Camp"
    ];

    const photoPresets = [
        { label: "Winter Clothes", url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9" },
        { label: "Blanket Relief", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c" },
        { label: "Cleanup", url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5" },
        { label: "Tree Plantation", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09" }
    ];

    useEffect(() => {
        async function unwrapParams() {
            const unwrapped = await params;
            setResolvedParams(unwrapped);
            fetchEventDetails(unwrapped.id);
        }
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!session?.user?.email || !resolvedParams?.id) return;

        const checkJoinedStatus = async () => {
            try {
                const res = await fetch(`http://localhost:8000/joined-events?email=${session.user.email}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    const alreadyJoined = data.some((item) => item.eventId === resolvedParams.id);
                    setIsJoined(alreadyJoined);
                }
            } catch (err) {
                console.error("Failed to check joined status:", err);
            }
        };

        checkJoinedStatus();
    }, [session, resolvedParams]);

    const fetchEventDetails = async (eventId) => {
        try {
            const res = await fetch(`http://localhost:8000/events/${eventId}`);
            if (res.ok) {
                const data = await res.json();
                setEvent(data);
                setEventData({
                    title: data.title || "",
                    category: data.category || "Donation & Relief",
                    date: data.date || "",
                    location: data.location || "",
                    imageUrl: data.imageUrl || "",
                    description: data.description || "",
                    organizerEmail: data.organizerEmail || "",
                });
            }
        } catch (err) {
            console.error("Failed to fetch event details:", err);
        } finally {
            setLoading(false);
        }
    };

    const triggerToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
    };

    const handleJoinEvent = async () => {
        if (!session) {
            router.push("/login");
            return;
        }

        if (isJoined) return;

        const joinPayload = {
            eventId: resolvedParams.id,
            title: event.title,
            category: event.category,
            date: event.date,
            location: event.location,
            imageUrl: event.imageUrl,
            userEmail: session.user.email,
            userName: session.user.name,
        };

        try {
            const res = await fetch("http://localhost:8000/joined-events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(joinPayload),
            });

            const data = await res.json();

            if (res.ok) {
                setIsJoined(true);
                triggerToast("Successfully joined this event!");
            } else {
                triggerToast(data.message || "You have already joined this event.");
            }
        } catch (err) {
            console.error("Failed to join event:", err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch(`http://localhost:8000/events/${resolvedParams.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventData),
            });

            if (res.ok) {
                setIsDialogOpen(false);
                fetchEventDetails(resolvedParams.id);
                triggerToast("Edited successfully");
            }
        } catch (error) {
            console.error("Failed to update event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async (e) => {
        e.preventDefault();
        if (deleteInputText.trim().toLowerCase() !== "delete") return;
        setIsDeleting(true);

        try {
            const res = await fetch(`http://localhost:8000/events/${resolvedParams.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                router.push("/events");
            }
        } catch (err) {
            console.error("Failed to delete event:", err);
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030215] text-white flex items-center justify-center font-mono text-sm">
                Loading event details...
            </div>
        );
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

            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#070b19]/90 border border-emerald-500/50 text-white px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <CheckCircle2 className="text-emerald-400" size={20} />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-emerald-300">Success</span>
                        <span className="text-xs text-gray-300">{toastMessage}</span>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-[#554bb9]/50 rounded-full blur-[70px] animate-bubble-one" />
                <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#af136a]/40 rounded-full blur-[80px] animate-bubble-two" />
            </div>

            <div className="w-full max-w-5xl relative z-10 space-y-6 mb-12">

                {/* Back Link and Action Buttons */}
                <div className="flex items-center justify-between">
                    <Link href="/events" className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition">
                        <ArrowLeft size={15} />
                        <span>Back to Events</span>
                    </Link>
                </div>

                <div className="bg-[#070b19]/85 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">

                    {/* Image Section with Edit and Delete buttons on top */}
                    <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-black/40 to-transparent z-10" />
                        <img 
                            src={event.imageUrl && event.imageUrl.startsWith("http") ? event.imageUrl : "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9"} 
                            alt={event.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9";
                            }}
                            className="w-full h-full object-cover"
                        />
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-[#030215]/80 border border-white/15 backdrop-blur-md text-xs font-mono text-[#79dce8] flex items-center gap-1.5 shadow-lg">
                            <Sparkles size={13} className="text-[#af136a]" />
                            <span>{event.category || "Community Drive"}</span>
                        </div>

                        {/* Edit and Delete Buttons on Top Right of the Image */}
                        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                            <button
                                onClick={() => setIsDialogOpen(true)}
                                className="h-9 px-3.5 rounded-xl bg-[#030215]/80 border border-white/20 text-xs text-gray-200 hover:text-white hover:bg-[#030215] flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition shadow-lg"
                            >
                                <Edit3 size={14} className="text-[#79dce8]" />
                                <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="h-9 px-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-xs text-red-300 hover:text-white hover:bg-red-600/60 flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition shadow-lg"
                            >
                                <Trash2 size={14} />
                                <span className="hidden sm:inline">Delete</span>
                            </button>
                        </div>

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
                            <Button 
                                onClick={handleJoinEvent}
                                disabled={isJoined}
                                className={`h-11 px-6 rounded-xl font-medium text-xs flex items-center gap-2 transition shadow-lg border-0 cursor-pointer w-full sm:w-auto ${
                                    isJoined 
                                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-not-allowed opacity-80 shadow-none" 
                                        : "bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white hover:opacity-95 shadow-[0_0_20px_rgba(85,75,185,0.4)]"
                                }`}
                            >
                                {isJoined ? <CheckCircle2 size={16} /> : <HeartHandshake size={16} />}
                                <span>{isJoined ? "Joined" : "Join Event"}</span>
                            </Button>
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

                            <div className="bg-[#030215]/40 border border-white/5 rounded-2xl p-5 space-y-3">
                                <h4 className="text-xs font-mono text-[#79dce8] uppercase tracking-wider">
                                    Volunteer Guidelines
                                </h4>
                                <ul className="space-y-2 text-xs text-gray-400">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#af136a]" />
                                        <span>Please arrive 15 minutes before the scheduled time at the designated location.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#af136a]" />
                                        <span>Wear comfortable clothing suitable for physical social work and distribution.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#af136a]" />
                                        <span>Bring any pre-coordinated relief packages or distribution items if requested.</span>
                                    </li>
                                </ul>
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

            {/* Edit Dialog Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-[#070b19] border border-white/15 text-white max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-serif">Edit Community Event</DialogTitle>
                        <DialogDescription className="text-xs text-gray-400">
                            Update the details of your social initiative below.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">Event Title</Label>
                            <div className="relative flex items-center">
                                <Type className="absolute left-3.5 text-gray-400 z-10" size={16} />
                                <Input
                                    type="text"
                                    name="title"
                                    required
                                    value={eventData.title}
                                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                                    className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-2.5 h-10 text-xs text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">Event Type</Label>
                                <div className="relative flex items-center">
                                    <Tag className="absolute left-3.5 text-gray-400 z-10 pointer-events-none" size={16} />
                                    <select
                                        name="category"
                                        value={eventData.category}
                                        onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                                        className="w-full bg-[#030215] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 h-10 text-xs text-white focus:outline-none appearance-none cursor-pointer"
                                    >
                                        {categories.map((cat, idx) => (
                                            <option key={idx} value={cat} className="bg-[#070b19] text-white">
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3.5 text-white/70 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">Event Date</Label>
                                <div className="relative flex items-center">
                                    <CalendarIcon className="absolute left-3.5 text-gray-400 z-10 pointer-events-none" size={16} />
                                    <Input
                                        type="date"
                                        name="date"
                                        required
                                        value={eventData.date}
                                        onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                                        className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-2.5 h-10 text-xs text-white [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">Location / Venue</Label>
                            <div className="relative flex items-center">
                                <MapPin className="absolute left-3.5 text-gray-400 z-10" size={16} />
                                <Input
                                    type="text"
                                    name="location"
                                    required
                                    value={eventData.location}
                                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                                    className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-2.5 h-10 text-xs text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">Thumbnail Image URL</Label>
                            <div className="relative flex items-center">
                                <ImageIcon className="absolute left-3.5 text-gray-400 z-10" size={16} />
                                <Input
                                    type="url"
                                    name="imageUrl"
                                    required
                                    value={eventData.imageUrl}
                                    onChange={(e) => setEventData({ ...eventData, imageUrl: e.target.value })}
                                    className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-2.5 h-10 text-xs text-white"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-400">
                                <span>Quick presets:</span>
                                {photoPresets.map((preset, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setEventData({ ...eventData, imageUrl: preset.url })}
                                        className="text-[#79dce8] hover:underline cursor-pointer"
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">Event Description</Label>
                            <Textarea
                                name="description"
                                required
                                rows={3}
                                value={eventData.description}
                                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                                className="w-full bg-[#030215]/60 border-white/10 rounded-xl p-3 text-xs text-white resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 rounded-xl bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white font-medium text-xs cursor-pointer border-0"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={() => { setIsDeleteDialogOpen(false); setDeleteInputText(""); }}>
                <DialogContent className="bg-[#070b19] border border-red-500/30 text-white max-w-md rounded-3xl p-6">
                    <DialogHeader className="space-y-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                            <AlertTriangle size={20} />
                        </div>
                        <DialogTitle className="text-lg font-serif">Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="text-xs text-gray-400 leading-relaxed">
                            This action cannot be undone. To confirm deletion, please type <span className="font-mono text-red-400 font-bold select-all">delete</span> below.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleDeleteConfirm} className="space-y-4 pt-3">
                        <Input
                            type="text"
                            placeholder="Type 'delete' to confirm"
                            value={deleteInputText}
                            onChange={(e) => setDeleteInputText(e.target.value)}
                            className="w-full bg-[#030215]/80 border-white/10 rounded-xl px-4 py-2.5 h-10 text-xs text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-red-500"
                        />
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsDeleteDialogOpen(false);
                                    setDeleteInputText("");
                                }}
                                className="h-9 px-4 rounded-xl bg-white/5 border-white/10 text-xs text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={deleteInputText.trim().toLowerCase() !== "delete" || isDeleting}
                                className="h-9 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium cursor-pointer border-0 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? "Deleting..." : "Confirm Delete"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}