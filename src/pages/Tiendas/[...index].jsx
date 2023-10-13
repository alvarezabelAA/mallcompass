import React, { useEffect, useState } from 'react'
import SideBar from '../../components/globals/SideBar';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import { useRouter } from 'next/router';
import { useAlert } from '../../context/AlertContext';
import Table from '../../components/globals/Table';
import { deleteWithParams, deleteWithbody, encryptAndSetLocalStorage, getFromAPI, getFromAPIWithParams, pathGen } from '../../funciones/api';

const Tiendas = () => {
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const { showAlertWithMessage } = useAlert();

  const Headers = [
    { titulo: "Nombre Tienda", fila: "nombreTienda", class: "text-center" },
    { titulo: "Telefono", fila: "telefono", class: "text-center" },
    { titulo: "Número Local", fila: "numeroLocal", class: "text-center" },
    { titulo: "Estado Cuenta", fila: "estado_cuenta", class: "text-center" },
    { titulo: "Categoria Tienda", fila: "categoriaTienda", class: "text-center" },
    { titulo: "Correo", fila: "correo", class: "text-center" },
    { titulo: "Imagen", fila: "imagen", class: "text-center" }    // Agrega más títulos y filas según sea necesario
  ];

  const getEnv = () => {
    console.log(token);
    if (!token) {
      router.push('/login/23232');
    }
    listar()
  }

  const listar =async()=>{
    try {
      const endpoint = 'http://localhost:4044/tiendas/consultaGeneral';
      const queryParams = {
        token: token      
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

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  useEffect(() => {
  }, [items]);

  const deleteItem = async (item) => {
    const endpoint = 'http://localhost:4044/tiendas/delete'; // URL del servidor de eliminación
    const requestBody = {
      token:token.toString(),
      idTienda: item.id_tienda, // Agrega otros campos si es necesario
    };
  
    try {
      const response = await deleteWithParams(endpoint, requestBody);
  
  
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
  

  const editItem = (items) => {
    router.push(`/Tiendas/EditarTienda/${pathGen()}`)
    console.log(items)
    encryptAndSetLocalStorage('tiendaData', JSON.stringify(items));

  }

  const handleSidebarVisibility = (sidebarVisible) => {
    console.log('Sidebar visibility:', sidebarVisible);
    setValidateSlide(sidebarVisible)

    // Realiza acciones basadas en el valor de sidebarVisible aquí
  };

  const [validateSlide, setValidateSlide] = useState(true)

  useEffect(()=>{
    console.log(validateSlide)
  },[validateSlide])

  const insertItem = (items) => {
    router.push(`/Tiendas/InsertarTienda/${pathGen()}`)
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
          onDelete={(newValue)=> deleteItem(newValue)}
          onEdit={(newValue)=> editItem(newValue)}
          onInsert={(newValue)=> insertItem(newValue)}

        />
      </div>

    </>
  )
}

export default Tiendas