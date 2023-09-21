import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import React, { useState,useEffect } from 'react';
import { decryptAndGetLocalStorage,pathGen } from '../funciones/api';

function Home() {
  const { token, login, logout } = useAuth();
  const router = useRouter();


  useEffect(()=>{
    console.log(token)
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
  },[token])

  const handleLogout = () => {
    logout();
    router.push(`/login/${pathGen()}`);
  };

  // Resto del contenido de tu componente Home
  return (
    <div>
      {token ? (
        <>
          <p>Usuario autenticado</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <p>Usuario no autenticado</p>
      )}
    </div>
  );
}

export default Home;
