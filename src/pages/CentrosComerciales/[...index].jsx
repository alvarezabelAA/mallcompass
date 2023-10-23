import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';import Table from '../../components/globals/Table';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import SideBar from '../../components/globals/SideBar';
import { encryptAndSetLocalStorage, getFromAPI, getFromAPIWithParams, pathGen } from '../../funciones/api';
import Cards from '../../components/globals/Cards';
import SideBars from '../../components/common/SideBars';
const CentrosComerciales = () => {
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])


  const listar =async()=>{
    try {
      const endpoint = 'http://localhost:4044/centroComercial/consultaGeneral';
      const queryParams = {
        token: token      };
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
      router.push('/login/23232');
    }
    listar()

  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);
  
  
  const Headers = [
    { titulo: "Nombre CC", fila: "nombreCC", class: "text-left" },
    { titulo: "Dirección", fila: "direccion", class: "text-left" },
    { titulo: "Estado de Cuenta", fila: "estado_cuenta", class: "text-center" },
    { titulo: "Correo", fila: "correo", class: "text-center" },
    { titulo: "Número de Teléfono", fila: "telefonoCC", class: "text-center" },
    { titulo: "Imagen", fila: "imagen", class: "text-center" },
    { titulo: "Longitud", fila: "longitud", class: "text-right" },
    { titulo: "Latitud", fila: "latitud", class: "text-right" },
    // Agrega más títulos y filas según sea necesario
  ];



  

 
  const [validateSlide, setValidateSlide] = useState(true)

  useEffect(()=>{
  },[validateSlide])

  const handleSidebarVisibility = (sidebarVisible) => {
    setValidateSlide(sidebarVisible)
    // Realiza acciones basadas en el valor de sidebarVisible aquí
  };

  const editItem = (items) => {
    router.push(`/Comerciales/EditarComercial/${pathGen()}`)
    encryptAndSetLocalStorage('comercialData', JSON.stringify(items));
    console.log(items)
  }

  const deleteItem = (item) => {
    console.log(item)
  }


  const insertItem = (items) => {
    router.push(`/Comerciales/NuevoComercial/${pathGen()}`)
    // encryptAndSetLocalStorage('usuarioData', JSON.stringify(items));
    console.log(items)
  }

  const showStores = (item) => {
    console.log('Aca estoiy')
    console.log(item)
    router.push(`/CentrosComerciales/TiendasComercial/${pathGen()}`)
    encryptAndSetLocalStorage('tiendasData', item);
  }


  return (
    <>
      <SideBars>
        <Cards onShopClick={(item)=> showStores(item)} cardData={items}/>
      </SideBars>
    </>
  )
}

export default CentrosComerciales