import React, { useState } from 'react';
import Image from 'next/image'
import * as iconsFc from 'react-icons/fc';

const Cards = () => {
  const cardData = [
    {
      id: 1,
      title: 'Centro Comercial 1',
      image: '/images/mall.jpg',
      subtitle1: 'Dirección',
      subtitle2: 'Teléfono',
      subtitle3: 'Correo Electrónico',
      subtitle4: 'Estado de Comercial',
      direccion: 'Dirección del Centro Comercial 1',
      telefono: 'Teléfono del Centro Comercial 1',
      correo: 'correo1@example.com',
      estadoCuenta: 'A',
    },
    {
      id: 2,
      title: 'Centro Comercial 2',
      image: null,
      subtitle1: 'Dirección',
      subtitle2: 'Teléfono',
      subtitle3: 'Correo Electrónico',
      subtitle4: 'Estado de Comercial',
      direccion: 'Dirección del Centro Comercial 2',
      telefono: 'Teléfono del Centro Comercial 2',
      correo: 'correo2@example.com',
      estadoCuenta: 'I',
    },
    {
      id: 3,
      title: 'Centro Comercial 2',
      image: null,
      subtitle1: 'Dirección',
      subtitle2: 'Teléfono',
      subtitle3: 'Correo Electrónico',
      subtitle4: 'Estado de Comercial',
      direccion: 'Dirección del Centro Comercial 2',
      telefono: 'Teléfono del Centro Comercial 2',
      correo: 'correo2@example.com',
      estadoCuenta: 'I',
    },
    {
      id: 4,
      title: 'Centro Comercial 2',
      image: null,
      subtitle1: 'Dirección',
      subtitle2: 'Teléfono',
      subtitle3: 'Correo Electrónico',
      subtitle4: 'Estado de Comercial',
      direccion: 'Dirección del Centro Comercial 2',
      telefono: 'Teléfono del Centro Comercial 2',
      correo: 'correo2@example.com',
      estadoCuenta: 'I',
    },{
      id: 5,
      title: 'Centro Comercial 2',
      image: null,
      subtitle1: 'Dirección',
      subtitle2: 'Teléfono',
      subtitle3: 'Correo Electrónico',
      subtitle4: 'Estado de Comercial',
      direccion: 'Dirección del Centro Comercial 2',
      telefono: 'Teléfono del Centro Comercial 2',
      correo: 'correo2@example.com',
      estadoCuenta: 'I',
    },{
      id: 6,
      title: 'Centro Comercial 2',
      image: null,
      subtitle1: 'Dirección',
      subtitle2: 'Teléfono',
      subtitle3: 'Correo Electrónico',
      subtitle4: 'Estado de Comercial',
      direccion: 'Dirección del Centro Comercial 2',
      telefono: 'Teléfono del Centro Comercial 2',
      correo: 'correo2@example.com',
      estadoCuenta: 'I',
    },{
      id: 7,
      title: 'Centro Comercial 2',
      image: null,
      subtitle1: 'Dirección',
      subtitle2: 'Teléfono',
      subtitle3: 'Correo Electrónico',
      subtitle4: 'Estado de Comercial',
      direccion: 'Dirección del Centro Comercial 2',
      telefono: 'Teléfono del Centro Comercial 2',
      correo: 'correo2@example.com',
      estadoCuenta: 'I',
    },{
      id: 8,
      title: 'Centro Comercial 2',
      image: null,
      subtitle1: 'Dirección',
      subtitle2: 'Teléfono',
      subtitle3: 'Correo Electrónico',
      subtitle4: 'Estado de Comercial',
      direccion: 'Dirección del Centro Comercial 2',
      telefono: 'Teléfono del Centro Comercial 2',
      correo: 'correo2@example.com',
      estadoCuenta: 'I',
    },{
      id: 9,
      title: 'Centro Comercial 2',
      image: null,
      subtitle1: 'Dirección',
      subtitle2: 'Teléfono',
      subtitle3: 'Correo Electrónico',
      subtitle4: 'Estado de Comercial',
      direccion: 'Dirección del Centro Comercial 2',
      telefono: 'Teléfono del Centro Comercial 2',
      correo: 'correo2@example.com',
      estadoCuenta: 'I',
    },
  ];

  const cardsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cardData.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  
  
  
  const defaultImage = '/images/no_image.jpg'; // Especifica la URL de la imagen por defecto
  return (
    <div className="mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-4 gap-4">
        {currentCards.map((card) => (
          <div key={card.id} className="  ">
            <h2 className="text-xl text-center font-semibold background-darkBlue rounded-t-lg  p-2 text-white">{card.title}</h2>
            <div className='bg-white pb-4 rounded shadow'>
              {card.image ? (
                <Image
                  src={card.image}
                  alt="Imagen de la tarjeta"
                  className=" w-full h-64 text-center "
                  width={200} // Especifica el ancho de la imagen
                  height={500} // Especifica la altura de la imagen
                />
              ) : (
                <Image
                  src={defaultImage}
                  alt="Imagen de la tarjeta por defecto"
                  className=" w-full h-64 text-center "
                  width={200} // Especifica el ancho de la imagen por defecto
                  height={200} // Especifica la altura de la imagen por defecto
                />
              )}              
              <div className='px-1'>
                <p className='font-semibold '>{card.subtitle1}: </p>
                <span className=''>{card.direccion}</span>
                <h3 className='font-semibold'>Medios de Contacto</h3>
                <p className='font-semibold '>{card.subtitle2}:</p>
                <span className=''> {card.telefono}</span>
                <p className='font-semibold '>{card.subtitle3}: </p>
                <span className=''>{card.correo}</span>
                <h3 className='font-semibold'></h3>
                <p className='font-semibold '>{card.subtitle4}: </p>
                <span className='text-center'>{
                  card.estadoCuenta ==='I' ?  <iconsFc.FcApproval className='w-8 h-8 flex-shrink-0' />
                  : <iconsFc.FcCancel className='w-8 h-8 flex-shrink-0' />

                }</span>
                <div className='flex justify-center'>
                  <div className='flex justify-between '>
                    <div className='w-full text-center'>
                      <iconsFc.FcShop className='w-16 h-16 flex-shrink-0' />
                    </div>
                    <div className='w-full text-center'>
                      <iconsFc.FcInfo className='w-16 h-16 flex-shrink-0' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Paginación */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(cardData.length / cardsPerPage) }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`mx-2 p-2 ${
              pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            } rounded`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Cards;
