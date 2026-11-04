"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                console.error("Login failed:", error);
                alert(error.message || "Login failed! Please check your credentials.");
            } else {
                console.log("Login successful:", data);
                router.push("/events");
            }
        } catch (err) {
            console.error("An unexpected error occurred:", err);
        } finally {
            setLoading(false);
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
                        Welcome Back
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        Sign in to continue your social initiatives
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
                            Email Address
                        </Label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 text-gray-400 z-10" size={18} />
                            <Input
                                type="email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-[#030215]/60 border-white/10 rounded-xl pl-10 pr-4 py-3 h-11 text-sm text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#af136a] transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                                Password
                            </Label>
                        </div>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 text-gray-400 z-10" size={18} />
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-6 px-4 rounded-xl bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-95 transition transform hover:scale-[1.01] active:scale-[0.99] shadow-lg cursor-pointer border-0 disabled:opacity-50"
                    >
                        <span>{loading ? "Signing in..." : "Sign In"}</span>
                        {!loading && <ArrowRight size={16} />}
                    </Button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-[#af136a] hover:underline font-semibold ml-1">
                        Register here
                    </Link>
                </div>

            </div>
        </div>
    );
}