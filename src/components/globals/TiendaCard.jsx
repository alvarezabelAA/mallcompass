import React from 'react';

const TiendaCard = ({ tienda }) => {
  const { nombreTienda, imagen, telefono, numeroLocal, categoriaTienda, correo } = tienda;

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 m-2">
      <img src={'/images/' + imagen} alt={nombreTienda} className="w-20 h-20 object-cover mr-4" />
      <div>
        <h2 className="text-lg font-semibold mb-1">{nombreTienda}</h2>
        <p className="text-gray-600 text-sm mb-1">Categoría: {categoriaTienda}</p>
        <p className="text-gray-600 text-sm mb-1">Teléfono: {telefono}</p>
        <p className="text-gray-600 text-sm mb-1">Número de local: {numeroLocal}</p>
        <p className="text-gray-600 text-sm mb-1">Correo electrónico: {correo}</p>
      </div>
    </div>
  );
};

export default TiendaCard;
