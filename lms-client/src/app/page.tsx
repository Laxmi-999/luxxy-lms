
'use client'

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BookSlider from '@/components/BookSlider';
import ReviewsSection from '@/components/ReviewsSection';
import Footer from '@/components/Footer';
import { useAppDispatch } from './hooks';
import { fetchAllUsers } from '../Redux/slices/userSlice';

const Page = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="min-h-screen w-screen overflow-y-hidden bg-gradient-to-br from-library-50 to-library-100">
      <Header />
      <HeroSection />
      <BookSlider />
      <ReviewsSection />
      <Footer />
    </div>
  );
};

export default Page;