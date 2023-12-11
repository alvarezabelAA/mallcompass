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
import { AiOutlineEye } from 'react-icons/ai';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from '../../components/globals/Modal';

const PromoCarrousel = ({ tiendas ,onClickButton = ()=> {} }) => {
  const [loading, setLoading] = useState(true);
  console.log(tiendas)
  useEffect(() => {
    // Simulación de carga de datos
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2000 milisegundos (ajusta según tus necesidades)
    return () => clearTimeout(delay); // Limpia el timeout si el componente se desmonta antes de que finalice
  }, [tiendas]);

  // Verifica si hay tiendas o si está en proceso de carga
  if (loading || !tiendas ) {
    return <p>Cargando tiendas...</p>;
  }else if(tiendas.length === 0){
    return <p>No hay promos disponibles...</p>;

  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1  // Se mantiene constante
  };
  const defaultImage = '/images/no_image.jpg';



  return (
    <>
      {tiendas.length === 0 || tiendas.every((promocion) => 
        promocion.vigencia_inicio === 0 || promocion.vigencia_final === 0 || new Date(promocion.vigencia_final) <= new Date()
      ) ? (
          <div className="text-center text-gray-500">
            <p>No hay promociones activas.</p>
            {/* Puedes agregar un icono moderno aquí */}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiendas.map((promocion) => (
              <div key={promocion.id} className="bg-slate-300 p-6 rounded-md shadow-md">
                {/* Imagen de la promoción */}
                <img
                  src={promocion.imagen ? '/images/' + promocion.imagen : defaultImage}
                  alt={promocion.descripcion}
                  className="mb-4 rounded-lg w-full h-40 object-cover"
                />
                <h3 className="text-xl font-semibold mb-4">{promocion.descripcion}</h3>
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                  <div className="w-full mb-4 lg:mb-0">
                    <CountdownTimer startTime={promocion.vigencia_inicio} endTime={promocion.vigencia_final} showStyle={true} />
                  </div>
                  <button
                    onClick={() => onClickButton(promocion)}
                    title="Ver promoción"
                    className="flex items-center justify-center text-center rounded-lg border-slate-600 border-4 p-3 transition duration-300"
                  >
                    <AiOutlineEye className="w-7 h-7" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}


    
    </>

  );
};

const Promociones = () => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const hasMounted = useHasMounted();
  const [items,setItems]=useState([])
  const defaultImage = '/images/no_image.jpg';

  const listar =async()=>{
    try {
      const endpoint = 'http://localhost:4044/promociones/publicar/general';
      const queryParams = {
        tokenSesion: token      };
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
    listar()

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
  const [searchTermPromo, setSearchTermPromo] = useState('');

  // useEffect(() => {
  //   const results = items.filter((item) =>
  //     Object.values(item).some((value) =>
  //       value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   );
  //   setSearchResults(results);
  // }, [searchTerm, items]);


  useEffect(() => {
    const results = items.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTermPromo.toLowerCase())
      )
    );
    console.log(results)
    setSearchResults(results);
  }, [searchTermPromo, items]);
  

  const MallProfile = (item) => {
    encryptAndSetLocalStorage('usuarioData', JSON.stringify(item));
    router.push(`../Mall/MallProfile/${pathGen()}`);  
  };

  const [modalVisible, setModalVisible] = useState(false);

  const [modalInfo, setModalInfo]= useState([])

  const handleModalOpen = (item) => {
    console.log(item)
    setModalInfo(item)
    infoTienda(item.id_tienda)
    setModalVisible(true);
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

  const handleModalClose = () => {
    setModalVisible(false);
  };
  return (
    <>
      <SideBars>
        <div className='w-full'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <section className="my-12">
              <div className='text-center'>
                <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-200 p-4 bg-blue-500 rounded-md shadow-md">
    Descubre nuestras promociones
                </h2>                  </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar promociones"
                  value={searchTermPromo}
                  onChange={(e) => setSearchTermPromo(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
              </div>

              <div className='w-full mx-auto py-1 p-8'>                        
                <PromoCarrousel onClickButton={(newValue)=> handleModalOpen(newValue)}  tiendas={searchResults} />
              </div>
            </section>
            
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
            <p>Nombre Tienda: {informacionTienda ?? 'No hay información de tienda disponible'}</p>
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

export default Promociones;
