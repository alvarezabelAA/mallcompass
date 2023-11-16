import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import useHasMounted from '../../hooks/useHasMounted';
import { decryptAndGetLocalStorage, pathGen, postToAPIWithParamsAndBody } from '../../funciones/api';
import NavBar from '../../components/globals/NavBar';
import SideBars from '../../components/common/SideBars';
import { useAlert } from '../../context/AlertContext';

const Post = () => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const hasMounted = useHasMounted();
  const [profileData, setProfileData] = useState(null);
  const [items, setItems] = useState(null);
  const [idComercial, setIdComercial] = useState(null);
  const [idTienda, setIdTienda] = useState(null);

  const getEnv = () => {
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    const decryptedData_1 = decryptAndGetLocalStorage('id_tienda');
    const decryptedData_2 = decryptAndGetLocalStorage('id_comercial');
    const tienda_id = decryptedData_1 ? JSON.parse(decryptedData_1) : null;
    const comercial_id = decryptedData_2 ? JSON.parse(decryptedData_2) : null;
    console.log(tienda_id)
    console.log(comercial_id)
    if (comercial_id && tienda_id) {
      setIdTienda(tienda_id)
    }else if (!tienda_id && comercial_id) {
      setIdComercial(comercial_id)

    }
    // setProfileData(objeto);
    // if(objeto?.id_centroComercial){
    //   listar(objeto.id_centroComercial)
    // }
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  // formulario
  const initialData={
    descripcion:"",
    actividad:"",
    vigencia_inicial: "",
    vigencia_final:"",
    imagen:"",
    categoria:"" 
  }

  const [errors, setErrors] = useState({
    descripcion:"",
    actividad:"",
    vigencia_inicial: "",
    vigencia_final:"",
    imagen:"",
    categoria:"" 
  });

  const [descripcion, setDescripcion] = useState('');
  const [actividad, setActividad] = useState('');
  const [vigencia_inicial, setVigenciaInicial] = useState('');
  const [vigencia_final, setVigenciaFinal] = useState('');
  const [imagen, setImagen] = useState('');
  const [categoria, setCategoria] = useState('');
  const showAlertWithMessage  = useAlert();
  const [validarRegistro, setValidarRegistro] = useState(false);


  const handleRegistro = async () => {
    // Validación de campos
    const camposObligatorios = ['descripcion', 'actividad', 'vigencia_inicial', 'vigencia_final', 'imagen', 'categoria'];
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
    const endpoint = idComercial !== null
      ? 'http://localhost:4044/centroComercial/post/publicar'
      : 'http://localhost:4044/tiendas/post/publicar';
    const registroData =  {
      descripcion,
      actividad,
      vigencia_inicio: vigencia_inicial,
      vigencia_final,
      imagen:  imagen.split('\\').pop(),
      categoria
    }
    console.log(endpoint)
    console.log(registroData)
    const queryParams = idComercial !== null
      ? { id_centroComercial: idComercial, tokenSesion: token.toString() }
      : { id_tienda: idTienda, tokenSesion: token.toString() };
    console.log()
    console.log(queryParams)
    try {
      try {
        const response = await postToAPIWithParamsAndBody(endpoint, queryParams, registroData);
        console.log(response)
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          router.push(`/Feed/${pathGen()}`);
          showAlertWithMessage('SUCCESS','Solicitud correcta', 'Se ingresaron los datos')
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


  const validarFechas = () => {
    if (vigencia_inicial && vigencia_final) {
      const fechaInicial = new Date(vigencia_inicial);
      const fechaFinal = new Date(vigencia_final);
      if (fechaInicial > fechaFinal) {
        setErrors({
          ...errors,
          vigencia_inicial: 'La vigencia inicial no puede ser mayor que la vigencia final.',
        });
      } else {
        setErrors({
          ...errors,
          vigencia_inicial: '',
        });
      }
    }
  };

  const handleVigenciaInicialChange = (e) => {
    validarFechas();
    setVigenciaInicial(e.target.value);
  };

  const handleVigenciaFinalChange = (e) => {
    validarFechas();
    setVigenciaFinal(e.target.value);
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
              <div className='w-full items-center md:md:m-[10vh] '>
                <div className=" bg-slate-300 p-5 rounded-md shadow-md">
                  <h2 className="text-2xl  font-semibold text-center mb-6 text-black">Publicaciones</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div className='col-span-2 md:col-span-1'>
                      <label htmlFor="nombre" className="text-black block text-sm font-medium ">
              Descripcion
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
                      <label htmlFor="telefono" className="text-black block text-sm font-medium ">
              Actividad
                      </label>
                      <input
                        type="text"
                        id="actividad"
                        className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                        value={actividad}
                        onChange={(e) => setActividad(e.target.value)}
                      />
                      {errors.actividad && <div className="text-red-500">{errors.actividad}</div>}
                    </div>
                    <div className='col-span-2 md:col-span-1'>
                      <label htmlFor="vigencia_inicial" className="text-black block text-sm font-medium ">
          Vigencia Inicial
                      </label>
                      <input
                        type="datetime-local"
                        id="vigencia_inicial"
                        className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                        value={vigencia_inicial}
                        onChange={handleVigenciaInicialChange}
                      />
                      {errors.vigencia_inicial && <div className="text-red-500">{errors.vigencia_inicial}</div>}
                    </div>
                    <div className='col-span-2 md:col-span-1'>
                      <label htmlFor="vigencia_final" className="text-black block text-sm font-medium ">
          Vigencia Final
                      </label>
                      <input
                        type="datetime-local"
                        id="vigencia_final"
                        className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                        value={vigencia_final}
                        onChange={handleVigenciaFinalChange}
                      />
                      {errors.vigencia_final && <div className="text-red-500">{errors.vigencia_final}</div>}
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
                      <label htmlFor="direccion" className="text-black block text-sm font-medium ">
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
              
                    {/* <div className='col-span-2'>
                <Map onCoordenadasChange={(newValue)=> coordenada(newValue)} />
                {/* <Accordion numOfAccordions={1} title="Mapa Ubicación">
                </Accordion> */}

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
              </div>
            </div>
          </motion.div>
        </div>
      </SideBars>
    </>
  );
};

export default Post;
