'use client';
import { Button } from "@/components/ui/button";
import { BookOpen, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleSignInClick = () => {
    if (isLoggedIn) {
      if (userInfo.role === 'admin') {
        toast.success('You are already logged In', {
          position: "top-center"
        });
        router.push('/admin/dashboard');
      } else if (userInfo.role === 'librarian') {
        toast.success('You are already logged In', {
          position: "top-center"
        });        
        router.push('/librarian/dashboard');
      } else if (userInfo.role === 'member') {
        toast.success('You are already logged In', {
          position: "top-center"
        });        
        router.push('/member');
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 backdrop-blur-md border-b border-blue-500/30 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BookOpen className="h-10 w-10 text-white animate-pulse" />
          <span className="text-3xl font-extrabold text-white tracking-wide">LibraryHub</span>
        </div>

        {/* <nav className="hidden md:flex items-center space-x-8">
          {["Home", "Books", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-white font-semibold hover:text-blue-200 transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-200 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav> */}
        <h1 className="text-xl font-extrabold text-white tracking-wide">Welcome to you digital library</h1>

        <div className="flex items-center space-x-4">
          <Button
            onClick={() => handleSignInClick()}
            asChild
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-700 hover:border-blue-500 transition-all duration-300 font-semibold rounded-full px-6 py-2"
          >
            <span>Sign In</span>
          </Button>
          <Link href='/register'>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300">
              Register
            </Button>
          </Link>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-8 w-8" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-blue-700/90 border-t border-blue-500">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            {["Home", "Books", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white font-medium hover:text-blue-200 transition-colors duration-300"
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