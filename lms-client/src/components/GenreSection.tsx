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
        const formattedGenres = data.map((genre: any) => ({
          name: genre.name,
          image: genre.image,
          link: genre.link || `/books?category=${genre.name.toLowerCase()}`,
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
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            Discover Your Next Adventure
          </h2>
          <div className="w-24 h-1 bg-gray-200 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our handpicked genres and find the perfect book to spark your imagination.
          </p>
        </div>
        {error ? (
          <p className="text-red-500 text-center text-lg">Error: {error}</p>
        ) : (
          <div className="flex flex-row gap-8 overflow-x-auto pb-6 scrollbar-hide">
            {genres && genres.length > 0 ? (
              genres.map((genre: any) => (
                <Link href={genre.link} key={genre.name} className="block group flex-shrink-0">
                  <div className="w-56 h-72 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 border-gray-200">
                    <div className="h-44 overflow-hidden flex items-center justify-center bg-gray-100">
                      <img
                        src={genre.image || 'https://via.placeholder.com/300x200/CCCCCC/888888?text=Genre'}
                        alt={genre.name}
                        className="w-24 h-24 object-cover rounded-full shadow group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">{genre.name}</h3>
                      <span className="text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-700">
                        Browse Collection
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center w-full text-lg">
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