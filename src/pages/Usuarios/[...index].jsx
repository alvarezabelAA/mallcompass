import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';import Table from '../../components/globals/Table';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import SideBar from '../../components/globals/SideBar';
import { deleteWithParams, encryptAndSetLocalStorage, getFromAPI, getFromAPIWithParams, pathGen } from '../../funciones/api';
import { useAlert } from '../../context/AlertContext';

const Usuarios = () => {
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const { showAlertWithMessage } = useAlert();

  const listar =async()=>{
    try {
      const endpoint = 'http://localhost:4044/usuario/final/consulta';
      
      const data = await getFromAPI(endpoint);
      console.log(data)
      setItems(data.datos)
      if(data.status ==='1'){
        showAlertWithMessage('OK', 'Datos obtenidos')
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

  useEffect(() => {
    console.log(items)
  }, [items]);
   
 
  
  
  const Headers = [
    { titulo: "Nombre", fila: "nombre", class: "text-center" },
    { titulo: "Apellido", fila: "apellido", class: "text-center" },
    { titulo: "Id Usuario", fila: "id_usuario", class: "text-center" },
    { titulo: "Rol", fila: "rol", class: "text-center" },
    { titulo: "Número de Teléfono", fila: "telefono", class: "text-center" },
    { titulo: "Correo", fila: "correo", class: "text-center" },
    { titulo: "Imagen", fila: "imagen", class: "text-center" },
    { titulo: "Fecha", fila: "fecha_nacimiento", class: "text-center" },
    // Agrega más títulos y filas según sea necesario
  ];

  const insertItem = (item) => {
    console.log(item)
    router.push(`/Usuarios/InsertarUsuario/${pathGen()}`)
  }



  

  const deleteItem = async (item) => {
    console.log(item);
    const endpoint = 'http://localhost:4044/usuario/final/delete'; // URL del servidor de eliminación
    const requestBody = {
      id_usuario: item.id_usuario, // Agrega otros campos si es necesario
    };
  
    try {
      const response = await deleteWithParams(endpoint, requestBody);
  
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
  

  const editItem = (items) => {
    router.push(`/Usuarios/EditarUsuarios/${pathGen()}`)
    encryptAndSetLocalStorage('usuarioData', JSON.stringify(items));

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


  return (
    <>
      <SideBar onVisible={(newValue) => handleSidebarVisibility(newValue)} />
      <div className={`p-4 ml-24 ${validateSlide ? 'sm:ml-24': 'sm:ml-64'}`}>
        <Table
          showInsertButton={true}
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

export default Usuarios