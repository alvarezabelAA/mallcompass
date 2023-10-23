import React from 'react'
import { BsCheckAll,BsExclamationCircle,BsInfoCircle } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { BiSolidError } from 'react-icons/bi'

const Alerts = ({ alert = { type: '', title: '', message: '' },onClose  }) => {
  const { type, title, message } = alert;

  let icon;
  if (type.toUpperCase() === 'INFO') {
    icon = <BsInfoCircle className='w-6 h-6' />;
  } else if (type.toUpperCase() === 'WARNING') {
    icon = <BsExclamationCircle className='w-6 h-6' />;
  } else if (type.toUpperCase() === 'SUCCESS') {
    icon = <BsCheckAll className='w-6 h-6' />;
  }else if (type.toUpperCase() === 'ERROR') {
    icon = <BiSolidError className='w-6 h-6' />;
  }

  const alertStyle = {
    position: 'fixed',
    top: '30%', // Centra verticalmente
    left: '50%',
    transform: 'translate(-50%, -50%)', // Centra horizontalmente
  };

  const colorMap = {
    SUCCESS: 'bg-green-100 text-green-700 shadow-green-500',   // Verde
    ERROR: 'bg-red-100 text-red-700 shadow-red-500',   // Rojo
    INFO: 'bg-blue-100 text-blue-700 shadow-blue-500',   // Azul
    WARNING: 'bg-yellow-100 text-yellow-700 shadow-yellow-500',   // Azul
  };

  const textMap = {
    SUCCESS: 'border-green-200 hover:bg-green-200',   // Verde
    ERROR: 'border-red-200 hover:bg-red-200',   // Rojo
    INFO: 'border-blue-200 hover:bg-blue-200',   // Azul
    WARNING: 'border-yellow-200 hover:bg-yellow-200',   // Azul

  };
  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div className='duration-700 transform transition-all ease-out' style={alertStyle}>
      <div className='flex flex-col gap-5'>
        <div className={`max-w-lg rounded  overflow-hidden shadow-md ${colorMap[type] || 'bg-slate-200'}`}>
          <div className='flex'>
            <div className="flex items-center gap-4 p-4">
              <div className='shrink-0'>
                {icon}
              </div>    
              <div className="space-y-1">
                <p className='font-bold capitalize'>{type.charAt(0).toUpperCase() + type.slice(1)}: {title}</p>
                <p>{message}</p>
              </div>
            </div>
            <div className={`flex cursor-pointer items-center border-l  px-5 ${textMap[type] || 'bg-slate-200'}`}> 
              <button onClick={handleCloseClick}>                
                <IoClose className='w-6 h-6'/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts