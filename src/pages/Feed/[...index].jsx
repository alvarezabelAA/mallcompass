import React from 'react'
import  { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const Feed = () => {
  const router = useRouter(); // Obtenemos el objeto router

  const comercialesB = () =>{
    router.push('../Comerciales/121322')
  }

  const LocalesB = () =>{
    router.push('/PantallaInicio/1213213')
  }

  const ConfiguracionB = () =>{
    router.push('/PantallaInicio/1213213')
  }

  return (
    <>
      <button onClick={()=>comercialesB()}>Comerciales</button>
      <button onClick={()=>LocalesB()}>Locales</button>
      <button onClick={()=>ConfiguracionB()}>Configuracion</button>
    </>
  )
}

export default Feed