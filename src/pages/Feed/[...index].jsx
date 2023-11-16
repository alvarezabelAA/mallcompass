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


const PromoCarrousel = ({ tiendas }) => {
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
          <h3 className="text-xl font-semibold mb-2">{promocion.titulo}</h3>
          <p className="text-gray-600">{promocion.descripcion}</p>
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

  const ofertasYnovedades = [
    { id: 1, titulo: 'Oferta 1', descripcion: 'Descripción de la oferta 1' },
    { id: 2, titulo: 'Oferta 2', descripcion: 'Descripción de la oferta 2' },
    { id: 3, titulo: 'Oferta 2', descripcion: 'Descripción de la oferta 2' },
    { id: 4, titulo: 'Oferta 2', descripcion: 'Descripción de la oferta 2' },
    // ... más ofertas
  ];

  const promocionesDestacadas = [
    { id: 1, titulo: 'Promoción 1', descripcion: 'Descripción de la promoción 1' },
    { id: 2, titulo: 'Promoción 2', descripcion: 'Descripción de la promoción 2' },
    { id: 4, titulo: 'Promoción 3', descripcion: 'Descripción de la promoción 2' },
    { id: 4, titulo: 'Promoción 4', descripcion: 'Descripción de la promoción 2' },
    // ... más promociones
  ];

  const centrosComerciales = [
    { id: 1, nombre: 'Centro Comercial 1', ubicacion: 'Ubicación del CC 1' },
    { id: 2, nombre: 'Centro Comercial 2', ubicacion: 'Ubicación del CC 2' },
    { id: 3, nombre: 'Centro Comercial 2', ubicacion: 'Ubicación del CC 2' },
    { id: 4, nombre: 'Centro Comercial 2', ubicacion: 'Ubicación del CC 2' },
    // ... más centros comerciales
  ];

  const getEnv = () => {
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
                    <PromoCarrousel tiendas={promocionesDestacadas} />
                  </div>
                </section>

                <section className="my-12">
                  <h2 className="text-3xl font-semibold mb-8 text-white p-8">Descubre Nuestros Centros Comerciales</h2>
                  <Swiper
                    spaceBetween={60} // Espaciado entre slides
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ofertasYnovedades.map((oferta) => (
                      <div key={oferta.id} className="bg-white p-6 rounded-md shadow-md">
                        <h3 className="text-xl font-semibold mb-2">{oferta.titulo}</h3>
                        <p className="text-gray-600">{oferta.descripcion}</p>
                      </div>
                    ))}
                  </div>
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
      </SideBars>
    </>
  );
};

export default Feed;
