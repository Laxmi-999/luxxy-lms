'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setGenre } from '@/Redux/slices/genreSlice';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';

const GenreSection = () => {
  const dispatch = useDispatch();
  const genres = useSelector((state: any) => state.genre.genres);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const { data } = await axiosInstance.get('/genre');
        // Format API data to include links and background color
        const formattedGenres = data.map((genre: any) => ({
          name: genre.name,
          image: genre.image,
          link: genre.link || `/books?category=${genre.name.toLowerCase()}`,
          bgColor: `bg-orange-${Math.floor(Math.random() * 4 + 5)}00`, // Dynamic orange shades (500-800)
        }));
        dispatch(setGenre(formattedGenres));
      } catch (err) {
        setError('Failed to fetch genres');
        toast.error('Failed to fetch genres', { position: 'top-center' });
      }
    };

    fetchGenre();
  }, [dispatch]);

  return (
    <section className="py-24 bg-gradient-to-b from-black/80 to-black/60 mt-12 mb-24">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-extrabold text-center text-white mb-8 tracking-tight">
          Discover Your Next Adventure
        </h2>
        <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto font-light">
          Explore our handpicked genres and find the perfect book to spark your imagination.
        </p>

        {error ? (
          <p className="text-red-400 text-center text-lg">Error: {error}</p>
        ) : (
          <div className="flex flex-row gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {genres && genres.length > 0 ? (
              genres.map((genre: any) => (
                <Link href={genre.link} key={genre.name} className="block group flex-shrink-0">
                  <div
                    className={`w-48 h-64 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 text-center border border-yellow-500/50 ${genre.bgColor} bg-opacity-90 flex flex-col justify-center items-center`}
                  >
                    <img
                      src={genre.image}
                      alt={genre.name}
                      className="h-20 w-20 object-cover rounded-full mx-auto mb-6 transition-transform duration-300 group-hover:scale-110"
                    />
                    <h3 className="text-xl font-bold text-white mb-3">{genre.name}</h3>
                    <span className="text-gray-200 text-sm font-medium group-hover:text-yellow-300 transition-colors">
                      Browse Books
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-300 text-center w-full text-lg">
                No genres available at the moment.
              </p>
            )}
          </div>
        )}
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

export default GenreSection;