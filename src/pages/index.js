import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import React, { useState,useEffect } from 'react';

function Home() {
  const { token, login, logout } = useAuth();
  const router = useRouter();

  // // Verificar si el usuario no está autenticado y redirigir a /login
  // if (!token) {
  //   // Redirige a la página de inicio de sesión
  //   router.push('/login/89787');
  //   // Puedes agregar un mensaje opcional o realizar otras acciones aquí
  // }

  useEffect(()=>{
    console.log(token)
    if (!token) {
      // Redirige a la página de inicio de sesión
      router.push('/login/23232');
      // Puedes agregar un mensaje opcional o realizar otras acciones aquí
    }
  },[token])

  const handleLogout = () => {
    // Llama a la función de cierre de sesión del contexto de autenticación
    logout();

    // Redirige al usuario a la página de inicio de sesión o a donde desees
    router.push('/login');
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
      {/* Otro contenido de la página */}
    </div>
  );
}

export default Home;
