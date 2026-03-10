import React from 'react'
import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div className='min-h-screen min-w-full'>
        <div className='h-14 flex justify-center items-center border-b border-b-gray-300'>
            <h1 className='text-2xl'>TrixStock</h1>
        </div>
        <div>
            <Outlet/>
        </div>

    </div>
  )
}

export default AuthLayout