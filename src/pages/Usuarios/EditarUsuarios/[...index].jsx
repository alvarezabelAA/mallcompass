import SideBar from '../../../components/globals/SideBar'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import { postToAPI, pathGen, putToAPIWithParamsAndBody, decryptAndGetLocalStorage, encryptAndSetLocalStorage } from '../../../funciones/api';
import { useAlert } from '../../../context/AlertContext'; 
import useHasMounted from '../../../hooks/useHasMounted';
import { format } from 'date-fns';

const EditarUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rols, setRol] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [imagen, setImagen] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const { showAlertWithMessage } = useAlert();
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
    console.log(token);
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    const decryptedData = decryptAndGetLocalStorage('usuarioData');
    console.log(decryptedData)
    const objeto = JSON.parse(decryptedData);
    if (objeto && Object.keys(objeto).length > 0) {
      console.log(objeto.contrasena)
      setContrasena(objeto.contrasena)
      setRol(objeto.rol)
      setApellido(objeto.apellido)
      setNombre(objeto.nombre)
      setEmail(objeto.correo)
      setTelefono(objeto.telefono)
      setImagen(objeto.imagen)
      setFechaNacimiento(format(new Date(objeto.fecha_nacimiento), 'yyyy/MM/dd'))
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
    const endpoint = 'http://localhost:4044/usuario/final/update'; // Ajusta la URL del servidor de registro
    const registroData = {
      contrasena: contrasena,
      apellido,
      nombre,
      rol:rols,
      correo: email,
      telefono,
      imagen,
      fecha_nacimiento: fechaNacimiento,
    };
    const queryParams = {
      tokenSesion: token.toString()
    };

    console.log(registroData)
    console.log(queryParams)
    try {
      try {
        const response = await putToAPIWithParamsAndBody(endpoint,queryParams, registroData);
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          router.push(`/Usuarios/${pathGen()}`)
          encryptAndSetLocalStorage('usuarioData', '');
          showAlertWithMessage('OK', 'Se ingresaron los datos')
        }else{
          showAlertWithMessage('ERROR', 'No se ingreso la data')

        }
        
      } catch (error) {
        showAlertWithMessage('ERROR', 'Error al hacer la solicitud POST:' + error)
        // Maneja el error aquí
      }
    } catch (error) {
      showAlertWithMessage('ERROR', 'Error al hacer la solicitud:' + error)
    }
  };

  const handleLogin = () => {
    router.push(`/Usuarios/${pathGen()}`);
  };

  return (
    <>
      <SideBar />
      <div className='p-4 sm:ml-64'>
        <div className="md:p-32 py-60 ">
          <div className="max-w-md md:max-w-3xl mx-auto background-darkBlue  p-5 rounded-md shadow-md">
            <h2 className="text-2xl  font-semibold text-center mb-6 text-white">Editar Perfil</h2>
            <div className="grid grid-cols-1 gap-4 ">
              <div>
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
              <div>
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
              <div>
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
              <div>
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
              <div>
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
              <div>
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
              <div>
                <label htmlFor="fechaNacimiento" className="text-white block text-sm font-medium ">
              Rol:
                </label>
                <select
                  id="fechaNacimiento"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={rols}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value="S">Super Administrador</option>
                  <option value="U">Usuario</option>
                  <option value="C">Centro Comercial</option>
                  <option value="T">Tienda</option>
                </select>
                {errors.fechaNacimiento && <div className="text-red-500">{errors.fechaNacimiento}</div>}
              </div>
            </div>
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7a7bcb] hover:bg-[#898ae1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={()=>handleRegistro()}
              >
            Actualizar
              </button>
              <button
                onClick={handleLogin}
                type="button"
                className="w-full mt-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
            Regresar a Usuarios
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditarUsuario