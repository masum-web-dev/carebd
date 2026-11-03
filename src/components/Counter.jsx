"use client";

import { useEffect, useState, useRef } from "react";

export default function Counter() {
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);

  const statsList = [
    {
      endValue: 10,
      suffix: "K+",
      title: "Garments Donated",
    },
    {
      endValue: 5,
      suffix: "K+",
      title: "Happy Families",
    },
    {
      endValue: 150,
      suffix: "+",
      title: "Charity Drives",
    },
    {
      endValue: 20,
      suffix: "K+",
      title: "Volunteers",
    },
  ];

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <section 
      ref={ref} 
      className="w-full bg-[#030215] py-24 px-4 text-white select-none relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex justify-center">
        {/* Main Pill Gradient Container */}
        <div className="w-full bg-gradient-to-r from-[#554bb9] via-[#83389c] to-[#af136a] rounded-[50px] py-14 px-6 md:px-12 shadow-2xl border border-white/20 relative overflow-hidden">
          
          {/* Grid for 4 Counter Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-items-center">
            {statsList.map((item, idx) => (
              <CounterItem key={idx} item={item} startAnimation={inView} mounted={mounted} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function CounterItem({ item, startAnimation, mounted }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime = null;
    const duration = 2200;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const currentCount = Math.floor(easeOutQuart * item.endValue);
      
      setCount(currentCount);

      if (percentage < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(item.endValue);
      }
    };

    requestAnimationFrame(animateCount);
  }, [startAnimation, item.endValue]);

  return (
    <div className="flex flex-col items-center justify-center relative">
      {/* Circular Card with Border Effect */}
      <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-full bg-[#030215] border-2 border-white/10 flex flex-col items-center justify-center shadow-xl group hover:border-[#af136a] transition-all duration-300">
        
        {/* Decorative Circular Arc Lines */}
        <div className="absolute inset-2 rounded-full border border-dashed border-white/15 pointer-events-none animate-spin-slow" />

        {/* Number */}
        <h3 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight mb-1">
          {mounted ? count : 0}{item.suffix}
        </h3>
        
        {/* Title */}
        <h4 className="text-sm md:text-base font-serif font-medium text-gray-300 tracking-wide">
          {item.title}
        </h4>
      </div>
    </div>
  );
}