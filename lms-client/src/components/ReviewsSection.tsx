'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import { FaQuoteLeft } from 'react-icons/fa';

interface Review {
  id: number;
  name: string;
  image: string;
  rating: number;
  text: string;
  role: string;
}

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async() => {
    const {data} = await axiosInstance.get('/reviews');
    setReviews(data);
  }

  useEffect(() => {
    fetchReviews();
  }, [])

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1 justify-center mb-2">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            Our Readers Love Us
          </h2>
          <div className="w-24 h-1 bg-gray-200 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of book lovers who trust LibraryHub for their reading journey
          </p>
        </div>
        <div className="flex flex-row gap-8 overflow-x-auto pb-6 scrollbar-hide md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
          {reviews.map((review) => (
            <div key={review.id} className="relative flex-shrink-0 w-full max-w-md mx-auto md:mx-0">
              <Card className="rounded-3xl bg-white/80 backdrop-blur-md border border-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-visible px-2 pt-12 pb-8 flex flex-col items-center min-h-[400px] h-[400px]">
                {/* Floating Avatar */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
                  <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                    <AvatarImage src={`http://localhost:8000${review.image}`} alt={review.name} />
                    <AvatarFallback>{review.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="flex flex-col items-center mt-8 flex-1 w-full justify-between">
                  {renderStars(review.rating)}
                  <FaQuoteLeft className="text-3xl text-gray-200 mb-4" />
                  <p className="text-gray-700 text-lg text-center leading-relaxed font-medium italic mb-6 line-clamp-5 overflow-hidden">
                    {review.text}
                  </p>
                  <div className="flex flex-col items-center mt-auto">
                    <h3 className="font-semibold text-lg text-gray-800">{review.name}</h3>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ReviewsSection;