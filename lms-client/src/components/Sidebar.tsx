'use client'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { logout } from '@/Redux/slices/authSlice'
import sidebarItems from '../config/sidebarItems.json';
const Sidebar = () => {
    const {userInfo, isLoggedIn} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = ()=> {
        dispatch(logout());
        router.push('/login')
    }
  return (
    <div className=''>
        <div className='flex flex-col bg-black/80 h-screen text-white w-64 shadow-lg'>
            {isLoggedIn && userInfo.role && sidebarItems[userInfo.role].map((item,id)=>{
            return (
                <Link href={item.path} key={id} className="block p-4 text-white hover:bg-gray-200 hover:text-black">
                    {item.label}
                </Link>

        )})}
        <Button  className = 'bg-orange-700 text-white' onClick={handleLogout}>Logout</Button>
        </div>
          
    </div>
  )
}

export default Sidebar;