import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { encryptAndSetLocalStorage, pathGen } from '../../funciones/api';

const registro = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [imagen, setImagen] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleregistro = async () => {
    // Validación de campos
    if (!nombre || !apellido || !email || !telefono || !imagen || !fechaNacimiento || !password) {
      // Aquí puedes agregar más validaciones según tus necesidades
      // ...
      return;
    }

    // Otras validaciones, como verificar el formato del correo electrónico, longitud de contraseña, etc.
    // ...

    // Si todas las validaciones pasan, puedes enviar los datos al servidor aquí
    // ...

    // Redirigir a la carpeta PantallaInicio después del registro exitoso
    const endpoint = 'http://localhost:4044/registro/'; // Ajusta la URL del servidor de registro
    const registroData = {
      nombre,
      apellido,
      correo: email,
      telefono,
      imagen,
      fecha_nacimiento: fechaNacimiento,
      contrasena: password,
    };

    try {
      // Realiza la solicitud de registro al servidor
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registroData),
      });

      if (response.ok) {
        // registro exitoso
        const data = await response.json();
        if (data.mensaje === 'registro exitoso') {
          // Realiza el inicio de sesión después del registro exitoso (opcional)
          const loginResponse = await fetch('http://localhost:4044/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              correo: email,
              contrasena: password,
            }),
          });

          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            if (loginData.mensaje === 'login exitoso') {
              // Guarda el token en el almacenamiento local
              encryptAndSetLocalStorage('token', loginData.mensaje);
              login(loginData.mensaje);
              // Redirige al usuario a la página de inicio
              router.push(`/PantallaInicio/${pathGen()}`);
            }
          }
        }
      } else {
        // Manejo de errores de registro (puedes agregar más lógica aquí)
        console.error('Error en la solicitud de registro');
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  };

  return (
    <div className="md:p-32 py-60">
      <div className="max-w-md md:max-w-3xl mx-auto bg-white p-5 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Registro</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">
              URL de la Imagen
            </label>
            <input
              type="text"
              id="imagen"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              id="fechaNacimiento"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleregistro}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default registro;
