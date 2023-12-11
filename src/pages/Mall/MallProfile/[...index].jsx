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
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa'; // Importa el icono de ubicación desde react-icons
import { FaWaze, FaMapMarkedAlt  } from 'react-icons/fa';  // Importa el ícono de Waze desde react-icons/fa
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { format } from "date-fns";
import ReactPaginate from 'react-paginate';
import { AiOutlineEye } from 'react-icons/ai';
import CountdownTimer from '../../../components/common/CountdownTimer';
const openGoogleMaps = (latitud, longitud) => {
  // Construye la URL de Google Maps con la latitud y longitud
  const mapsUrl = `https://www.google.com/maps/dir//${latitud},${longitud}/`;

  // Abre la URL en una nueva ventana o pestaña
  window.open(mapsUrl, '_blank');
};
const ITEMS_PER_PAGE = 4; // Número de elementos por página

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
    return <p>No hay tiendas disponibles...</p>;

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
    <Slider {...settings}>
      {tiendas.length === 0 || tiendas.every((promocion) => 
        promocion.vigencia_inicio === 0 || promocion.vigencia_final === 0 || new Date(promocion.vigencia_final) <= new Date()
      ) ? (
          <div className="text-center text-gray-500">
            <p>No hay promociones activas.</p>
            {/* Puedes agregar un icono moderno aquí */}
          </div>
        ) : (
          tiendas.map((promocion) => (
            <div key={promocion.id} className="bg-slate-300 p-6 rounded-md shadow-md">
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
          ))
        )}
    </Slider>

  );
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
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  const defaultImage = '/images/no_image.jpg';

  



  return (
    <Slider {...settings}>
      {tiendas.map((tienda) => (
        <div
          onClick={() => onTap(tiendas)}
          key={tienda.id_tienda}
          className="bg-opacity-25 border p-6 rounded-lg shadow-lg grid grid-cols-2 gap-1 transition duration-300 transform hover:scale-105"
        >
          {/* Imagen de la tienda */}
          <div className=" h-24  mb-2  col-span-2 object-cover flex justify-center">
            <div className="flex-shrink-0 flex justify-center h-24 w-24 mb-2 overflow-hidden rounded-lg bg-white">
              <Image
                src={tienda.imagen ? '/images/' + tienda.imagen : defaultImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
                width={50}
                height={50}
                alt="Imagen de la tienda"
                className=""
                layout="responsive"
              />
            </div>
          </div>
      
          {/* Contenido de la tienda */}
          <div className="ml-4 col-span-2  z-20">
            <h3 className="text-sm font-semibold mb-1 truncate">{tienda.nombreTienda}</h3>
            <p className="text-xs text-gray-500">{tienda.categoriaTienda}</p>
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
      listarPromociones(objeto?.id_tienda)

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

  const [modalVisible2, setModalVisible2] = useState(false);

  const [modalInfo, setModalInfo]= useState([])

  const handleModalOpen2 = (item) => {
    console.log(item)
    setModalInfo(item)
    infoTienda(item.id_tienda)
    setModalVisible2(true);
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

  const handleModalClose2 = () => {
    setLng('')
    setLat('')
    setModalVisible2(false);
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


  const listarPostComercial = async (comercial) => {
    try {
      const endpoint = 'http://localhost:4044/centroComercial/post';
      const queryParams = {
        tokenSesion: token,
        id_centroComercial: comercial,
      };
      const data = await getFromAPIWithParams(endpoint, queryParams);
  
      if (data.status === 1) {
        // Filtrar elementos cuya vigencia_final sea menor o igual a la fecha actual
        const filteredItems = data.datos.filter((item) => {
          console.log(new Date(item.vigencia_final))
          const vigenciaFinalDate = new Date(item.vigencia_final);
          const currentDate = new Date();
          console.log(currentDate)
          return vigenciaFinalDate >= currentDate;
        });
        console.log(filteredItems)
        setItemsComercial(filteredItems);
      } else {
        // Manejar otros casos según sea necesario
        console.log('Error en la respuesta:', data);
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const [listarPromos,setPromos]= useState('')

  const listarPromociones = async (tienda) => {
    try {
      const endpoint = 'http://localhost:4044/promociones/publicar';
      console.log(token)
      console.log(tienda)
      const queryParams = {
        tokenSesion: token,
        id_tienda: tienda
      };
      console.log(queryParams)
      const response = await getFromAPIWithParams(endpoint, queryParams);
      console.log('Tipo de datos de data:', typeof response.datos);
      console.log('Contenido de data:', response.datos);
      setPromos(response.datos)
    
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };
  
  

  const listarPostTienda =async(tienda)=>{
    try {
      const endpoint = 'http://localhost:4044/tiendas/post';
      console.log(token)
      console.log(tienda)
      const queryParams = {
        tokenSesion: token,
        id_tienda: tienda
      };
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      if(data.status ===1){
        // Filtrar elementos cuya vigencia_final sea menor o igual a la fecha actual
        const filteredItems = data.datos.filter((item) => {
          console.log(new Date(item.vigencia_final))
          const vigenciaFinalDate = new Date(item.vigencia_final);
          const currentDate = new Date();
          console.log(currentDate)
          return vigenciaFinalDate <= currentDate;
        });
        console.log(filteredItems)
        setItemsComercial(data.datos)

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

  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const paginatedItems = itemsComercial?.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  ) || [];


  
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
              <div className='w-full min-h-screen bg-white font-sans text-black'>
                <div className="bg-gray-100 p-4 rounded-md shadow-md">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 md:h-32 md:w-32 relative mr-4">
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
                  <div className="mt-4 px-6 text-black">
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
                      <div className='flex justify-center py-1'>
                        <button onClick={() => handleModalOpen(profileData)} className="px-4 py-2 bg-red-700 text-white rounded flex items-center gap-2">
                          <FaMapMarkerAlt />
          Ubicación
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className=" mt-4 px-6 text-center">
                  {profileData.nombreCC && (
                    <>
                      <div className=''>
                        <h1 className="text-2xl font-extrabold leading-tight">Tiendas</h1>
                        <div className='w-full mx-auto py-1 cursor-pointer'>
                          <TiendasCarousel tiendas={items} />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className=" mt-4 px-6 text-center">
                  {profileData.nombreTienda && (
                    <>
                      <div className=''>
                        <h1 className="text-2xl font-extrabold leading-tight">Promociones</h1>
                        <div className='w-full mx-auto py-1 cursor-pointer'>
                          <PromoCarrousel onClickButton={(newValue)=> handleModalOpen2(newValue)}  tiendas={listarPromos} />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <>
                  <div className='px-4 mt-5 text-center'>
                    <h1 className="text-2xl font-extrabold leading-tight">Publicaciones</h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 mt-4">
                    {paginatedItems?.length === 0 ? (
                      <div className="col-span-full text-center text-gray-500">
                        <p>No hay publicaciones disponibles.</p>
                      </div>
                    ) : (
                      paginatedItems?.map((result) => (
                        <div key={result.descripcion} className="col-span-1 bg-white border border-gray-300 rounded-md overflow-hidden shadow-md transition-transform transform hover:scale-105">
                          <div className="relative h-48 overflow-hidden">
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
                          <div className="p-4">
                            <p className="font-semibold text-sm md:text-lg mb-2 text-gray-800">{result.descripcion}</p>
                            <p className="text-gray-600 mb-2 text-xs md:text-sm truncate">Actividad: {result.actividad}</p>
                            <p className="text-gray-600 mb-2 text-xs md:text-sm">
            Inicia: {format(new Date(result.vigencia_inicio), "yyyy-MM-dd HH:mm:ss")}
                            </p>
                            <p className="text-gray-600 mb-2 text-xs md:text-sm">
            Termina: {format(new Date(result.vigencia_final), "yyyy-MM-dd HH:mm:ss")}
                            </p>
                            <p className="text-gray-600 text-xs md:text-sm">Categoría: {result.categoria}</p>
                            {/* Otros campos que desees mostrar */}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <ReactPaginate
                    previousLabel={<FaChevronLeft />}
                    nextLabel={<FaChevronRight />}
                    pageCount={Math.ceil(itemsComercial?.length / ITEMS_PER_PAGE)}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={1}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination flex justify-center mt-4'}
                    pageClassName={'mx-2 cursor-pointer'}
                    previousClassName={'bg-slate-500 text-white py-2 px-4 rounded-md mr-2 cursor-pointer'}
                    nextClassName={'bg-slate-500 text-white py-2 px-4 rounded-md ml-2 cursor-pointer'}
                    activeClassName={'bg-slate-700 p-2 px-4 rounded text-white'}
                  />

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
      {modalVisible2 && (
        <Modal titulo="Promoción" onClose={handleModalClose2}>
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
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { src: modalInfo.qr_convertido, alt: "Código QR de la promoción" },
                { src: modalInfo.imagen ? '/images/' + modalInfo.imagen : defaultImage, alt: "Imagen de la promoción" },
              ].map((item, index) => (
                <div key={index} className="h-2/5">
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
                        width={80} // Ajusta según tus necesidades
                        height={80} // Ajusta según tus necesidades
                      />
                    </a>
                  ) : (
                    <Image
                      src={item.src}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                      alt={item.alt}
                      className="rounded-t-md object-cover"
                      layout="responsive"
                      width={80} // Ajusta según tus necesidades
                      height={80} // Ajusta según tus necesidades
                    />
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

export default MallProfile;
