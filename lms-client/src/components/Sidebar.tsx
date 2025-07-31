'use client';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Users, BookOpen, Tag } from 'lucide-react';
import { logout } from '@/Redux/slices/authSlice';
import sidebarItems from '@/config/sidebarItems.json';
import { RootState } from '@/Redux/store';

const Sidebar = () => {
  const { userInfo, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const safeUserInfo = (userInfo && typeof userInfo === 'object') ? userInfo : {};
  const dispatch = useDispatch();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  // Map icon names to lucide-react components
  const iconMap = {
    Dashboard: LayoutDashboard,
    Users: Users,
    Books: BookOpen,
    Genre: Tag,
    Requests: BookOpen,
  };

  return (
    <div className="flex flex-col min-h-screen w-64 bg-gray-900 shadow-lg">
      <div className="flex flex-col flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isLoggedIn && safeUserInfo.role && sidebarItems[safeUserInfo.role]?.map((item) => {
          const IconComponent = iconMap[item.icon] || BookOpen;
          const isActive = pathname === item.path;
          return (
            <Link
              href={item.path}
              key={item.id}
              className={`flex items-center gap-2 p-4 text-gray-200 transition-all duration-200 ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'hover:bg-orange-500/10 hover:text-orange-400 hover:scale-105'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-orange-400'}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="p-4 mb-10 shrink-0">
        <Button
          className="w-full bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 text-xs py-1"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;