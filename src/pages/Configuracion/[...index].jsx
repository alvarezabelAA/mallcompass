import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';import Table from '../../components/globals/Table';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import { encryptAndSetLocalStorage, getFromAPI, getFromAPIWithParams, pathGen } from '../../funciones/api';
import * as iconsFc from 'react-icons/fc';
import { format } from 'date-fns';
import Modal from '../../components/globals/Modal';
import SideBars from '../../components/common/SideBars';

const Configuracion = () => {
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const [showModal, setShowModal] = useState(false)

  const initialData={
    apellido:null,
    nombre:null,
    rol: null,
    correo:null,
    telefono:null,
    imagen:null,
    fecha_nacimiento:null
  }

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
      
  const getEnv = () => {
    console.log(token);
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    listar(token)
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);


  const deleteItem = (item) => {
    console.log(item)
  }

  // Función para formatear el nombre completo según el rol
  const formatFullName = (rol, nombre, apellido) => {
    switch (rol) {
      case 'S':
        return 'Super Administrador';
      case 'U':
        return `Usuario ${nombre} ${apellido}`;
      case 'C':
        return 'Centro Comercial';
      case 'T':
        return 'Tienda';
      default:
        return '';
    }
  };

  const cerrarModel = () => {
    setShowModal(false)
  }

  useEffect(()=>{
    console.log(showModal)
  },[showModal])

  const editData =()=>{
    encryptAndSetLocalStorage('usuarioData', JSON.stringify(items));
    router.push(`/Configuracion/EditarUsuario/${pathGen()}`)
  }

  const [validateSlide, setValidateSlide] = useState(true)

  useEffect(()=>{
    console.log(validateSlide)
  },[validateSlide])

  const handleSidebarVisibility = (sidebarVisible) => {
    console.log('Sidebar visibility:', sidebarVisible);
    setValidateSlide(sidebarVisible)

    // Realiza acciones basadas en el valor de sidebarVisible aquí
  };


  return (
    <>
      <SideBars>      
        <div className="p-4 sm:ml-64">
          <div className='flex items-center justify-center rounded-lg'>
            <div className='m-2 gap-4 grid grid-flow-row-dense grid-cols-3 grid-rows-3 bg-white rounded-t-lg'>
              <div className="bg-indigo-500 rounded-t-lg p-2  items-center col-span-3 font-semibold text-4xl flex ">
                <iconsFc.FcSettings className='flex-shrink-0 w-10 h-10 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span>Datos del Usuario</span>
              </div>
              <div className=" p-2 flex items-center col-span-2 font-semibold text-xl">
                <iconsFc.FcPortraitMode className='flex-shrink-0 w-10 h-10 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
              Nombre:
              </div>
              <div className='p-2 col-span-1 text-xl'>{items.length > 0
                ? items[0].nombre +' '+ items[0].apellido : ''}</div>
              <div className="flex p-2 items-center col-span-2 font-semibold text-xl">
                <iconsFc.FcFeedback className='flex-shrink-0 w-10 h-10 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />Correo:</div>
              <div className='col-span-1 text-xl'>{items.length > 0
                ?items[0].correo:''}</div>
              <div className="flex p-2 items-center col-span-2 font-semibold text-xl">
                <iconsFc.FcPhone className='flex-shrink-0 w-10 h-10 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />Telefono:</div>
              <div className='col-span-1 text-xl'>{items.length > 0
                ?items[0].telefono:''}</div>
              <div className="flex p-2 items-center col-span-2 font-semibold text-xl">
                <iconsFc.FcCalendar className='flex-shrink-0 w-10 h-10 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />Fecha Nacimiento:</div>
              <div className=" p-2 col-span-1 text-xl">
                {items.length > 0
                  ? format(new Date(items[0].fecha_nacimiento), 'dd/MM/yyyy')
                  : ''}
              </div>   
              <div className="flex items-center p-2 col-span-2 font-semibold text-xl">
                <iconsFc.FcPrivacy className='flex-shrink-0 w-10 h-10 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />Rol:</div>
              <div className="p-2 col-span-1 text-xl">
                {items.length > 0
                  ? formatFullName(items[0].rol, items[0].nombre, items[0].apellido)
                  : ''}
              </div>
              <div className='flex justify-center items-center col-span-3 font-semibold text-xl p-2'>
                <div className='mx-2 w-full'>
                  <button
                    onClick={ ()=> editData()}
                    type="button"
                    className="w-full mt-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
            Editar Usuario
                  </button>
                </div>
              
              </div>     
            </div>
          </div>
        
        </div>
      </SideBars>
    </>
  )
}

export default Configuracion