import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // Funciones para establecer y eliminar el token de inicio de sesión
  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);

  useEffect(() => {
    // Recuperar el token del almacenamiento local al cargar la aplicación
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
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
