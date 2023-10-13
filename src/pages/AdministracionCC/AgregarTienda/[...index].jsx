import React, { useEffect, useState } from 'react'
import SideBar from '../../../components/globals/SideBar'
import { useAlert } from '../../../context/AlertContext';
import useHasMounted from '../../../hooks/useHasMounted';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/router';
import { decryptAndGetLocalStorage, getFromAPIWithParams, pathGen, postToAPIWithParamsAndBody, putToAPIWithParamsAndBody } from '../../../funciones/api';
import CardStore from '../../../components/globals/CardStore';
import * as iconsFc from 'react-icons/fc';

const AgregarTienda = () => {
  const [validateSlide, setValidateSlide] = useState(true)
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const [usuario ,setUsuario]=useState([])
  const [centroCC ,setCentroCC]=useState([])
  const { showAlertWithMessage } = useAlert();

  const handleSidebarVisibility = (sidebarVisible) => {
    setValidateSlide(sidebarVisible)
    // Realiza acciones basadas en el valor de sidebarVisible aquí
  };

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

  const getEnv = () => {
    console.log(token);
    if (!token) {
      router.push('/login/23232');
    }
    listar()
    const decryptedData = decryptAndGetLocalStorage('id_centroComercial');
    console.log(decryptedData)
    setCentroCC(decryptedData)
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  const onClickButtonChange = async(items) =>{
    console.log('Bueno')
    console.log(items)
    console.log(centroCC)
    console.log(token)
    const endpoint = 'http://localhost:4044/tiendas/relCC'; // Ajusta la URL del servidor de registro
    const queryParams = {
      token: token.toString()
      
    };

    const registroData =  {
      idComercial:centroCC,
      id_tienda : items.id_tienda
    }
    console.log(queryParams)
    try {
      try {
        const response = await postToAPIWithParamsAndBody(endpoint, queryParams, registroData);
        console.log(response)
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          router.push(`/AdministracionCC/${pathGen()}`);
          showAlertWithMessage('OK', 'Se modificaron los datos')
        }else{
          showAlertWithMessage('ERROR', 'No se ingreso la data')

        }
        
      } catch (error) {
        showAlertWithMessage('ERROR', 'Error al hacer la solicitud POST:' + error)
        // Maneja el error aquí
      }
    } catch (error) {
      showAlertWithMessage('ERROR', 'Error al hacer la solicitud:' + error)
    }
  }

  const regresarTiendas = () =>{
    router.push(`/AdministracionCC/${pathGen()}`);

  }

  return (
    <>
      <SideBar onVisible={(newValue) => handleSidebarVisibility(newValue)} />
      <div className={`p-4 ml-24 ${validateSlide ? 'sm:ml-24': 'sm:ml-64'}`}>
        {items.length > 0 && (
          <div className=''>
            <CardStore item={items} onClickButton={(newValue)=> onClickButtonChange(newValue)} />
          </div>
        )}
        <div className='flex justify-center'>
          <button onClick={() => regresarTiendas()} className='rounded bg-slate-600 text-white px-3 flex items-center'>
            <iconsFc.FcCancel className='w-6 h-6 flex-shrink-0 text-white'/>
            Regresar
          </button>
        </div>
      </div>

    </>
  )
}

export default AgregarTienda