import { TaskProvider } from '../context/taskContext'
import '../styles/globals.css'
import Layout from '../Layout/Layout'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  // const { login } = useAuth();
  // useEffect(() => {
  //   Recuperar el token del almacenamiento local
  //   const token = localStorage.getItem('token');

  //   Establecer el token en el contexto de autenticación si existe
  //   if (token) {
  //     login(token);
  //   }
  // }, [login]); // Añade login como dependencia
  return (
    <AuthProvider>
      {/* <TaskProvider> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* </TaskProvider> */}
    </AuthProvider>
  )
}

export default MyApp
