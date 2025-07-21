// components/CallToAction.jsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-6">
            Unlock a Universe of Stories
          </h2>
          <div className="w-32 h-1 bg-gray-200 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join LibraryHub today and gain instant access to an endless collection of books, all at your fingertips.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/register" passHref>
            <Button
              size="lg"
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold 
                        px-12 py-6 text-lg rounded-lg shadow-lg transition-all duration-300 
                        transform hover:-translate-y-1 hover:shadow-gray-200/50"
            >
              Get Started for Free
            </Button>
          </Link>
          <Link href="/books" passHref>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-400 bg-white text-gray-800 
                       hover:bg-gray-100 hover:border-gray-600 hover:text-gray-900 
                       font-semibold px-12 py-6 text-lg rounded-lg transition-all duration-300 
                       transform hover:-translate-y-1 hover:shadow-lg"
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