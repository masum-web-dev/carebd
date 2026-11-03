"use client";

import { useState } from "react";
import IntroSplash from "@/components/IntroSplash";
import Counter from "@/components/Counter";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import MarqueeText from "@/components/MarqueeText";
import Newsletter from "@/components/Newsletter";
import Testimonials from "@/components/Testimonials";
import UpcomingEvents from "@/components/Upcoming-events";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {/* 3 Seconds Intro Splash Screen */}
      {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}

      {/* Main Website Sections */}
      <Hero />
      <UpcomingEvents/>
      <Counter />
      <Features />
      <MarqueeText />
      <Testimonials />
      <Newsletter />
    </>
  );
}