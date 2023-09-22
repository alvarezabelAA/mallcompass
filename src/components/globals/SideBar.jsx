import React, { useState } from 'react';
import * as iconsFc from 'react-icons/fc';
import * as iconsMd from 'react-icons/md';
import { useRouter } from 'next/router';
import { pathGen } from '../../funciones/api';
import { useAuth } from '../../context/AuthContext';

const SideBar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [catalogosMenuOpen, setCatalogosMenuOpen] = useState(false); // Estado para el menú desplegable de Catalogos
  const router = useRouter();
  const { token,logout } = useAuth(); // Obtén el token del contexto de autenticación

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleCatalogosMenu = () => {
    setCatalogosMenuOpen(!catalogosMenuOpen);
  };

  const sidebarClassName = `fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
    sidebarVisible ? '' : '-translate-x-full sm:translate-x-0'
  }`;


  const comercialesB = () => {
    router.push(`../Comerciales/${pathGen()}`);  };

  const usuariosC = () => {
    router.push(`../Usuarios/${pathGen()}`);  };

  const feedC = () => {
    router.push(`../Feed/${pathGen()}`);  };

  const configuracionC = () => {
    router.push(`../Configuracion/${pathGen()}`);  };

  const handleLogout = () => {
    logout();
    localStorage.clear();
    router.push(`/login/${pathGen()}`);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Toggle sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={sidebarClassName}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                onClick={toggleCatalogosMenu} // Manejador de eventos para abrir/cerrar el menú de Catalogos
              >
                <iconsFc.FcAutomatic className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className="ml-3">Catalogos</span>
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
                      <span className="ml-3">Centros Comerciales</span>
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={()=> usuariosC()}
                      href="#"
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group"
                    >
                      <iconsFc.FcManager className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                      <span className="ml-3">Usuarios</span>
                    </a>
                  </li>
                  {/* Agrega más opciones aquí */}
                </ul>
              )}
            </li>
            <li>
              <a onClick={()=> feedC()}
                href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                <iconsFc.FcTabletAndroid className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className="flex-1 ml-3 whitespace-nowrap">Feed</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                <iconsFc.FcOrganization className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className="flex-1 ml-3 whitespace-nowrap">Centros Comerciales</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                <iconsMd.MdOutlinePercent className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className="flex-1 ml-3 whitespace-nowrap">Promociones</span>
              </a>
            </li>
            <li>
              <a onClick={()=> configuracionC()} href="#" className="flex items
              -center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                <iconsFc.FcSettings className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className="flex-1 ml-3 whitespace-nowrap">Configuración</span>
              </a>
            </li>
            <li>
              <a onClick={()=>handleLogout()} href="#" className="flex items
              -center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group">
                <iconsMd.MdOutlineKeyboardDoubleArrowLeft className='flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className="flex-1 ml-3 whitespace-nowrap">Cerrar Sesión</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
