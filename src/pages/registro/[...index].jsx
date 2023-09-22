import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { postToAPI, pathGen } from '../../funciones/api';
import { useAlert } from '../../context/AlertContext'; // Ajusta la ruta según tu estructura de directorios

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [imagen, setImagen] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const { showAlertWithMessage } = useAlert();
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

  const handleRegistro = async () => {
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
      imagen,
      fecha_nacimiento: fechaNacimiento,
    };


    try {
      try {
        const response = await postToAPI(endpoint, registroData);
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          router.push(`/login/${pathGen()}`);
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
    router.push(`/login/${pathGen()}`);
  };

  return (
    <div className="md:p-32 py-60 ">
      <div className="max-w-md md:max-w-3xl mx-auto background-darkBlue  p-5 rounded-md shadow-md">
        <h2 className="text-2xl  font-semibold text-center mb-6 text-white">Registro</h2>
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
            <label htmlFor="password" className="text-white block text-sm font-medium ">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="text-red-500">{errors.password}</div>}
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
            onClick={handleLogin}
            type="button"
            className="w-full mt-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Regresar Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registro;
