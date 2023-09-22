import React from 'react';

const Alert = ({ type, message }) => {
  // Define el mapeo de colores según el tipo de alerta
  const colorMap = {
    OK: 'bg-green-500',   // Verde
    ERROR: 'bg-red-500',   // Rojo
    INFO: 'bg-blue-500',   // Azul
  };

  const colorMap2 = {
    OK: 'bg-green-300',   // Verde
    ERROR: 'bg-red-300',   // Rojo
    INFO: 'bg-blue-300',   // Azul
  };

  // Clases CSS basadas en el tipo de alerta
  const alertClasses = ` ${colorMap[type] || 'bg-blue-500'} text-white`;

  const alertStyle = {
    position: 'fixed',
    top: '30%', // Centra verticalmente
    left: '50%',
    transform: 'translate(-50%, -50%)', // Centra horizontalmente
  };

  return (
    <div className={`w-96`} style={alertStyle} role="alert">
      <div className={`${alertClasses}  text-white font-bold rounded-t px-4 py-2`}>
        {type}
      </div>
      <div className={` border-t-0 rounded-b px-4 py-3 ${colorMap2[type] || 'bg-blue-300'}`}>
        <p>{message}</p>
      </div>
    </div>
    // <div className={alertClasses} style={alertStyle}>
    //   {message}
    // </div>
  );
};

export default Alert;
