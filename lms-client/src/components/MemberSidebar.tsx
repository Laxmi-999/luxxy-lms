'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleDashboardClick = () => {
    router.push('/member');
  };

  const handleBrowseBookClick = () => {
    router.push('/member/find-book');
  };

  const handleReviewClick = () => {
    console.log('review clicked');
    router.push('/member/review');
  };

  const handleFinesClick = () => {
    router.push('/member/fines');
  };

  const handleAccountClick = () => {
    router.push('/member/account');
  };

  const menuItems = [
    { label: 'Dashboard', icon: '📊', path: '/member', onClick: handleDashboardClick },
    { label: 'Browse Books', icon: '📖', path: '/member/find-book', onClick: handleBrowseBookClick },
    { label: 'Fines', icon: '💰', path: '/member/fines', onClick: handleFinesClick },
    { label: 'Add Review', icon: '🌟', path: '/member/review', onClick: handleReviewClick },
    { label: 'Account', icon: '👤', path: '/member/account', onClick: handleAccountClick },
  ];

  return (
    <section className="w-64 text-white bg-gray-900 p-4 space-y-4 min-h-screen">
      <div className="text-2xl font-bold">Library</div>
      <div className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={item.onClick}
              className={`w-full text-left p-2 rounded flex items-center gap-2 transition-all duration-200 ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'hover:bg-orange-500/10 hover:text-orange-400 hover:scale-105'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-orange-400'}>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;