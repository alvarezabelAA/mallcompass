import React, { createContext, useContext, useState, useEffect } from 'react';
import Alert from '../components/Alert';

// Crea el contexto de alerta
const AlertContext = createContext();

// Hook personalizado para acceder al contexto de alerta
export const useAlert = () => {
  return useContext(AlertContext);
};

// Componente proveedor de alerta
export const AlertProvider = ({ children }) => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('INFO');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlertWithMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setIsAlertVisible(true);

    // Ocultar la alerta después de 5 segundos
    setTimeout(() => {
      hideAlert();
    }, 5000);
  };

  const hideAlert = () => {
    setIsAlertVisible(false);
  };

  return (
    <AlertContext.Provider value={{ showAlertWithMessage, hideAlert }}>
      {children}
      {isAlertVisible && <Alert type={alertType} message={alertMessage} />}
    </AlertContext.Provider>
  );
};
