import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext';
import useHasMounted from '../../../hooks/useHasMounted';
import { useRouter } from 'next/router';
import SideBar from '../../../components/globals/SideBar';
import { decryptAndGetLocalStorage, pathGen, postToAPI, postToAPIWithParamsAndBody, putToAPIWithParamsAndBody } from '../../../funciones/api';
import { useAlert } from '../../../context/AlertContext';


const EditarComecial = () => {
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [items,setItems]=useState([])
  const [nombre, setNombre] = useState('');
  const [telefonoCC, settelefonoCC] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [imagen, setImagen] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [estado_cuenta, setEstadoCuenta] = useState('A');
  const [id_comercial, setIdComercial] = useState(0);
  const { showAlertWithMessage } = useAlert();

  const [errors, setErrors] = useState({
    estado_cuenta: "",
    nombreCC: "",
    longitud: "",
    latitud: "",
    imagen: "",
    telefonoCC: "",
    correo: "",
    direccion: ""
  });

  const getEnv = () => {
    console.log(token);
    if (!token) {
      router.push(`/login/${pathGen()}`);
    }
    const decryptedData = decryptAndGetLocalStorage('comercialData');
    console.log(decryptedData)
    const objeto = JSON.parse(decryptedData);
    console.log(objeto)
    if (objeto && Object.keys(objeto).length > 0) {
      console.log(objeto.contrasena)
      setEstadoCuenta(objeto.estado_cuenta)
      setNombre(objeto.nombreCC)
      setLongitud(objeto.longitud)
      setLatitud(objeto.latitud)
      setImagen(objeto.imagen)
      settelefonoCC(objeto.telefonoCC)
      setCorreo(objeto.correo)
      setDireccion(objeto.direccion)
      setIdComercial(objeto.id_centroComercial)
    }else{
      console.error("El objeto está vacío o no definido");
    }
    // listar()

  }

  useEffect(() => {
    // Verifica si el componente se ha montado antes de validar el token
    if (hasMounted) {
      getEnv()
    }
  }, [hasMounted]);

  const [validateSlide, setValidateSlide] = useState(true)

  useEffect(()=>{
  },[validateSlide])

  const handleSidebarVisibility = (sidebarVisible) => {
    setValidateSlide(sidebarVisible)
    // Realiza acciones basadas en el valor de sidebarVisible aquí
  };

  const handleRegistro = async () => {
    // // Validación de campos
    // const camposObligatorios = ['nombre', 'telefono', 'correo', 'direccion', 'imagen', 'longitud', 'latitud','estado_cuenta'];
    // const newErrors = {};

    // camposObligatorios.forEach((campo) => {
    //   if (!eval(campo)) {
    //     newErrors[campo] = `El campo de ${campo} es obligatorio.`;
    //   } else {
    //     newErrors[campo] = '';
    //   }
    // });

    // setErrors(newErrors);

    // // Verifica si hay algún error en los campos
    // const hayErrores = Object.values(newErrors).some((error) => error);

    // if (hayErrores) {
    //   // Detén el proceso de registro si faltan campos obligatorios
    //   return;
    // }

    // // Redirigir a la carpeta PantallaInicio después del registro exitoso
    const endpoint = 'http://localhost:4044/centroComercial/modificacion'; // Ajusta la URL del servidor de registro
    const registroData =  {
      estado_cuenta,
      nombreCC: nombre,
      longitud: longitud,
      latitud: latitud,
      imagen: imagen,
      telefonoCC: telefonoCC,
      correo: correo,
      direccion: direccion
    }
    console.log(endpoint)
    console.log(registroData)
    const queryParams = {
      token: token.toString(),
      id_centroComercial:id_comercial
    };
    console.log()
    console.log(queryParams)
    try {
      try {
        const response = await putToAPIWithParamsAndBody(endpoint, queryParams, registroData);
        console.log(response)
        // Haz algo con la respuesta aquí
        console.log(response)
        if(response.status === 1){
          router.push(`/Comerciales/${pathGen()}`);
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

  const handleLogin= ()=>{
    router.push(`/Comerciales/${pathGen()}`);

  }

  return (
    <>
      <SideBar onVisible={(newValue) => handleSidebarVisibility(newValue)} />
      <div className={`p-4 ml-24 ${validateSlide ? 'sm:ml-24': 'sm:ml-64'}`}>
        <div className="md:p-32 py-60 ">
          <div className="max-w-md md:max-w-3xl mx-auto background-darkBlue  p-5 rounded-md shadow-md">
            <h2 className="text-2xl  font-semibold text-center mb-6 text-white">Editar Comercial</h2>
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
                {errors.nombreCC && <div className="text-red-500">{errors.nombreCC}</div>}
              </div>
              <div>
                <label htmlFor="telefono" className="text-white block text-sm font-medium ">
              Telefono
                </label>
                <input
                  type="text"
                  id="telefono"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={telefonoCC}
                  onChange={(e) => settelefonoCC(e.target.value)}
                />
                {errors.telefonoCC && <div className="text-red-500">{errors.apellido}</div>}
              </div>
              <div>
                <label htmlFor="correo" className="text-white block text-sm font-medium ">
              Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                {errors.correo && <div className="text-red-500">{errors.correo}</div>}
              </div>
              <div>
                <label htmlFor="direccion" className="text-white block text-sm font-medium ">
              Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
                {errors.direccion && <div className="text-red-500">{errors.direccion}</div>}
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
                <label htmlFor="longitud" className="text-white block text-sm font-medium ">
              Longitud
                </label>
                <input
                  type="text"
                  id="longitud"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={longitud}
                  onChange={(e) => setLongitud(e.target.value)}
                />
                {errors.longitud && <div className="text-red-500">{errors.longitud}</div>}
              </div>
              <div>
                <label htmlFor="latitud" className="text-white block text-sm font-medium ">
              Latitud
                </label>
                <input
                  type="text"
                  id="latitud"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={latitud}
                  onChange={(e) => setLatitud(e.target.value)}
                />
                {errors.latitud && <div className="text-red-500">{errors.latitud}</div>}
              </div>
              <div>
                <label htmlFor="estado_cuenta" className="text-white block text-sm font-medium ">
              Estado
                </label>
                <select
                  id="estadoCuenta"
                  className="mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md"
                  value={estado_cuenta}
                  onChange={(e) => setEstadoCuenta(e.target.value)}
                >
                  <option value="A">Activo</option>
                  <option value="I">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7a7bcb] hover:bg-[#898ae1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={()=>handleRegistro()}
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
      </div>
    </>
  )
}

export default EditarComecial