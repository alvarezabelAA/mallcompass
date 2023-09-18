import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const PantallInicio = () => {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    console.log(token)
  }, [token, router]);
  return (
    <div>
      <p>
        Token: {token}
      </p>
    </div>
  )
}

export default PantallInicio