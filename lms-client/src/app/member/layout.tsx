import MemberHeader from '@/components/MemberHeader'
import Sidebar from '@/components/MemberSidebar'
import React from 'react'

const Layout = ({children}) => {
  return (
    <div className=''>
      
        <MemberHeader />
 <div
      className="min-h-screen flex w-screen overflow-y-scroll overflow-x-hidden" 
      style={{
        backgroundImage: 'url(https://www.voicesofruralindia.org/wp-content/uploads/2020/11/ylswjsy7stw-scaled.jpg)',
        backgroundSize: 'cover',       
        backgroundPosition: 'center',  
        backgroundRepeat: 'no-repeat', 
        backgroundAttachment: 'fixed', 
      }}
    >     <Sidebar  />
          {children}

        </div>
  
        </div>
  )
}

export default Layout