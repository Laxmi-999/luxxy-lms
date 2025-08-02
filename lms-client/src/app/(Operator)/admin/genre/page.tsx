'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Assuming these are available from your shadcn/ui setup
// You might need to adjust imports based on your actual project structure
// For this standalone example, we'll define simple versions of them.
const Button = ({ children, onClick, className, disabled, type, variant }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={disabled}
  >
    {children}
  </button>
);

const Card = ({ children, className }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-zinc-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`p-6 border-b border-zinc-200 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`text-3xl font-bold text-[#ff6900] ${className}`}>
    {children}
  </h2>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Input = ({ type, placeholder, value, onChange, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full p-3 rounded-lg bg-white text-zinc-900 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#ff6900] transition-all duration-200 ${className}`}
  />
);

// Mocking axiosInstance and setGenre for standalone demonstration
// In your actual project, keep your original imports.
const axiosInstance = {
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    if (url === '/genre') {
      return {
        data: [
          // Updated mock image URLs to use a light blue background
          { _id: '1', name: 'Fiction', image: 'https://placehold.co/192x192/ADD8E6/000000?text=Fiction' },
          { _id: '2', name: 'Mystery', image: 'https://placehold.co/192x192/ADD8E6/000000?text=Mystery' },
          { _id: '3', name: 'Science Fiction', image: 'https://placehold.co/192x192/ADD8E6/000000?text=Sci-Fi' },
          { _id: '4', name: 'Fantasy', image: 'https://placehold.co/192x192/ADD8E6/000000?text=Fantasy' },
          { _id: '5', name: 'Thriller', image: '' }, // No image example, will use onError fallback
        ]
      };
    }
    return { data: [] };
  },
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    console.log('Adding genre:', data);
    return { data: { _id: Date.now().toString(), ...data } };
  },
  delete: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    console.log('Deleting genre:', url);
    return { data: {} };
  }
};

const setGenre = (data) => ({ type: 'SET_GENRE', payload: data }); // Mock action

const Genre = () => {
  const [genreName, setGenreName] = useState('');
  const [genreImageUrl, setGenreImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [editingGenre, setEditingGenre] = useState(null); // State for genre being edited

  const dispatch = useDispatch();

  const fetchGenre = async () => {
    try {
      const { data } = await axiosInstance.get('/genre');
      dispatch(setGenre(data));
      setGenres(data);
    } catch (err) {
      setError('Failed to fetch genres');
      toast.error('Failed to fetch genres', { position: 'top-center' });
    }
  };

  useEffect(() => {
    fetchGenre();
  }, []);

  const handleAddOrUpdateGenre = async (e) => {
    e.preventDefault();
    if (!genreName.trim()) {
      setError('Genre name is required');
      toast.error('Genre name is required', { position: 'top-center' });
      return;
    }

    setLoading(true);
    try {
      if (editingGenre) {
        // Update existing genre
        const { data } = await axiosInstance.put(`/genre/${editingGenre._id}`, {
          name: genreName,
          image: genreImageUrl.trim() || null,
        });
        if (data) {
          toast.success('Genre updated successfully', { position: 'top-center' });
          setEditingGenre(null); // Exit edit mode
        }
      } else {
        // Add new genre
        const { data } = await axiosInstance.post('/genre', {
          name: genreName,
          image: genreImageUrl.trim() || null,
        });
        if (data) {
          toast.success('Genre added successfully', { position: 'top-center' });
        }
      }
      setGenreName('');
      setGenreImageUrl('');
      fetchGenre(); // Refresh the list
    } catch (err) {
      setError(`Error ${editingGenre ? 'updating' : 'adding'} genre`);
      toast.error(`Error ${editingGenre ? 'updating' : 'adding'} genre`, { position: 'top-center' });
      console.error(`Error while ${editingGenre ? 'updating' : 'adding'} genre:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (genre) => {
    setEditingGenre(genre);
    setGenreName(genre.name);
    setGenreImageUrl(genre.image || '');
  };

  const handleCancelEdit = () => {
    setEditingGenre(null);
    setGenreName('');
    setGenreImageUrl('');
  };

  const handleDeleteGenre = async (genreId) => {
    try {
      await axiosInstance.delete(`/genre/${genreId}`);
      toast.success('Genre deleted successfully', { position: 'top-center' });
      fetchGenre();
    } catch (err) {
      toast.error('Error deleting genre', { position: 'top-center' });
      console.error('Error while deleting genre:', err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-100 to-zinc-200 font-sans text-zinc-900">
      <div className="w-full space-y-10 px-6 py-10">
        {/* Genre Adding/Editing Form */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className='text-4xl'>
              {editingGenre ? 'Edit Genre' : 'Add New Genre'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddOrUpdateGenre} className="space-y-6">
              <div>
                <Input
                  type="text"
                  placeholder="Enter genre name (e.g., Fiction, Mystery)"
                  value={genreName}
                  onChange={(e) => setGenreName(e.target.value)}
                  className="placeholder-zinc-500"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Enter genre image URL (optional)"
                  value={genreImageUrl}
                  onChange={(e) => setGenreImageUrl(e.target.value)}
                  className="placeholder-zinc-500"
                />
                {genreImageUrl && (
                  <p className="text-sm text-zinc-600 mt-2 flex items-center gap-2">
                    Image Preview:
                    <img
                      src={genreImageUrl}
                      alt="Genre Preview"
                      className="w-16 h-16 object-cover rounded-md border border-zinc-300"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/64x64/cccccc/333333?text=Error';
                      }}
                    />
                  </p>
                )}
              </div>
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-[#ff6900] hover:bg-orange-600 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? (editingGenre ? 'Updating...' : 'Adding...') : (editingGenre ? 'Update Genre' : 'Add Genre')}
                </Button>
                {editingGenre && (
                  <Button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
            </form>
          </CardContent>
        </Card>

        {/* Genre Display Section */}
        <Card className="mt-10 animate-fade-in delay-200">
          <CardHeader>
            <CardTitle className='text-4xl'>Existing Genres</CardTitle>
          </CardHeader>
          <CardContent>
            {genres.length === 0 ? (
              <p className="text-zinc-600 text-lg text-center py-8">No genres available. Add one above!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {genres.map((genre) => (
                  <Card
                    key={genre._id}
                    className="flex flex-col items-center p-6 bg-white/70 text-zinc-900 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-[1.02] rounded-2xl border border-zinc-200"
                  >
                    <div className="relative w-40 h-40 mb-5 overflow-hidden rounded-xl border border-zinc-300">
                      {genre.image ? (
                        <img
                          src={genre.image}
                          alt={genre.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            // Fallback image for individual genre cards
                            e.target.src = `https://placehold.co/160x160/cccccc/333333?text=${encodeURIComponent(genre.name || 'No Image')}`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-300/50">
                          <span className="text-zinc-600 text-sm text-center px-2">No Image Available</span>
                        </div>
                      )}
                    </div>
                    <span className="text-2xl font-semibold text-[#ff6900] text-center mb-4 truncate w-full">
                      {genre.name}
                    </span>
                    <div className="flex gap-3 mt-auto">
                      <Button
                        onClick={() => handleEditClick(genre)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md transition-transform duration-200 hover:scale-110"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteGenre(genre._id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-md transition-transform duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Genre;

