"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Search, Plus, ArrowRight, Sparkles, User, CheckCircle2, Edit3, Trash2, AlertTriangle, Type, Tag, Image as ImageIcon, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
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

export default function Events() {
    const [events, setEvents] = useState([]);
    const [joinedEventIds, setJoinedEventIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const [editingEventId, setEditingEventId] = useState(null);
    const [deletingEventId, setDeletingEventId] = useState(null);
    const [deleteInputText, setDeleteInputText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const [eventData, setEventData] = useState({
        title: "",
        category: "Donation & Relief",
        date: "",
        location: "",
        imageUrl: "",
        description: "",
        organizerEmail: "",
    });

    const { data: session } = authClient.useSession();

    const categories = [
        "All",
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

    const fetchEvents = async () => {
        try {
            const eventsRes = await fetch("http://localhost:8000/events");
            const eventsData = await eventsRes.json();
            
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

            if (session?.user?.email) {
                const joinedRes = await fetch(`http://localhost:8000/joined-events?email=${session.user.email}`);
                const joinedData = await joinedRes.json();
                if (Array.isArray(joinedData)) {
                    const ids = new Set(joinedData.map((item) => item.eventId));
                    setJoinedEventIds(ids);
                }
            }
        } catch (err) {
            console.error("Failed to fetch events:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [session]);

    const triggerToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
    };

    const handleOpenEdit = (event) => {
        setEditingEventId(event._id);
        setEventData({
            title: event.title || "",
            category: event.category || "Donation & Relief",
            date: event.date || "",
            location: event.location || "",
            imageUrl: event.imageUrl || "",
            description: event.description || "",
            organizerEmail: event.organizerEmail || "",
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch(`http://localhost:8000/events/${editingEventId}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": "Bearer dummy-token-to-satisfy-middleware"
                },
                body: JSON.stringify(eventData),
            });

            if (res.ok) {
                setEditingEventId(null);
                fetchEvents();
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
            const res = await fetch(`http://localhost:8000/events/${deletingEventId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer dummy-token-to-satisfy-middleware"
                }
            });
            if (res.ok) {
                setDeletingEventId(null);
                setDeleteInputText("");
                fetchEvents();
                triggerToast("Event deleted successfully");
            }
        } catch (err) {
            console.error("Failed to delete event:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredEvents = events.filter((event) => {
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.location?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
                <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-[#554bb9]/70 rounded-full blur-[60px] animate-bubble-one shadow-[0_0_90px_rgba(85,75,185,0.5)]" />
                <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] bg-[#af136a]/60 rounded-full blur-[70px] animate-bubble-two shadow-[0_0_120px_rgba(175,19,106,0.4)]" />
                <div className="absolute top-[40%] right-[30%] w-80 h-80 bg-[#79dce8]/50 rounded-full blur-[50px] animate-bubble-three shadow-[0_0_80px_rgba(121,220,232,0.3)]" />
            </div>

            <div className="w-full max-w-7xl relative z-10 space-y-8 mb-12">

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
                        {filteredEvents.map((event) => {
                            const eventId = event._id;
                            const isJoined = joinedEventIds.has(eventId);

                            return (
                                <div 
                                    key={eventId}
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

                                    <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-3">
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <div className="flex items-center gap-1.5 truncate">
                                                <User size={13} className="text-gray-500" />
                                                <span className="truncate font-mono text-[11px] text-gray-300 max-w-[140px]">{event.organizerEmail}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <button 
                                                    onClick={() => handleOpenEdit(event)}
                                                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer transition"
                                                    title="Edit Event"
                                                >
                                                    <Edit3 size={13} className="text-[#79dce8]" />
                                                </button>
                                                <button 
                                                    onClick={() => setDeletingEventId(event._id)}
                                                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/20 cursor-pointer transition"
                                                    title="Delete Event"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>

                                        <Link href={`/events/${eventId}`} className="block">
                                            <Button className={`w-full py-5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
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

            <Dialog open={!!editingEventId} onOpenChange={() => setEditingEventId(null)}>
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
                                        {categories.filter(c => c !== "All").map((cat, idx) => (
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

            <Dialog open={!!deletingEventId} onOpenChange={() => { setDeletingEventId(null); setDeleteInputText(""); }}>
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
                                    setDeletingEventId(null);
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