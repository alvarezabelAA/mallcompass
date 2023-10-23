import React, { createContext, useContext, useState } from 'react';
import Alerts from '../components/common/Alerts';

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, title, message) => {
    setAlert({ type, title, message });
    setTimeout(() => {
      setAlert(null);
    }, 6000); // Ocultar la alerta después de 5 segundos
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      {alert && <Alerts alert={alert} onClose={closeAlert} />}
    </AlertContext.Provider>
  );
};
