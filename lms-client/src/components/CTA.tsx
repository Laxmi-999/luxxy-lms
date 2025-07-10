// components/CallToAction.jsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-20 bg-black/80"> {/* Off-White/Light Gray background */}
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Unlock a Universe of Stories
        </h2>
        <p className="text-xl text-white mb-10 max-w-3xl mx-auto">
          Join LibraryHub today and gain instant access to an endless collection of books, all at your fingertips.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register" passHref>
            <Button
              size="lg"
              className="bg-orange-400  hover:bg-[#D69E2E] text-white font-bold px-10 py-6 text-xl rounded-full shadow-lg transition-all duration-300"
            >
              Get Started for Free
            </Button>
          </Link>
          <Link href="/books" passHref>
            <Button
              size="lg"
              variant="outline"
              className="border-[#D69E2E] text-[#D69E2E] hover:bg-[#374151]/10 hover:text-[#2C5282] font-bold px-10 py-6 text-xl rounded-full transition-all duration-300"
            >
              Browse All Books
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;