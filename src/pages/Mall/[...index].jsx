import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import { decryptAndGetLocalStorage, encryptAndSetLocalStorage, getFromAPIWithParams, pathGen } from '../../funciones/api';
import NavBar from '../../components/globals/NavBar';
import SideBars from '../../components/common/SideBars';
import Image from 'next/image';

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

  const getEnv = () => {
    console.log(token);
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    listar()
    listarTiendas()

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
    const results = items.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setSearchResults(results);
  }, [searchTerm, items]);

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
                    <p className='font-semibold text-white'>{result?.nombreCC || result?.nombreTienda}</p>
                    <p className='text-gray-300'>{result?.direccion || result?.categoriaTienda}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </SideBars>
    </>
  );
};

export default Feed;
