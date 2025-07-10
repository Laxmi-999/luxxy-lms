// components/HeroSectionUnique.jsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";
import Link from 'next/link'; // Assuming Next.js for Link component

const HeroSectionUnique = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center bg-black/80 overflow-hidden py-16 px-4 md:px-8">
      {/* Abstract Background Element (Right Side) - Placeholder for a unique visual */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('/path/to/abstract-knowledge-pattern.svg')] bg-cover bg-no-repeat opacity-20 transform scale-125 origin-right pointer-events-none z-10"></div>
      {/* If no SVG, a simple shape or subtle texture can be used: */}
      {/* <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#D69E2E]/10 transform skew-x-12 origin-top-right z-10"></div> */}

      {/* Main Content */}
      <div className="container mx-auto relative z-20 flex flex-col md:flex-row items-center justify-between">
        {/* Left Content Area: Text and Buttons */}
        <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0 pr-0 md:pr-16">
          <div className="flex items-center justify-center md:justify-start mb-6">
            <BookOpen className="h-12 w-12 text-[#D69E2E] mr-4" /> {/* Muted Gold Accent */}
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#F8F9FA] leading-tight tracking-tight drop-shadow">
              Your Next Great Read Awaits
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-[#D1D5DB] mb-8 max-w-lg leading-relaxed font-light drop-shadow">
            Discover, borrow, and immerse yourself in an endless collection of digital books and resources. Your literary journey, simplified.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/books" passHref>
              <Button
                size="lg"
                className="bg-[#D69E2E] hover:bg-[#2C5282] text-[#FFFFFF] font-bold px-10 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Search className="h-5 w-5 mr-3" />
                Explore Books
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button
                size="lg"
                variant="outline"
                className=" text-[#F8F9FA] bg-[#F8F9FA]/10 border-[#D69E2E] text-[#D69E2E] font-bold px-10 py-6 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Join LibraryHub
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Content Area: Unique Visual Element */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center relative pr-0 md:pr-4">
          {/* Main Visual: A beautifully styled abstract representation of knowledge flow or interconnected books */}
          {/* Replace this with a high-quality, custom-designed SVG or image. */}
                    <img src  = 'https://static.toiimg.com/thumb/imgsize-453196,msid-67214970/67214970.jpg?width=500&resizemode=4' />
          </div>
        </div>
    </section>
  );
};

export default HeroSectionUnique;