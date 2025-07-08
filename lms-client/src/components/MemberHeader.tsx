'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/Redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

const MemberHeader = () => {
  const { userInfo, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      {/* User Info - Left */}
      {isLoggedIn && (
        <div className="flex items-center gap-4">
          <div className="text-left">
            <p className="text-lg font-semibold text-green-600">
              Welcome, <span className="text-orange-600">{userInfo.name}</span>
            </p>
            <p className="text-sm text-orange-800">{userInfo.email}</p>
          </div>
        </div>
      )}

      {/* Navigation Links - Center */}
      <div className="flex gap-8">
        {/* <Link href="/member">
          <span className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
            Dashboard
          </span>
        </Link> */}
        {/* <Link href="/member/find-book">
          <span className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
            Find Book
          </span>
        </Link> */}
      </div>

      {/* Logout Button - Right */}
      <Button 
        variant="destructive" 
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors" 
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </header>
  );
};

export default MemberHeader;