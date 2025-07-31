import React from 'react';
import { BookOpen } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] bg-black/80 flex items-center overflow-hidden py-16 px-4 md:px-8">
      {/* Main Content */}
      <div className="container mx-auto relative z-20 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20">
        {/* Left: Logo Content */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start items-center relative pl-0 md:pl-4 mt-10 md:mt-0 z-10">
          <div className="flex items-center justify-center bg-[#22C55E]/20 p-8 md:p-12 rounded-xl shadow-lg">
            <img
              src="/assests/logo.png"
              alt="LibraryHub Logo"
              className="max-w-xs md:max-w-md lg:max-w-lg h-auto"
              style={{ display: 'block' }}
            />
          </div>
        </div>
        {/* Right: Static Text Content */}
        <div className="w-full md:w-2/3 lg:w-1/2 text-center md:text-left mb-12 md:mb-0 pl-0 md:pl-16">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <BookOpen className="h-12 w-12 text-[#D69E2E]" />
            <div style={{ minHeight: '72px', display: 'flex', alignItems: 'center' }} className="relative w-full">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#F8F9FA] leading-tight tracking-tight drop-shadow min-h-[56px] w-full">
                Your Next Great Read Awaits
                <span className="text-[#22C55E]">|</span>
              </h1>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-[#D1D5DB] mb-2 max-w-lg leading-relaxed font-light drop-shadow">
            Discover, borrow, and immerse yourself in an endless collection of digital books and resources. Your literary journey, simplified.
          </p>
          {/* Static Stat Badge */}
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#D69E2E]/90 text-[#232526] font-bold text-lg shadow">
              10,000+ Books Available
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#22C55E]/80 text-white font-semibold text-base">
              Trusted by 5,000+ readers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;