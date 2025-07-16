// Sidebar.jsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();

  const handleDashboardClick = () => {
    router.push('/member');
  };

  const handleBrowseBookClick = () => {
    router.push('/member/find-book');
  };


  const handleReviewClick = () => {
   console.log('review clicked');
   
    router.push('/member/review');
  }

  const handleFinesClick = () =>{
    router.push('/member/fines');
  }
  return (
    <section className="w-64 text-white bg-black/80 p-4 space-y-4">
      <div className="text-2xl font-bold">Library</div>
      <div className="space-y-2">
        <button onClick={handleDashboardClick} className="w-full text-left p-2 rounded hover:bg-gray-600">
          <span className="mr-2">📊</span> Dashboard
        </button>
        <button onClick={handleBrowseBookClick} className="w-full text-left p-2 rounded hover:bg-gray-600">
          <span className="mr-2">📖</span> Browse Books
        </button>
        
        <button 
        onClick={handleFinesClick}
        className="w-full text-left p-2 rounded hover:bg-gray-600">
          <span className="mr-2">💰</span> Fines
        </button>
         <button
          onClick={handleReviewClick}

         className="w-full text-left p-2 rounded hover:bg-gray-600">
          <span className="mr-2">🌟</span> Add Reveiw
        </button>
        <button 
        
         className="w-full text-left p-2 rounded hover:bg-gray-600">
          <span className="mr-2">👤</span> Account
        </button>
      </div>
    </section>
  );
};

export default Sidebar;