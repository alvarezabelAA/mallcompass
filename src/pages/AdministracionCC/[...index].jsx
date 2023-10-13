import React, { useEffect, useState } from 'react'
import SideBar from '../../components/globals/SideBar'
import { useAlert } from '../../context/AlertContext';
import { useRouter } from 'next/router';
import useHasMounted from '../../hooks/useHasMounted';
import { useAuth } from '../../context/AuthContext';
import { decryptAndGetLocalStorage, encryptAndSetLocalStorage, getFromAPIWithParams, pathGen } from '../../funciones/api';
import Cards from '../../components/globals/Cards';

const AdministracionCC = () => {
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const [usuario ,setUsuario]=useState([])
  const { showAlertWithMessage } = useAlert();

  const [validateSlide, setValidateSlide] = useState(true)

  const listar =async()=>{
    try {
      const endpoint = 'http://localhost:4044/centroComercial/lista';
      console.log(token)
      const queryParams = {
        token: token.toString()      
      };
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setItems(data.datos)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);

    }

  }

  const listarPorUsuario =async()=>{
    try {
      const endpoint = 'http://localhost:4044/centroComercial/listaUsuarios';
      console.log(token)
      const queryParams = {
        token: token.toString(),
        id_usuario: usuario     
      };
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setItems(data.datos)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);

    }

  }

  const getEnv = () => {
    console.log(token);
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    const decryptedData = decryptAndGetLocalStorage('id_usuario');
    const decryptedData2 = decryptAndGetLocalStorage('rol');
    setUsuario(decryptedData)
    console.log(decryptedData2)
    if(decryptedData2 === 'S'){
      listar()
    }else if(decryptedData2 === 'C'){
      listarPorUsuario()
    }

  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  const handleSidebarVisibility = (sidebarVisible) => {
    setValidateSlide(sidebarVisible)
    // Realiza acciones basadas en el valor de sidebarVisible aquí
  };

  const handleShopClick = (item) => {
    console.log(item)
    router.push(`/AdministracionCC/AgregarTienda/${pathGen()}`)
    encryptAndSetLocalStorage('id_centroComercial', item.id_centroComercial);


  };
  
  const handleInfoClick = (item) => {
    console.log(item)
    // Lógica cuando se hace clic en el icono de Información
    // Por ejemplo: mostrar detalles adicionales, etc.
  };

  useEffect(()=>{
    console.log(usuario)
  },[usuario])
  return (
    <>
      <SideBar onVisible={(newValue) => handleSidebarVisibility(newValue)} />
      <div className={`p-4 ml-24 ${validateSlide ? 'sm:ml-24': 'sm:ml-64'}`}>
        <Cards cardData={items} onShopClick={(newValue)=>handleShopClick(newValue)} onInfoClick={(newValue)=>handleInfoClick(newValue)}/>
      </div>

    </>
  )
}

export default AdministracionCC