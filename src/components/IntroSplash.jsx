"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function IntroSplash({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2500);
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030215] text-white px-4 select-none transition-opacity duration-700 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Glow Accents */}
      <div className="absolute w-[500px] h-[500px] bg-[#554bb9]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[#af136a]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-xl">
        {/* Large Logo with Glow & Border */}
        <div className="p-5 rounded-3xl bg-[#070b19] border border-white/15 backdrop-blur-xl shadow-2xl animate-pulse">
          <Image 
            src="/carebd logo.png" 
            alt="CareBD Logo" 
            width={110} 
            height={110} 
            className="object-contain" 
            priority
          />
        </div>

        {/* Emotional Header & Welcome */}
        <div className="space-y-3">
          <span className="text-[#79dce8] font-mono tracking-widest text-sm uppercase">
            // Thanks for joining with us //
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
            Share Warmth, <span className="text-[#af136a]">Spread Smiles</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Connecting compassionate hearts with direct community initiatives. Every pre-loved garment brings a new hope.
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-[#554bb9] to-[#af136a] animate-progress" />
        </div>
      </div>
    </div>
  );
}