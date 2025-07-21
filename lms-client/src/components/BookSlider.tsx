import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBooks } from "@/Redux/slices/bookSlice";
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "25px", zIndex: 1, color: '#black', fontSize: '30px' }}
      onClick={onClick}
    >
      ❯
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "25px", zIndex: 1, color: '#black', fontSize: '30px' }}
      onClick={onClick}
    >
      ❮
    </div>
  );
};

const BookSlider = () => {
  const { books } = useSelector((state) => state.books);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-24 text-gray-600 text-xl font-medium">
        No books available to display.
      </div>
    );
  }

  return (
    <div className="w-full relative overflow-hidden py-16 bg-gray-50">
      <div className="relative z-10 w-full items-center">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl text-gray-800 font-bold mb-3 font-serif">
            Latest Arrivals
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg font-medium max-w-2xl mx-auto px-4">
            Discover our newest collection of literary treasures
          </p>
        </div>
        <Slider {...settings} className="w-full px-4">
          {books.map((book, idx) => (
            <div key={idx} className="px-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl max-w-[280px] mx-auto">
                <div className="aspect-[3/4] relative max-h-[320px]">
                  <img
                    src={book.coverImage || 'https://via.placeholder.com/400x600/CCCCCC/888888?text=No+Cover'}
                    alt={book.title || 'Book Cover'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-1">
                    {book.title || 'Untitled Book'}
                  </h3>
                  {book.author && (
                    <p className="text-gray-600 text-sm mb-3">
                      {book.author}
                    </p>
                  )}
                  <Badge 
                    className={book.status === 'available' 
                      ? 'bg-yellow-400 text-black hover:bg-yellow-500 text-sm'
                      : 'bg-orange-400 text-white hover:bg-orange-500 text-sm'}
                  >
                    {book.genre?.name || 'Genre N/A'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BookSlider;