import React, { useEffect, useState } from 'react'
import { TaskContext } from '../context/taskContext'
import { useContext } from 'react'
import FormLogin from '../components/login/FormLogin'
import { getFromAPI, postToAPI } from '../funciones/api'
import axios from 'axios'


const Home = () => {
  const [data, setData] = useState([]);
  const newData = {
    contrasena:"chiquitosabroso",
    apellido:"Alvarez",
    nombre:"Abel",
    correo:"andresalvarez635@gmail.com",
    telefono:"35625462",
    imagen:"fotoeli",
    fecha_nacimiento:"2005-03-24"
  } ; // Objeto con los datos que deseas enviar en la solicitud PUT

  // useEffect(() => {
  //   // Realizar una solicitud GET a tu API
  //   getFromAPI('https://beb8-186-151-141-111.ngrok.io/usuario/final/consulta')
  //     .then((result) => {
  //       console.log(result)
  //       setData(result.datos);
  //     })
  //     .catch((error) => {
  //       console.error('Error al obtener datos:', error);
  //     });
  // }, []);

  // // Función para enviar la solicitud POST
  // const enviarSolicitudPOST = () => {
  //   postToAPI('https://8221-186-151-141-111.ngrok.io/usuario/final/registro', newData)
  //     .then((result) => {
  //       console.log(result)
  //       // Procesar la respuesta de la solicitud POST si es necesario
  //     })
  //     .catch((error) => {
  //       console.error('Error al enviar la solicitud POST:', error);
  //     });
  // };

  // const postData = async (data) => {
  //   console.log(newData)
  //   const response = await axios.post('https://603f-186-151-141-111.ngrok-free.app/usuario/final/registro',  JSON.stringify(newData), {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       // Otras cabeceras personalizadas si es necesario
  //     },
  //   });

  //   // Procesa la respuesta
  //   console.log('Respuesta:', response);
  //   //return response.data;
  //   // try {
  //   // } catch (error) {
  //   //   // Maneja errores
  //   //   console.error('Error en la solicitud:', error);
  //   //   throw error;
  //   // }
  // };


  // const { hello } = useContext(TaskContext)
  // console.log(hello)
  return (
    <>
      <FormLogin />
      {/* {data.length > 0 ? (
        data.map((item) => (
          <div key={item._id}>{item.nombre}</div>
        ))
      ) : (
        <p>No se encontraron datos.</p>
      )}
      {/* Botón para enviar la solicitud POST */}
      {/* <button onClick={()=>postData()}>Enviar POST</button> */}
    </>    
    
  )
}

export default Home