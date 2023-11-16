import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { postToAPI, pathGen } from '../../funciones/api';
import { useAlert } from '../../context/AlertContext'; // Ajusta la ruta según tu estructura de directorios
import dynamic from 'next/dynamic';
import { MdOutlineAdminPanelSettings,MdOutlineLocalMall } from 'react-icons/md'

const Map = dynamic(() => import('../../components/Map'), {
  ssr: false,
});

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [imagen, setImagen] = useState('');
  const [validarRegistro, setValidarRegistro] = useState(false);
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const showAlertWithMessage  = useAlert();
  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    imagen: '',
    fechaNacimiento: '',
    password: '',
  });

  const { login } = useAuth();
  const router = useRouter();

  const handleRegistro = async ({ imageFile }) => {
    console.log(imageFile)
    // Validación de campos
    const camposObligatorios = ['nombre', 'apellido', 'email', 'telefono', 'imagen', 'fechaNacimiento', 'password'];
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
    const endpoint = 'http://localhost:4044/usuario/final/registro'; // Ajusta la URL del servidor de registro
    
    const registroData = {
      contrasena: password,
      apellido,
      nombre,
      correo: email,
      telefono,
      imagen: imagen.split('\\').pop(),
      fecha_nacimiento: fechaNacimiento,
    };


    try {
      try {
        const response = await postToAPI(endpoint, registroData);
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          router.push(`/login/${pathGen()}`);
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

  const handleLogin = () => {
    router.push(`/login/${pathGen()}`);
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

  return (
    <div className="md:p-32 md:py-24 bg-no-repeat bg-cover bg-center relative" style={{ backgroundImage: 'url(/images/mall.jpg)' }}>
      <div className="absolute bg-gradient-to-b from-blue-900 to-blue-500 opacity-75 inset-0 z-0"></div>
      <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
        <div className="flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
          <div className="self-start hidden lg:flex flex-col  text-white">
            {/* <img src="" className="mb-3" /> */}
            <h1 className="mb-3 font-bold text-5xl">Quieres registrarte? Ingresa tus datos </h1>
            <p className="pr-3">¿Buscas ofertas exclusivas y acceso a información privilegiada? Estás a un clic de descubrirlo.</p>
          </div>
        </div>
        <div className="flex justify-center self-center  z-10">
          <div className="p-12 bg-white  mx-auto rounded-2xl w-[650px] ">
            <div className="mb-4">
              <h3 className="font-semibold text-2xl text-gray-800">Sign up </h3>
              <p className="text-gray-500">Please Sign up to create your account.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className='col-span-1'>
                <label htmlFor="nombre" className="text-gray-600 block text-sm font-medium">
            Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="mt-1 h-8 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                {errors.nombre && <div className="text-red-500">{errors.nombre}</div>}
              </div>
              <div className='col-span-1'>
                <label htmlFor="apellido" className="text-gray-600 block text-sm font-medium">
            Apellido
                </label>
                <input
                  type="text"
                  id="apellido"
                  className="mt-1 h-8 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
                {errors.apellido && <div className="text-red-500">{errors.apellido}</div>}
              </div>
              <div className='col-span-1'>
                <label htmlFor="email" className="text-gray-600 block text-sm font-medium">
            Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 h-8 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
                {errors.email && <div className="text-red-500">{errors.email}</div>}
              </div>
              <div className='col-span-1'>
                <label htmlFor="telefono" className="text-gray-600 block text-sm font-medium">
            Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  className="mt-1 h-8 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
                {errors.telefono && <div className="text-red-500">{errors.telefono}</div>}
              </div>
              <div className='col-span-1'>
                <label htmlFor="imagen" className="text-gray-600 block text-sm font-medium">
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
              <div className='col-span-1'>
                <label htmlFor="fechaNacimiento" className="text-gray-600 block text-sm font-medium">
            Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  className="mt-1 h-8 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                />
                {errors.fechaNacimiento && <div className="text-red-500">{errors.fechaNacimiento}</div>}
              </div>
              <div className='col-span-1'>
                <label htmlFor="password" className="text-gray-600 block text-sm font-medium">
            Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 h-8 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="text-red-500">{errors.password}</div>}
              </div>
              <div className='col-span-2'>
                <button
                  type="button"
                  className="w-full  p-3  bg-blue-400  hover:bg-blue-500 text-white rounded-lg tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                  onClick={()=>handleRegistro(imageFile)}
                >
            Registrarse
                </button>
                
              </div>
              <div className='w-full col-span-2'>
                <button
                  onClick={handleLogin}
                  type="button"
                  className="w-full text-gray-100 p-3 bg-red-600 hover:bg-red-700 rounded-lg tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                >
            Regresar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Registro;
