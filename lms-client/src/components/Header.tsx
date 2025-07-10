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
    <header className="w-full flex justify-between bg-orange-500 h-25 backdrop-blur-md border-b border-gray-300 sticky top-0 z-50 shadow-lg">
       
        <div className="flex ml-5 items-center"> 
          <img src='/assests/logo.png' alt="LibraryHub Logo" className="h-20   w-auto object-contain" /> 
        </div>

        <h1 className="text-xl pt-2 font-extrabold text-white tracking-wide hidden md:block">Welcome to your digital library</h1>

        <div className="flex items-center space-x-4 right-5">
          <Button
            onClick={() => handleSignInClick()}
            asChild
            variant="outline"
            className="border-yellow-300 text-black  hover:bg-yellow-500 hover:text-black hover:border-yellow-600 transition-all duration-300 font-semibold rounded-full px-6 py-2"
          >
            <span>Sign In</span>
          </Button>
          <Link href='/register'>
            <Button className="bg-yellow-500 text-black font-semibold rounded-full px-6 py-2 shadow-md hover:bg-yellow-600 hover:shadow-lg transition-all duration-300">
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

      {isMenuOpen && (
        <div className="md:hidden bg-gray-200/90 border-t border-gray-300">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            {["Home", "Books", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white font-medium hover:text-yellow-300 transition-colors duration-300"
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