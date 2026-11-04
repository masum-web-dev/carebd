"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Compass, PlusCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Hero() {
  // Better Auth সেশন হুক
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const ORDER = ['earth', 'venus', 'mars'];
    let currentFeatured = 'earth';

    const skyEl = document.querySelector('.sky');
    const slotLBtn = document.querySelector('.planet-l');
    const slotRBtn = document.querySelector('.planet-r');

    function warm(planetKey){
      const video = skyEl?.querySelector(`video[data-planet="${planetKey}"]`);
      if(video && !video.getAttribute('src') && video.dataset.src){
        video.setAttribute('preload', 'auto');
        video.setAttribute('src', video.dataset.src);
        video.load();
      }
    }

    function show(nextKey){
      if(nextKey === currentFeatured) return;
      currentFeatured = nextKey;

      const videos = skyEl?.querySelectorAll('video');
      videos?.forEach(v => {
        if(v.dataset.planet === nextKey){
          if(!v.getAttribute('src') && v.dataset.src){
            v.setAttribute('src', v.dataset.src);
            v.load();
          }
          v.classList.add('opacity-100', 'z-10');
          v.classList.remove('opacity-0', 'z-0');
          v.play().catch(()=>{});
        } else {
          v.classList.remove('opacity-100', 'z-10');
          v.classList.add('opacity-0', 'z-0');
          v.pause();
        }
      });

      const activeVideo = skyEl?.querySelector(`video[data-planet="${nextKey}"]`);
      if(activeVideo && activeVideo.poster && skyEl){
        skyEl.style.backgroundImage = `url(${activeVideo.poster})`;
      }

      const rest = ORDER.filter(k => k !== nextKey);
      const leftKey = rest[0];
      const rightKey = rest[1];

      if(slotLBtn){
        slotLBtn.dataset.planet = leftKey;
        slotLBtn.querySelectorAll('img').forEach(img => {
          if(img.dataset.planet === leftKey) img.classList.remove('hidden');
          else img.classList.add('hidden');
        });
      }

      if(slotRBtn){
        slotRBtn.dataset.planet = rightKey;
        slotRBtn.querySelectorAll('img').forEach(img => {
          if(img.dataset.planet === rightKey) img.classList.remove('hidden');
          else img.classList.add('hidden');
        });
      }

      warm(leftKey);
      warm(rightKey);
    }

    const buttons = [slotLBtn, slotRBtn].filter(Boolean);
    const handlers = [];

    buttons.forEach(btn => {
      const clickHandler = () => show(btn.dataset.planet);
      btn.addEventListener('click', clickHandler);
      handlers.push({ btn, event: 'click', handler: clickHandler });

      ['pointerenter', 'focus'].forEach(evt => {
        const intentHandler = () => warm(btn.dataset.planet);
        btn.addEventListener(evt, intentHandler, {once: true});
      });
    });

    show('earth');

    const idleCallback = window.requestIdleCallback || function(cb){ setTimeout(cb, 2500); };
    idleCallback(() => {
      ORDER.forEach(k => warm(k));
    }, {timeout: 4000});

    return () => {
      handlers.forEach(({ btn, event, handler }) => {
        btn.removeEventListener(event, handler);
      });
    };
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-[#04101f] select-none">
      <div className="absolute inset-0 overflow-hidden isolate">
        {/* Sky / Video Background */}
        <div 
          className="sky absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_508c64b8-a31e-4290-bdfc-1187df70e0a6.png)` }}
        >
          <video data-planet="earth" className="absolute inset-0 w-full h-full object-cover opacity-100 z-10 transition-opacity duration-300" autoPlay muted loop playsInline preload="auto" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_3ffb4889-c520-432d-8458-038009eb40df.mp4" poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_508c64b8-a31e-4290-bdfc-1187df70e0a6.png" aria-hidden="true"></video>
          <video data-planet="venus" className="absolute inset-0 w-full h-full object-cover opacity-0 z-0 transition-opacity duration-300" muted loop playsInline preload="none" data-src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_b211cd74-013b-4dd3-bfd0-64491d8696fa.mp4" poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_cf55d1d8-7b59-4a64-80da-d72052ae974e.png" aria-hidden="true"></video>
          <video data-planet="mars" className="absolute inset-0 w-full h-full object-cover opacity-0 z-0 transition-opacity duration-300" muted loop playsInline preload="none" data-src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_51eae59a-2459-4c84-907c-cc5edfe5fea7.mp4" poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_0ba6de7c-285d-43dc-b7ab-8c54c73707cb.png" aria-hidden="true"></video>
        </div>

        {/* Center Content Box */}
        <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center text-center px-4 w-full max-w-5xl pointer-events-none">
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 pointer-events-auto leading-tight">
            <span className="text-white">One Pre-Loved Garment,</span> <br />
            <span className="text-[#af136a]">Someone's New Hope</span>
          </h1>
          <p className="font-sans text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl mb-8 pointer-events-auto leading-relaxed">
            Bring warmth and smiles to those in need by sharing your gently used clothes. Join or create events on CareBD to make a meaningful difference today.
          </p>
          
          {/* টার্নারি অপারেটর ব্যবহার করে লগইন চেক করা হয়েছে */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
            <Link
              href={session ? "/events" : "/register"}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#554bb9] to-[#af136a] text-white font-sans font-medium text-base shadow-lg hover:opacity-90 transition transform hover:scale-105"
            >
              <Compass size={20} />
              Explore Upcoming Events
            </Link>
            <Link
              href={session ? "/create-event" : "/register"}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-sans font-medium text-base backdrop-blur-md transition transform hover:scale-105"
            >
              <PlusCircle size={20} />
              Create An Event
            </Link>
          </div>
        </div>

        {/* Left Side Planet Slot */}
        <button className="planet-l absolute z-30 p-0 border-0 bg-transparent cursor-pointer pointer-events-auto w-[140px] h-[140px] left-[-30px] top-[40%] -translate-y-1/2 transition-transform duration-300 hover:scale-105 active:scale-95" type="button" data-planet="venus" aria-label="Switch Planet">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-planet="earth" alt="" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202005_3346cc4d-ec3b-44ab-825c-b18e49f5021a.png" className="w-full h-auto hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-planet="venus" alt="" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202012_640b239a-d08a-4200-adb2-741bbe129ac8.png" className="w-full h-auto block" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-planet="mars" alt="" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202018_3d559490-f613-4ed7-a3bb-3b7e9fc90fb8.png" className="w-full h-auto hidden" />
        </button>

        {/* Right Side Planet Slot */}
        <button className="planet-r absolute z-30 p-0 border-0 bg-transparent cursor-pointer pointer-events-auto w-[140px] h-[140px] right-[-30px] top-[40%] -translate-y-1/2 transition-transform duration-300 hover:scale-105 active:scale-95" type="button" data-planet="mars" aria-label="Switch Planet">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-planet="earth" alt="" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202005_3346cc4d-ec3b-44ab-825c-b18e49f5021a.png" className="w-full h-auto hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-planet="venus" alt="" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202012_640b239a-d08a-4200-adb2-741bbe129ac8.png" className="w-full h-auto hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-planet="mars" alt="" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202018_3d559490-f613-4ed7-a3bb-3b7e9fc90fb8.png" className="w-full h-auto block" />
        </button>
      </div>
    </div>
  );
}