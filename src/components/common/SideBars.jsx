import React, { useEffect, useState } from 'react'
import { BsArrowLeftShort,BsChevronDown,BsFillImageFill,BsReverseLayoutTextSidebarReverse,BsSearch,BsPercent } from 'react-icons/bs'
import { AiFillEnvironment, AiOutlineFileText,AiFillSetting } from 'react-icons/ai'
import { RiDashboardFill,RiPagesLine,RiLogoutBoxLine } from 'react-icons/ri'
import { MdOutlineAdminPanelSettings,MdOutlineLocalMall,MdStore } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { useAlert } from '../../context/AlertContext'
import { decryptAndGetLocalStorage, deleteWithbody, pathGen } from '../../funciones/api'
import { FaHome, FaSearch, FaBell, FaUser ,FaPlus } from 'react-icons/fa';
// import { HiReceiptPercent  } from 'react-icons/hi'
const SideBars = ({ children }) => {
  const [open, setOpen] = useState(true)
  const [submenuopen, setSubMenuOpen] = useState(true)
  // Variables que se reutilizan 
  const router = useRouter();
  const { token,logout } = useAuth(); // Obtén el token del contexto de autenticación
  const [validar, setValidar]=useState('')
  const showAlertWithMessage  = useAlert();
  
  const handleLogout = async () => {
    const endpoint = 'http://localhost:4044/usuario/final/logout'; // URL del servidor de eliminación
    console.log(token)
    const requestBody = {
      tokenSesion: token.toString(),
    };
    console.log(requestBody)
    
    try {
      
      const response = await deleteWithbody(endpoint, requestBody);
      console.log(response);
  
      if (response.status === 1) {
        showAlertWithMessage('SUCCESS','Consulta válida', 'Se cerro sesion correctamente');
        logout();
        localStorage.clear();
        router.push(`/login/${pathGen()}`);
      } else {
        showAlertWithMessage('ERROR', 'No se cerro sesión correctamente', 'Dsiculpe el error');
      }
    } catch (error) {
      showAlertWithMessage('Warning','Revise su conexión', 'No se encontro conexión: ' + error);
      // Maneja el error aquí
    }
    logout();
    localStorage.clear();
    router.push(`/login/${pathGen()}`);
  };

  useEffect(()=>{
    const decryptedData = decryptAndGetLocalStorage('rol');
    setValidar(decryptedData)
    console.log(validar)
  },[validar])

  const CentrosComerciales = () => {
    router.push(`../CentrosComerciales/${pathGen()}`);  };

  const comercialesB = () => {
    router.push(`../Comerciales/${pathGen()}`);  };

  const adminCC = () => {
    router.push(`../AdministracionCC/${pathGen()}`);  };

  const prdocutosTienda = () => {
    router.push(`../Productos/${pathGen()}`);  };

  const usuariosC = () => {
    router.push(`../Usuarios/${pathGen()}`);  };

  const tiendasC = () => {
    router.push(`../Tiendas/${pathGen()}`);  };

  const feedC = () => {
    router.push(`../Feed/${pathGen()}`);  };

  const configuracionC = () => {
    router.push(`../Configuracion/${pathGen()}`);  };

  const miPerfil = () => {
    router.push(`../Perfil/${pathGen()}`);  };

  const mall = () => {
    router.push(`../Mall/${pathGen()}`);  };

  const post = () => {
    router.push(`../Post/${pathGen()}`);  };


  const Menus = [
    // { title: 'Feed',spacing: true,onClick:()=> feedC() },
    // { title: 'Centros Comerciales',icon: <MdOutlineLocalMall/>,onClick:()=> CentrosComerciales() },
    // { title: 'Promociones' ,icon: <BsPercent />  },
    // { title: 'Configuración' ,icon: <AiFillSetting /> ,onClick:()=> configuracionC() },
    { title: 'Catalogos',
      submenu: true,
      icon: <RiPagesLine/>,
      disabled: validar !== 'S',
      submenuItems: [
        { title: 'Usuarios' , onClick: () => usuariosC() },
        { title: 'Centros Comerciales', onClick: () => comercialesB()  },
        { title: 'Tiendas', onClick: () => tiendasC() },
      ],
    },
    { title: 'Administración',
      submenu: true,
      icon: <MdOutlineAdminPanelSettings/>,
      
      disabled: validar !== 'S' && validar !== 'C', // Deshabilitar si validar no es 'S' o 'C'
      submenuItems: [
        { title: 'Admin C.C', onClick:() => adminCC() }
        // ,
        // { title: 'Usuarios' },
        // { title: 'Tiendas' },
      ],
    },{ title: 'Administración Tienda',
      submenu: true,
      icon: <MdStore/>,
      disabled: validar !== 'S' && validar !== 'T', // Deshabilitar si validar no es 'S' o 'C'
      submenuItems: [
        { title: 'Productos', onClick:() => prdocutosTienda() }
      // ,
      // { title: 'Usuarios' },
      // { title: 'Tiendas' },
      ],
    },    { title: 'Logout',icon: <RiLogoutBoxLine />, onClick: () => handleLogout( ) },

  ]

  const [submenus, setSubmenus] = useState(Menus.map(() => false));

  const toggleSubmenu = (index) => {
    const updatedSubmenus = [...submenus];
    updatedSubmenus[index] = !updatedSubmenus[index];
    setSubmenus(updatedSubmenus);
  };

  const gridCols = validar === 'U' ? 'grid-cols-4' : 'grid-cols-5';

  return (
    <>
      {/* <--Primer div */}
      {validar === 'S' ? (
        <div className='flex '> 
          <div className={`bg-blue-900 md:h-screen  p-5 pt-8  rounded-md  ${open ? 'w-72' : 'w-20'} duration-300 relative`}>
            <BsArrowLeftShort className={`bg-white text-black text-3xl rounded-full absolute -right-3 top-9 border border-black cursor-pointer ${!open && 'rotate-180'}`} onClick={() => setOpen(!open)} />
            <div className='inline-flex'>
              <AiFillEnvironment className={`bg-violet-300 text-4xl rounded cursor-pointer block float-left mr-2 duration-500 ${!open && 'rotate-[360deg]'}`} />
              <h1 className={`text-white text-2xl font-medium origin-left duration-300 ${!open && 'scale-0'}`}>MallCompass</h1>
            </div>
            {/* <div className={`flex items-center rounded-md bg-slate-300 mt-6 py-2 ${!open ? 'px-2.5' : 'px-4'}`}>
      <BsSearch className={`text-black text-lg block float-left cursor-pointer ${!open && 'mr-2'}`} />
      <input type="search" placeholder='Search' className={`text-base bg-transparent w-full text-white focus:outline-none ${!open && 'hidden'}`} />
    </div> */}
            <ul className='pt-2'>
              {Menus.map((menu, index) => (
                <>
                  {menu.disabled ? null : (
                    <li
                      onClick={menu.onClick}
                      key={index}
                      className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-slate-500 rounded-md mt-2 ${menu.spacing ? 'mt-9' : 'mt-2'}`}
                    >
                      <span className='text-2xl block float-left'>{menu.icon ? menu.icon : <RiDashboardFill />}</span>
                      <span title={menu.title} className={`text-base font-medium flex-1 ${!open && 'hidden'}`}>
                        {menu.title}
                      </span>
                      {menu.submenu && open && (
                        <BsChevronDown className={`${submenus[index] && 'rotate-180'}`} onClick={() => toggleSubmenu(index)} />
                      )}
                    </li>
                  )}
                  {menu.submenu && submenus[index] && open && (
                    <ul>
                      {menu.submenuItems.map((submenuItems, subIndex) => (
                        !submenuItems.disabled && (
                          <li
                            onClick={submenuItems.onClick}
                            key={subIndex}
                            className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-slate-200 rounded-md mt-2 ${menu.spacing ? 'mt-9' : 'mt-2'}`}
                          >
                            {submenuItems.title}
                          </li>
                        )
                      ))}
                    </ul>
                  )}
                </>
              ))}
            </ul>


          </div>
          <div className={`w-full ${open ? 'hidden md:block' : 'block'} `}>
            {/* <h1 className='text-2xl font-semibold'>Home Page</h1> */}
            <div className='flex justify-center '>
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full'>
          <div className={`grid ${gridCols} gap-2 justify-center items-center h-16 text-center bg-gray-800 text-white fixed top-0 left-0 right-0 z-50`}>
            <button onClick={()=> feedC()} className='flex flex-col items-center'>
              <FaHome /> 
              <span className='text-xs'>Inicio</span>
            </button>
            <button onClick={()=> mall()} className='flex flex-col items-center'>
              <FaSearch /> 
              <span className='text-xs'>Comerciales</span>
            </button>
            {validar !== 'U' && (
              <button onClick={()=>post()} className='flex flex-col items-center'>
                <FaPlus className='border-white border rounded flex-shrink w-7 h-7'/> 
                <span className='text-xs'>Añadir Publicación</span>
              </button>
            )}
            <button className='flex flex-col items-center'>
              <FaBell /> 
              <span className='text-xs'>Promociones</span>
            </button>
            <button onClick={()=>miPerfil()} className='flex flex-col items-center'>
              <FaUser /> 
              <span className='text-xs'>Perfil</span>
            </button>
          </div>
          <div className={`w-full mt-16`}>
            <div className='flex justify-center'>
              {/* Contenido del segundo div */}
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SideBars