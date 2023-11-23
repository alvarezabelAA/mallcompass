import SideBar from '../../../components/globals/SideBar'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import { postToAPI, pathGen, putToAPIWithParamsAndBody, decryptAndGetLocalStorage, encryptAndSetLocalStorage } from '../../../funciones/api';
import { useAlert } from '../../../context/AlertContext'; 
import useHasMounted from '../../../hooks/useHasMounted';
import { format } from 'date-fns';
import SideBars from '../../../components/common/SideBars';

const EditProfile = () => {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [imagen, setImagen] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const showAlertWithMessage  = useAlert();
  const hasMounted = useHasMounted();

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    imagen: '',
    fechaNacimiento: '',
    password: '',
  });

  const getEnv = () => {
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    const decryptedData = decryptAndGetLocalStorage('usuarioData');
    const objeto = JSON.parse(decryptedData);
    setRol(objeto[0].rol)
    setContrasena(objeto[0].contrasena)
    setApellido(objeto[0].apellido)
    setNombre(objeto[0].nombre)
    setEmail(objeto[0].correo)
    setTelefono(objeto[0].telefono)
    setImagen(objeto[0].imagen)
    setFechaNacimiento(format(new Date(objeto[0].fecha_nacimiento), 'yyyy/MM/dd'))
  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  const { token, login } = useAuth();
  const router = useRouter();

  const handleRegistro = async () => {
    // // Validación de campos
    // const camposObligatorios = ['nombre', 'apellido', 'email', 'telefono', 'imagen', 'fechaNacimiento', 'password'];
    // const newErrors = {};

    // camposObligatorios.forEach((campo) => {
    //   if (!eval(campo)) {
    //     newErrors[campo] = `El campo de ${campo} es obligatorio.`;
    //   } else {
    //     newErrors[campo] = '';
    //   }
    // });
    // console.log(newErrors)

    // setErrors(newErrors);

    // // Verifica si hay algún error en los campos
    // const hayErrores = Object.values(newErrors).some((error) => error);

    // if (hayErrores) {
    //   console.log(hayErrores)
    //   // Detén el proceso de registro si faltan campos obligatorios
    //   return;
    // }

    // // Redirigir a la carpeta PantallaInicio después del registro exitoso
    const endpoint = 'http://localhost:4044/usuario/final/updateGeneral'; // Ajusta la URL del servidor de registro
    const registroData = {
      contrasena: contrasena,
      apellido,
      nombre,
      correo: email,
      telefono,
      imagen,
      fecha_nacimiento: fechaNacimiento,
    };
    const queryParams = {
      tokenSesion: token.toString()
    };
    console.log(queryParams,registroData)
    try {
      try {
        const response = await putToAPIWithParamsAndBody(endpoint,queryParams, registroData);
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          router.push(`/Perfil/${pathGen()}`)
          encryptAndSetLocalStorage('usuarioData', '');
          showAlertWithMessage('SUCCESS','Solicitud correcta', 'Se ingresaron los datos')
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
    encryptAndSetLocalStorage('usuarioData', '');
    router.push(`/Perfil/${pathGen()}`);
  };
  const handleSidebarVisibility = (sidebarVisible) => {
    console.log('Sidebar visibility:', sidebarVisible);
    // Realiza acciones basadas en el valor de sidebarVisible aquí
    setValidateSlide(sidebarVisible)

  };

  const [validateSlide, setValidateSlide] = useState(true)

  useEffect(()=>{
    console.log(validateSlide)
  },[validateSlide])


  return (
    <>
      <SideBars>
        <div className='w-full min-h-screen items-center bg-gray-800'>
          <div className="  p-5 rounded-md shadow-md">

            <h2 className="text-2xl  font-semibold text-center mb-6 text-slate-500">Editar Perfil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="nombre" className="text-white block text-sm font-medium ">
              Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                {errors.nombre && <div className="text-red-500">{errors.nombre}</div>}
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="apellido" className="text-white block text-sm font-medium ">
              Apellido
                </label>
                <input
                  type="text"
                  id="apellido"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
                {errors.apellido && <div className="text-red-500">{errors.apellido}</div>}
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="email" className="text-white block text-sm font-medium ">
              Correo Electrónico
                </label>
                <input
                  disabled
                  type="email"
                  id="email"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="text-red-500">{errors.email}</div>}
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="telefono" className="text-white block text-sm font-medium ">
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
                <label htmlFor="imagen" className="text-white block text-sm font-medium ">
              URL de la Imagen
                </label>
                <input
                  type="text"
                  id="imagen"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                />
                {errors.imagen && <div className="text-red-500">{errors.imagen}</div>}
              </div>
              <div className='col-span-2 md:col-span-1'>
                <label htmlFor="fechaNacimiento" className="text-white block text-sm font-medium ">
              Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                />
                {errors.fechaNacimiento && <div className="text-red-500">{errors.fechaNacimiento}</div>}
              </div>
            </div>
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7a7bcb] hover:bg-[#898ae1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={()=>handleRegistro()}
              >
            Editar
              </button>
              <button
                onClick={handleLogin}
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

export default EditProfile