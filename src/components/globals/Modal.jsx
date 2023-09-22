import React, { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'

const Modal = ({ isVisible, onClose, children, size = 'small', height, weight, no_proyecto, nombre_titulo, showClose = true }) => {
  const getWidth = (size) => {
    if (height && weight) return `md:w-[${weight}%] md:h-[${height}%]`
    return size === 'xssmall' ? 'w-[50%] sm:w-[30%] h-[85%]' : size === 'small' ? 'w-[90%] md:w-[40%]' : size === 'medium' ? 'w-[100%] md:w-[85%] h-[100%] md:h-[85%]' : size === 'large' ? 'w-[90%] h-[90%]' : size === 'full' ? 'w-[100%] h-[100%]' : 'w-full md:w-[50%]'
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-[1px] flex justify-center items-center z-60">
          <div className={`bg-white rounded-lg ${getWidth(size)} max-w-full`}>
            <div className="flex flex-col h-full">
              <div className="flex h-10 justify-between bg-theme-app-500 dark:bg-theme-app-800 rounded-t-lg">
                <div className="flex-grow flex justify-center items-center">
                  <span className="text-white m-2 text-lg">
                    {no_proyecto ? `${no_proyecto} - ` : ''}{nombre_titulo}
                  </span>
                </div>
                {showClose === true &&
                  <button
                    className="text-white bg-transparent hover:bg-theme-app-400 hover:text-danger hover:scale-105 transition duration-200 ease-in-out cursor-pointer rounded-lg text-sm m-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => onClose()}
                    aria-label="Cerrar"
                  >
                    <XMarkIcon className="h-7 w-7" />
                  </button>
                }
              </div>
              <div className="flex-grow overflow-y-auto p-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
