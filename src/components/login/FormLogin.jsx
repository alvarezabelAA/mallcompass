import React from 'react'

const FormLogin = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 h-screen w-screen ">
        <div className='flex items-center justify-center'>
          <div className='background-darkBlue  text-white w-full sm:w-96 h-96 rounded-lg p-4'>
            <div className='grid grid-cols-1 gap-1'>
              <div className='flex justify-center h-20 items-center'>
                <span className='text-xl'>WELCOME BACK!</span>
              </div>
              <div className='w-full'>
                <div className='p-1'>
                  <span>Email:</span>
                  <input className='input-proyect ' type="text" />
                </div>
                <div className='p-1'>
                  <span>Password</span>
                  <input className='input-proyect' type="password" />
                </div>
              </div>
              <div>
                <div className='grid grid-cols-1 gap-1 text-center mt-10'>
                  <div className=''>
                    <button className='py-1 px-6 rounded bg-green-500 w-full'>LOGIN</button>
                  </div> 
                  <div>
                    <button type='button' className='text-slate-400'>Forgot Password?</button>
                  </div>
                  <div>
                    <button type='button' className='text-[#7a7bcb]'>Dont have an account?</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=''>09</div>
      </div>
    </>
  )
}

export default FormLogin