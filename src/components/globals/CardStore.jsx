import { useEffect } from "react";

const CardStore = ({ item, onClickButton }) => {
  useEffect(()=>{
    console.log(item)
  },[item])
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
      {item.map((item) => (
        <div key={item.id_tienda} className="w-[400px] ml5 m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img
              className="rounded-t-lg"
              src={`/images/${item.imagen || '/images/no_image.jpg'}`}
              alt=""
              style={{ height: '200px', width: '400px' }}
            />
          </a>
          <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 truncate">{item.nombreTienda}</h5>
            </a>
            <span className="font-semibold text-gray-900">Tienda de</span>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {item.categoriaTienda}
            </p>
            <span className="font-semibold text-gray-900">Local</span>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {item.numeroLocal}. Teléfono: {item.telefono}
            </p>
            <span className="font-semibold text-gray-900">Telefono:</span>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {item.telefono}
            </p>
            <span className="font-semibold text-gray-900">Correo:</span>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {item.telefono}
            </p>
            <a onClick={()=>onClickButton(item)}
              href="#"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Agregar a tienda
              <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardStore;