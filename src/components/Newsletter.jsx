"use client";

import { useState, useEffect } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    }
  };

  if (!mounted) {
    return <section className="w-full bg-[#af136a] py-20 min-h-[300px]" />;
  }

  return (
    <section className="w-full bg-[#af136a] py-20 px-4 text-white select-none relative overflow-hidden shadow-2xl">
      {/* Background Decorative Glow Effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-black/20 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/20">
          <Mail className="w-8 h-8 text-white" />
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">
          Stay Updated With CareBD
        </h2>

        {/* Description */}
        <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Subscribe to our newsletter to receive immediate updates about upcoming community clothing drives, food distributions, and volunteer opportunities near you.
        </p>

        {/* Form / Success Message */}
        {submitted ? (
          <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full py-4 px-6 max-w-md mx-auto text-white animate-fade-in">
            <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
            <span className="font-medium text-sm sm:text-base">
              Thank you! You've successfully subscribed.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="w-full px-6 py-4 rounded-full bg-[#030215]/30 backdrop-blur-md border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#030215] hover:bg-[#070b19] text-white font-medium text-sm sm:text-base transition-all duration-300 shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer transform hover:scale-105 active:scale-95 border border-white/10"
            >
              <Send className="w-4 h-4" />
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}