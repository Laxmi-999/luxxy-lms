'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import axiosInstance from '@/lib/axiosInstance';

const AddReviewForm = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
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
      setFormData({
        name: userInfo?.name || '',
        image: null,
        rating: 5,
        text: '',
        role: userInfo?.role || '',
      });
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
          font-size: 1.75rem;
          color: #e5e7eb;
          transition: color 0.2s ease;
        }
        .star-rating input:checked ~ label,
        .star-rating label:hover,
        .star-rating label:hover ~ label {
          color: #f59e0b;
        }
        .image-preview {
          max-width: 100%;
          max-height: 200px;
          height: auto;
          border-radius: 0.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          object-fit: cover;
        }
        .form-container {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .form-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }
        .input-field {
          transition: all 0.3s ease;
        }
        .input-field:focus {
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
        }
        .submit-button {
          position: relative;
          overflow: hidden;
        }
        .submit-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: 0.5s;
        }
        .submit-button:hover::after {
          left: 100%;
        }
      `}</style>
      <div className="w-7xl  mx-auto bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl form-container my-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Share Your Experience</h2>
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              readOnly
              className="w-full p-3 text-gray-800 border border-gray-200 rounded-lg input-field bg-gray-100 cursor-not-allowed"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="image">
              Upload Your Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 input-field"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 image-preview" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="star-rating flex space-x-2 justify-center">
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
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="text">
              Your Review
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              rows="5"
              className="w-full p-3 text-gray-800 border border-gray-200 rounded-lg input-field focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/50"
              placeholder="Share your experience"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="role">
              Your Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              readOnly
              required
              className="w-full p-3 border border-gray-200 text-gray-800 rounded-lg input-field bg-gray-100 cursor-not-allowed"
              placeholder="E.g., Developer, Designer"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white submit-button transition-all ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
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