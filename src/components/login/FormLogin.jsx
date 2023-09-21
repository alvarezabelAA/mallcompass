import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { getFromAPIWithParams } from '../../funciones/api';

const FormLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();

  const router = useRouter(); // Obtenemos el objeto router

  const handleLogin = async () => {
    // Validación de campos
    if (!email) {
      setEmailError('El campo de correo electrónico es obligatorio.');
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('El campo de contraseña es obligatorio.');
    } else {
      setPasswordError('');
    }

    // Otras validaciones, como verificar el formato del correo electrónico, longitud de contraseña, etc.
    // ...

    // Si todas las validaciones pasan, puedes enviar los datos al servidor aquí
    // ...

    // Redirigir a la carpeta PantallaInicio después del inicio de sesión exitoso
    if (!emailError && !passwordError) {
      const endpoint = 'http://localhost:4044/usuario/final/login/';
      const queryParams = {
        correo: 'correo@example.com',
        contrasena: 'clave-secreta',
      };

      try {
        const data = await getFromAPIWithParams(endpoint, queryParams);
        console.log('Datos obtenidos:', data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
      // localStorage.setItem('token', 'Hola');
      // login('Hola');
      // router.push('/Feed/1213213');
    }
  };

  

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-1 h-screen w-screen">
        <div className="flex items-center justify-center">
          <div className="background-darkBlue text-white w-full sm:w-96 h-96 rounded-lg p-4">
            <div className="grid grid-cols-1 gap-1">
              <div className="flex p-2 h-20 items-center">
                <span className="text-right text-2xl font-semibold">WELCOME BACK!</span>
              </div>
              <div className="w-full">
                <div className="p-1">
                  <span>Email:</span>
                  <input
                    className="input-proyect"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && <div className="text-red-500">{emailError}</div>}
                </div>
                <div className="p-1">
                  <span>Password</span>
                  <input
                    className="input-proyect"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && <div className="text-red-500">{passwordError}</div>}
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 gap-1 text-center mt-10">
                  <div>
                    <button className="py-1 px-6 rounded background-purple w-full" onClick={handleLogin}>
                      LOGIN
                    </button>
                  </div>
                  <div>
                    <button type="button" className="text-slate-400">
                      Forgot Password?
                    </button>
                  </div>
                  <div>
                    <button type="button" className="text-[#7a7bcb]">
                      Dont have an account?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormLogin;
