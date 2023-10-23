import React, { useEffect, useState } from 'react'
import { BsArrowLeftShort,BsChevronDown,BsFillImageFill,BsReverseLayoutTextSidebarReverse,BsSearch,BsPercent } from 'react-icons/bs'
import { AiFillEnvironment, AiOutlineFileText,AiFillSetting } from 'react-icons/ai'
import { RiDashboardFill,RiPagesLine,RiLogoutBoxLine } from 'react-icons/ri'
import { MdOutlineAdminPanelSettings,MdOutlineLocalMall } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { useAlert } from '../../context/AlertContext'
import { decryptAndGetLocalStorage, deleteWithbody, pathGen } from '../../funciones/api'
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

  const usuariosC = () => {
    router.push(`../Usuarios/${pathGen()}`);  };

  const tiendasC = () => {
    router.push(`../Tiendas/${pathGen()}`);  };

  const feedC = () => {
    router.push(`../Feed/${pathGen()}`);  };

  const configuracionC = () => {
    router.push(`../Configuracion/${pathGen()}`);  };


  const Menus = [
    { title: 'Feed',spacing: true,onClick:()=> feedC() },
    { title: 'Centros Comerciales',icon: <MdOutlineLocalMall/>,onClick:()=> CentrosComerciales() },
    { title: 'Promociones' ,icon: <BsPercent />  },
    { title: 'Configuración' ,icon: <AiFillSetting /> ,onClick:()=> configuracionC() },
    { title: 'Logout',icon: <RiLogoutBoxLine />, onClick: () => handleLogout( ) },
    { title: 'Catalogos',
      submenu: true,
      icon: <RiPagesLine/>,
      submenuItems: [
        { title: 'Centros Comerciales', onClick: () => comercialesB()  },
        { title: 'Usuarios' , onClick: () => usuariosC() },
        { title: 'Tiendas', onClick: () => tiendasC() },
      ],
    },
    { title: 'Administración',
      submenu: true,
      icon: <MdOutlineAdminPanelSettings/>,
      submenuItems: [
        { title: 'Admin C.C', onClick:() => adminCC() },
        { title: 'Usuarios' },
        { title: 'Tiendas' },
      ],
    },

  ]

  const [submenus, setSubmenus] = useState(Menus.map(() => false));

  const toggleSubmenu = (index) => {
    const updatedSubmenus = [...submenus];
    updatedSubmenus[index] = !updatedSubmenus[index];
    setSubmenus(updatedSubmenus);
  };

  return (
    <div className='flex '>
      <div className={`bg-blue-900 md:h-screen  p-5 pt-8  rounded-md  ${open ? 'w-72' : 'w-20' } duration-300 relative`}>
        <BsArrowLeftShort className={`bg-white text-black text-3xl rounded-full absolute -right-3 top-9 border border-black cursor-pointer ${!open && 'rotate-180'}`} onClick={() => setOpen(!open)}/>
        <div className='inline-flex'>
          <AiFillEnvironment className={`bg-violet-300 text-4xl rounded cursor-pointer block float-left mr-2 duration-500 ${!open && 'rotate-[360deg]'}`}/>
          <h1 className={`text-white text-2xl font-medium origin-left duration-300 ${!open && 'scale-0'}`}>MallCompass</h1>
        </div>
        {/* <div className={`flex items-center rounded-md bg-slate-300 mt-6 py-2 ${!open ? 'px-2.5' : 'px-4'}`}>
          <BsSearch className={`text-black text-lg block float-left cursor-pointer ${!open && 'mr-2'}`} />
          <input type="search" placeholder='Search' className={`text-base bg-transparent w-full text-white focus:outline-none ${!open && 'hidden'}`} />
        </div> */}
        <ul className='pt-2'>
          {Menus.map((menu,index)=> (
            <>
              <li onClick={menu.onClick} key={index} className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-slate-500 rounded-md mt-2 ${menu.spacing ? 'mt-9' : 'mt-2'}`}>
                <span className='text-2xl block float-left'>
                  {menu.icon ? menu.icon : <RiDashboardFill />}
                </span>
                <span  title={menu.title} className={`text-base font-medium flex-1 ${!open && 'hidden'}`}>{menu.title}</span>
                {menu.submenu && open  && (
                  <BsChevronDown className={`${submenus[index] && 'rotate-180'}`} onClick={() =>
                    toggleSubmenu(index)
                  } /> 
                )}
              </li>
              {(menu.submenu && submenus[index] && open)  && (
                <ul>
                  {menu.submenuItems.map((submenuItems,index)=>(
                    <li onClick={submenuItems.onClick} key={index} 
                      className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-slate-200 rounded-md mt-2 ${menu.spacing ? 'mt-9' : 'mt-2'}`}>
                      {submenuItems.title}
                    </li>
                  ))}
                </ul>
              )
              }
            </>
          ))}
        </ul>
      </div>
      <div className={`w-full ${open ? 'hidden md:block' : 'block' }`}>
        {/* <h1 className='text-2xl font-semibold'>Home Page</h1> */}
        <div className='flex justify-center'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default SideBars