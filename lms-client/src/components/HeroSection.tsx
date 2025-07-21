import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";
import Link from 'next/link';

// --- Typewriter Effect Hook ---
const headlineList = [
  "Your Next Great Read Awaits",
  "Discover, Borrow, Immerse",
  "Explore 10,000+ Books Instantly"
];

function useTypewriter(words: string[], speed = 80, pause = 1200) {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (index >= words.length) setIndex(0);
    if (!deleting && subIndex === words[index].length) {
      setTimeout(() => setDeleting(true), pause);
      return;
    }
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
      setDisplayed(words[index].slice(0, subIndex + (deleting ? -1 : 1)));
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, words, speed, pause]);

  return {displayed, index};
}

// --- CountUp Animation Hook ---
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(target / (duration / 16));
    const step = () => {
      start += increment;
      if (start < target) {
        setCount(start);
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    step();
  }, [target, duration]);
  return count;
}

const HeroSection = () => {
  const {displayed: headline, index: headlineIndex} = useTypewriter(headlineList);
  const booksCount = useCountUp(10000);

  // Helper to render right-side content based on headlineIndex
  function renderRightContent() {
    if (headlineIndex === 0) {
      // Logo with matching green background (same as books circle, soft opacity)
      return (
        <div className="flex items-center justify-center bg-[#22C55E]/20 p-8 md:p-12 rounded-xl shadow-lg">
          <img
            src="/assests/logo.png"
            alt="LibraryHub Logo"
            className="max-w-xs md:max-w-md lg:max-w-lg h-auto"
            style={{ display: 'block' }}
          />
        </div>
      );
    } else if (headlineIndex === 1) {
      // Relevant content for "Discover, Borrow, Immerse"
      return (
        <div className="flex flex-col items-center animate-fade-in">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="60" width="160" height="80" rx="24" fill="#D69E2E" fillOpacity="0.18" />
            <rect x="50" y="90" width="100" height="40" rx="16" fill="#22C55E" fillOpacity="0.18" />
            <rect x="80" y="120" width="40" height="20" rx="10" fill="#F8F9FA" fillOpacity="0.18" />
          </svg>
          <span className="mt-6 text-2xl md:text-3xl text-[#D1D5DB] font-semibold">Discover, Borrow, Immerse</span>
          <span className="text-lg md:text-xl text-[#F8F9FA]/80">Find your next favorite book and dive in!</span>
        </div>
      );
    } else if (headlineIndex === 2) {
      // Celebratory/stat visual for "Explore 10,000+ Books Instantly"
      return (
        <div className="flex flex-col items-center animate-fade-in">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" fill="#22C55E" fillOpacity="0.13" />
            <text x="100" y="120" textAnchor="middle" fontSize="56" fill="#D69E2E" fontWeight="bold">10k+</text>
            <text x="100" y="150" textAnchor="middle" fontSize="24" fill="#F8F9FA">Books</text>
          </svg>
          <span className="mt-6 text-2xl md:text-3xl text-[#D1D5DB] font-semibold">10,000+ Books</span>
          <span className="text-lg md:text-xl text-[#F8F9FA]/80">Instant access, endless possibilities!</span>
        </div>
      );
    }
    return null;
  }

  return (
    <section className="relative w-full min-h-[90vh] bg-black/80 flex items-center overflow-hidden py-16 px-4 md:px-8" 
    // style={{
    //   background: 'linear-gradient(120deg, #232526 0%, #414345 100%)',
    // }}
    >
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 z-0 animate-gradient-move  opacity-90" />

      {/* Main Content: switched sides */}
      <div className="container mx-auto relative z-20 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20">
        {/* Left: Dynamic Visual Content */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start items-center relative pl-0 md:pl-4 mt-10 md:mt-0 z-10">
          {renderRightContent()}
        </div>
        {/* Right: Headline, badges, description */}
        <div className="w-full md:w-2/3 lg:w-1/2 text-center md:text-left mb-12 md:mb-0 pl-0 md:pl-16">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <BookOpen className="h-12 w-12 text-[#D69E2E] animate-bounce-slow" />
            <div style={{ minHeight: '72px', display: 'flex', alignItems: 'center' }} className="relative w-full">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#F8F9FA] leading-tight tracking-tight drop-shadow min-h-[56px] w-full transition-all duration-300 animate-stagger-fadein-1">
                {headline}
                <span className="text-[#22C55E]">|</span>
              </h1>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-[#D1D5DB] mb-2 max-w-lg leading-relaxed font-light drop-shadow animate-stagger-fadein-2">
            Discover, borrow, and immerse yourself in an endless collection of digital books and resources. Your literary journey, simplified.
          </p>
          {/* Animated Stat Badge */}
          <div className="flex items-center gap-3 mb-2 animate-stagger-fadein-3">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#D69E2E]/90 text-[#232526] font-bold text-lg shadow animate-pulse">
              {booksCount.toLocaleString()}+ Books Available
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#22C55E]/80 text-white font-semibold text-base animate-fade-in">
              Trusted by 5,000+ readers
            </span>
          </div>
        </div>
      </div>
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 7s ease-in-out infinite;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-10deg); }
          40% { transform: rotate(10deg); }
          60% { transform: rotate(-6deg); }
          80% { transform: rotate(6deg); }
        }
        .group-hover\:animate-wiggle:hover .group-hover\:animate-wiggle {
          animation: wiggle 0.6s;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1.2s;
        }
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        /* Staggered Entrance Animations */
        @keyframes stagger-fadein {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-stagger-fadein-1 {
          animation: stagger-fadein 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s both;
        }
        .animate-stagger-fadein-2 {
          animation: stagger-fadein 1.2s cubic-bezier(0.4,0,0.2,1) 0.8s both;
        }
        .animate-stagger-fadein-3 {
          animation: stagger-fadein 1.2s cubic-bezier(0.4,0,0.2,1) 1.3s both;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;