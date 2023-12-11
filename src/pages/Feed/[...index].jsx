import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import { decryptAndGetLocalStorage, encryptAndSetLocalStorage, getFromAPIWithParams, pathGen } from '../../funciones/api';
import NavBar from '../../components/globals/NavBar';
import SideBars from '../../components/common/SideBars';
import Image from 'next/image';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from 'next/dynamic';
const CountdownTimer = dynamic(() => import('../../components/common/CountdownTimer'), {
  ssr: false,
});
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineShop, AiOutlineHome } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import Modal from '../../components/globals/Modal';

const getColorClass = (index) => {
  const colors = ['bg-blue-100', 'bg-pink-100', 'bg-green-100', 'bg-yellow-100']; // Puedes agregar más colores según sea necesario
  return colors[index % colors.length];
};


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
    return <p>Cargando promociones...</p>;
  }else if(tiendas.length === 0){
    return <p>No hay promociones disponibles...</p>;

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

const Feed = () => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const hasMounted = useHasMounted();
  const [items, setItems] = useState(null);

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

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(blob);
    });
  }



  const listarPromociones = async (tienda) => {
    try {
      const endpoint = 'http://localhost:4044/promociones/publicar/general';
      console.log(token)
      console.log(tienda)
      const queryParams = {
        tokenSesion: token
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
  

  const [listarPosts,setPosts]= useState('')
  const listarPosts1 = async (tienda) => {
    try {
      const endpoint = 'http://localhost:4044/publicaciones';
      console.log(token);
      console.log(tienda);
      const queryParams = {
        tokenSesion: token,
      };
      console.log(queryParams);
      const data = await getFromAPIWithParams(endpoint, queryParams);
      console.log(data);
  
      if (data.status === 1) {
        // Eliminar duplicados
        const uniquePosts = Array.from(
          new Set([...data.datosTienda, ...data.datosCC].map((post) => post.id_post))
        ).map((idPost) => {
          const tiendaPost = data.datosTienda.find((post) => post.id_post === idPost);
          const ccPost = data.datosCC.find((post) => post.id_post === idPost);
          return tiendaPost || ccPost;
        });
  
        setPosts({
          ...data,
          datosTienda: uniquePosts.filter((post) => post.id_tienda !== null),
          datosCC: uniquePosts.filter((post) => post.id_centroComercial !== null),
        });
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };
  

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
        const allPosts = [...(listarPosts.datosTienda ?? []), ...(listarPosts.datosCC ?? [])];
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
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
            <div className='w-full min-h-screen  font-sans'>
              <header className="bg-blue-500 text-white py-8 " >
                <div className="container mx-auto flex items-center h-full">
                  <div className='hidden md:block'>
                    <Image
                      src={ '/images/banner.png'}
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
                  <div className="text-center">
                    <h1 className="text-5xl font-extrabold leading-tight">Descubre el Mundo de Compras</h1>
                    <p className="mt-4 text-xl">Explora las últimas ofertas, promociones y centros comerciales.</p>
                  </div>
                </div>
              </header>

              <main className="container mx-auto py-12">
                <section className="my-12">
                  <div className='text-center'>
                    <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-200 p-4 bg-blue-500 rounded-md shadow-md">
    Descubre nuestras promociones
                    </h2>                  </div>
                  <div className='w-full mx-auto py-1 p-8'>                        
                    <PromoCarrousel onClickButton={(newValue)=> handleModalOpen(newValue)}  tiendas={listarPromos} />
                  </div>
                </section>

                <section className="my-12">
                  <div className='text-center'>
                    <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-200 p-4 bg-blue-500 rounded-md shadow-md">
    Descubre Nuestros Centros Comerciales
                    </h2>               
                  </div>   
                  <Slider
                    {...settings}
                  >
                    {items?.map((centroComercial) => (
                      <div key={centroComercial.id_centroComercial}
                        onClick={() => MallProfile(centroComercial)}
                        className={`cursor-pointer border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out rounded-md overflow-hidden w-80 md:w-96 lg:w-96 h-64 mx-auto ${getColorClass(centroComercial.id_centroComercial)}`}
                      >
                        <div className='flex items-center'>
                          <div className='h-2/5 w-1/2 overflow-hidden p-4'>
                            <Image
                              src={centroComercial.imagen ? '/images/' + centroComercial.imagen : defaultImage}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultImage;
                              }}
                              alt="Imagen de perfil"
                              className="rounded object-cover w-full h-full"
                              layout="responsive"
                              width={1920}
                              height={1080}
                            />
                          </div>
                          <div className='p-6 flex flex-col justify-between h-3/5 w-1/2 md:h-2/5'>
                            <div>
                              <h3 className="text-xl text-gray-800 font-semibold mb-2 truncate">{centroComercial.nombreCC}</h3>
                              <div className='mb-2'>
                                <p className="text-gray-500 truncate">{centroComercial.direccion}</p>
                              </div>
                              <div className='mb-2'>
                                <p className="text-gray-500 font-semibold">Teléfono:</p>
                                <p className="text-gray-500 truncate"> {centroComercial.telefonoCC}</p>
                              </div>
                              <div className='mb-2'>
                                <p className="text-gray-500 font-semibold">Correo:</p>
                                <p className="text-gray-500 truncate">{centroComercial.correo}</p>
                              </div>
                            </div>
                            {/* Otros detalles del centro comercial según sea necesario */}
                          </div>
                        </div>
                      </div>
                    ))}

                  </Slider>
                </section>
                <section className="my-12">
                  <div className='text-center'>
                    <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-200 p-4 bg-blue-500 rounded-md shadow-md">Publicaciones Tiendas y Comerciales</h2>

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                    { currentPosts
                      .filter((post) => new Date(post.vigencia_final) > currentDate)
                      .length === 0 ? (
                        <div className="text-center text-gray-500">
                          <p>No hay publicaciones activas.</p>
                          {/* Puedes agregar un icono moderno aquí */}
                        </div>
                      ) : (
                        currentPosts
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
                            </div>      ))
                      )}

                  </div>

                  <ReactPaginate
                    previousLabel={'Anterior'}
                    nextLabel={'Siguiente'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(filteredPosts.length / postsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination flex justify-center mt-4'}
                    pageClassName={'mx-2 cursor-pointer'}
                    previousClassName={'bg-slate-500 text-white py-2 px-4 rounded-md mr-2 cursor-pointer'}
                    nextClassName={'bg-slate-500 text-white py-2 px-4 rounded-md ml-2 cursor-pointer'}
                    activeClassName={'bg-slate-700 p-2 px-4 rounded text-white'}
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
              <p className="text-lg font-bold mb-2">{modalInfo?.descripcion}</p>
              <p className="mt-2">Cantidad disponible: {modalInfo?.cantidad}</p>
              <p>Precio: <span className="text-green-500">${modalInfo?.precio}</span></p>
              {/* <p>Nombre Tienda: {informacionTienda ?? 'No hay información de tienda disponible'}</p> */}
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
      </SideBars>
    </>
  );
};

export default Feed;
