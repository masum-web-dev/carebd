"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function Testimonials() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const testimonials = [
    {
      name: "Rahim Ahmed",
      role: "Local Volunteer Lead",
      quote: "CareBD made it so easy to organize our winter clothing drive. Seeing the smiles on children's faces when receiving warm clothes was truly priceless!",
      rating: 5,
    },
    {
      name: "Nazma Akter",
      role: "Community Donor",
      quote: "I had so many pre-loved winter jackets and clothes sitting idle. Through CareBD, I found a verified local drive just down my street. Amazing initiative!",
      rating: 5,
    },
    {
      name: "Tanvir Hasan",
      role: "Charity Event Organizer",
      quote: "The platform's seamless participation and creator controls helped us coordinate our flood relief clothing distribution efficiently. Highly recommended!",
      rating: 5,
    },
    {
      name: "Dr. Farhana Yasmin",
      role: "Social Activist",
      quote: "A game-changer for community welfare in Bangladesh! Connecting donors directly with active campaigns saves time and maximizes genuine impact.",
      rating: 5,
    },
  ];

  const handleSlideChange = (newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setTimeout(() => {
      setIsAnimating(false);
    }, 400); // matches transition duration
  };

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    handleSlideChange(newIndex);
  };

  const nextSlide = () => {
    const newIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
    handleSlideChange(newIndex);
  };

  if (!mounted) {
    return <section className="w-full bg-[#030215] py-24 px-4 min-h-[500px]" />;
  }

  return (
    <section className="w-full bg-[#030215] py-24 px-4 text-white select-none overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Top Header & Navigation Buttons */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-[#79dce8] tracking-widest text-sm uppercase mb-3 font-mono">
              // TESTIMONIALS //
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight">
              What the world <br />
              has to <span className="text-[#af136a]">say!</span>
            </h2>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              aria-label="Previous Testimonial"
              className="w-12 h-12 rounded-full bg-[#554bb9] hover:bg-[#af136a] flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Testimonial"
              className="w-12 h-12 rounded-full bg-[#554bb9] hover:bg-[#af136a] flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Circular Cards Slider Container with Smooth Transition */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 transform ${
            isAnimating ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          {[0, 1, 2].map((offset) => {
            const itemIndex = (currentIndex + offset) % testimonials.length;
            const item = testimonials[itemIndex];

            return (
              <div
                key={itemIndex}
                className="relative w-full aspect-square rounded-full border border-dashed border-[#554bb9]/50 bg-[#070b19]/40 backdrop-blur-sm p-10 flex flex-col items-center justify-center text-center transition-all duration-500 hover:border-[#af136a] group shadow-xl"
              >
                {/* Author Name & Role */}
                <span className="text-gray-300 font-semibold text-sm sm:text-base mb-2">
                  — {item.name}, {item.role}
                </span>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>

                {/* Quote Title */}
                <h4 className="text-lg sm:text-xl font-serif font-bold text-white mb-2">
                  "{item.role === 'Local Volunteer Lead' ? 'Frictionless Experience!' : item.role === 'Community Donor' ? 'Sharing Made Easy!' : 'Incredible Impact!'}"
                </h4>

                {/* Quote Description */}
                <p className="text-gray-400 text-xs sm:text-sm max-w-[260px] leading-relaxed">
                  "{item.quote}"
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}