"use client";

import { useEffect, useState, useRef } from "react";

export default function MarqueeText() {
  const [mounted, setMounted] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDelta = currentScrollTop - lastScrollTop.current;

      if (scrollDelta !== 0) {
        // Add scroll boost when scrolling
        setScrollOffset((prev) => prev - (scrollDelta * 1.5));
      }

      lastScrollTop.current = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!mounted) {
    return <div className="w-full bg-[#030215] py-16 min-h-[120px]" />;
  }

  const items = [
    "CareBD • Community Clothing Drive",
    "Share Warmth, Spread Smiles",
    "Pre-Loved Garments, New Hope",
    "Join Local Charity Events",
  ];

  return (
    <section className="w-full bg-[#030215] py-16 overflow-hidden select-none border-t border-b border-white/10">
      <div className="flex whitespace-nowrap overflow-hidden">
        <div
          className="flex items-center gap-8 animate-marquee will-change-transform"
          style={{ transform: `translateX(${scrollOffset}px)` }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              {items.map((text, idx) => (
                <div key={idx} className="flex items-center gap-8">
                  <span className="text-4xl sm:text-6xl font-serif font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)] tracking-wider hover:text-[#af136a] transition-colors duration-300">
                    {text}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-[#af136a] inline-block" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}