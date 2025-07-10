import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "LibraryHub has completely transformed how I discover and manage my reading list. The interface is intuitive and the book recommendations are spot-on!",
      role: "Book Enthusiast"
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "As a librarian, I appreciate the robust management features. The system makes cataloging and tracking books effortless. Highly recommended!",
      role: "Professional Librarian"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The user experience is fantastic! I love how easy it is to search for books and manage my reading progress. This platform is a game-changer.",
      role: "Student"
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${i < rating ? 'text-[#D69E2E]' : 'text-[#F6AD55]/50'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="py-24 mb-1 bg-black/80">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center text-white mb-4 tracking-tight">
          Our Readers Love Us
        </h2>
        <p className="text-xl text-center text-white mb-16 max-w-2xl mx-auto">
          Join thousands of book lovers who trust LibraryHub for their reading journey
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="bg-[#FFFFFF]/80 backdrop-blur-sm border-[#D1D5DB] shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Avatar className="h-14 w-14 mr-4 ring-2 ring-[#D69E2E]">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-[#1F2937]">{review.name}</h3>
                    <p className="text-sm text-[#374151]">{review.role}</p>
                  </div>
                </div>

                {renderStars(review.rating)}

                <p className="text-[#374151] mt-4 leading-relaxed font-medium">
                  "{review.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;