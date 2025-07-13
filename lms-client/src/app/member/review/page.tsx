'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import axiosInstance from '@/lib/axiosInstance';

const AddReviewForm = () => {

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const {userInfo} = useSelector((state) => state.auth);


    const [formData, setFormData] = useState({
    name: '',
    image: null,
    rating: 5,
    text: '',
    role: userInfo?.role || '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('image', formData.image);
    data.append('rating', formData.rating);
    data.append('text', formData.text);
    data.append('role', formData.role);

    try {
      await axiosInstance.post('/reviews', data);
      setMessage({ type: 'success', text: 'Review added successfully!' });
      setFormData({ name: '', image: null, rating: 5, text: '', role: '' });
      setImagePreview(null);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add review' });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .star-rating input[type='radio'] {
          display: none;
        }
        .star-rating label {
          cursor: pointer;
          font-size: 1.5rem;
          color: #d1d5db;
        }
        .star-rating input:checked ~ label,
        .star-rating label:hover,
        .star-rating label:hover ~ label {
          color: #f59e0b;
        }
        .image-preview {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      <div className="w-7xl mx-auto bg-black/80 p-3 rounded-2xl shadow-2xl space-y-6 h-200 mt-5 transform transition-all ">
        <h2 className="text-2xl font-bold text-center text-white">Add Your Review</h2>
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 " encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-white mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
               value={formData.name}
               onChange={handleChange}
              required
              className="w-full p-3 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1" htmlFor="image">
              Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full p-3 border  text-white border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 image-preview" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Rating</label>
            <div className="star-rating flex space-x-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <React.Fragment key={star}>
                  <input
                    type="radio"
                    id={`star-${star}`}
                    name="rating"
                    value={star}
                    checked={formData.rating === star}
                    onChange={() => handleRatingChange(star)}
                    required
                  />
                  <label htmlFor={`star-${star}`} className="transition-colors">
                    ★
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1" htmlFor="text">
              Review Text
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-3 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Share your experience"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1" htmlFor="role">
              Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              readOnly
              required
              className="w-full p-3 border border-gray-300 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="E.g., Developer, Designer"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddReviewForm;