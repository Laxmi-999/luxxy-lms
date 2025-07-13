'use client'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { logout } from '@/Redux/slices/authSlice'
import sidebarItems from '../config/sidebarItems.json';
import { RootState } from '@/Redux/store';
const Sidebar = () => {
    const {userInfo, isLoggedIn} = useSelector((state: RootState) => state.auth)
    type UserInfoType = { role?: string };
    const safeUserInfo: UserInfoType = (userInfo && typeof userInfo === 'object') ? userInfo as UserInfoType : {};
    const dispatch = useDispatch();
    const router = useRouter()
    const handleLogout = () => {
        (dispatch as any)(logout());
        router.push('/login');
    }
  return (
    <div className="">
        <div
          className="flex flex-col h-screen w-64 shadow-lg"
          style={{
            background: 'var(--luxxy-sidebar-bg)',
            color: 'var(--luxxy-sidebar-text)',
          }}
        >
            {isLoggedIn && safeUserInfo.role && ((sidebarItems as any)[safeUserInfo.role] as Array<{ path: string; label: string }>).map((item, id: number) => {
              return (
                <Link
                  href={item.path}
                  key={id}
                  className="block p-4 transition-colors"
                  style={{
                    color: 'var(--luxxy-sidebar-text)',
                  }}
                  onMouseOver={e => (e.currentTarget as HTMLElement).style.background = 'var(--luxxy-sidebar-hover)'}
                  onMouseOut={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  {item.label}
                </Link>
              );
            })}
        <Button className="mt-4" style={{background: 'var(--luxxy-secondary)', color: 'var(--luxxy-sidebar-text)'}} onClick={handleLogout}>Logout</Button>
        </div>
    </div>
  )
}

export default Sidebar;