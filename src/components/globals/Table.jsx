import React, { useState, useEffect } from "react";
import * as iconsMd from 'react-icons/md';
import * as iconsBs from 'react-icons/bs';

const Table = ({ headers, content, showActions = false, onDelete, onEdit, showInsertButton = true, onInsert }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Estado para el número de página actual
  const [itemsPerPage, setItemsPerPage] = useState(15); // Estado para la cantidad de elementos por página
  const [totalPages, setTotalPages] = useState(1); // Estado para la cantidad total de páginas

  const handleInsert = () => {
    console.log('Hola')
    if (onInsert) {
      onInsert('hola'); // Llama a la función onInsert si está definida
    }
  };

  const handleDelete = (item) => {
    console.log(item);
    if (onDelete) {
      onDelete(item); // Llama a la función onDelete y pasa el elemento para eliminar
    }
  };

  const handleEdit = (item) => {
    console.log(item);
    if (onEdit) {
      onEdit(item); // Llama a la función onDelete y pasa el elemento para eliminar
    }
  };

  const extendedHeaders = showActions ? [...headers, { titulo: "Acciones", fila: "acciones" }] : headers;

  // Función para filtrar el contenido basado en el término de búsqueda
  const filteredContent = content.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calcula la cantidad total de páginas
  useEffect(() => {
    const totalItems = filteredContent.length;
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [filteredContent, itemsPerPage]);

  // Lógica del paginador
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContent.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Genera los botones de paginación
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`${
            currentPage === i ? "bg-slate-600 text-white" : "bg-gray-300 text-gray-700"
          } px-4 py-2 rounded-lg`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Agregar un campo de búsqueda */}
      <div className="relative flex items-center mb-3">
        {/* Agregar un icono de búsqueda dentro del campo */}
        <iconsMd.MdSearch className='h-7 w-7 absolute left-3 text-slate-500 dark:text-slate-300' />
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark-bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {showInsertButton && (
          <button onClick={handleInsert} className="mall-button bg-emerald-600 text-white font-semibold ">
            <iconsBs.BsPlus className="w-5 h-5 flex-shrink-0 "/>
          Insertar
          </button>
        )}
      </div>

        
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="">
              {extendedHeaders.map((header, index) => (
                <th
                  className={`${
                    index === 0 ? "rounded-tl-lg" : ""}${
                    index === extendedHeaders.length - 1 ? "border" : ""
                  }  h-10 border bg-slate-300 truncate`}
                  key={index}
                >
                  {header.titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, rowIndex) => (
              <tr className={rowIndex % 2 === 0 ? "bg-slate-200" : "bg-slate-300"} key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td className={`h-10 ${header.class || ""}`} key={colIndex}>
                    {row[header.fila]}
                  </td>
                ))}

                {showActions && (
                  <td className="text-center">
                    <button className="px-2 py-1">
                      <iconsMd.MdEditDocument onClick={() => handleEdit(row)} className='h-6 w-6 shrink-0 text-blue-800 hover:bg-blue-300 hover:rounded-lg ' />
                    </button>
                    <button type="button" onClick={() => handleDelete(row)} className="px-2 py-1">
                      <iconsMd.MdDeleteOutline className='h-6 w-6 shrink-0 text-red-500  hover:bg-red-300 hover:rounded' />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginator */}
      <div className="flex justify-center mt-4">
        {renderPageNumbers()}
      </div>
    </div>
  );
};

export default Table;
