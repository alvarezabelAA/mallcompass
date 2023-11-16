import React, { useEffect, useState } from 'react'
import SideBar from '../../../components/globals/SideBar'
import { decryptAndGetLocalStorage, getFromAPIWithParams } from '../../../funciones/api';
import { useAlert } from '../../../context/AlertContext';
import { useRouter } from 'next/router';
import useHasMounted from '../../../hooks/useHasMounted';
import { useAuth } from '../../../context/AuthContext';
import TiendaCard from '../../../components/globals/TiendaCard';
import SideBars from '../../../components/common/SideBars';

const TiendasComercial = () => {

  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const [centroComercial,setCentroComercial]=useState([])
  const showAlertWithMessage  = useAlert();


  const listar =async(comercial)=>{
    try {
      const endpoint = 'http://localhost:4044/centroComercial/listaTiendas';
      console.log(token)
      console.log(comercial)
      const queryParams = {
        token: token,
        id_centroComercial: comercial
      };
      console.log(queryParams)
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
    const decryptedData = decryptAndGetLocalStorage('tiendasData');
    console.log(decryptedData)
    listar(decryptedData.id_centroComercial)
    setCentroComercial(decryptedData.nombreCC)

  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  const [validateSlide, setValidateSlide] = useState(true)

  useEffect(()=>{
  },[validateSlide])

  const handleSidebarVisibility = (sidebarVisible) => {
    setValidateSlide(sidebarVisible)
    // Realiza acciones basadas en el valor de sidebarVisible aquí
  };

  const nowStore = (item) => {
    console.log(item)
  }

  return (
    <>
      <SideBars>
        <div className='p-4'>
          <div>
            <h1 className="text-3xl font-bold mb-4">¡Bienvenido a {centroComercial}!</h1>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Descubre nuestras increíbles tiendas:</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
              {items.length > 0 ? (
                items.map((tienda) => (
                  <div key={tienda.id_tienda}>
                    <TiendaCard onEdit={(newValue)=> nowStore(newValue) } tienda={tienda} />
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-lg font-semibold">
      Lo sentimos, no tenemos tiendas disponibles en este momento. ¡Vuelve pronto para descubrir nuestras nuevas
      tiendas!
                </p>
              )}
            </div>
          </div>
        </div>
      </SideBars>
    </>
  )
}

export default TiendasComercial