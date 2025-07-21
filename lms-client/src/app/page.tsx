
'use client'
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
import { useEffect, useRef, useState } from 'react';

export function useInView(threshold = 0.15) {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function AnimatedSection({ children }) {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} className={`section-fade${inView ? ' in-view' : ''}`}>
      {children}
    </section>
  );
}

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
      <AnimatedSection>
        <HeroSection />
      </AnimatedSection>
      <AnimatedSection>
        <BookSlider />
      </AnimatedSection>
      <AnimatedSection>
        <KeyFeatures />
      </AnimatedSection>
      <AnimatedSection>
        <HowItWorks />
      </AnimatedSection>
      <AnimatedSection>
        <GenreSection />
      </AnimatedSection>
      <AnimatedSection>
        <ReviewsSection />
      </AnimatedSection>
      <AnimatedSection>
        <CallToAction />
      </AnimatedSection>
      <Footer />
    </div>
  );
};

export default Page;