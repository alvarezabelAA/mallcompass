import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import useHasMounted from '../../../hooks/useHasMounted';
import SideBars from '../../../components/common/SideBars';
import { decryptAndGetLocalStorage, encryptAndSetLocalStorage, getFromAPIWithParams, pathGen } from '../../../funciones/api';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('../../../components/Map'), {
  ssr: false,
});
import Modal from '../../../components/globals/Modal';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Importa el icono de ubicación desde react-icons
import { FaWaze, FaMapMarkedAlt  } from 'react-icons/fa';  // Importa el ícono de Waze desde react-icons/fa
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { format } from "date-fns";
const openGoogleMaps = (latitud, longitud) => {
  // Construye la URL de Google Maps con la latitud y longitud
  const mapsUrl = `https://www.google.com/maps/dir//${latitud},${longitud}/`;

  // Abre la URL en una nueva ventana o pestaña
  window.open(mapsUrl, '_blank');
};

const TiendasCarousel = ({ tiendas, onTap = () =>{} }) => {
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
    return <p>No hay tiendas disponibles...</p>;

  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
  };
  const defaultImage = '/images/no_image.jpg';



  return (
    <Slider {...settings}>
      {tiendas.map((tienda) => (
        <div onClick={() => onTap(tiendas)} key={tienda.id_tienda} className="bg-opacity-25 p-6 rounded-lg shadow-lg flex items-center justify-center transition duration-300 transform hover:scale-105">
          {/* Imagen de la tienda */}
          <div className="h-24 w-24 mb-2 overflow-hidden rounded-full flex bg-white">
            <Image
              src={tienda.imagen ? '/images/' + tienda.imagen : defaultImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
              width={100}
              height={100}
              alt="Imagen de la tienda"
              className="w-full h-full object-cover rounded-full"
              layout="responsive"
            />
          </div>

          {/* Contenido de la tienda */}
          <div className="">
            <h3 className="text-sm font-semibold mb-1 truncate">{tienda.nombreTienda}</h3>
            <p className="text-xs text-gray-300">{tienda.categoriaTienda}</p>
          </div>
        </div>
      ))}
    </Slider>

  );
};




