import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';import Table from '../../components/globals/Table';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import { decryptAndGetLocalStorage, deleteWithbody, encryptAndSetLocalStorage, getFromAPI, getFromAPIWithParams, pathGen, postToAPIWithParamsAndBody } from '../../funciones/api';
import * as iconsFc from 'react-icons/fc';
import { format } from 'date-fns';
import Modal from '../../components/globals/Modal';
import SideBars from '../../components/common/SideBars';
import Image from 'next/image';
import { useAlert } from '../../context/AlertContext';
import Accordion from '../../components/common/Accordion';
import dynamic from 'next/dynamic';
const CountdownTimer = dynamic(() => import('../../components/common/CountdownTimer'), {
  ssr: false,
});

const Perfil = () => {
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const [showModal, setShowModal] = useState(false)
  const [esComercial, setEsComercial] = useState(false)

  const { logout } = useAuth(); // Obtén el token del contexto de autenticación
  const showAlertWithMessage  = useAlert();
  const initialData={
    apellido:null,
    nombre:null,
    rol: null,
    correo:null,
    telefono:null,
    imagen:null,
    fecha_nacimiento:null
  }

  const [tiendaId, setTiendaId]=useState('')

  const getEnv = () => {
    console.log(token);
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    const decryptedData2 = decryptAndGetLocalStorage('id_comercial');
    const decryptedData_1 = decryptAndGetLocalStorage('id_tienda');
    const decryptedRol = decryptAndGetLocalStorage('rol');
    const tienda_id = decryptedData_1 ? JSON.parse(decryptedData_1) : null;
    console.log(tienda_id)
    setTiendaId(tienda_id)
    if(tienda_id){
      infoTienda(tienda_id)
      listarPromociones(tienda_id)
    }
    if(decryptedData2){
      console.log(decryptedData2)
    }
    if(decryptedRol){
      console.log(decryptedRol)
      if(decryptedRol==='C'){
        setEsComercial(true)
      }else{
        setEsComercial(false)
      }
    }
    listar(token)
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  const listar =async(token)=>{
    try {
      const endpoint = 'http://localhost:4044/usuario/final/consultaGeneral/';
      const queryParams = {
        tokenSesion: token.toString()
      };
      console.log(queryParams)
      const data = await getFromAPIWithParams(endpoint,queryParams);
      if(data.status ===1){
        console.log(data)
        setItems(data.datos)
      }else{
        setItems(initialData)
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);

    }

  }

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
      setInfoTienda(data.datos)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }

  const [listarPromos,setPromos]= useState([])

  const listarPromociones =async(tienda)=>{
    try {
      const endpoint = 'http://localhost:4044/promociones/publicar';
      console.log(token)
      console.log(tienda)
      const queryParams = {
        tokenSesion: token,
        id_tienda: tienda
      };
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

  useEffect(()=> {
    console.log(informacionTienda[0]?.nombreTienda)
    console.log(listarPromos)
  },[informacionTienda,listarPromos])


  useEffect(() => {
    console.log(items)
  }, [items]);

  const defaultImage = '/images/no_image.jpg';

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

  const editData =()=>{
    encryptAndSetLocalStorage('usuarioData', JSON.stringify(items));
    router.push(`/Perfil/EditProfile/${pathGen()}`)
  }

  const newStore = () => {
    encryptAndSetLocalStorage('usuarioData', JSON.stringify(items));
    router.push(`/Perfil/NewStore/${pathGen()}`)
  }

  const [modalVisible, setModalVisible] = useState(false);
  const handleModalOpen = (item) => {
    setModalVisible(true);
  };
  
  const handleModalClose = () => {
    setDescripcion('')
    setFechaInicio(null)
    setFechaFin(null)
    setTimer(null)
    setCantidad(null)
    setImagen(null)
    setQr(null)
    setPrecio(null)
    setModalVisible(false);
  };

  const [formulario, setFormulario] = useState({
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    timer: '',
    cantidad: '',
    imagen: null,
    qr: null,
    precio: '',
  });

  const [errors, setErrors] = useState({
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    timer: '',
    cantidad: '',
    imagen: null,
    qr: null,
    precio: '',
  });

  

  const [descripcion, setDescripcion] = useState('');
  const [fecha_inicio, setFechaInicio] = useState('');
  const [fecha_fin, setFechaFin] = useState('');
  const [timer, setTimer] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [imagen, setImagen] = useState('');
  const [qr, setQr] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');


  // Registro datos de Promociones
  const handleRegistro = async () => {
    // Validación de campos
    const camposObligatorios = ['descripcion', 'fecha_inicio', 'fecha_fin', 'timer', 'imagen', 'qr', 'precio'];
    const newErrors = {};

    camposObligatorios.forEach((campo) => {
      if (!eval(campo)) {
        newErrors[campo] = `El campo de ${campo} es obligatorio.`;
      } else {
        newErrors[campo] = '';
      }
    });

    setErrors(newErrors);

    // Verifica si hay algún error en los campos
    const hayErrores = Object.values(newErrors).some((error) => error);

    if (hayErrores) {
      // Detén el proceso de registro si faltan campos obligatorios
      return;
    }

    // // Redirigir a la carpeta PantallaInicio después del registro exitoso
    // const endpoint = 'http://localhost:4044/centroComercial/post/publicar'; // Ajusta la URL del servidor de registro
    const endpoint = 'http://localhost:4044/promociones/publicar';
    const registroData =  {
      descripcion,
      vigencia_inicio: fecha_inicio,
      vigencia_final: fecha_fin,
      timer,
      cantidad,
      imagen:imagen.split('\\').pop() ,
      qr: qr.split('\\').pop(),
      precio,
      categoria
    }
    console.log(endpoint)
    console.log(registroData)
    const queryParams =  { tokenSesion: token.toString(), id_tienda: tiendaId };
    console.log()
    console.log(queryParams)
    try {
      console.log(queryParams)
      try {
        const response = await postToAPIWithParamsAndBody(endpoint, queryParams, registroData);
        console.log(response)
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          router.push(`/Perfil/${pathGen()}`);
          showAlertWithMessage('SUCCESS','Solicitud correcta', 'Se ingresaron los datos')
          setValidarRegistro(true)
          setModalVisible(false)
        }else{
          showAlertWithMessage('ERROR','Hay error en los datros', 'No se hizo la consulta correctamente')

        }
        
      } catch (error) {
        showAlertWithMessage('ERROR','Hubo error de conexión con la Api', 'Error al hacer la solicitud POST:' + error)
        // Maneja el error aquí
      }
    } catch (error) {
      showAlertWithMessage('WARNING','Valide su conexión', 'Error al hacer la solicitud:' + error)
    }
  };

  const [validarRegistro, setValidarRegistro] = useState(false);

  const [imageFile,setImageFile]=useState('')
  const [QrFile,setQrFile]=useState('')

  const handleImagenUpload = async (imagenGuardar) => {
    console.log(imagenGuardar)
    const file = imagenGuardar;
    const formData = new FormData();
    formData.append('imagen', file);
    setValidarRegistro(false)
    try {
      const response = await fetch('http://localhost:4044/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('Archivo subido exitosamente');
        // Realiza cualquier acción adicional después de cargar el archivo
      } else {
        console.error('Error al subir el archivo');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleQRUpload = async (imagenGuardar) => {
    console.log(imagenGuardar)
    const file = imagenGuardar;
    const formData = new FormData();
    formData.append('imagen', file);
    setValidarRegistro(false)
    try {
      const response = await fetch('http://localhost:4044/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('Archivo subido exitosamente');
        // Realiza cualquier acción adicional después de cargar el archivo
      } else {
        console.error('Error al subir el archivo');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };
  

  useEffect(()=>{
    console.log(imageFile)
    console.log(QrFile)
  },[imageFile,QrFile])

  useEffect(()=>{
    console.log(imagen)
    console.log(qr)
  },[imagen,qr])

  useEffect(()=>{
    if(validarRegistro === true){
      handleImagenUpload(imageFile)
      handleQRUpload(QrFile)
      
    }
  },[validarRegistro])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: '' });

    if (name === 'fecha_inicio') {
      setFechaInicio(value);
    } else if (name === 'fecha_fin') {
      setFechaFin(value);
    } else if (name === 'timer') {
      setTimer(value);
    }
  };

  useEffect(() => {
    // Calcular la diferencia de tiempo entre las fechas de inicio y fin
    if (fecha_inicio && fecha_fin) {
      const inicio = new Date(fecha_inicio);
      const fin = new Date(fecha_fin);
      const diferenciaTiempo = fin - inicio;

      // Calcular días, horas y minutos
      const dias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenciaTiempo % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferenciaTiempo % (1000 * 60 * 60)) / (1000 * 60));

      // Construir el string con la diferencia
      const diferenciaString = `${dias} días, ${horas} horas, ${minutos} minutos`;

      // Actualizar el valor del campo "Tiempo"
      setTimer(diferenciaString);
    }
  }, [fecha_inicio, fecha_fin]);

  


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
              <div className="flex justify-center items-center h-40 bg-gradient-to-r from-blue-400 via-sky-500 to-green-500">
                <div className='h-20 w-20 md:h-32 md:w-32 relative'>
                  <Image
                    src={items[0]?.imagen ? '/images/' + items[0]?.imagen : defaultImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                    alt="Imagen de perfil"
                    className="rounded-full object-cover"
                    layout="fill"
                  />
                </div>
              </div>

              {/* Resto del contenido del perfil */}
              <header className=" text-white py-2">
                <div className="container mx-auto px-2">
                  <h1 className="text-lg font-semibold ">{items[0]?.nombre + '   '+ items[0]?.apellido}</h1>
                  <h1 className="text-nomal  ">{items[0]?.rol === 'U' ? 'Usuario' : (items[0]?.rol === 'T' ? 'Tienda' : 'Comercial')}</h1>
                  {items[0]?.rol === 'T' ? informacionTienda[0]?.nombreTienda :''}
                  <h1 className="text-nomal">{items[0]?.telefono}</h1>
                  <h1 className="text-nomal">{items[0]?.correo}</h1>
                  <nav className="mt-4 text-center">
                    {/* <div className='flex justify-center w-full'>
                      <Accordion  title={'Hola'}>assssssssssssssssssssssssssssssssssssS</Accordion>
                    
                    </div> */}
                    {/* Coloca aquí enlaces de navegación si es necesario */}
                    {esComercial && (
                      <button onClick={()=>newStore(items)} className='bg-green-600 m-1 text-white font-semibold py-0.5 px-20 rounded-lg'>
                        <span className='text-sm'>Nueva Tienda</span>
                      </button>
                    )}
                    {(items[0]?.rol === 'T') && (
                      <button onClick={()=>handleModalOpen(items)} className='bg-green-600 m-1 text-white font-semibold py-0.5 px-20 rounded-lg'>
                        <span className='text-sm'>Agregar Promo</span>
                      </button>
                    )}
                    <button onClick={()=>editData(items)} className='bg-slate-600 m-1 text-white font-semibold py-0.5 px-20 rounded-lg'>
                      <span className='text-sm'>Editar</span>
                    </button>
                    <button onClick={()=>handleLogout()} className='bg-red-800 m-1 text-white font-semibold py-0.5 px-16 rounded-lg'>
                      <span className='text-sm'>Cerrar Sesion</span>
                    </button>
                  </nav>
                  {(items[0]?.rol === 'T') && (
                    <>
                      <h1 className='text-2xl'>Promociones</h1>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
                        {listarPromos.map((promo) => (
                      
                          <div key={promo.id_promocion} className="bg-white p-4 rounded-md shadow-md">
                            <div className='h-2/5  w-full overflow-hidden'>
                              <Image
                                src={promo.imagen ? '/images/' + promo.imagen : defaultImage}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = defaultImage;
                                }}
                                alt="Imagen de perfil"
                                className="rounded-t-md object-cover"
                                layout="responsive"
                                width={100}
                                height={100}
                              />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">{promo.descripcion}</h3>
                            <p className="text-sm text-gray-500 mb-2">Categoría: {promo.categoria}</p>
                            <p className="text-sm text-gray-500 mb-2">Precio: ${promo.precio}</p>
                            <p className="text-sm text-gray-500 mb-2">Vigencia: 
                              <CountdownTimer startTime={promo.vigencia_inicio} endTime={promo.vigencia_final} /></p>
                            <p className="text-sm text-gray-500 mb-2">Disponibles: {promo.cantidad}</p>
                            {/* Agrega más detalles según sea necesario */}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </header>
              
            </div>
          </motion.div>
        </div>
      </SideBars>
      {modalVisible && (
        <Modal titulo="Agregar Promoción" onClose={handleModalClose}>
          <div className="  p-5 rounded-md shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="nombre" className="text-black block text-sm font-medium ">
  Descripción
                </label>
                <input
                  type="text"
                  id="descripcion"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
                {errors.descripcion && <div className="text-red-500">{errors.descripcion}</div>}
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="fecha_inicio" className="text-black block text-sm font-medium">
          Fecha Inicio
                </label>
                <input
                  type="datetime-local"
                  id="fecha_inicio"
                  name="fecha_inicio"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={fecha_inicio}
                  onChange={handleInputChange}
                />
                {errors.fecha_inicio && <div className="text-red-500">{errors.fecha_inicio}</div>}
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="fecha_fin" className="text-black block text-sm font-medium">
          Fecha Fin
                </label>
                <input
                  type="datetime-local"
                  id="fecha_fin"
                  name="fecha_fin"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={fecha_fin}
                  onChange={handleInputChange}
                />
                {errors.fecha_fin && <div className="text-red-500">{errors.fecha_fin}</div>}
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="timer" className="text-black block text-sm font-medium">
          Tiempo
                </label>
                <input
                  type="text"
                  disabled
                  id="timer"
                  name="timer"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={timer}
                  onChange={handleInputChange}
                />
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="fechaNacimiento" className="text-black block text-sm font-medium " />
  Cantidad
                <input
                  type="number"
                  id="cantidad"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
                {errors.cantidad && <div className="text-red-500">{errors.cantidad}</div>}
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="imagen" className="text-black block text-sm font-medium ">
  Imagen
                </label>
                <input
                  type="file"
                  id="imagen"
                  accept="image/*"
                  className="mt-1 h-8 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={imagen}
                  onChange={(e) => {setImagen(e.target.value); setImageFile(e.target.files[0])}}
                />
                {errors.imagen && <div className="text-red-500">{errors.imagen}</div>}
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="imagen" className="text-black block text-sm font-medium ">
  Qr
                </label>
                <input
                  type="file"
                  id="imagen"
                  accept="image/*"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={qr}
                  onChange={(e) => {setQr(e.target.value), setQrFile(e.target.files[0])}}
                />
                {errors.qr && <div className="text-red-500">{errors.qr}</div>}
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="imagen" className="text-black block text-sm font-medium ">
  Precio
                </label>
                <input
                  type="text"
                  id="precio"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
                {errors.precio && <div className="text-red-500">{errors.precio}</div>}
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="imagen" className="text-black block text-sm font-medium ">
  Categoria
                </label>
                <input
                  type="text"
                  id="categoria"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                />
                {errors.categoria && <div className="text-red-500">{errors.categoria}</div>}
              </div>
            </div>
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7a7bcb] hover:bg-[#898ae1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={()=>handleRegistro()}
              >
Insertar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default Perfil