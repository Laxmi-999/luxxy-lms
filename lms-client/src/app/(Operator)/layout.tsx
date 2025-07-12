'use client';
import React from 'react'
import Sidebar from '../../components/Sidebar'

const Layout = ({children}) => {
  return (
    <div >
           <div
      className="min-h-screenflex gap-2 flex w-screen overflow-y-scroll overflow-x-hidden" 
      style={{
        backgroundImage: 'url(https://www.voicesofruralindia.org/wp-content/uploads/2020/11/ylswjsy7stw-scaled.jpg)',
        backgroundSize: 'cover',         
        backgroundPosition: 'center',    
        backgroundRepeat: 'no-repeat',   
        backgroundAttachment: 'fixed',   
      }}
    > 
         <Sidebar />
          {children}
        </div>
  
        </div>
  )
}

export default Layout;