'use client';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBooks } from "@/Redux/slices/bookSlice";

const BookSlider = () => {
  const { books } = useSelector((state) => state.books); // Fetch books from Redux state
  const duplicatedBooks = books ? [...books, ...books, ...books] : []; // Duplicate for infinite sliding
  const [currentIndex, setCurrentIndex] = useState(books ? books.length : 0); // Start in middle for infinite scroll
  const visibleBooks = 4; // Number of books visible at once
  const [isTransitioning, setIsTransitioning] = useState(true);

  const dispatch = useDispatch();

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    dispatch(fetchAllBooks());
    const interval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(interval);
  }, [books]);

  useEffect(() => {
    // Handle infinite scroll reset
    if (currentIndex >= duplicatedBooks.length - visibleBooks) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(books ? books.length : 0); // Reset to original set
      }, 500); // Match transition duration
    } else if (currentIndex < books.length - visibleBooks) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(books ? books.length * 2 - visibleBooks : 0); // Reset to end of second set
      }, 500);
    } else {
      setIsTransitioning(true);
    }
  }, [currentIndex, books]);

  const styles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-fade-in { animation: fadeIn 1s ease-out; }
    .animate-slide-in { animation: slideIn 1s ease-out; }
    .animate-pulse { animation: pulse 2s infinite; }
    .animate-spin-slow { animation: spinSlow 4s linear infinite; }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  if (!books || books.length === 0) {
    return <div className="text-center py-24 text-gray-500">No books available.</div>;
  }

  return (
    <section className="py-24 w-full bg-gradient-to-br from-blue-900/10 via-blue-800/5 to-blue-700/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'20\'/%3E%3C/g%3E%3C/svg%3E')]"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-6 tracking-wide animate-slide-in">
          Featured Masterpieces
        </h2>
        <p className="text-lg md:text-xl text-center text-blue-100/80 mb-12 max-w-3xl mx-auto animate-fade-in">
          Discover a curated collection of literary treasures that inspire and captivate.
        </p>

        <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl bg-white/90 backdrop-blur-md border border-blue-200/30">
          <div
            className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{ transform: `translateX(-${(currentIndex * 100) / visibleBooks}%)` }}
          >
            {duplicatedBooks.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                className="flex-shrink-0 w-1/4 px-3 group cursor-pointer"
              >
                <div className="relative h-96 overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-4 bg-gradient-to-br from-blue-50 to-blue-100/50">
                  <img
                    src={book.coverImage || 'https://via.placeholder.com/300x400'}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-2xl transition-opacity duration-300 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <div className="text-white">
                      <h3 className="font-bold text-2xl mb-2 line-clamp-1 animate-fade-in">{book.title}</h3>
                      <p className="text-lg font-medium text-blue-100 animate-slide-in">{book.author}</p>
                      <Button
                        variant="outline"
                        className="mt-4 border-blue-300 text-white hover:bg-blue-600 hover:border-blue-400 font-semibold rounded-full px-6 py-2 transition-all duration-300 animate-pulse"
                      >
                        Explore
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-600/80 text-white p-4 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg animate-pulse"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600/80 text-white p-4 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg animate-pulse"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-3 animate-fade-in">
          {books.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(books.length + index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex % books.length === index ? 'bg-blue-600 scale-125' : 'bg-blue-300/50'
              } hover:bg-blue-500`}
            />
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-spin-slow"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-xl animate-spin-slow delay-1000"></div>
    </section>
  );
};

export default BookSlider;