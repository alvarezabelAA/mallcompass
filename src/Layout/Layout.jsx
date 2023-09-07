import React from 'react'
import { useEffect, useState, createContext } from 'react'
import NavBar from '../components/globals/NavBar'

export const LayoutContext = createContext()


const Layout = ({children}) => {
  return (
    <LayoutContext.Provider value={{}} >
        <div>
            <NavBar />
            <div className='px-4 sm:px-6 lg:px-8 py-2 w-full max-w-9xl mx-auto bg-gray-100  mb-10'>
            {children}
            </div>
        </div>
    </LayoutContext.Provider>
  )
}

export default Layout