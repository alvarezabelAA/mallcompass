import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';import Table from '../../components/globals/Table';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import SideBar from '../../components/globals/SideBar';
import { deleteWithParams, encryptAndSetLocalStorage, getFromAPI, getFromAPIWithParams, pathGen } from '../../funciones/api';
import { useAlert } from '../../context/AlertContext';

const Comerciales = () => {
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const { showAlertWithMessage } = useAlert();


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

  const deleteItem = async (item) => {
    console.log(item);
    const endpoint = 'http://localhost:4044/centroComercial/delete'; // URL del servidor de eliminación
    console.log(token)
    console.log(item.id_centroComercial)
    const requestParams = {
      token: token.toString(),
      idComercial: item.id_centroComercial, // Agrega otros campos si es necesario
    };
  
    try {
      const response = await deleteWithParams(endpoint, requestParams);
  
      console.log(response);
  
      if (response.status === 1) {
        listar();
        showAlertWithMessage('OK', 'El elemento se eliminó correctamente');
      } else {
        showAlertWithMessage('ERROR', 'No se pudo eliminar el elemento');
      }
    } catch (error) {
      showAlertWithMessage('ERROR', 'Error al hacer la solicitud DELETE: ' + error);
      // Maneja el error aquí
    }
  };


  const insertItem = (items) => {
    router.push(`/Comerciales/NuevoComercial/${pathGen()}`)
    // encryptAndSetLocalStorage('usuarioData', JSON.stringify(items));
    console.log(items)
  }


  return (
    <>
      <SideBar onVisible={(newValue) => handleSidebarVisibility(newValue)} />
      
      <div className={`p-4 ml-24 ${validateSlide ? 'sm:ml-24': 'sm:ml-64'}`}>
        <Table 
          headers={Headers} 
          content={items} 
          showActions={true} 
          onInsert={(newValue)=> insertItem(newValue)}
          onDelete={(newValue)=> deleteItem(newValue)}
          onEdit={(newValue)=> editItem(newValue)}
        />
      </div>
    </>
  )
}

export default Comerciales