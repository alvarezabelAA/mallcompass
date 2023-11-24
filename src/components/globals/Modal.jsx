import React from 'react';

const Modal = ({ children, titulo, onClose, onDoIt, tamano = 'max-w-3xl' }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-10 flex justify-center items-center ">
      <div className={`bg-slate-200 p-2 rounded-lg w-full ${tamano} `}>
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">{titulo}</h3>
        </div>
        <div className="overflow-y-auto max-h-[70vh]"> {/* Establece una altura máxima para el contenido */}
          {children}
        </div>
        <div className="flex justify-center mt-4">
          {/* <button
        onClick={onDoIt}
        className="bg-green-600 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-500"
      >
        Nueva
      </button> */}
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
        Cancel
          </button>
        </div> 
      </div>
    </div>

  );
};

export default Modal;
