import React from 'react'

interface AuthLayoutProps{
  children:React.ReactNode
}

function AuthLayout({children}:AuthLayoutProps) {
  return (
    <div className=' w-full flex h-screen justify-center items-center'>
      {children}
    </div>
  )
}

export default AuthLayout