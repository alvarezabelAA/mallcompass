import React from 'react';

const TiendaCard = ({ tienda,onEdit = () => ''  }) => {
  const { nombreTienda, imagen, telefono, numeroLocal, categoriaTienda, correo } = tienda;

  const handleEditClick = (item) => {
    console.log(item)
    onEdit(item); // Llama a la función onEdit pasando el ID de la tienda como argumento
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 m-2 flex">
      <img src={'/images/' + imagen} alt={nombreTienda} className="w-32 h-32 object-cover mr-4 rounded-md" />
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-2">{nombreTienda}</h2>
        <div className="flex items-center mb-2">
          <span className="text-gray-600 text-sm mr-2">Categoría:</span>
          <span className="text-blue-500 font-medium">{categoriaTienda}</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="text-gray-600 text-sm mr-2">Teléfono:</span>
          <span className="text-gray-800 font-medium">{telefono}</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="text-gray-600 text-sm mr-2">Número de local:</span>
          <span className="text-gray-800 font-medium">{numeroLocal}</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="text-gray-600 text-sm mr-2 truncate">Correo electrónico:</span>
          <span className="text-gray-800 font-medium">{correo}</span>
        </div>
        {/* <button onClick={()=>handleEditClick(tienda)} className="bg-blue-500 text-white rounded-md py-1 px-4 hover:bg-blue-600 focus:outline-none mt-2">
          Ver Detalles
        </button> */}
      </div>
    </div>
  );
};

export default TiendaCard;
