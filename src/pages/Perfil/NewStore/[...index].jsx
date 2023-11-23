import React, { useEffect, useState } from 'react'
import SideBar from '../../../components/globals/SideBar'
import { useAlert } from '../../../context/AlertContext';
import { useRouter } from 'next/router';
import useHasMounted from '../../../hooks/useHasMounted';
import { useAuth } from '../../../context/AuthContext';
import { decryptAndGetLocalStorage, encryptAndSetLocalStorage, getFromAPIWithParams, pathGen, postToAPIWithParamsAndBody } from '../../../funciones/api';
import Cards from '../../../components/globals/Cards';
import SideBars from '../../../components/common/SideBars';
import Modal from '../../../components/globals/Modal';

const NewStore = () => {
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const [usuario ,setUsuario]=useState([])
  const showAlertWithMessage  = useAlert();
  const [validateSlide, setValidateSlide] = useState(true)
  const [id_comercial,setIdComercial]=useState('')
  const [validarRegistro, setValidarRegistro] = useState(false);
  const [roles,setRoles] = useState('')
  const [nombreTienda, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [imagen, setImagen] = useState('');
  const [numeroLocal, setNumeroLocal] = useState('');
  const [estado, setEstado] = useState('A');
  const [categoriaTienda, setCategoria] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    nombreTienda: '',
    imagen: '',
    telefono: '',
    numeroLocal: '',
    categoriaTienda: '',
    correo: '',
  });

  const handleRegistro = async () => {
    console.log('Aca estoy')
    // Validación de campos
    const camposObligatorios = ['nombreTienda', 'imagen', 'telefono', 'numeroLocal', 'categoriaTienda', 'correo'];
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
    console.log()
    // // // Redirigir a la carpeta PantallaInicio después del registro exitoso
    const endpoint = 'http://localhost:4044/tiendas/registro'; // Ajusta la URL del servidor de registro
    const registroData = {
      nombreTienda,
      imagen:  imagen.split('\\').pop(),
      telefono,
      numeroLocal,
      estado_cuenta: estado,
      categoriaTienda,
      correo
    };
    const queryParams = {
      token: token.toString()      };

    console.log(registroData)
    try {
      try {
        const response = await postToAPIWithParamsAndBody(endpoint,queryParams, registroData);
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          showAlertWithMessage('SUCCESS','Solicitud correcta', 'Se ingresaron los datos')
          onClickButtonChange(response.id_tienda,id_comercial)
          setValidarRegistro(true)

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

  const [imageFile,setImageFile]=useState('')

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
  

  useEffect(()=>{
    console.log(imageFile)
  },[imageFile])

  useEffect(()=>{
    console.log(imagen)
  },[imagen])

  useEffect(()=>{
    if(validarRegistro === true){
      handleImagenUpload(imageFile)
      
    }
  },[validarRegistro])



  const listar =async()=>{
    try {
      const endpoint = 'http://localhost:4044/centroComercial/lista';
      console.log(token)
      const queryParams = {
        token: token.toString()      
      };
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setItems(data.datos)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);

    }

  }

  const listarPorUsuario =async(id_usuario)=>{
    try {
      const endpoint = 'http://localhost:4044/centroComercial/listaUsuarios';
      console.log(token)
      console.log(id_usuario)
      const queryParams = {
        token: token.toString(),
        id_usuario: id_usuario     
      };
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setItems(data.datos)
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
    const decryptedData3 = decryptAndGetLocalStorage('id_comercial');
    if(decryptedData3){
      console.log(decryptedData3)
      setIdComercial(decryptedData3)
    }
    const decryptedData = decryptAndGetLocalStorage('id_usuario');
    const decryptedData2 = decryptAndGetLocalStorage('rol');
    setUsuario(decryptedData)
    console.log(decryptedData2)
    setRoles(decryptedData2)
    if(decryptedData2 === 'S'){
      listar()
    }else if(decryptedData2 === 'C'){
      listarPorUsuario(decryptedData)
    }

  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    console.log(usuario)
  }, [usuario]);

  const handleSidebarVisibility = (sidebarVisible) => {
    setValidateSlide(sidebarVisible)
    // Realiza acciones basadas en el valor de sidebarVisible aquí
  };

  const handleShopClick = (item) => {
    console.log(item)
    router.push(`/NewStore/AgregarTienda/${pathGen()}`)
    encryptAndSetLocalStorage('id_centroComercial', item.id_centroComercial);


  };
  
  const handleInfoClick = (item) => {
    console.log(item)
    // Lógica cuando se hace clic en el icono de Información
    // Por ejemplo: mostrar detalles adicionales, etc.
  };

  useEffect(()=>{
    console.log(usuario)
  },[usuario])

  const [searchTerm, setSearchTerm] = useState('');

  const pageSize = 10; // Tamaño de página
  const [currentPage, setCurrentPage] = useState(1);

  // Lógica para calcular el índice inicial y final de los items a mostrar en la página actual
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Filtra los items basándote en el término de búsqueda
  const filteredItems = items
    .filter(item => {
      const searchTermLower = searchTerm.toLowerCase();
      const mallNameLower = item.nombreCC.toLowerCase();
      return mallNameLower.includes(searchTermLower);
    })
    .slice(startIndex, endIndex); // Pagina los items según el tamaño de la página y la página actual

  const [modalVisible, setModalVisible] = useState(false);

  const handleModalOpen = (item) => {
    console.log(item)
    setIdComercial(item.id_centroComercial)
    setModalVisible(true);
  };
  
  const handleModalClose = () => {
    setModalVisible(false);
  };



  const onClickButtonChange = async(id_tienda,id_comercial) =>{
    console.log(id_comercial)
    console.log(id_tienda)
    console.log(token)
    const endpoint = 'http://localhost:4044/tiendas/relCC'; // Ajusta la URL del servidor de registro
    const queryParams = {
      token: token.toString()
      
    };

    const registroData =  {
      idComercial:id_comercial,
      id_tienda :id_tienda
    }
    console.log(queryParams)
    try {
      try {
        const response = await postToAPIWithParamsAndBody(endpoint, queryParams, registroData);
        console.log(response)
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          router.push(`/Perfil/${pathGen()}`);
          setModalVisible(false);
          if(roles === 'S'){
            listar()
          }else if(roles === 'C'){
            listarPorUsuario(usuario)
          }
          showAlertWithMessage('SUCCESS','Update realizado', 'Se modificaron los datos')
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
  }

    
  return (
    <>

      <SideBars>
        {/* <Cards cardData={items} onShopClick={(newValue)=>handleShopClick(newValue)} onInfoClick={(newValue)=>handleInfoClick(newValue)}/> */}
        <div className='w-full items-center md:m-2'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 bg-slate-200 ">
            <div className='col-span-2 md:col-span-1'>
              <label htmlFor="nombre" className="text-black block text-sm font-medium ">
              Nombre
              </label>
              <input
                type="text"
                id="nombreTienda"
                className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                value={nombreTienda}
                onChange={(e) => setNombre(e.target.value)}
              />
              {errors.nombreTienda && <div className="text-red-500">{errors.nombreTienda}</div>}
            </div>
            <div className='col-span-2 md:col-span-1'>
              <label htmlFor="apellido" className="text-black block text-sm font-medium ">
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
              <label htmlFor="email" className="text-black block text-sm font-medium ">
              Teléfono
              </label>
              <input
                type="text"
                id="telefono"
                className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
              {errors.telefono && <div className="text-red-500">{errors.telefono}</div>}
            </div>
            <div className='col-span-2 md:col-span-1'>
              <label htmlFor="telefono" className="text-black block text-sm font-medium ">
              Número de Local
              </label>
              <input
                type="text"
                id="numeroLocal"
                className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                value={numeroLocal}
                onChange={(e) => setNumeroLocal(e.target.value)}
              />
            </div>
            <div className='col-span-2 md:col-span-1'>
              <label htmlFor="estado" className="text-black block text-sm font-medium ">
              Estado
              </label>
              <select
                id="estado"
                className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="A">Activo</option>
                <option value="I">Inactivo</option>
              </select>
              {errors.estado && <div className="text-red-500">{errors.estado}</div>}
            </div>
            <div className='col-span-2 md:col-span-1'>
              <label htmlFor="fechaNacimiento" className="text-black block text-sm font-medium ">
              Categoria Tienda
              </label>
              <input
                type="text"
                id="categoriaTienda"
                className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                value={categoriaTienda}
                onChange={(e) => setCategoria(e.target.value)}
              />
              {errors.categoriaTienda && <div className="text-red-500">{errors.categoriaTienda}</div>}
            </div>
            <div className='col-span-2 md:col-span-1'>
              <label htmlFor="password" className="text-black block text-sm font-medium ">
              Correo
              </label>
              <input
                type="email"
                id="correo"
                className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                value={correo}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.correo && <div className="text-red-500">{errors.correo}</div>}
            </div>
          </div>
          <div className='flex justify-center m-2'>
            <div><button onClick={()=>handleRegistro()} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-gray-400"
            >Agregar</button></div>
          </div>
        </div>

      </SideBars>


    </>
  )
}

export default NewStore