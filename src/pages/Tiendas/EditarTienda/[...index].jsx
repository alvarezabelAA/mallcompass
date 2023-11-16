import React, { useEffect, useState } from 'react'
import SideBar from '../../../components/globals/SideBar'
import { useAlert } from '../../../context/AlertContext';
import useHasMounted from '../../../hooks/useHasMounted';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/router';
import { decryptAndGetLocalStorage, pathGen, postToAPI, postToAPIWithParamsAndBody, putToAPIWithParamsAndBody } from '../../../funciones/api';
import SideBars from '../../../components/common/SideBars';

const EditarTienda = () => {
  const showAlertWithMessage  = useAlert();
  const hasMounted = useHasMounted();
  const { token, login } = useAuth();
  const router = useRouter();
  const [validarRegistro, setValidarRegistro] = useState(false);

  const [nombreTienda, setNombre] = useState('');
  const [correo, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [imagen, setImagen] = useState('');
  const [numeroLocal, setNumeroLocal] = useState('');
  const [estado, setEstado] = useState('A');
  const [categoriaTienda, setCategoria] = useState('');
  const [id_tienda, setIdTienda] = useState('');
  const [errors, setErrors] = useState({
    nombreTienda: '',
    imagen: '',
    telefono: '',
    numeroLocal: '',
    categoriaTienda: '',
    correo: '',
  });

  const getEnv = () => {
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }

    const decryptedData = decryptAndGetLocalStorage('tiendaData');
    const objeto = JSON.parse(decryptedData);
    if (objeto && Object.keys(objeto).length > 0) {
      setNombre(objeto.nombreTienda)
      setEmail(objeto.correo)
      setTelefono(objeto.telefono)
      setImagen(objeto.imagen)
      setCategoria(objeto.categoriaTienda)
      setImagen(objeto.imagen)
      setNumeroLocal(objeto.numeroLocal)
      setEstado(objeto.estado_cuenta)
      setIdTienda(objeto.id_tienda)
    }else{
      console.error("El objeto está vacío o no definido");
    }
    
    
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);




  const handleRegistro = async () => {
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
    const endpoint = 'http://localhost:4044/tiendas/modificacion'; // Ajusta la URL del servidor de registro
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
      token: token.toString(), idTienda: id_tienda      };

    console.log(registroData)
    console.log(queryParams)
    try {
      try {
        const response = await putToAPIWithParamsAndBody(endpoint,queryParams, registroData);
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          router.push(`/Tiendas/${pathGen()}`);
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

  const handleUsuario = () => {
    router.push(`/Tiendas/${pathGen()}`);
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

  return (
    <>
      <SideBars>
        <div className='w-full items-center md:m-[10vh]'>
          <div className=" bg-slate-300 p-5 rounded-md shadow-md">
            <h2 className="text-2xl  font-semibold text-center mb-6 text-black">Registro</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
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
                  // value={imagen}
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
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7a7bcb] hover:bg-[#898ae1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleRegistro}
              >
            Registrarse
              </button>
              <button
                onClick={handleUsuario}
                type="button"
                className="w-full mt-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
            Regresar 
              </button>
            </div>
          </div>
        </div>
      </SideBars>
    </>
  )
}

export default EditarTienda