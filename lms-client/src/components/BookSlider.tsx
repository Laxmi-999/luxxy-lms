import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBooks } from "@/Redux/slices/bookSlice";
import { Button } from './ui/button';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "25px", zIndex: 1, color: '#yellow-300', fontSize: '30px' }}
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
      style={{ ...style, display: "block", left: "25px", zIndex: 1, color: '#yellow-300', fontSize: '30px' }}
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

  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: false,
    // arrows: true,
    // nextArrow: <NextArrow />,
    // prevArrow: <PrevArrow />,
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
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-24 text-gray-200 text-xl font-medium bg-orange-400">
        No items available to display.
      </div>
    );
  }

  return (
    <div className="w-full relative overflow-hidden mt-30 pb-40 py-12 rounded-md">
      <div className="relative z-10 w-full items-center bg-orange-500">
        <h2
          className="text-2xl sm:text-3xl text-white font-bold text-center pt-10 pb-10 px-4"
        >
          "Your thoughts deserve a place to wander too"
        </h2>
        <Slider {...settings} className="w-full">
          {books.map((book, idx) => (
            <div key={idx} className="outline-none px-1 h-[22rem] sm:h-[36rem] lg:h-[32rem] group">
              <div
                className={`relative w-full h-full overflow-hidden
                  transform transition-all duration-300 ease-in-out
                  hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-300/30`}
              >
                <img
                  src={book.coverImage || 'https://via.placeholder.com/400x600/CCCCCC/888888?text=No+Cover'}
                  alt={book.title || 'Book Cover'}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                />

                {/* Transparent, subtle overlay */}
                <div className="absolute inset-0 bg-black/80 to-transparent z-10"></div>

                {/* Text content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                  <span className="text-white text-xl sm:text-2xl font-bold line-clamp-2 mb-2">
                    {book.title || 'Untitled Book'}
                  </span>
                  {book.author && (
                    <span className="text-gray-200 text-base sm:text-lg font-medium">
                      by {book.author}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
         

        </Slider>
         {/* <Button className='align-center mx-auto bg-orange-800 rounded-md justify-center'>Latest Arrivals</Button> */}
      </div>

    </div>
  );
};

export default BookSlider;