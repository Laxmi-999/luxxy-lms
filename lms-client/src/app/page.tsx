
'use client'

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BookSlider from '@/components/BookSlider';
import ReviewsSection from '@/components/ReviewsSection';
import Footer from '@/components/Footer';
import { useAppDispatch } from './hooks';
import { fetchAllUsers } from '../Redux/slices/userSlice';
import KeyFeatures from '@/components/KeyFeatures';
import HowItWorks from '@/components/HowItWorks';
import GenreSection from '@/components/GenreSection';
import CallToAction from '@/components/CTA';
import NotificationBell from '@/components/notificationBell';

const Page = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
 <div
      className="min-h-screen w-screen overflow-y-scroll overflow-x-hidden" // Use overflow-y-scroll to enable vertical scrolling
      style={{
        backgroundImage: 'url(https://www.voicesofruralindia.org/wp-content/uploads/2020/11/ylswjsy7stw-scaled.jpg)',
        backgroundSize: 'cover',         // Ensures the image covers the entire container
        backgroundPosition: 'center',    // Centers the image
        backgroundRepeat: 'no-repeat',   // Prevents the image from repeating
        backgroundAttachment: 'fixed',   // THIS IS THE KEY PROPERTY for parallax effect
      }}
    >   
      <Header />
      <HeroSection />
      <BookSlider />
      <KeyFeatures />
      <HowItWorks />
      <GenreSection />
      <ReviewsSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Page;