import React from 'react'
import { useEffect, useState, createContext } from 'react'
import NavBar from '../components/globals/NavBar'

export const LayoutContext = createContext()


const Layout = ({ children }) => {
  return (
    <LayoutContext.Provider value={{}} >
      <div>
        <div className=' w-full h-screen bg-gray-200 max-w-9xl mx-auto'>
          {children}
        </div>
      </div>
    </LayoutContext.Provider>
  )
}

export default Layout