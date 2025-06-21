'use client';
import React from 'react'
import Sidebar from '../../components/Sidebar'

const Layout = ({children}) => {
  return (
    <div >
        <div className='flex gap-2'>
         <Sidebar />
          {children}
        </div>
  
        </div>
  )
}

export default Layout;