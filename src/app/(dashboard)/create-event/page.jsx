"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, MapPin, Image as ImageIcon, FileText, Tag, Type, ArrowLeft, Sparkles, ChevronDown, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateEventPage() {
    const [today, setToday] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const currentDate = new Date().toISOString().split("T")[0];
        setToday(currentDate);
    }, []);

    const initialFormState = {
        title: "",
        category: "Donation & Relief",
        date: "",
        location: "",
        imageUrl: "",
        description: "",
        organizerEmail: "masum.akash1999@gmail.com",
    };

    const [eventData, setEventData] = useState(initialFormState);

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

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handlePresetClick = (url) => {
        setEventData({ ...eventData, imageUrl: url });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("http://localhost:8000/create-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization header added here
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
                },
                body: JSON.stringify(eventData),
            });

            if (res.ok) {
                setShowToast(true);
                setTimeout(() => {
                    router.push("/events");
                }, 1000);
            }
        } catch (error) {
            console.error("Failed to submit event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030215] text-white flex flex-col items-center justify-start p-4 sm:p-8 relative overflow-hidden select-none">

            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#070b19]/90 border border-emerald-500/50 text-white px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <CheckCircle2 className="text-emerald-400" size={20} />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-emerald-300">Success!</span>
                        <span className="text-xs text-gray-300">Event created & saved successfully.</span>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[15%] left-[15%] w-80 h-80 bg-[#554bb9]/80 rounded-full blur-[45px] animate-bubble-one shadow-[0_0_80px_rgba(85,75,185,0.6)]" />
                <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-[#af136a]/70 rounded-full blur-[50px] animate-bubble-two shadow-[0_0_100px_rgba(175,19,106,0.5)]" />
                <div className="absolute top-[40%] right-[35%] w-72 h-72 bg-[#79dce8]/60 rounded-full blur-[40px] animate-bubble-three shadow-[0_0_70px_rgba(121,220,232,0.4)]" />
            </div>

            <div className="w-full max-w-3xl relative z-10 mb-6">
                <Link 
                    href="/events" 
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Events</span>
                </Link>
            </div>

            <div className="w-full max-w-3xl bg-[#070b19]/85 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative z-10 mb-12">

                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#554bb9]/20 border border-[#554bb9]/40 text-[#79dce8] text-xs font-mono mb-3">
                        <Sparkles size={13} />
                        <span>Social Service Drive</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                        Create a Community Event
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1.5">
                        Organize a local relief effort, environmental cleanup, or community support drive.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                            Event Title <span className="text-[#af136a]">*</span>
                        </Label>
                        <div className="relative flex items-center">
                            <Type className="absolute left-3.5 text-gray-400 z-10" size={18} />
                            <Input
                                type="text"
                                name="title"
                                required
                                value={eventData.title}
                                onChange={handleChange}
                                placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
                                className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-3 h-12 text-sm text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#af136a] transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                                Event Type <span className="text-[#af136a]">*</span>
                            </Label>
                            <div className="relative flex items-center">
                                <Tag className="absolute left-3.5 text-gray-400 z-10 pointer-events-none" size={18} />
                                <select
                                    name="category"
                                    value={eventData.category}
                                    onChange={handleChange}
                                    className="w-full bg-[#030215]/80 border border-white/10 rounded-xl pl-10 pr-10 py-3 h-12 text-sm text-white focus:outline-none focus:border-[#af136a] transition appearance-none cursor-pointer"
                                >
                                    {categories.map((cat, idx) => (
                                        <option key={idx} value={cat} className="bg-[#070b19] text-white">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3.5 text-white/70 pointer-events-none" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                                Event Date <span className="text-[#af136a]">*</span>
                            </Label>
                            <div className="relative flex items-center">
                                <CalendarIcon className="absolute left-3.5 text-gray-400 z-10 pointer-events-none" size={18} />
                                <Input
                                    type="date"
                                    name="date"
                                    required
                                    min={today}
                                    value={eventData.date}
                                    onChange={handleChange}
                                    className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-3 h-12 text-sm text-white focus-visible:ring-0 focus-visible:border-[#af136a] transition cursor-pointer [color-scheme:dark]"
                                />
                            </div>
                            <p className="text-[11px] text-gray-500">Dates must be in the future (today or later)</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                            Location / Venue <span className="text-[#af136a]">*</span>
                        </Label>
                        <div className="relative flex items-center">
                            <MapPin className="absolute left-3.5 text-gray-400 z-10" size={18} />
                            <Input
                                type="text"
                                name="location"
                                required
                                value={eventData.location}
                                onChange={handleChange}
                                placeholder="Dhaka Jurain"
                                className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-3 h-12 text-sm text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#af136a] transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                            Thumbnail Image URL <span className="text-[#af136a]">*</span>
                        </Label>
                        <div className="relative flex items-center">
                            <ImageIcon className="absolute left-3.5 text-gray-400 z-10" size={18} />
                            <Input
                                type="url"
                                name="imageUrl"
                                required
                                value={eventData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://images.unsplash.com/photo-..."
                                className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-3 h-12 text-sm text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#af136a] transition"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-400">
                            <span className="font-mono text-[11px]">Quick photo presets:</span>
                            {photoPresets.map((preset, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handlePresetClick(preset.url)}
                                    className="text-[#79dce8] hover:underline cursor-pointer"
                                >
                                    {preset.label}{index < photoPresets.length - 1 ? "," : ""}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                            Event Description <span className="text-[#af136a]">*</span>
                        </Label>
                        <div className="relative">
                            <Textarea
                                name="description"
                                required
                                rows={4}
                                value={eventData.description}
                                onChange={handleChange}
                                placeholder="Explain the purpose of the drive, volunteers required, items being distributed or tasks to complete..."
                                className="w-full bg-[#030215]/60 border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#af136a] transition resize-none"
                            />
                        </div>
                    </div>

                    <div className="bg-[#030215]/40 border border-white/5 rounded-xl p-4 flex items-center justify-between text-xs text-gray-400">
                        <span>Organizer Email attached:</span>
                        <span className="font-mono text-white font-medium">{eventData.organizerEmail}</span>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-6 rounded-xl bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-95 transition transform hover:scale-[1.01] active:scale-[0.99] shadow-lg cursor-pointer border-0 disabled:opacity-50"
                    >
                        <span>{isSubmitting ? "Publishing Event..." : "Publish Event"}</span>
                    </Button>

                </form>
            </div>
        </div>
    );
}