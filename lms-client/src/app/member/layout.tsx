import MemberHeader from '@/components/MemberHeader'
import React from 'react'

const Layout = ({children}) => {
  return (
    <div >
        <MemberHeader />
         {children}
  
        </div>
  )
}

export default Layout