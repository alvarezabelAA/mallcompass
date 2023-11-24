import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ startTime, endTime, showStyle = false }) => {
  const [remainingTime, setRemainingTime] = useState(calculateTimeRemaining());

  function calculateTimeRemaining() {
    const now = new Date();
    const end = new Date(endTime);
    const difference = end - now;
  
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
      // Redondear los valores
      return {
        days,
        hours,
        minutes,
        seconds,
      };
    } else {
      // Si el tiempo restante es negativo, regresamos valores nulos
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
  }
  
  

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(calculateTimeRemaining());
    }, 1000);

    // Limpia el temporizador cuando el componente se desmonta
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {showStyle === false ? (
        <div>
          <p>Tiempo restante:</p>
          <p>{`${remainingTime.days} días, ${remainingTime.hours} horas, ${remainingTime.minutes} minutos, ${remainingTime.seconds} segundos`}</p>
        </div>
      ) : (
        <div className="bg-gray-800 text-white p-6 rounded-md shadow-md">
          <p className="text-lg mb-4">Tiempo restante:</p>
          <div className="flex space-x-4">
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold">{remainingTime.days}</p>
              <p className="text-sm">días</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold">{remainingTime.hours}</p>
              <p className="text-sm">horas</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold">{remainingTime.minutes}</p>
              <p className="text-sm">minutos</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold">{remainingTime.seconds}</p>
              <p className="text-sm">segundos</p> 
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CountdownTimer;
