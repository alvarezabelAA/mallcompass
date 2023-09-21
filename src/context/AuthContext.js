import { createContext, useContext, useState, useEffect } from 'react';
import { decryptAndGetLocalStorage } from '../funciones/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // Funciones para establecer y eliminar el token de inicio de sesión
  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);

  useEffect(() => {
    // Recuperar el token del almacenamiento local al cargar la aplicación
    const decryptedData = decryptAndGetLocalStorage('token');
    console.log(decryptedData)
    if (decryptedData) {
      console.log('Datos desencriptados:', decryptedData);
    } else {
      console.log('No se pudo desencriptar los datos.');
    }
    if (decryptedData) {
      setToken(decryptedData);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
