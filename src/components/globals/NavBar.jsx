import React, { useState } from 'react';
import  {Bars4Icon}  from '@heroicons/react/24/solid'


const NavBar = () => {

    const [showOptions, setShowOptions] = useState(false);

    const toggleOptions = () => {
        console.log(showOptions)
        setShowOptions(!showOptions)
    }
  return (
    <>
    <div className='grid gap-1 grid-cols-2 p-3 h-16 items-center bg-slate-900 text-white'>
            <div className="col-span-1">
                usuario
            </div>
            <div className="col-span-1">
                <div className='flex justify-end relative'>
                    <button className=" rounded px-3 py-1" onClick={toggleOptions}>
                        <Bars4Icon className='w-6 h-6 flex-shrink-0' />
                    </button>
                    {showOptions && (
                        <div className="absolute top-8 right-0 mt-2 w-64 rounded-lg text-black bg-white border border-gray-300 shadow p-2">
                            <a className="block py-1" href="#">bueno</a>
                            <a className="block py-1" href="#">Mi perfil</a>
                            <a className="block py-1" href="#">Theme</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
  )
} 

export default NavBar