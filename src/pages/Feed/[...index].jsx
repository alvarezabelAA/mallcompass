import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted'
import { decryptAndGetLocalStorage,pathGen } from '../../funciones/api';
import NavBar from '../../components/globals/NavBar';
import SideBar from '../../components/globals/SideBar';
import SideBars from '../../components/common/SideBars';
const Feed = () => {
  const router = useRouter();
  const { token,logout } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();


    
  const getEnv = () => {
    console.log(token);
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  const comercialesB = () => {
    router.push(`../Comerciales/${pathGen()}`);  };

  const LocalesB = () => {
    router.push(`/PantallaInicio/${pathGen()}`);  };

  const ConfiguracionB = () => {
    router.push(`/PantallaInicio/${pathGen()}`);  };
  const handleLogout = () => {
    logout();
    localStorage.clear();
    router.push(`/login/${pathGen()}`);
  };
  const handleSidebarVisibility = (sidebarVisible) => {
    console.log('Sidebar visibility:', sidebarVisible);
    setValidateSlide(sidebarVisible)

    // Realiza acciones basadas en el valor de sidebarVisible aquí
  };

  const [validateSlide, setValidateSlide] = useState(true)

  useEffect(()=>{
    console.log(validateSlide)
  },[validateSlide])

  const sampleItems = [
    {
      id: 1,
      title: 'Oferta Especial',
      description: '¡Descuentos increíbles en todas las tiendas de moda!',
    },
    {
      id: 2,
      title: '¡Nuevos Lanzamientos!',
      description: 'Descubre las últimas tendencias en electrónica y gadgets.',
    },
  ];

  const sampleMalls = [
    {
      id: 1,
      name: 'Centro Comercial XYZ',
      location: 'Calle Principal #123',
    },
    {
      id: 2,
      name: 'Mall Aventura',
      location: 'Avenida Central #456',
    },
  ];


  return (
    <>
      {/* <SideBar onVisible={(newValue) => handleSidebarVisibility(newValue)} /> */}
      <SideBars>
        <div className='w-full'>
          <header className="background-purple text-white text-center py-4">
            <h1 className="text-4xl font-bold">Bienvenido a Centros Comerciales</h1>
            <nav className="mt-4">
              {/* Coloca aquí enlaces de navegación si es necesario */}
            </nav>
          </header>

          <section className="my-8 px-4">
            <h2 className="text-2xl font-semibold mb-4">Publicaciones Recientes</h2>
            <div className="flex flex-wrap -mx-2">
              {/* Tarjetas de publicaciones */}
              {/* ... */}
            </div>
          </section>

          <section className="my-8 px-4">
            <h2 className="text-2xl font-semibold mb-4">Promociones Destacadas</h2>
            <div className="flex flex-wrap -mx-2">
              {/* Tarjetas de promociones */}
              {/* ... */}
            </div>
          </section>

          <section className="my-8 px-4">
            <h2 className="text-2xl font-semibold mb-4">Centros Comerciales Activos</h2>
            <div className="flex flex-wrap -mx-2">
              {/* Tarjetas de centros comerciales */}
              {/* ... */}
            </div>
          </section>

          <footer className="background-purple text-white text-center py-4">
            <p>&copy; 2023 Centros Comerciales. Todos los derechos reservados.</p>
          </footer>
        </div>
      </SideBars>

      {/* <div className={`p-4 ml-24 ${validateSlide ? 'sm:ml-24': 'sm:ml-64'}`}>
        
      </div> */}
    </>
  );
};

export default Feed;
