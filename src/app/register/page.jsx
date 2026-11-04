"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Image as ImageIcon, Lock, Eye, EyeOff, ArrowRight, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        photoUrl: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);

    const hasUpper = /[A-Z]/.test(formData.password || "");
    const hasLower = /[a-z]/.test(formData.password || "");
    const isMinLength = (formData.password || "").length >= 8;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target);
        const user = Object.fromEntries(formdata.entries());
        
        const {data, error} = await authClient.signUp.email({
            ...user,
        })
        if(data){
            console.log(data)
        }else{
            console.log(error)
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoadingGoogle(true);
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/events",
            });
        } catch (err) {
            console.error("Google sign in error:", err);
        } finally {
            setLoadingGoogle(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030215] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">

            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[15%] left-[15%] w-80 h-80 bg-[#554bb9]/80 rounded-full blur-[45px] animate-bubble-one shadow-[0_0_80px_rgba(85,75,185,0.6)]" />
                <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-[#af136a]/70 rounded-full blur-[50px] animate-bubble-two shadow-[0_0_100px_rgba(175,19,106,0.5)]" />
                <div className="absolute top-[40%] right-[35%] w-72 h-72 bg-[#79dce8]/60 rounded-full blur-[40px] animate-bubble-three shadow-[0_0_70px_rgba(121,220,232,0.4)]" />
            </div>

            <div className="w-full max-w-md bg-[#070b19]/85 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10 my-8">

                <div className="flex flex-col items-center text-center mb-8">
                    <div className="p-3.5 rounded-2xl bg-[#030215] border border-white/10 mb-4 shadow-inner">
                        <Image
                            src="/carebd logo.png"
                            alt="CareBD Logo"
                            width={90}
                            height={30}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        Join the community and start driving social change
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loadingGoogle}
                    className="w-full mb-6 py-6 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition cursor-pointer"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#EA4335"
                            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z"
                        />
                        <path
                            fill="#4285F4"
                            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 15.6C3.5 19.4 7.4 23 12 23z"
                        />
                    </svg>
                    <span>{loadingGoogle ? "Connecting..." : "Continue with Google"}</span>
                </Button>

                <div className="relative flex items-center justify-center mb-6">
                    <div className="border-t border-white/10 w-full absolute"></div>
                    <span className="bg-[#070b19] px-3 text-xs text-gray-400 relative z-10 font-mono">OR WITH EMAIL</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="space-y-1.5">
                        <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                            Full Name
                        </Label>
                        <div className="relative flex items-center">
                            <User className="absolute left-3.5 text-gray-400 z-10" size={18} />
                            <Input
                                type="text"
                                name="name"
                                required
                                value={formData.name ?? ""}
                                onChange={handleChange}
                                placeholder="Tanvir Ahmed"
                                className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-3 h-11 text-sm text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#af136a] transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                            Email Address
                        </Label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 text-gray-400 z-10" size={18} />
                            <Input
                                type="email"
                                name="email"
                                required
                                value={formData.email ?? ""}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-3 h-11 text-sm text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#af136a] transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                            Profile Photo URL
                        </Label>
                        <div className="relative flex items-center">
                            <ImageIcon className="absolute left-3.5 text-gray-400 z-10" size={18} />
                            <Input
                                type="url"
                                name="photoUrl"
                                value={formData.photoUrl ?? ""}
                                onChange={handleChange}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-3 h-11 text-sm text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#af136a] transition"
                            />
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">
                            Optional: Leave empty for default avatar
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                            Password
                        </Label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 text-gray-400 z-10" size={18} />
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                value={formData.password ?? ""}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-10 py-3 h-11 text-sm text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#af136a] transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-gray-400 hover:text-white transition cursor-pointer z-10"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="mt-3 space-y-1.5 text-xs">
                            <div className={`flex items-center gap-2 ${hasUpper ? "text-emerald-400" : "text-gray-400"}`}>
                                {hasUpper ? <Check size={14} /> : <X size={14} />}
                                <span>At least one uppercase letter (A-Z)</span>
                            </div>
                            <div className={`flex items-center gap-2 ${hasLower ? "text-emerald-400" : "text-gray-400"}`}>
                                {hasLower ? <Check size={14} /> : <X size={14} />}
                                <span>At least one lowercase letter (a-z)</span>
                            </div>
                            <div className={`flex items-center gap-2 ${isMinLength ? "text-emerald-400" : "text-gray-400"}`}>
                                {isMinLength ? <Check size={14} /> : <X size={14} />}
                                <span>Minimum 8 characters length</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-6 py-6 px-4 rounded-xl bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-95 transition transform hover:scale-[1.01] active:scale-[0.99] shadow-lg cursor-pointer border-0"
                    >
                        <span>Register</span>
                        <ArrowRight size={16} />
                    </Button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#af136a] hover:underline font-semibold ml-1">
                        Login here
                    </Link>
                </div>

            </div>
        </div>
    );
}