import Link from 'next/link';
import { BookText, Globe, Lightbulb, Heart, Atom, Landmark } from 'lucide-react';

const categories = [
  { name: "Fiction", icon: BookText, link: "/books?category=fiction", bgColor: "bg-orange-800" },
  { name: "Non-Fiction", icon: Lightbulb, link: "/books?category=non-fiction", bgColor: "bg-orange-700" },
  { name: "Science Fiction", icon: Atom, link: "/books?category=science-fiction", bgColor: "bg-orange-500" },
  { name: "Fantasy", icon: Globe, link: "/books?category=fantasy", bgColor: "bg-orange-500" },
  { name: "Romance", icon: Heart, link: "/books?category=romance", bgColor: "bg-orange-700" },
  { name: "History", icon: Landmark, link: "/books?category=history", bgColor: "bg-orange-800" },
];

const GenreSection = () => {
  return (
    <section className="py-20 bg-black/70 mt-10 mb-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center text-white mb-6">Explore Our Vast Collection</h2>
        <p className="text-xl text-center text-gray-200 mb-12 max-w-2xl mx-auto">
          Dive into diverse worlds and discover your next favorite read from our carefully curated categories.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link href={category.link} key={category.name} className="block">
              <div className={`${category.bgColor} p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center border border-yellow-400`}>
                <category.icon className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
                <span className="text-gray-200 text-sm">Browse Books</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreSection;