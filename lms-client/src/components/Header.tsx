'use client';
import { Button } from "@/components/ui/button";
import { BookOpen, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gradient-to-r from-amber-50 to-orange-100 backdrop-blur-lg border-b border-amber-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-9 w-9 text-orange-600 animate-pulse" />
          <span className="text-2xl font-extrabold text-orange-800 tracking-tight">LibraryHub</span>
        </div>

        {/* <nav className="hidden md:flex items-center space-x-10">
          {["Home", "Books", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-orange-700 font-medium hover:text-orange-600 transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav> */}

        <div className="flex items-center space-x-4">
        <Link href="/Login" >
            <Button
                asChild
                variant="outline"
                className="border-orange-400 cursor-pointer text-orange-700 hover:bg-orange-100/50 hover:text-orange-800 transition-all duration-300 font-semibold rounded-full px-6"
            >
                <span>Sign In</span>
            </Button>
        </Link>
        <Link href='/Register'>
            <Button className="bg-orange-600 cursor-pointer hover:bg-orange-700 text-white font-semibold rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300">
                Register
            </Button>
          </Link>
          <button
            className="md:hidden text-orange-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-amber-50 border-t border-amber-200">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {["Home", "Books", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-orange-700 font-medium hover:text-orange-600 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;