"use client";

import { useState, useEffect } from "react";
import { Users, Calendar, ShieldCheck } from "lucide-react";

export default function Features() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuresList = [
    {
      num: "01",
      title: "Community-Led Drives",
      desc: "Every citizen can organize winter clothing drives, food distributions, or aid events in their local area easily.",
      icon: <Users className="w-6 h-6 text-white" />
    },
    {
      num: "02",
      title: "One-Click Participation",
      desc: "Join verified charity events with a single click and coordinate directly with local volunteers and organizers.",
      icon: <Calendar className="w-6 h-6 text-white" />
    },
    {
      num: "03",
      title: "Active Relief Discovery",
      desc: "Strict future-date filters guarantee you will always discover upcoming active campaigns and donation events.",
      icon: <ShieldCheck className="w-6 h-6 text-white" />
    }
  ];

  if (!mounted) {
    return <section className="w-full bg-[#030215] py-16 px-4 min-h-[400px]" />;
  }

  return (
    <section className="w-full bg-[#030215] py-16 px-4 text-white select-none">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Subtitle */}
        <p className="text-[#79dce8] tracking-widest text-sm uppercase mb-2 font-mono">
          // Our Features //
        </p>
        
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-3">
          Feature for your <span className="text-[#af136a]">Event</span>
        </h2>
        
        <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-12">
          A frictionless platform connecting compassionate citizens with direct local community initiatives.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuresList.map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-[#070b19] border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-[280px] transition-all duration-300 overflow-hidden"
            >
              {/* Dotted Border Animation Element (Bottom to Top slide) */}
              <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-[#af136a] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 [clip-path:inset(100%_0_0_0)] group-hover:[animation:borderSlide_0.5s_cubic-bezier(0.4,0,0.2,1)_forwards]" />

              {/* Top Number & Badge */}
              <div className="flex justify-between items-start">
                <span className="text-6xl font-serif font-bold text-[#af136a] leading-none">
                  {item.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#554bb9] to-[#af136a] flex items-center justify-center shadow-md">
                  {item.icon}
                </div>
              </div>

              {/* Content Details */}
              <div className="text-left mt-2">
                <h3 className="text-xl font-serif font-semibold mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}