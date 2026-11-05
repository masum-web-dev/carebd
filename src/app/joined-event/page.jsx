"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowLeft, Sparkles, XCircle, Edit3, Trash2, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function JoinedEventsPage() {
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const { data: session } = authClient.useSession();

    // Edit modal states
    const [editingEvent, setEditingEvent] = useState(null);
    const [editFormData, setEditFormData] = useState({ title: "", location: "", date: "", category: "", imageUrl: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete confirmation modal states
    const [deleteModalItem, setDeleteModalItem] = useState(null);
    const [deleteInputText, setDeleteInputText] = useState("");

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

    const handleConfirmDelete = async () => {
        if (!deleteModalItem || deleteInputText !== "delete") return;

        const uniqueId = deleteModalItem._id || deleteModalItem.eventId;

        try {
            setCancellingId(uniqueId);
            
            const res = await fetch(`http://localhost:8000/joined-events/${uniqueId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer dummy-token-to-satisfy-middleware"
                }
            });

            if (res.ok) {
                setJoinedEvents((prev) => prev.filter((i) => (i._id || i.eventId) !== uniqueId));
                setDeleteModalItem(null);
                setDeleteInputText("");
            } else {
                console.error("Failed to cancel event");
            }
        } catch (err) {
            console.error("Error cancelling event:", err);
        } finally {
            setCancellingId(null);
        }
    };

    const openEditModal = (item) => {
        setEditingEvent(item);
        setEditFormData({
            title: item.title || "",
            location: item.location || "",
            date: item.date || "",
            category: item.category || "",
            imageUrl: item.imageUrl || ""
        });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        const uniqueId = editingEvent._id || editingEvent.eventId;

        try {
            setIsSubmitting(true);
            const res = await fetch(`http://localhost:8000/joined-events/${uniqueId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer dummy-token-to-satisfy-middleware"
                },
                body: JSON.stringify(editFormData)
            });

            if (res.ok) {
                setJoinedEvents((prev) =>
                    prev.map((item) =>
                        (item._id || item.eventId) === uniqueId ? { ...item, ...editFormData } : item
                    )
                );
                setEditingEvent(null);
            } else {
                console.error("Failed to update event");
            }
        } catch (err) {
            console.error("Error updating event:", err);
        } finally {
            setIsSubmitting(false);
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

                                    {/* Manage Event Section */}
                                    <div className="p-6 pt-2 border-t border-white/5 space-y-3">
                                        <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                                            Manage Event
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Button 
                                                onClick={() => openEditModal(item)}
                                                className="flex-1 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 bg-[#554bb9]/20 border border-[#554bb9]/40 text-[#79dce8] hover:bg-[#554bb9]/30 transition cursor-pointer"
                                            >
                                                <Edit3 size={14} />
                                                <span>Edit</span>
                                            </Button>

                                            <Button 
                                                onClick={() => {
                                                    setDeleteModalItem(item);
                                                    setDeleteInputText("");
                                                }}
                                                disabled={cancellingId === uniqueId}
                                                className="flex-1 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition cursor-pointer"
                                            >
                                                <Trash2 size={14} />
                                                <span>{cancellingId === uniqueId ? "Deleting..." : "Delete"}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Edit Modal / Popup */}
                {editingEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="w-full max-w-lg bg-[#070b19] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                            <button 
                                onClick={() => setEditingEvent(null)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-white transition cursor-pointer"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-serif font-bold text-white mb-6">Edit Joined Event</h2>

                            <form onSubmit={handleUpdateEvent} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-mono text-gray-300 uppercase">Title</Label>
                                    <Input 
                                        type="text" 
                                        name="title" 
                                        value={editFormData.title} 
                                        onChange={handleEditChange} 
                                        required 
                                        className="w-full bg-[#030215]/60 border-white/10 rounded-xl text-sm text-white"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-mono text-gray-300 uppercase">Location</Label>
                                    <Input 
                                        type="text" 
                                        name="location" 
                                        value={editFormData.location} 
                                        onChange={handleEditChange} 
                                        required 
                                        className="w-full bg-[#030215]/60 border-white/10 rounded-xl text-sm text-white"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-mono text-gray-300 uppercase">Date</Label>
                                    <Input 
                                        type="text" 
                                        name="date" 
                                        value={editFormData.date} 
                                        onChange={handleEditChange} 
                                        required 
                                        className="w-full bg-[#030215]/60 border-white/10 rounded-xl text-sm text-white"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-mono text-gray-300 uppercase">Category</Label>
                                    <Input 
                                        type="text" 
                                        name="category" 
                                        value={editFormData.category} 
                                        onChange={handleEditChange} 
                                        required 
                                        className="w-full bg-[#030215]/60 border-white/10 rounded-xl text-sm text-white"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-mono text-gray-300 uppercase">Image URL</Label>
                                    <Input 
                                        type="url" 
                                        name="imageUrl" 
                                        value={editFormData.imageUrl} 
                                        onChange={handleEditChange} 
                                        className="w-full bg-[#030215]/60 border-white/10 rounded-xl text-sm text-white"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <Button 
                                        type="button" 
                                        onClick={() => setEditingEvent(null)}
                                        className="w-1/2 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white hover:opacity-95 text-xs"
                                    >
                                        {isSubmitting ? "Updating..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Custom Delete Confirmation Modal matching the design */}
                {deleteModalItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md bg-[#070b19] border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white">
                            <button 
                                onClick={() => {
                                    setDeleteModalItem(null);
                                    setDeleteInputText("");
                                }}
                                className="absolute top-6 right-6 text-gray-400 hover:text-white transition cursor-pointer"
                            >
                                <X size={20} />
                            </button>

                            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-5">
                                <AlertTriangle size={24} />
                            </div>

                            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
                                Are you absolutely sure?
                            </h2>
                            <p className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed">
                                This action cannot be undone. To confirm deletion, please type <span className="text-red-400 font-semibold">delete</span> below.
                            </p>

                            <div className="space-y-4 mb-6">
                                <Input 
                                    type="text" 
                                    placeholder="Type 'delete' to confirm" 
                                    value={deleteInputText}
                                    onChange={(e) => setDeleteInputText(e.target.value)}
                                    className="w-full bg-[#030215]/80 border-red-500/40 rounded-xl text-sm text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-red-500"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <Button 
                                    type="button" 
                                    onClick={() => {
                                        setDeleteModalItem(null);
                                        setDeleteInputText("");
                                    }}
                                    className="w-1/2 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="button" 
                                    disabled={deleteInputText !== "delete"}
                                    onClick={handleConfirmDelete}
                                    className={`w-1/2 py-3 rounded-xl text-xs font-medium text-white transition ${
                                        deleteInputText === "delete" 
                                            ? "bg-red-600 hover:bg-red-700 cursor-pointer" 
                                            : "bg-red-950/40 text-gray-500 border border-red-500/10 cursor-not-allowed"
                                    }`}
                                >
                                    Confirm Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}