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
    router.push('/');
  };

  return (
    <header className="bg-orange-500 shadow-sm py-4 px-6 flex items-center justify-between">
      {/* User Info - Left */}
        <div className="flex items-center ml-5">
         <img src = '/assests/logo.png' className='h-15 w-auto'/>
        </div>

      {/* Navigation Links - Center */}
      <div className="text-left px-2">
            <p className="text-3xl font-bold text-green-800">
              Welcome, <span className="text-white text-2xl font-bold">{userInfo?.name}</span>
            </p>
            <p className=" text-orange-500 font-bold text-xl">{userInfo?.email}</p>
          </div> 

      {/* Logout Button - Right */}
      <Button 
        className="flex items-center gap-2 bg-red-700 hover:bg-red-600 transition-colors" 
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </header>
  );
};

export default MemberHeader;