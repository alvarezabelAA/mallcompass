import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import { decryptAndGetLocalStorage, encryptAndSetLocalStorage, getFromAPIWithParams, pathGen } from '../../funciones/api';
import NavBar from '../../components/globals/NavBar';
import SideBars from '../../components/common/SideBars';
import Image from 'next/image';
import CountdownTimer from '../../components/common/CountdownTimer';
import Modal from '../../components/globals/Modal';

const Feed = () => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const hasMounted = useHasMounted();
  const [items,setItems]=useState([])
  const defaultImage = '/images/no_image.jpg';

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

  const listarTiendas =async()=>{
    try {
      const endpoint = 'http://localhost:4044/tiendas/consultaGeneral';
      const queryParams = {
        token: token      
      };
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      // setItems(data.datos)
      setItems((prevItems) => [...prevItems, ...data.datos]);
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);

    }

  }

  const [listarPromos, setListarPromos]=useState([])

  const listarPromociones =async()=>{
    try {
      const endpoint = 'http://localhost:4044/promociones/publicar/general';
      const queryParams = {
        tokenSesion: token      };
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setItems((prevItems) => [...prevItems, ...data.datos]);
      setListarPromos(data.datos)
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
    listar()
    listarTiendas()
    listarPromociones()

  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  // Filtrar los resultados al cambiar el término de búsqueda

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const results = items
      .filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        // Ordenar por id_centroComercial
        const centroComercialA = parseInt(a.id_centroComercial, 10);
        const centroComercialB = parseInt(b.id_centroComercial, 10);
        if (centroComercialA !== centroComercialB) {
          return centroComercialA - centroComercialB;
        }
  
        // Si id_centroComercial es igual, ordenar por id_tienda
        const tiendaA = parseInt(a.id_tienda, 10);
        const tiendaB = parseInt(b.id_tienda, 10);
        if (tiendaA !== tiendaB) {
          return tiendaA - tiendaB;
        }
  
        // Si id_tienda es igual, ordenar por id_promocion
        const promocionA = parseInt(a.id_promocion, 10);
        const promocionB = parseInt(b.id_promocion, 10);
        return promocionA - promocionB;
      });
  
    console.log(results);
    setSearchResults(results);
  }, [searchTerm, items]);

  const [modalVisible, setModalVisible] = useState(false);

  const [modalInfo, setModalInfo]= useState([])

  const handleModalOpen = (item) => {
    console.log(item)
    infoTienda(item.id_tienda)
    setModalInfo(item)
    setModalVisible(true);
  };
  
  const handleModalClose = () => {
    setModalVisible(false);
  };

  const MallProfile = (item) => {
    console.log(item);
  
    if (item.id_centroComercial) {
      // Hacer algo si item tiene id_centroComercial
      encryptAndSetLocalStorage('usuarioData', JSON.stringify(item));
      router.push(`../Mall/MallProfile/${pathGen()}`);
      console.log("ID del Centro Comercial encontrado");
    } else if (item.id_tienda) {
      // Hacer algo si item tiene id_tienda
      encryptAndSetLocalStorage('usuarioData', JSON.stringify(item));
      router.push(`../Mall/MallProfile/${pathGen()}`);
      console.log("ID de Tienda encontrado");
    } else if (item.id_promocion) {
      // Hacer algo si item tiene id_promocion
      console.log("ID de Promoción encontrado");
      handleModalOpen(item)
    } else {
      // Hacer algo si no se cumple ninguna condición
      console.log("No se encontró ninguna ID válida");
    }
  };

  const [informacionTienda,setInfoTienda]= useState('')

  const infoTienda =async(tienda)=>{
    try {
      const endpoint = 'http://localhost:4044/tiendas/consulta';
      console.log(token)
      console.log(tienda)
      const queryParams = {
        token: token,
        idTienda: tienda
      };
      console.log(queryParams)
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setInfoTienda(data?.datos[0].nombreTienda)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
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
            <div className='w-full min-h-screen bg-white font-sans'>
              <input
                type='text'
                placeholder='Buscar...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full h-10 px-3 mb-5 mt-5 outline-none focus:outline-none border-[1px] border-gray-400 rounded-md'
              />

              {/* Renderizar los resultados filtrados */}
              {searchResults.map((result) => (
                <div onClick={()=>MallProfile(result)} key={result.id_centroComercial} className='cursor-pointer flex items-center space-x-4 p-4 border-b border-gray-300'>
                  <div className='h-10 w-10 relative'>
                    <Image
                      src={result.imagen ? '/images/' + result.imagen : defaultImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                      alt="Imagen de perfil"
                      className="rounded-full object-cover"
                      layout="fill"
                    />
                  </div>
                  <div>
                    <p className='font-semibold text-black'>{result?.nombreCC || result?.nombreTienda || result?.descripcion}</p>
                    <p className='text-black'>{result?.direccion || result?.categoriaTienda || 'Está promocion tiene: ' + result?.cantidad + ' promociones'}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
      </SideBars>
      {modalVisible && (
        <Modal titulo="Promoción" onClose={handleModalClose}>
          <div className="p-4">
            <CountdownTimer
              startTime={modalInfo?.vigencia_inicio}
              endTime={modalInfo?.vigencia_final}
              showStyle={true}
            />
            <p className="text-lg font-bold mb-2">{modalInfo?.descripcion}</p>
            <p className="mt-2">Cantidad disponible: {modalInfo?.cantidad}</p>
            <p>Precio: <span className="text-green-500">${modalInfo?.precio}</span></p>
            {/* <p>Nombre Tienda: {informacionTienda ?? 'No hay información de tienda disponible'}</p> */}
            <div className="grid grid-cols-1 gap-4 mt-4">
              {[
                { src: modalInfo.qr_convertido, alt: "Código QR de la promoción" },
                { src: modalInfo.imagen ? '/images/' + modalInfo.imagen : defaultImage, alt: "Imagen de la promoción" },
              ].map((item, index) => (
                <div key={index} className="h-1/5">
                  {item.alt === "Código QR de la promoción" ? (
                    <a href={item.src} download={item.alt}>
                      <Image
                        src={item.src}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImage;
                        }}
                        alt={item.alt}
                        className="rounded-t-md object-cover"
                        layout="responsive"
                        width={30} // Ajusta según tus necesidades
                        height={30} // Ajusta según tus necesidades
                      />
                    </a>
                  ) : (
                    // <Image
                    //   src={item.src}
                    //   onError={(e) => {
                    //     e.target.onerror = null;
                    //     e.target.src = defaultImage;
                    //   }}
                    //   alt={item.alt}
                    //   className="rounded-t-md object-cover"
                    //   layout="responsive"
                    //   width={80} // Ajusta según tus necesidades
                    //   height={80} // Ajusta según tus necesidades
                    // />
                    null
                  )}
                </div>
              ))}
            </div>
          </div>


        </Modal>
      )}
    </>
  );
};

export default Feed;