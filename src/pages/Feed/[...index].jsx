import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted'
import { decryptAndGetLocalStorage,pathGen } from '../../funciones/api';
import NavBar from '../../components/globals/NavBar';
const Feed = () => {
  const router = useRouter();
  const { token,logout } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();


    
  const getEnv = () => {
    console.log(token);
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  const comercialesB = () => {
    router.push(`../Comerciales/${pathGen()}`);  };

  const LocalesB = () => {
    router.push(`/PantallaInicio/${pathGen()}`);  };

  const ConfiguracionB = () => {
    router.push(`/PantallaInicio/${pathGen()}`);  };
  const handleLogout = () => {
    logout();
    localStorage.clear();
    router.push(`/login/${pathGen()}`);
  };
  return (
    <>
      <NavBar />
      <button onClick={handleLogout}>Cerrar sesión</button>
      <button onClick={() => comercialesB()}>Comerciales</button>
      <button onClick={() => LocalesB()}>Locales</button>
      <button onClick={() => ConfiguracionB()}>Configuración</button>
    </>
  );
};

export default Feed;
