import React, { useEffect, useState } from 'react';
import * as iconsFc from 'react-icons/fc';
import * as iconsMd from 'react-icons/md';
import { useRouter } from 'next/router';
import { decryptAndGetLocalStorage, pathGen } from '../../funciones/api';
import { useAuth } from '../../context/AuthContext';

const SideBar = ({ onVisible }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [catalogosMenuOpen, setCatalogosMenuOpen] = useState(false); // Estado para el menú desplegable de Catalogos
  const router = useRouter();
  const { token,logout } = useAuth(); // Obtén el token del contexto de autenticación
  const [validar, setValidar]=useState('')

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    onVisible(!sidebarVisible)

  };

  const toggleCatalogosMenu = () => {
    setCatalogosMenuOpen(!catalogosMenuOpen);
  };

  const sidebarClassName = `fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
    sidebarVisible ? '' : '-translate-x-full sm:translate-x-0'
  }`;

  useEffect(()=>{
 
  },[sidebarVisible])


  const comercialesB = () => {
    router.push(`../Comerciales/${pathGen()}`);  };

  const usuariosC = () => {
    router.push(`../Usuarios/${pathGen()}`);  };

  const tiendasC = () => {
    router.push(`../Tiendas/${pathGen()}`);  };

  const feedC = () => {
    router.push(`../Feed/${pathGen()}`);  };

  const configuracionC = () => {
    router.push(`../Configuracion/${pathGen()}`);  };

  const handleLogout = () => {
    logout();
    localStorage.clear();
    router.push(`/login/${pathGen()}`);
  };

  useEffect(()=>{
    const decryptedData = decryptAndGetLocalStorage('rol');
    setValidar(decryptedData)
  },[validar])

  return (
    <>
      <aside
        id="default-sidebar"
        className={ `fixed top-0 left-0 z-40  h-screen transition-transform ${
          sidebarVisible ? 'w-24' : '-translate-x-full sm:translate-x-0'
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          
          <ul className="space-y-2 font-medium">
            <li>
              <a onClick={()=> toggleSidebar()} href="#" className="flex items
              -center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                <iconsFc.FcMenu className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className={`flex-1 ml-3 whitespace-nowrap ${sidebarVisible?'hidden':'block'}`}></span>
              </a>
            </li>
            {validar === 'S' && (
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                  onClick={toggleCatalogosMenu} // Manejador de eventos para abrir/cerrar el menú de Catalogos
                >
                  <iconsFc.FcAutomatic className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                  <span className={`ml-3 ${sidebarVisible ? 'hidden':'block'}`}>Catalogos</span>
                  <svg
                    className={`ml-auto w-4 h-4 transition-transform ${
                      catalogosMenuOpen ? 'rotate-0' : 'rotate-180'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </a>
                {/* Menú desplegable de Catalogos */}
                {catalogosMenuOpen && (
                  <ul className="ml-6 space-y-2">
                    <li>
                      <a
                        onClick={()=> comercialesB()}
                        href="#"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                      >
                        <iconsFc.FcDepartment className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                        <span className={`ml-3 ${sidebarVisible ? 'hidden': 'block'}`}>Centros Comerciales</span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={()=> usuariosC()}
                        href="#"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                      >
                        <iconsFc.FcManager className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                        <span className={`ml-3 ${sidebarVisible ? 'hidden': 'block'}`}>Usuarios</span>
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={()=> tiendasC()}
                        href="#"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                      >
                        <iconsFc.FcShop className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                        <span className={`ml-3 ${sidebarVisible ? 'hidden': 'block'}`}>Tiendas</span>
                      </a>
                    </li>
                    {/* Agrega más opciones aquí */}
                  </ul>
                )}
              </li>
            )}
            <li>
              <a onClick={()=> feedC()}
                href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                <iconsFc.FcTabletAndroid className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className={`flex-1 ml-3 whitespace-nowrap ${sidebarVisible?'hidden':'block'}`}>Feed</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                <iconsFc.FcOrganization className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className={`flex-1 ml-3 whitespace-nowrap ${sidebarVisible?'hidden':'block'}`}>Centros Comerciales</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                <iconsMd.MdOutlinePercent className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className={`flex-1 ml-3 whitespace-nowrap ${sidebarVisible?'hidden':'block'}`}>Promociones</span>
              </a>
            </li>
            <li>
              <a onClick={()=> configuracionC()} href="#" className="flex items
              -center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                <iconsFc.FcSettings className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className={`flex-1 ml-3 whitespace-nowrap ${sidebarVisible?'hidden':'block'}`}>Configuración</span>
              </a>
            </li>
            <li>
              <a onClick={()=>handleLogout()} href="#" className="flex items
              -center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                <iconsMd.MdOutlineKeyboardDoubleArrowLeft className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className={`flex-1 ml-3 whitespace-nowrap ${sidebarVisible?'hidden':'block'}`}>Cerrar Sesión</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
