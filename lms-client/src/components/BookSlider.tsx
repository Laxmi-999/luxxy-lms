'use client';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BookSlider = () => {
  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"
    },
    {
      id: 6,
      title: "Lord of the Flies",
      author: "William Golding",
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop"
    }
  ];

  // Duplicate books for infinite sliding
  const duplicatedBooks = [...books, ...books, ...books]; // Triple for smoother infinite effect
  const [currentIndex, setCurrentIndex] = useState(books.length); // Start in middle for infinite scroll
  const visibleBooks = 4; // Number of books visible at once
  const [isTransitioning, setIsTransitioning] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Handle infinite scroll reset
    if (currentIndex >= duplicatedBooks.length - visibleBooks) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(books.length); // Reset to original set
      }, 500); // Match transition duration
    } else if (currentIndex < books.length - visibleBooks) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(books.length * 2 - visibleBooks); // Reset to end of second set
      }, 500);
    } else {
      setIsTransitioning(true);
    }
  }, [currentIndex]);

  return (
    <section className="py-24 w-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center text-orange-900 mb-4 tracking-tight">
          Featured Books
        </h2>
        <p className="text-xl text-center text-orange-700/80 mb-12 max-w-2xl mx-auto">
          Dive into our handpicked selection of must-read classics
        </p>

        <div className="relative w-full overflow-hidden">
          <div
            className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
            style={{ transform: `translateX(-${(currentIndex * 100) / visibleBooks}%)` }}
          >
            {duplicatedBooks.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                className="flex-shrink-0 w-1/4 px-2 group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-105 bg-white/80 backdrop-blur-sm">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-96 object-cover rounded-t-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-6 left-6 right-6 text-amber-100">
                      <h3 className="font-bold text-xl mb-2">{book.title}</h3>
                      <p className="text-sm opacity-90">{book.author}</p>
                      <Button
                        variant="outline"
                        className="mt-4 border-amber-300 text-amber-100 hover:bg-amber-300 hover:text-orange-900 font-semibold rounded-full px-6"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-orange-600/80 text-white p-3 rounded-full hover:bg-orange-700 transition-all duration-300 z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-orange-600/80 text-white p-3 rounded-full hover:bg-orange-700 transition-all duration-300 z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {books.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(books.length + index)} // Map to middle set
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex % books.length === index ? 'bg-orange-600 scale-125' : 'bg-amber-300/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookSlider;