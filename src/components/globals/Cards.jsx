import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import * as iconsFc from 'react-icons/fc';

const Cards = ({ cardData, onShopClick = () => '', onInfoClick = () => '' }) => {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 4;

  const filteredAndPaginatedCards = cardData.filter((card) => {
    return card.nombreCC.toLowerCase().includes(searchText.toLowerCase()) ||
      card.direccion.toLowerCase().includes(searchText.toLowerCase());
  }).slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    console.log(cardData);
  }, [cardData]);

  const defaultImage = '/images/no_image.jpg';

  return (
    <div className="mx-auto w-full p-2">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark-bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAndPaginatedCards.map((card) => (
          <div key={card.id} className="w-full">
            <h2 className="text-xl text-center font-semibold bg-blue-900 text-white rounded-t-lg p-2">{card.nombreCC}</h2>
            <div className='bg-white pb-4 rounded shadow'>
              <div className='h-32 relative'>
                <Image
                  src={card.imagen ? '/images/' + card.imagen : defaultImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                  alt="Imagen de la tarjeta"
                  className="w-full h-full object-cover"
                  layout="fill"
                />
              </div>
              <div className='p-4'>
                <h5 className="mb-2 text-2xl font-bold text-gray-900 truncate">{card.nombreTienda}</h5>
                <p className='font-semibold'>Dirección:</p>
                <span className='block truncate'>{card.direccion}</span>
                <h3 className='font-semibold'>Medios de Contacto</h3>
                <p className='font-semibold'>Teléfono:</p>
                <span className='block'>{card.telefonoCC}</span>
                <p className='font-semibold'>Correo Electrónico:</p>
                <span className='block'>{card.correo}</span>
                <h3 className='font-semibold'>Estado:</h3>
                <span className='block text-center'>
                  {card.estado_cuenta === 'I' ? <iconsFc.FcCancel className='w-8 h-8 mx-auto' /> : <iconsFc.FcApproval className='w-8 h-8 mx-auto' />}
                </span>
                {card.cantidad_usuarios > 0 && (
                  <div className='flex justify-center space-x-8 mt-4'>
                    <div className='flex items-center'>
                      <span className='font-semibold'>Tiendas:</span>
                      <span className='ml-1'>{card.cantidad_tiendas}</span>
                    </div>
                    <div className='flex items-center'>
                      <span className='font-semibold'>Usuarios:</span>
                      <span className='ml-1'>{card.cantidad_usuarios}</span>
                    </div>
                  </div>
                )}
                <div className='flex justify-center mt-4 space-x-4'>
                  <button onClick={() => onShopClick(card)} className="btn-primary">
                    <iconsFc.FcShop className='w-8 h-8 mr-1' />
                  </button>
                  <button onClick={() => onInfoClick(card)} className="btn-primary">
                    <iconsFc.FcInfo className='w-8 h-8 mr-1' />
                  </button>
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
