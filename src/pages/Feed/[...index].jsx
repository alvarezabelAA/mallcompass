import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted'
const Feed = () => {
  const router = useRouter();
  const { token,logout } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();


    
  const getEnv = () => {
    console.log(token);
    if (!token) {
      router.push('/login/23232');
    }
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  const comercialesB = () => {
    router.push('../Comerciales/121322');
  };

  const LocalesB = () => {
    router.push('/PantallaInicio/1213213');
  };

  const ConfiguracionB = () => {
    router.push('/PantallaInicio/1213213');
  };
  const handleLogout = () => {
    // Llama a la función de cierre de sesión del contexto de autenticación
    logout();
    localStorage.clear();
    // Redirige al usuario a la página de inicio de sesión o a donde desees
    router.push('/login/456');
  };
  return (
    <>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <button onClick={() => comercialesB()}>Comerciales</button>
      <button onClick={() => LocalesB()}>Locales</button>
      <button onClick={() => ConfiguracionB()}>Configuración</button>
    </>
  );
};

export default Feed;
