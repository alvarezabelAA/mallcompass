import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted'
import { decryptAndGetLocalStorage,getFromAPIWithParams,pathGen, postToAPIWithParamsAndBody, putToAPIWithParamsAndBody } from '../../funciones/api';
import NavBar from '../../components/globals/NavBar';
import SideBars from '../../components/common/SideBars';
import Modal from '../../components/globals/Modal';
import { useAlert } from '../../context/AlertContext';

const Productos = () => {
  const router = useRouter();
  const { token,logout } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const [items,setItems]=useState([])
  const [items2,setItems2]=useState([])
  const [items3,setItems3]=useState([])
  const [roles,setRoles] = useState('')
  const [usuario ,setUsuario]=useState([])
  const [id_comercial,setIdComercial]=useState('')
  const [validarRegistro, setValidarRegistro] = useState(false);
  const showAlertWithMessage  = useAlert();

  const listar =async(comercial)=>{
    try {
      const endpoint = 'http://localhost:4044/centroComercial/listaTiendas';
      console.log(token)
      console.log(comercial)
      const queryParams = {
        token: token,
        id_centroComercial: comercial
      };
      console.log(queryParams)
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setItems(data.datos)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);

    }
  }

  const listarCC =async()=>{
    try {
      const endpoint = 'http://localhost:4044/centroComercial/lista';
      console.log(token)
      const queryParams = {
        token: token.toString()      
      };
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setItems2(data.datos)
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
      setItems3(data.datos)
      if(data.status ==='1'){
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);

    }

  }

  const listarProductosTienda =async(item)=>{
    try {
      const endpoint = 'http://localhost:4044/productos/tienda';
      console.log(token)
      console.log(item.id_tienda)
      const queryParams = {
        token: token.toString(),
        id_tienda: item.id_tienda     
      };
      const data = await getFromAPIWithParams(endpoint,queryParams);
      console.log(data)
      setItems3(data.datos)
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
    const decryptedData = decryptAndGetLocalStorage('id_usuario');
    const decryptedData2 = decryptAndGetLocalStorage('rol');
    setUsuario(decryptedData)
    console.log(decryptedData2)
    setRoles(decryptedData2)
    if(decryptedData2 === 'S'){
      listarCC()
    }else if(decryptedData2 === 'C' || decryptedData2 === 'T'){
      listarPorUsuario(decryptedData)
    }
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

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
  const filteredItems = items2
    .filter(item => {
      const searchTermLower = searchTerm.toLowerCase();
      const mallNameLower = item.nombreCC.toLowerCase();
      return mallNameLower.includes(searchTermLower);
    })
    .slice(startIndex, endIndex); // Pagina los items según el tamaño de la página y la página actual
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);

  const handleModalOpen = (item) => {
    console.log(item)
    setIdComercial(item.id_centroComercial)
    listar(item.id_centroComercial)
    setModalVisible(true);
  };
    
  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalClose2 = () => {
    setModalVisible2(false);
  };

  const handleModalClose3 = () => {
    setModalVisible3(false);
    setFormValues(initialState)
  };


  const [store, setStore] = useState([])

  const OpenPublicaciones = (item) => {
    console.log(item)
    setStore(item.id_tienda)
    setModalVisible2(true)
    setModalVisible(false);
    listarProductosTienda(item)
  }

  //   const [currentPage3, setCurrentPage3] = useState(1);
  // const pageSize3 = 3; // Número de elementos por página

  // const filteredItems3 = items3
  //   .filter(tienda => {
  //     const searchTermLower = searchTerm.toLowerCase();
  //     const tiendaNameLower = tienda.nombreTienda.toLowerCase();
  //     return tiendaNameLower.includes(searchTermLower);
  //   })
  //   .slice((currentPage3 - 1) * pageSize, currentPage3 * pageSize3);

  // const totalPages = Math.ceil(filteredItems3.length / pageSize3);

  const newPost = () => {
    console.log('aca estoy')
    setModalVisible3(true)
  }

  const initialState = {
    existencia: "",
    descripcion: "",
    estado_producto: "A",
    categoria: "",
    nombre: "",
    precio: "",
    imagen: "",
    qr: ""
  }

  //Formulario
  const [formValues, setFormValues] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí puedes realizar alguna acción con los valores del formulario
    // Por ejemplo, enviar los datos a tu API
    console.log("Formulario enviado:", formValues);

    const body = {
      existencia:formValues.existencia,
      descripcion:formValues.descripcion,
      estado_producto:formValues.estado_producto,
      categoria:formValues.categoria,
      nombre:formValues.nombre,
      precio:formValues.precio,
      imagen:formValues.imagen.split('\\').pop(),
      qr:formValues.qr='qr'
    }
    setImageFile(formValues.imagen.split('\\').pop())
    console.log(body)
    console.log(store)
    const queryParams = {
      token: token.toString(),
      id_tienda: store     
    };
    const endpoint = 'http://localhost:4044/productos/ingreso'; // Ajusta la URL del servidor de registro
    try {
      try {
        const response = await postToAPIWithParamsAndBody(endpoint, queryParams, body);
        console.log(response)
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          router.push(`/Productos/${pathGen()}`);
          showAlertWithMessage('SUCCESS','Insert realizado', 'Se inserto la publicacion')
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
        setModalVisible(false);
        setModalVisible2(false);
        setModalVisible3(false);

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

  // useEffect(()=>{
  //   console.log(imagen)
  // },[imagen])

  useEffect(()=>{
    if(validarRegistro === true){
      handleImagenUpload(imageFile)
      
    }
  },[validarRegistro])


  return (
    <>
      <SideBars>
        <div className='w-full items-center md:m-2'>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark-bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Buscar centro comercial..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-wrap justify-center">
            {filteredItems.map((mall, index) => (
              <div key={index} className="w-full  md:w-[350px]  p-4">
                <div className="rounded bg-base-100 shadow-xl md:m-2">
                  <figure><img className='w-full h-80 object-cover' src={'/images/' + mall.imagen} alt="Mall" /></figure>
                  <div className="p-4">
                    <h2 className="font-semibold text-xl">{mall.nombreCC}</h2>
                    {/* <p>Correo: {mall.correo}</p>
                    <p>Cantidad de Usuarios: {mall.cantidad_usuarios}</p>
                    <p>Cantidad de Tiendas: {mall.cantidad_tiendas}</p> */}
                    <div className="flex justify-center mt-4">
                      <button onClick={()=>handleModalOpen(mall)} className="bg-emerald-600 rounded p-3 text-white font-medium mx-2">Ver tiendas</button>
                      {/* <button className="bg-emerald-600 rounded p-3 text-white font-medium mx-2">+ Usuario</button> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {modalVisible && (
          <Modal titulo="Ver Tiendas" onClose={handleModalClose}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.length > 0 ? (
                items.map(tienda => (
                  <div key={tienda.id_tienda} className="card rounded-md overflow-hidden shadow-md">
                    <img className="h-24 w-full object-cover" src={'/images/' + tienda.imagen} alt={tienda.nombreTienda} />
                    <div className="p-4">
                      <h5 className="font-bold text-lg mb-2">{tienda.nombreTienda}</h5>
                      <p className="text-gray-600 mb-2">Teléfono: {tienda.telefono}</p>
                      <p className="text-gray-600 mb-2">Local: {tienda.numeroLocal}</p>
                      <p className="text-gray-600 mb-2">Categoría: {tienda.categoriaTienda}</p>
                      <p className="text-gray-600 mb-4">Correo: {tienda.correo}</p>
                      <button onClick={()=> OpenPublicaciones(tienda)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Publicaciones
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay tiendas disponibles.</p>
              )}
            </div>
          </Modal>
      
        )}

        {modalVisible2 && (
          <Modal titulo="Ver publicaciones" onClose={handleModalClose2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className='flex justify-center col-span-2'>
                <button onClick={() => newPost()} className='bg-emerald-500 p-2 rounded'>
                    + Post
                </button>
              </div>
              {items3.length > 0 ? (
                items3.map(tienda => (
                  <div key={tienda.id_tienda} className="card rounded-md overflow-hidden shadow-md">
                    <img className="h-24 w-full object-cover" src={'/images/' + tienda.imagen} alt={tienda.nombreTienda} />
                    <div className="p-4">
                      <h5 className="font-bold text-lg mb-2">{tienda.nombre}</h5>
                      <p className="text-gray-600 mb-2">Descripción: {tienda.descripcion}</p>
                      <p className="text-gray-600 mb-2">Precio: {tienda.precio}</p>
                      <p className="text-gray-600 mb-2">Categoría: {tienda.categoria}</p>
                      <p className="text-gray-600 mb-4">Existencia: {tienda.existencia}</p>
                      
                    </div>
                  </div>
                ))
              
              ) : (
                <div className='col-span-2 '>
                  <p>No hay publicaciones disponibles.</p>
                  <div className='flex justify-center'>
                    <button onClick={() => newPost()} className='bg-emerald-500 p-2 rounded'>
                    Generar nueva publicacion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Modal>
      
        )}

        {modalVisible3 && (
          <Modal titulo="Nueva Publicación" onClose={handleModalClose3}>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formValues.nombre}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Precio</label>
                  <input
                    type="text"
                    name="precio"
                    value={formValues.precio}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Existencia</label>
                  <input
                    type="text"
                    name="existencia"
                    value={formValues.existencia}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Categoria</label>
                  <input
                    type="text"
                    name="categoria"
                    value={formValues.categoria}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Estado</label>
                  <select
                    name="estado_producto"
                    value={formValues.estado}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  >
                    <option value="A">Activo</option>
                    <option value="I">Inactivo</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Imagen</label>
                  <input
                    type="file"
                    id="imagen"
                    name='imagen'
                    accept="image/*"
                    className="mt-1 h-8 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={formValues.estado}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formValues.descripcion}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                
                {/* Agrega más campos según tus necesidades */}
              </div>
              <div className="flex justify-end p-4">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Guardar
                </button>
              </div>
            </form>
          </Modal>
        )}
      </SideBars>
    </>
  )
}

export default Productos