const MallProfile = () => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const hasMounted = useHasMounted();
  const [profileData, setProfileData] = useState(null);
  const [items, setItems] = useState(null);
  const [itemsComercial, setItemsComercial] = useState(null);
  const [itemsComercialNombre, setItemsNombreComercial] = useState(null);
  const [numeroComercial, setNumeroComercial] = useState('');

  const getEnv = () => {
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    const decryptedData = decryptAndGetLocalStorage('usuarioData');
    const objeto = JSON.parse(decryptedData);
    console.log(objeto)
    setProfileData(objeto);
    if(objeto?.id_centroComercial){
      listar(objeto.id_centroComercial)
      listarPostComercial(objeto.id_centroComercial)
    }
    
    if(objeto?.id_tienda){
      const decryptedData2 = decryptAndGetLocalStorage('id_comercial');
      listarComercialesNombres();
      listarPostTienda(objeto?.id_tienda);
      if (decryptedData2) {
        const comercial = JSON.parse(decryptedData2);
        console.log(decryptedData2);
        setNumeroComercial(comercial);
      } else {
        console.error('El dato a parsear está vacío o es nulo.');
        // Puedes manejar esta situación según tus necesidades.
      }
    }
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);
  const defaultImage = '/images/no_image.jpg';

  const [modalVisible, setModalVisible] = useState(false);
  const [lng, setLng] = useState(-90.50569325945615);
  const [lat, setLat] = useState(14.63679332755007);

  const handleModalOpen = (item) => {
    setLng(item.longitud)
    setLat(item.latitud)
    setModalVisible(true);
  };
  
  const handleModalClose = () => {
    setLng('')
    setLat('')
    setModalVisible(false);
  };


  const EnlaceWaze = ({ latitud, longitud }) => {
    const enlaceWaze = `https://www.waze.com/ul?ll=${latitud},${longitud}&navigate=yes`;
  
    return (
      <button
        onClick={() => window.open(enlaceWaze, '_blank')}
        className="px-3 py-1 bg-blue-500 mx-1 rounded flex items-center"
      >
        <FaWaze className="text-white mr-2" /> 
        <span className='text-white'>Waze</span>
      </button>
    );
  };

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


  const listarPostComercial =async(comercial)=>{
    try {
      const endpoint = 'http://localhost:4044/centroComercial/post';
      console.log(token)
      console.log(comercial)
      const queryParams = {
        tokenSesion: token,
        id_centroComercial: comercial
      };
      console.log(queryParams)
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setItemsComercial(data.datos)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }

  const listarPostTienda =async(tienda)=>{
    try {
      const endpoint = 'http://localhost:4044/tiendas/post';
      console.log(token)
      console.log(tienda)
      const queryParams = {
        tokenSesion: token,
        id_tienda: tienda
      };
      console.log(queryParams)
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setItemsComercial(data.datos)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }

  const listarComercialesNombres =async()=>{
    try {
      const endpoint = 'http://localhost:4044/centroComercial/consultaGeneral/activo';
      const queryParams = {
        token: token.toString()
      };
      const data = await getFromAPIWithParams(endpoint, queryParams);
      console.log(data)
      setItemsNombreComercial(data.datos)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);

    }

  }


  useEffect(()=>{

  },[items,itemsComercial,itemsComercialNombre])

  useEffect(()=>{
    console.log(numeroComercial)
  },[numeroComercial])

  const MallProfile = (item) => {
    console.log(item)
    encryptAndSetLocalStorage('usuarioData', JSON.stringify(item));
    setProfileData(item)
    if(item?.id_centroComercial){
      listar(item.id_centroComercial)
      listarPostComercial(item.id_centroComercial)
    }
    
    if(item?.id_tienda){
      const decryptedData2 = decryptAndGetLocalStorage('id_comercial');
      listarComercialesNombres();
      listarPostTienda(item?.id_tienda);
      if (decryptedData2) {
        const comercial = JSON.parse(decryptedData2);
        console.log(decryptedData2);
        setNumeroComercial(comercial);
      } else {
        console.error('El dato a parsear está vacío o es nulo.');
        // Puedes manejar esta situación según tus necesidades.
      }
    }
    window.location.reload();
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
            {profileData && (
              <div className='w-full min-h-screen bg-gray-800 font-sans text-white'>
                <div className="flex items-center bg-gradient-to-r from-blue-400 via-sky-500 to-green-500 p-4">
                  <div className='h-20 w-20 md:h-32 md:w-32 relative mr-4'>
                    <Image
                      src={profileData.imagen ? '/images/' + profileData.imagen : defaultImage}
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
                    <h1 className="text-2xl font-bold">
                      {profileData.nombreCC || profileData.nombreTienda}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {profileData.nombreCC ? 'Centro Comercial' : 'Tienda'}
                    </p>
                  </div>
                </div>
                <div className=" mt-4 px-6">
                  {/* Resto del contenido */}
                  <p className="text-sm">
                    <span className="font-bold">Correo Electrónico:</span> {profileData.correo}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">Teléfono:</span> {profileData.telefono}
                  </p>
                  {profileData.nombreCC && (
                    <>
                      <p className="text-sm">
                        <span className="font-bold">Dirección:</span> {profileData.direccion}
                      </p>
                      <p className="text-sm">
                        <span className="font-bold">Estado:</span> {profileData.estado_cuenta}
                      </p>
                    </>
                  )}
                  {profileData.nombreTienda && (
                    <>
                      <p className="text-sm">
                        <span className="font-bold">Número de Local:</span> {profileData.numeroLocal}
                      </p>
                      <p className="text-sm">
                        <span className="font-bold">Categoría:</span> {profileData.categoriaTienda}
                      </p>
                    </>
                  )}
                  {profileData.nombreCC && (
                    <>
                      <div className='flex justify-center py-1'>
                        <button onClick={()=>handleModalOpen(profileData)}     className="px-4 py-2 bg-red-700 text-white rounded flex items-center gap-2">
                          <FaMapMarkerAlt /> {/* Icono de ubicación */}
                        Ubicación
                        </button>
                      </div>
                    </>
                  )}
                  {profileData.nombreCC && (
                    <>
                      <div className=''>
                        <h1 className="text-2xl font-extrabold leading-tight">Tiendas</h1>
                        <div className='w-full mx-auto py-1 cursor-pointer'>                        
                          <TiendasCarousel  tiendas={items} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <>
                  <div className='px-4 mt-2'>
                    <h1 className="text-2xl font-extrabold leading-tight">Publicaciones</h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 mt-4">
                    {itemsComercial?.map((result) => (
                      <div key={result.descripcion} className="col-span-1 border border-gray-300 rounded-md overflow-hidden shadow-md">
                        <div className="relative h-48">
                          <Image
                            src={result.imagen ? '/images/' + result.imagen : defaultImage}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultImage;
                            }}
                            alt="Imagen de perfil"
                            className="w-full h-full object-cover rounded-t-md"
                            layout="fill"
                          />
                        </div>
                        <div className="p-4 bg-white">
                          <p className="font-semibold text-xs md:text-lg mb-2 text-black">{result.descripcion}</p>
                          <p className="text-gray-600 mb-2 text-xs md:text-lg truncate">Actividad: {result.actividad}</p>
                          <p className="text-gray-600 mb-2 text-xs md:text-lg">
          Inicia: {format(new Date(result.vigencia_inicio), "yyyy-MM-dd HH:mm:ss")}
                          </p>
                          <p className="text-gray-600 mb-2 text-xs md:text-lg">
          Termina: {format(new Date(result.vigencia_final), "yyyy-MM-dd HH:mm:ss")}
                          </p>
                          <p className="text-gray-600 text-xs md:text-lg">Categoría: {result.categoria}</p>
                          {/* Otros campos que desees mostrar */}
                        </div>
                      </div>
                    ))}
                  </div>





                </>
              </div>
            )}
          </motion.div>
        </div>
      </SideBars>
      {modalVisible && (
        <Modal titulo="Ubicación" onClose={handleModalClose}>
          <Map enableClick={false} latitud={lat} longitud={lng} />
          <div className='flex justify-center mt-5'>
            <button onClick={() => openGoogleMaps(lat, lng)} className="px-3 py-1 mx-1 bg-red-600 rounded flex items-center">
              <FaMapMarkedAlt className="text-white mr-2" /> 
              <span className='text-white'>Maps</span>
            </button>
            <EnlaceWaze latitud={lat} longitud={lng} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default MallProfile;
