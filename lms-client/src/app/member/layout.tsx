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
        backgroundSize: 'cover',         // Ensures the image covers the entire container
        backgroundPosition: 'center',    // Centers the image
        backgroundRepeat: 'no-repeat',   // Prevents the image from repeating
        backgroundAttachment: 'fixed',   // THIS IS THE KEY PROPERTY for parallax effect
      }}
    >            <Sidebar  />
          {children}

        </div>
  
        </div>
  )
}

export default Layout