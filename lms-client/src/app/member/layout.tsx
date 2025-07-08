import MemberHeader from '@/components/MemberHeader'
import Sidebar from '@/components/MemberSidebar'
import React from 'react'

const Layout = ({children}) => {
  return (
    <div className=''>
      
        <MemberHeader />
        <div className='flex '>
          <Sidebar  />
          {children}

        </div>
  
        </div>
  )
}

export default Layout