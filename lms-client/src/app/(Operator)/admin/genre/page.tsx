'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/lib/axiosInstance';
import { Edit, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { setGenre } from '@/Redux/slices/genreSlice';

const Genre = () => {
    const [genreName, setGenreName] = useState('');
    const [genreImageUrl, setGenreImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);

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

    const handleAddGenre = async (e) => {
        e.preventDefault();
        if (!genreName.trim()) {
            setError('Genre name is required');
            toast.error('Genre name is required', { position: 'top-center' });
            return;
        }

        setLoading(true);
        try {
            const { data } = await axiosInstance.post('/genre', {
                name: genreName,
                image: genreImageUrl.trim() || null,
            });

            if (data) {
                toast.success('Genre added successfully', { position: 'top-center' });
                setGenreName('');
                setGenreImageUrl('');
                fetchGenre();
            }
        } catch (err) {
            setError('Error adding genre');
            toast.error('Error adding genre', { position: 'top-center' });
            console.error('Error while adding genre:', err);
        } finally {
            setLoading(false);
        }
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
        <div className="p-6 space-y-6 w-full overflow-x-hidden overflow-y-hidden text-white">
            {/* Genre Adding Form */}
            <div className="max-w-7xl mx-auto">
                <Card className="bg-black/60 text-white">
                    <CardHeader>
                        <CardTitle className='text-2xl'>Add New Genre</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddGenre} className="space-y-4">
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Enter genre name (e.g., Fiction, Mystery)"
                                    value={genreName}
                                    onChange={(e) => setGenreName(e.target.value)}
                                    className="bg-black/70 text-white border-white/50 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Enter genre image URL (e.g., https://example.com/image.jpg)"
                                    value={genreImageUrl}
                                    onChange={(e) => setGenreImageUrl(e.target.value)}
                                    className="bg-black/70 text-white border-white/50 focus:ring-blue-400"
                                />
                                {genreImageUrl && (
                                    <p className="text-sm text-white/80 mt-2">
                                        Preview URL: {genreImageUrl}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Genre'}
                            </Button>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Genre Display Section */}
            <Card className="bg-black/70 mt-10 text-white">
                <CardHeader>
                    <CardTitle className='text-3xl'>Existing Genres</CardTitle>
                </CardHeader>
                <CardContent>
                    {genres.length === 0 ? (
                        <p className="text-white/80">No genres available.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {genres.map((genre) => (
                                <Card
                                    key={genre._id}
                                    className="bg-black/75 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
                                >
                                    <CardContent className="p-4 flex flex-col items-center">
                                        <div className="relative w-48 h-48 mb-4">
                                            {genre.image ? (
                                                <img
                                                    src={genre.image}
                                                    alt={genre.name}
                                                    className="w-full h-full object-cover rounded-lg border border-white/50"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/192?text=No+Image';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-black/50 rounded-lg border border-white/50">
                                                    <span className="text-white/80 text-sm">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xl font-bold text-center mb-4">{genre.name}</span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="text-white bg-green-500 border-white/50 hover:bg-green-600"
                                                onClick={() => {/* Add edit functionality */}}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                onClick={() => handleDeleteGenre(genre._id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Genre;