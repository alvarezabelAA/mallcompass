import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import { decryptAndGetLocalStorage, encryptAndSetLocalStorage, getFromAPIWithParams, pathGen } from '../../funciones/api';
import NavBar from '../../components/globals/NavBar';
import SideBars from '../../components/common/SideBars';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/swiper-bundle.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import dynamic from 'next/dynamic';
const CountdownTimer = dynamic(() => import('../../components/common/CountdownTimer'), {
  ssr: false,
});
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineShop, AiOutlineHome } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
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
      {tiendas.map((promocion) => (
        <div key={promocion.id} className="bg-white p-6 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-4">{promocion.descripcion}</h3>
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
            <div className="w-full mb-4 lg:mb-0">
              <CountdownTimer startTime={promocion.vigencia_inicio} endTime={promocion.vigencia_final} showStyle={true} />
            </div>
            <button
              onClick={()=> onClickButton(promocion)}
              title="Ver promoción"
              className="flex items-center justify-center text-center rounded-lg border-slate-600 border-4 p-3 transition duration-300"
            >
              <AiOutlineEye className="w-7 h-7" />
            </button>
          </div>
        </div>
      ))}

    </Slider>
  );
};

const Feed = () => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const hasMounted = useHasMounted();
  const [items, setItems] = useState(null);

  // ... (rest of your code remains the same)

  const [tiendaId, setTiendaId]=useState('')

  const getEnv = () => {
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }

    listar()
    const decryptedData_1 = decryptAndGetLocalStorage('id_tienda');
    const tienda_id = decryptedData_1 ? JSON.parse(decryptedData_1) : null;
    console.log(tienda_id)
    setTiendaId(tienda_id)

    listarPromociones()

    listarPosts1()
  }
  const [listarPromos,setPromos]= useState('')

  const listarPromociones =async(tienda)=>{
    try {
      const endpoint = 'http://localhost:4044/promociones/publicar/general';
      console.log(token)
      console.log(tienda)
      const queryParams = {
        tokenSesion: token      };
      console.log(queryParams)
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setPromos(data.datos)
      // setInfoTienda(data.datos)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }

  const [listarPosts,setPosts]= useState('')

  const listarPosts1 =async(tienda)=>{
    try {
      const endpoint = 'http://localhost:4044/publicaciones';
      console.log(token)
      console.log(tienda)
      const queryParams = {
        tokenSesion: token 
      };
      console.log(queryParams)
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setPosts(data)
      // setInfoTienda(data.datos)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }

  useEffect(()=> {
    console.log(listarPromos)
  },[listarPromos])

  useEffect(()=> {
    console.log(listarPosts)
  },[listarPosts])

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Cuando cambia el estado de "selectedCategory", filtra los posts correspondientes
    if (selectedCategory === 'Comerciales') {
      setFilteredPosts(listarPosts.datosCC.filter(post => new Date(post.vigencia_final) > new Date()));
    } else if (selectedCategory === 'Tiendas') {
      setFilteredPosts(listarPosts.datosTienda.filter(post => new Date(post.vigencia_final) > new Date()));
    } else {
      // Si la categoría seleccionada es 'all', muestra todas las publicaciones
      if(listarPosts){
        const allPosts = [...listarPosts.datosTienda, ...listarPosts.datosCC];
        setFilteredPosts(allPosts.filter(post => new Date(post.vigencia_final) > new Date()));
      }
    }
  }, [selectedCategory, listarPosts]);
  

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 4;

  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

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

  const defaultImage = '/images/no_image.jpg';

  const MallProfile = (item) => {
    console.log(item)
    encryptAndSetLocalStorage('usuarioData', JSON.stringify(item));
    router.push(`../Mall/MallProfile/${pathGen()}`);  
  };

  const currentDate = new Date();
  // Helper function para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    };

    return date.toLocaleString('es-ES', options);
  };

  const [modalVisible, setModalVisible] = useState(false);

  const [modalInfo, setModalInfo]= useState([])

  const handleModalOpen = (item) => {
    console.log(item)
    setModalInfo(item)
    infoTienda(item.id_tienda)
    setModalVisible(true);
  };

  useEffect(()=>{
    console.log(modalInfo)
  },[modalInfo])
  
  const handleModalClose = () => {
    setModalVisible(false);
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
            <div className='w-full min-h-screen bg-gray-800 font-sans'>
              <header className="bg-blue-700 text-white py-8">
                <div className="container mx-auto text-center">
                  <h1 className="text-5xl font-extrabold leading-tight">Descubre el Mundo de Compras</h1>
                  <p className="mt-4 text-xl">Explora las últimas ofertas, promociones y centros comerciales.</p>
                </div>
              </header>

              <main className="container mx-auto py-12">
                <section className="my-12">
                  <h2 className="text-3xl text-white font-semibold mb-8 mx-5">Promociones Destacadas</h2>
                  <div className='w-full mx-auto py-1 p-8'>                        
                    <PromoCarrousel onClickButton={(newValue)=> handleModalOpen(newValue)}  tiendas={listarPromos} />
                  </div>
                </section>

                <section className="my-12">
                  <h2 className="text-3xl font-semibold mb-8 text-white p-8">Descubre Nuestros Centros Comerciales</h2>
                  <Swiper
                    spaceBetween={10} // Espaciado entre slides
                    slidesPerView={2}   // Número de slides visibles en pantallas pequeñas
                    breakpoints={{
                      640: {
                        slidesPerView: 1, // Número de slides visibles en pantallas medianas
                      },
                      768: {
                        slidesPerView: 2, // Número de slides visibles en pantallas grandes
                      },
                    }}
                  >
                    {items?.map((centroComercial) => (
                      <SwiperSlide key={centroComercial.id}>
                        <div
                          onClick={() => MallProfile(centroComercial)}
                          className="cursor-pointer bg-white border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out rounded-md overflow-hidden h-[400px] w-80 md:w-96 lg:w-96 mx-auto"
                        >
                          <div className='h-2/5  w-full overflow-hidden'>
                            <Image
                              src={centroComercial.imagen ? '/images/' + centroComercial.imagen : defaultImage}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultImage;
                              }}
                              alt="Imagen de perfil"
                              className="rounded-t-md object-cover"
                              layout="responsive"
                              width={1920}
                              height={1080}
                            />
                          </div>
                          <div className='p-6 flex flex-col justify-between h-3/5 md:h-2/5'>
                            <div>
                              <h3 className="text-xl text-gray-800 font-semibold mb-2">{centroComercial.nombreCC}</h3>
                              <div className='mb-2'>
                                <p className="text-gray-500">{centroComercial.direccion}</p>
                              </div>
                              <div className='mb-2'>
                                <p className="text-gray-500 font-semibold">Teléfono:</p>
                                <p className="text-gray-500"> {centroComercial.telefonoCC}</p>
                              </div>
                              <div className='mb-2'>
                                <p className="text-gray-500 font-semibold">Correo:</p>
                                <p className="text-gray-500">{centroComercial.correo}</p>
                              </div>
                            </div>
                            {/* Otros detalles del centro comercial según sea necesario */}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}

                  </Swiper>
                </section>
                <section className="my-12">
                  <h2 className="text-3xl font-semibold mb-8 text-white p-8">Publicaciones Tiendas y Comerciales</h2>
                  <div className='flex justify-center w-full'>
                    <div className='flex'>
                      <button
                        className={`border ${selectedCategory === 'Comerciales' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-white'} p-2 mx-2 rounded-md flex items-center`}
                        onClick={() => handleCategoryChange('Comerciales')}
                      >
                        <AiOutlineShop className="mr-2" />
      Comerciales
                      </button>
                      <button
                        className={`border ${selectedCategory === 'Tiendas' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-white'} p-2 rounded-md flex items-center`}
                        onClick={() => handleCategoryChange('Tiendas')}
                      >
                        <AiOutlineHome className="mr-2" />
      Tiendas
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">

                    {currentPosts
                      .filter((post) => new Date(post.vigencia_final) > currentDate)
                      .map((post) => (
                        <div key={post.id_post} className="bg-white p-6 rounded-md shadow-md">
                          <div className='h-2/5 w-full overflow-hidden'>
                            <Image
                              src={post.imagen ? '/images/' + post.imagen : defaultImage}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultImage;
                              }}
                              alt="Imagen de perfil"
                              className="rounded-t-md object-cover"
                              layout="responsive"
                              width={1920}
                              height={1080}
                            />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{post.descripcion}</h3>
                          <p><strong>Actividad:</strong> {post.actividad}</p>
                          <p><strong>Finaliza:</strong> </p>           
                          <p>
                            {formatDate(post.vigencia_final)}
                          </p>               {/* Puedes mostrar otras propiedades según tus necesidades */}
                        </div>
                      ))}
                  </div>

                  <ReactPaginate
                    previousLabel={'Anterior'}
                    nextLabel={'Siguiente'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(filteredPosts.length / postsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={' flex justify-center list-none'}
                    activeClassName={' p-2  mr-2 text-white'}
                    previousClassName={'border p-2 rounded-md mr-2 text-white'}
                    nextClassName={'border p-2 rounded-md ml-2 text-white'}
                    pageClassName={'inline-block mx-1'}
                    pageLinkClassName={'border p-2 rounded-md ml-2 text-white'}
                    breakClassName={'mx-1'}
                  />
                </section>

              </main>

              <footer className="bg-blue-700 text-white py-8">
                <div className="container mx-auto text-center">
                  <p className="text-lg">&copy; 2023 Centros Comerciales. Todos los derechos reservados.</p>
                </div>
              </footer>
            </div>
          </motion.div>
        </div>
        {modalVisible && (
          <Modal titulo="Promoción" onClose={handleModalClose}>
            <div className="p-4">
              <CountdownTimer
                startTime={modalInfo?.vigencia_inicio}
                endTime={modalInfo?.vigencia_final}
                showStyle={true}
              />
              <p className="text-lg font-bold mb-2"> {modalInfo?.descripcion}</p>
              <p className="mt-2">Cantidad disponible: {modalInfo?.cantidad}</p>
              <p>Precio: <span className="text-green-500">${modalInfo?.precio}</span></p>
              <p>Nombre Tienda: {informacionTienda ?? 'No hay información de tienda disponible'}</p>

              <div className='h-2/5 w-full  px-36 mt-4'>
                <Image
                  src={modalInfo.imagen ? '/images/' + modalInfo.imagen : defaultImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                  alt="Código QR de la promoción"
                  className="rounded-t-md object-cover "
                  layout="responsive"
                  width={80} // Ajusta según tus necesidades
                  height={80} // Ajusta según tus necesidades
                />
              </div>
            </div>
          </Modal>
        )}
      </SideBars>
    </>
  );
};

export default Feed;
