import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import * as iconsFc from 'react-icons/fc';

const Cards = ({ cardData,onShopClick,onInfoClick }) => {
  

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 4;

  const filteredAndPaginatedCards = cardData
    .filter((card) => {
      return card.nombreCC.toLowerCase().includes(searchText.toLowerCase()) ||
        card.direccion.toLowerCase().includes(searchText.toLowerCase());
    })
    .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(()=>{
    console.log(cardData)
  },[cardData])
  
  // estado_cuenta: 'I',
  //       nombreCC: 'Centro Comercial C',
  //       longitud: '-74.3456',
  //       latitud: '40.7890',
  //       imagen: 'imagen3.jpg',
  //       telefonoCC: '345-678-9012',
  //       correo: 'correo3@example.com',
  //       id_centroComercial: 3,
  //       direccion: '789 Calle Peatonal'
  
  
  
  const defaultImage = '/images/no_image.jpg'; // Especifica la URL de la imagen por defecto
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
      <div className="grid  grid-cols-1  md:grid-cols-2  lg:grid-cols-4 gap-4">
        {filteredAndPaginatedCards.map((card) => (
          <div key={card.id} className=" w-full ">
            <h2 className="text-xl text-center font-semibold background-darkBlue rounded-t-lg  p-2 text-white">{card.nombreCC}</h2>
            <div className='bg-white pb-4 rounded shadow'>
              {card.imagen ? (
                <Image
                  src={'/images/'+ card.imagen}
                  onError={(e) => {
                    
                  }}
                  alt="Imagen de la tarjeta"
                  className=" w-full h-32 text-center "
                  width={200} // Especifica el ancho de la imagen
                  height={500} // Especifica la altura de la imagen
                />
              ) : (
                <Image
                  src={defaultImage}
                  alt="Imagen de la tarjeta por defecto"
                  className=" w-full h-32 text-center "
                  width={200} // Especifica el ancho de la imagen por defecto
                  height={200} // Especifica la altura de la imagen por defecto
                />
              )}          
              <div className='px-1'>
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold  text-gray-900 truncate">{card.nombreTienda}</h5>
                </a>    
                <p className='font-semibold '>Dirección: </p>
                <span className=''>{card.direccion}</span>
                <h3 className='font-semibold'>Medios de Contacto</h3>
                <p className='font-semibold '>Telefono:</p>
                <span className=''> {card.telefonoCC}</span>
                <p className='font-semibold '>Correo Electronico: </p>
                <span className=''>{card.correo}</span>
                <h3 className='font-semibold'></h3>
                <p className='font-semibold '>Estado: </p>
                <span className='text-center'>{
                  card.estado_cuenta ==='I' ?  <iconsFc.FcCancel className='w-8 h-8 flex-shrink-0' />
                  : <iconsFc.FcApproval className='w-8 h-8 flex-shrink-0' />

                }</span>
                {(card.cantidad_usuarios > 0) ?
                  (<div className='flex justify-center px-4'>
                    <div className='px-3'>
                      <span className='font-semibold'>
                        Tiendas:
                      </span>
                      {card.cantidad_tiendas}
                    </div>
                    <div className='px-3'>
                      <span className='font-semibold'>
                        Usuarios:
                      </span>
                      {card.cantidad_usuarios}
                      
                    </div>
                  </div>) : '' 

                }
                <div className='md:flex justify-center'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <a onClick={()=>onShopClick(card)} 
                      href="#"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-800 rounded-lg hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <iconsFc.FcShop className='w-7 h-7 flex-shrink-0 mr-1' />
                      Tiendas
                    </a>
                    <a onClick={()=>onInfoClick(card)}
                      href="#"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-800 rounded-lg hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <iconsFc.FcInfo className='w-7 h-7 flex-shrink-0 mr-1' />
                      Información
                    </a>
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
