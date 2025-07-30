
'use client';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { logout } from '@/Redux/slices/authSlice';
import sidebarItems from '../config/sidebarItems.json';
import { RootState } from '@/Redux/store';

const Sidebar = () => {
    const { userInfo, isLoggedIn } = useSelector((state: RootState) => state.auth);
    type UserInfoType = { role?: string };
    const safeUserInfo: UserInfoType = (userInfo && typeof userInfo === 'object') ? userInfo as UserInfoType : {};
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <div className="flex flex-col min-h-screen w-64 bg-black/80 shadow-lg">
            <div className="flex flex-col flex-1 overflow-y-auto">
                {isLoggedIn && safeUserInfo.role && ((sidebarItems as any)[safeUserInfo.role] as Array<{ path: string; label: string }>).map((item, id: number) => {
                    return (
                        <Link
                            href={item.path}
                            key={id}
                            className="block p-4 text-gray-200 hover:bg-gray-700/50 transition-colors"
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
            <div className="p-4 shrink-0">
                <Button
                    className="w-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
