import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';import Table from '../../components/globals/Table';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import { decryptAndGetLocalStorage, deleteWithbody, encryptAndSetLocalStorage, getFromAPI, getFromAPIWithParams, pathGen } from '../../funciones/api';
import * as iconsFc from 'react-icons/fc';
import { format } from 'date-fns';
import Modal from '../../components/globals/Modal';
import SideBars from '../../components/common/SideBars';
import Image from 'next/image';
import { useAlert } from '../../context/AlertContext';
import Accordion from '../../components/common/Accordion';

const Perfil = () => {
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const [showModal, setShowModal] = useState(false)
  const [esComercial, setEsComercial] = useState(false)

  const { logout } = useAuth(); // Obtén el token del contexto de autenticación
  const showAlertWithMessage  = useAlert();
  const initialData={
    apellido:null,
    nombre:null,
    rol: null,
    correo:null,
    telefono:null,
    imagen:null,
    fecha_nacimiento:null
  }

  const getEnv = () => {
    console.log(token);
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    const decryptedData2 = decryptAndGetLocalStorage('id_comercial');
    const decryptedRol = decryptAndGetLocalStorage('rol');
    if(decryptedData2){
      console.log(decryptedData2)
    }
    if(decryptedRol){
      console.log(decryptedRol)
      if(decryptedRol==='C'){
        setEsComercial(true)
      }else{
        setEsComercial(false)
      }
    }
    listar(token)
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  const listar =async(token)=>{
    try {
      const endpoint = 'http://localhost:4044/usuario/final/consultaGeneral/';
      const queryParams = {
        tokenSesion: token.toString()
      };
      console.log(queryParams)
      const data = await getFromAPIWithParams(endpoint,queryParams);
      if(data.status ===1){
        console.log(data)
        setItems(data.datos)
      }else{
        setItems(initialData)
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);

    }

  }

  useEffect(() => {
    console.log(items)
  }, [items]);

  const defaultImage = '/images/no_image.jpg';

  const handleLogout = async () => {
    const endpoint = 'http://localhost:4044/usuario/final/logout'; // URL del servidor de eliminación
    console.log(token)
    const requestBody = {
      tokenSesion: token.toString(),
    };
    console.log(requestBody)
    
    try {
      
      const response = await deleteWithbody(endpoint, requestBody);
      console.log(response);
  
      if (response.status === 1) {
        showAlertWithMessage('SUCCESS','Consulta válida', 'Se cerro sesion correctamente');
        logout();
        localStorage.clear();
        router.push(`/login/${pathGen()}`);
      } else {
        showAlertWithMessage('ERROR', 'No se cerro sesión correctamente', 'Dsiculpe el error');
      }
    } catch (error) {
      showAlertWithMessage('Warning','Revise su conexión', 'No se encontro conexión: ' + error);
      // Maneja el error aquí
    }
    logout();
    localStorage.clear();
    router.push(`/login/${pathGen()}`);
  };

  const editData =()=>{
    encryptAndSetLocalStorage('usuarioData', JSON.stringify(items));
    router.push(`/Perfil/EditProfile/${pathGen()}`)
  }

  const newStore = () => {
    encryptAndSetLocalStorage('usuarioData', JSON.stringify(items));
    router.push(`/Perfil/NewStore/${pathGen()}`)
  }


  return (
    <>
      <SideBars>
        <div className='w-full'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className='w-full min-h-screen bg-gray-800 font-sans'>
              <div className="flex justify-center items-center h-40 bg-gradient-to-r from-blue-400 via-sky-500 to-green-500">
                <div className='h-20 w-20 md:h-32 md:w-32 relative'>
                  <Image
                    src={items[0]?.imagen ? '/images/' + items[0]?.imagen : defaultImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                    alt="Imagen de perfil"
                    className="rounded-full object-cover"
                    layout="fill"
                  />
                </div>
              </div>

              {/* Resto del contenido del perfil */}
              <header className=" text-white py-2">
                <div className="container mx-auto px-2">
                  <h1 className="text-lg font-semibold ">{items[0]?.nombre + '   '+ items[0]?.apellido}</h1>
                  <h1 className="text-nomal  ">{items[0]?.rol === 'U' ? 'Usuario' : (items[0]?.usuario === 'T' ? 'Tienda' : 'Comercial')}</h1>
                  <h1 className="text-nomal">{items[0]?.telefono}</h1>
                  <h1 className="text-nomal">{items[0]?.correo}</h1>
                  <nav className="mt-4 text-center">
                    {/* <div className='flex justify-center w-full'>
                      <Accordion  title={'Hola'}>assssssssssssssssssssssssssssssssssssS</Accordion>

                    </div> */}
                    {/* Coloca aquí enlaces de navegación si es necesario */}
                    {esComercial && (
                      <button onClick={()=>newStore(items)} className='bg-green-600 m-1 text-white font-semibold py-0.5 px-20 rounded-lg'>
                        <span className='text-sm'>Nueva Tienda</span>
                      </button>
                    )}
                    <button onClick={()=>editData(items)} className='bg-slate-600 m-1 text-white font-semibold py-0.5 px-20 rounded-lg'>
                      <span className='text-sm'>Editar</span>
                    </button>
                    <button onClick={()=>handleLogout()} className='bg-red-800 m-1 text-white font-semibold py-0.5 px-16 rounded-lg'>
                      <span className='text-sm'>Cerrar Sesion</span>
                    </button>
                  </nav>
                </div>
              </header>
              
            </div>
          </motion.div>
        </div>
      </SideBars>
    </>
  )
}

export default Perfil