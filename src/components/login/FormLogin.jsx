import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { getFromAPIWithParams,encryptAndSetLocalStorage,decryptAndGetLocalStorage,pathGen } from '../../funciones/api';
import { useAlert } from '../../context/AlertContext'; // Ajusta la ruta según tu estructura de directorios
import dynamic from 'next/dynamic';
import SideBars from '../common/SideBars';
const Map = dynamic(() => import('../Map'), {
  ssr: false,
});

const FormLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();
  const showAlertWithMessage  = useAlert();

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

    if (!emailError && !passwordError) {
      const endpoint = 'http://localhost:4044/usuario/final/login/';
      const queryParams = {
        correo: email,
        contrasena: password,
      };

      try {
        const data = await getFromAPIWithParams(endpoint, queryParams);
        console.log(data)
        if(data.status === 1){
          showAlertWithMessage('SUCCESS','Se inicio sesión correctamente', 'Bienvenido')
          router.push(`/Feed/${pathGen()}`);
          login(data.tokenSesionID);
          encryptAndSetLocalStorage('token', data.tokenSesionID);
          encryptAndSetLocalStorage('rol', data.rol);
          encryptAndSetLocalStorage('id_usuario', data.id_usuario);
        }else{
          showAlertWithMessage('ERROR','Los datos no son correctos', 'Verifique sus credenciales ')
        }
      } catch (error) {
        showAlertWithMessage('WARNING','No se obtuvieron datos', 'Valide su conexión ')
      }
      // localStorage.setItem('token', 'Hola');
    }
  };

  const handleRegister = () =>{
    router.push(`/registro/${pathGen()}`);
  }

  

  return (
    <>
      <div className="bg-no-repeat bg-cover bg-center relative" style={{ backgroundImage: 'url(/images/mall.jpg)' }} >
        <div className="absolute bg-gradient-to-b from-blue-900 to-blue-500 opacity-75 inset-0 z-0"></div>
        <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
          <div className="flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
            <div className="self-start hidden lg:flex flex-col  text-white">
              {/* <img src="" className="mb-3" /> */}
              <h1 className="mb-3 font-bold text-5xl">Hola!! Bienvenid@ a MallCompass </h1>
              <p className="pr-3">Lorem ipsum is placeholder text commonly used in the graphic, print,
            and publishing industries for previewing layouts and visual mockups</p>
            </div>
          </div>
          <div className="flex justify-center self-center  z-10">
            <div className="p-12 bg-white  mx-auto rounded-2xl w-100 ">
              <div className="mb-4">
                <h3 className="font-semibold text-2xl text-gray-800">Sign In </h3>
                <p className="text-gray-500">Please sign in to your account.</p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">Email</label>
                  <input 
                    className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400" 
                    type="" 
                    placeholder="mail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())} />
                  {emailError && <div className="text-red-500">{emailError}</div>}
                </div>
                <div className="space-y-2">
                  <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                Password
                  </label>
                  <input 
                    className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400" 
                    type="password" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && <div className="text-red-500">{passwordError}</div>}
                </div>
                <div className="flex items-center justify-between">

                  <div className="text-sm">
                    <a onClick={()=>handleRegister()} href="#" className="text-blue-400 hover:text-blue-500">
                  Dont have an account?
                    </a>
                  </div>
                </div>
                <div>
                  <button onClick={handleLogin} type="submit" className="w-full flex justify-center bg-blue-400  hover:bg-blue-500 text-gray-100 p-3  rounded-lg tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500">
                Sign in
                  </button>
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
