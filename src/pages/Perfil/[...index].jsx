import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Table from '../../components/globals/Table';
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
import { FaStore, FaPlus, FaEdit, FaSignOutAlt, FaRegUser } from 'react-icons/fa';
import { FaClock, FaTag } from 'react-icons/fa';  // Asegúrate de importar estos iconos o utiliza otros de tu preferencia
import ReactPaginate from 'react-paginate';
import { FaChevronLeft,FaPhoneAlt , FaChevronRight } from 'react-icons/fa';
import QRCode from 'qrcode';
import { QrReader } from 'react-qr-reader';

import { Html5Qrcode } from 'html5-qrcode';
const Perfil = () => {
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const [showModal, setShowModal] = useState(false)
  const [esComercial, setEsComercial] = useState(false)
  const [delayScan , setDelayScan] = useState(500);


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
  const [comercialid, setComercialid]=useState('')


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
      setComercialid(decryptedData2)
      consultarTiendasMall(decryptedData2)
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
      // Filtrar promociones válidas
      const promosFiltradas = data.datos.filter((promo) => {
        const vigenciaInicio = new Date(promo.vigencia_inicio).getTime();
        const vigenciaFinal = new Date(promo.vigencia_final).getTime();
        const ahora = new Date().getTime();

        return ahora <= vigenciaFinal;
      });
      console.log(promosFiltradas)
      setPromos(promosFiltradas);
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }

  useEffect(()=> {

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

  const newAdmin = (items) => {
    console.log(comercialid)
    // encryptAndSetLocalStorage('usuarioData', JSON.stringify(items));
    router.push(`/Perfil/NewAdmin/${pathGen()}`)
  }

  const [modalVisible, setModalVisible] = useState(false);
  const handleModalOpen = (item) => {
    setModalVisible(true);
  };

  const [modalVisible2, setModalVisible2] = useState(false);
  const handleModalOpen2 = (item) => {
    setModalVisible2(true);
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

  const handleModalClose2 = () => {

    setModalVisible2(false);
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

  function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  function blobToText(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function () {
        const text = reader.result;
        resolve(text);
      };

      reader.onerror = function (error) {
        reject(error);
      };

      reader.readAsText(blob);
    });
  }

  function blobToBase64WithHeader(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Agregar el encabezado al resultado
        const base64WithHeader = `data:${blob.type};base64,${reader.result.split(',')[1]}`;
        resolve(base64WithHeader);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(blob);
    });
  }
  
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(blob);
    });
  }
  

  // Registro datos de Promociones
  const handleRegistro = async () => {
    console.log('Hola')
    // Validación de campos
    // const camposObligatorios = ['descripcion', 'fecha_inicio', 'fecha_fin', 'timer', 'imagen', 'qr', 'precio'];
    // const newErrors = {};

    // camposObligatorios.forEach((campo) => {
    //   if (!eval(campo)) {
    //     newErrors[campo] = `El campo de ${campo} es obligatorio.`;
    //   } else {
    //     newErrors[campo] = '';
    //   }
    // });

    // setErrors(newErrors);

    // // Verifica si hay algún error en los campos
    // const hayErrores = Object.values(newErrors).some((error) => error);

    // if (hayErrores) {
    //   // Detén el proceso de registro si faltan campos obligatorios
    //   return;
    // }

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

    // console.log(endpoint)
    console.log(registroData)
    // try {
    //   const jsonString = JSON.stringify(registroData);

    //   const response = await QRCode.toDataURL(jsonString)
    //   console.log(response)
    //   const qrCodeBlob = dataURLtoBlob(response);
    //   console.log(qrCodeBlob);
    //   const qrCodeBase64 = await blobToBase64WithHeader(qrCodeBlob);
    //   console.log(qrCodeBase64);
    // } catch (error) {
    //   console.log(error)
    // }

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
          const generacionQrData = {
            id_promocion: response.datos.id_promocion,
            cantidad,
            precio,
            vigencia_inicio: fecha_inicio,
            vigencia_final: fecha_fin,
          }
          console.log(response.datos.id_promocion)
          const jsonString = JSON.stringify(generacionQrData);
          const response3 = await QRCode.toDataURL(jsonString)
          console.log(response3)
          const qrCodeBlob = dataURLtoBlob(response3);
          console.log(qrCodeBlob);

          const base64QR = await blobToBase64(qrCodeBlob);
          const paramsQR = { tokenSesion: token.toString() };
          const registroQr = {
            qr: response3,
            id_promocion: response.datos.id_promocion,
          };
          const endpoint2 = 'http://localhost:4044/promociones/actualizar-qr';
          const response2 = await postToAPIWithParamsAndBody(endpoint2, paramsQR, registroQr);
          console.log(response2)


          // -----------------------------------------
          router.push(`/Perfil/${pathGen()}`);
          showAlertWithMessage('SUCCESS','Solicitud correcta', 'Se ingresaron los datos')
          setValidarRegistro(true)
          listarPromociones(tiendaId)
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

  const generateQrCode2 = async () =>{
    try {
      const response = await QRCode.toDataURL(textUrl)
      console.log(response)
      setImageUrl(response)
    } catch (error) {
      console.log(error)
    }
  }

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

  const [currentPage, setCurrentPage] = useState(0);
  const promosPerPage = 4;

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const slicedPromos = listarPromos.slice(
    currentPage * promosPerPage,
    (currentPage + 1) * promosPerPage
  );

  const [currentPage2, setCurrentPage2] = useState(0);
  const promosPerPage2 = 4;

  
  const [tiendasComercial, setTiendasComercial]=useState([])
  const handlePageChange2 = ({ selected }) => {
    setCurrentPage2(selected);
  };

  const slicedPromos2 = tiendasComercial.slice(
    currentPage2 * promosPerPage2,
    (currentPage2 + 1) * promosPerPage2
  );
  const consultarTiendasMall =async(comercial)=>{
    try {
      const endpoint = 'http://localhost:4044/tiendas/consultaGeneral/activo';
      console.log(token)
      console.log(comercial)
      const queryParams = {
        token: token,
        id_centroComercial: comercial
      };
      console.log(queryParams)
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setTiendasComercial(data.datos)

      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }

  const productInfo = {
    productName: 'Ejemplo de Producto',
    price: '$19.99',
    description: 'Este es un producto de ejemplo.',
    // Otros detalles del producto...
  };

  const handleSaveImage = (imageURL) => {
    // Convertir la URL a datos binarios y enviarlos al servidor para guardar en la base de datos
    const binaryData = atob(imageURL.split(',')[1]);
    
    console.log(imageURL)
    console.log(binaryData)
  };

  
  const [imageUrl, setImageUrl]=useState('')
  const [textUrl,setTextUrl] = useState('')
  useEffect(()=>{
    console.log(textUrl)
  },[textUrl])
  const generateQrCode = async () =>{
    try {
      const response = await QRCode.toDataURL(textUrl)
      console.log(response)
      setImageUrl(response)
    } catch (error) {
      console.log(error)
    }
  }
  const [scanResultWebCam, setScanResultWebCam] = useState(null);
  const handleErrorWebCam = error => {
    console.error('Error al acceder a la cámara:', error);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  const qrReader = React.createRef();


  const handleScan = (result, error) => {
    
    if (result) {
      setScanResultWebCam(result?.text)
      qrReader.current.stop();
    }

    if (error) {
      console.info(error);
    }
  };

  useEffect(() => {
    // useEffect se ejecutará cada vez que scanResultWebCam cambie
    if (scanResultWebCam) {
      restOfDataBase();
    }
  }, [scanResultWebCam]);

  const restOfDataBase = async (item) => {
    try {
      const endpoint = 'http://localhost:4044/promociones/publicarUpdate';
      const jsonObject = JSON.parse(scanResultWebCam);
      const paramsQR = { tokenSesion: token.toString() };
      const registroQr = {
        id_promocion: jsonObject.id_promocion,
      };
      const response = await postToAPIWithParamsAndBody(endpoint, paramsQR, registroQr);
      
      if (response.status === 1) {
        showAlertWithMessage('SUCCESS', 'Solicitud correcta', 'Se ingresaron los datos');
        setModalVisible2(false);
        setScanResultWebCam(null);
      } else {
        showAlertWithMessage('ERROR', 'Solicitud INCORRECTA', 'Pruebe denuevo');
        setModalVisible2(false);
        setScanResultWebCam(null);

      }
    } catch (error) {
      console.error('Error en restOfDataBase:', error);
      setScanResultWebCam(null);

    }
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
            <div className='w-full min-h-screen bg-white font-sans'>
              <div className="bg-gray-100 p-4 rounded-md shadow-md">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 md:h-32 md:w-32 overflow-hidden rounded-full shadow-lg bg-white">
                    <Image
                      src={items[0]?.imagen ? '/images/' + items[0]?.imagen : defaultImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                      alt="Imagen de perfil"
                      className="object-cover w-full h-full rounded-full"
                      layout="responsive"
                      width={500}
                      height={500}
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold">{items[0]?.nombre + ' ' + items[0]?.apellido}</h1>
                    <p className="text-gray-600">
                      {items[0]?.rol === 'U'
                        ? 'Usuario'
                        : items[0]?.rol === 'T'
                          ? 'Tienda'
                          : 'Comercial'}
                    </p>
                  </div>
                </div>
                {items[0]?.rol === 'T' && (
                  <p className="text-sm text-gray-500 mt-2">{informacionTienda[0]?.nombreTienda}</p>
                )}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">{items[0]?.telefono}</p>
                  <p className="text-sm text-gray-500">{items[0]?.correo}</p>
                </div>
              </div>



              {/* Resto del contenido del perfil */}
              <header className=" text-black py-2">
                <div className="container mx-auto px-2">
                  <nav className="mt-4 flex justify-center">
                    {esComercial && (
                      <>
                        <button
                          onClick={() => newStore(items)}
                          className='bg-blue-500 m-1 text-white font-semibold py-2 px-8 rounded-lg flex items-center justify-center hover:bg-blue-600'
                        >
                          <FaStore className='mr-2' />
                          <span className='hidden md:inline text-md'>Nueva Tienda</span>
                        </button>
                        {/* <button
                          onClick={() => newAdmin(items)}
                          className='bg-gray-500 m-1 text-white font-semibold py-2 px-8 rounded-lg flex items-center justify-center hover:bg-blue-600'
                        >
                          <FaRegUser className='mr-2' />
                          <span className='hidden md:inline text-md'>Nueva Admin</span>
                        </button> */}
                      </>
                    )}
                    {items[0]?.rol === 'T' && (
                      <>
                        <button
                          onClick={() => handleModalOpen2(items)}
                          className='bg-purple-500 m-1 text-white font-semibold py-2 px-8 rounded-lg flex items-center justify-center hover:bg-purple-600'
                        >
                          <FaPlus className='mr-2' />
                          <span className='hidden md:inline text-md'>Escanear Promocion</span>
                        </button>
                        <button
                          onClick={() => handleModalOpen(items)}
                          className='bg-green-500 m-1 text-white font-semibold py-2 px-8 rounded-lg flex items-center justify-center hover:bg-green-600'
                        >
                          <FaPlus className='mr-2' />
                          <span className='hidden md:inline text-md'>Agregar Promo</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => editData(items)}
                      className='bg-yellow-500 m-1 text-white font-semibold py-2 px-8 rounded-lg flex items-center justify-center hover:bg-yellow-600'
                    >
                      <FaEdit className='mr-2' />
                      <span className='hidden md:inline text-md'>Editar</span>
                    </button>
                    <button
                      onClick={() => handleLogout()}
                      className='bg-red-600 m-1 text-white font-semibold py-2 px-8 rounded-lg flex items-center justify-center hover:bg-red-700'
                    >
                      <FaSignOutAlt className='mr-2' />
                      <span className='hidden md:inline text-md'>Cerrar Sesión</span>
                    </button>
                  </nav>
                  {(items[0]?.rol === 'T') && (
                    <div className="mt-4">
                      <h1 className='text-2xl font-semibold mb-4'>Promociones</h1>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
                        { slicedPromos.length === 0 ? (
                          <div className="text-center text-gray-500">
                            <p>No hay promociones disponibles.</p>
                            {/* Puedes agregar un icono moderno aquí */}
                          </div>
                        ): (
                          slicedPromos.map((promo) => (
                            <div key={promo.id_promocion} className="bg-white p-4 rounded-md shadow-md">
                              <div className='h-40 w-full overflow-hidden mb-4'>
                                <Image
                                  src={promo.imagen ? '/images/' + promo.imagen : defaultImage}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultImage;
                                  }}
                                  alt="Imagen de perfil"
                                  className="rounded-t-md object-cover w-full h-full"
                                  layout="responsive"
                                  width={500}
                                  height={500}
                                />
                              </div>
                              <h3 className="text-lg font-semibold mb-2 text-gray-800">{promo.descripcion}</h3>
                              <p className="text-sm text-gray-500 mb-2 flex"><FaTag className="mr-2" />Categoría: {promo.categoria}</p>
                              <p className="text-sm text-gray-500 mb-2">Precio: ${promo.precio}</p>
                              <p className="text-sm text-gray-500 mb-2 flex">
                                <FaClock className="mr-2" />
              Vigencia: 
                              </p>
                              <CountdownTimer startTime={promo.vigencia_inicio} endTime={promo.vigencia_final} />
                              <p className="text-sm text-gray-500 mb-2">Disponibles: {promo.cantidad}</p>
                              {/* Agrega más detalles según sea necesario */}
                            </div>
                          ))
                        )}
                      </div>
                      <ReactPaginate
                        previousLabel={<FaChevronLeft />}
                        nextLabel={<FaChevronRight />}
                        breakLabel={'...'}
                        pageCount={Math.ceil(listarPromos.length / promosPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName={'pagination flex justify-center mt-4'}
                        pageClassName={'mx-2 cursor-pointer'}
                        previousClassName={'bg-slate-500 text-white py-2 px-4 rounded-md mr-2 cursor-pointer'}
                        nextClassName={'bg-slate-500 text-white py-2 px-4 rounded-md ml-2 cursor-pointer'}
                        activeClassName={'bg-slate-700 p-2 px-4 rounded text-white'}
                      />
                    </div>
                  )}
                  {(items[0]?.rol === 'C') && (
                    <>
                      {slicedPromos2.length === 0 ? (
                    
                        <div className="text-center text-gray-500">
                          <h1 className='text-2xl font-semibold mb-4'>Tiendas</h1>

                          <p>No hay tiendas disponibles.</p>
                          {/* Puedes agregar un icono moderno aquí */}
                        </div>
                      ) : (
                        <>
                          <h1 className='text-2xl font-semibold mb-4'>Tiendas</h1>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  
                            {slicedPromos2.map((tienda) => (
                              <div key={tienda.id_tienda} className="bg-white p-4 rounded-md shadow-md">
                                <div className="h-40 w-full overflow-hidden mb-4">
                                  <img
                                    src={'/images/' + tienda.imagen}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/default-image.jpg'; // Cambia 'default-image.jpg' por la ruta de tu imagen predeterminada
                                    }}
                                    alt="Imagen de tienda"
                                    className="rounded-t-md object-cover w-full h-full"
                                  />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">{tienda.nombreTienda}</h3>
                                <p className="text-sm text-gray-500 mb-2 flex"><FaPhoneAlt className="mr-2" />Teléfono: {tienda.telefono}</p>
                                <p className="text-sm text-gray-500 mb-2"><strong>Local:</strong> {tienda.numeroLocal}</p>
                                <p className="text-sm text-gray-500 mb-2"><strong>Categoría:</strong> {tienda.categoriaTienda}</p>
                                <p className="text-sm text-gray-500 mb-2"><strong>Correo:</strong> {tienda.correo}</p>
                              </div>
                            ))}
                          </div>

                        </>
                      )}
                      <ReactPaginate
                        previousLabel={<FaChevronLeft />}
                        nextLabel={<FaChevronRight />}
                        breakLabel={'...'}
                        pageCount={Math.ceil(tiendasComercial.length / promosPerPage2)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange2}
                        containerClassName={'pagination flex justify-center mt-4'}
                        pageClassName={'mx-2 cursor-pointer'}
                        previousClassName={'bg-slate-500 text-white py-2 px-4 rounded-md mr-2 cursor-pointer'}
                        nextClassName={'bg-slate-500 text-white py-2 px-4 rounded-md ml-2 cursor-pointer'}
                        activeClassName={'bg-slate-700 p-2 px-4 rounded text-white'}
                      />
                    </>
                  )}
                  {/* <QrReader
                    delay={300}
                    width={{ width: '100%' }}
                    onError={handleErrorWebCam}
                    onScan={handleScanWebCam}>
                  </QrReader> */}
                  {/* <p>Aqui:{scanResultWebCam}</p>
                  <div id="qr-code-reader"></div>
                  <p>Scan result: {scanResult}</p> */}
                </div>
              </header>
              
            </div>
            {/* <QRCodeComponent productData={productInfo} onSaveImage={handleSaveImage} /> */}

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
              {/* <div className='col-span-2 md:col-span-1'>
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
              </div> */}
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
      {modalVisible2 && (
        <Modal titulo="Escanear Promoción" onClose={handleModalClose2}>
          <QrReader
            scanDelay={delayScan}
            onError={handleErrorWebCam}
            onScan={(data)=>{''}}         
            onResult={(result, error) =>
              handleScan(result, error)
            }            style={{ width: '100%' }}
            resolution={1280}
            ref={qrReader}

            constraints={{ facingMode: 'environment' }}

          />
          <p>Aquí: {scanResultWebCam}</p>
        </Modal>
      )}
    </>
  )
}

export default Perfil