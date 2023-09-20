import React from 'react'
import Table from '../../components/globals/Table';

const Comerciales = () => {

  const companias = [
    {
      id_centro_comercial: 1,
      direccion: "Dirección 1",
      nombre_cc: "Centro Comercial A",
      estado_cuenta: "Activo",
      correo: "correo1@example.com",
      numero_telefono: "123-456-7890",
      imagen: "imagen1.jpg",
      longitud: -75.12345,
      latitud: 40.67890,
    },
    {
      id_centro_comercial: 2,
      direccion: "Dirección 2",
      nombre_cc: "Centro Comercial B",
      estado_cuenta: "Inactivo",
      correo: "correo2@example.com",
      numero_telefono: "987-654-3210",
      imagen: "imagen2.jpg",
      longitud: -75.54321,
      latitud: 40.12345,
    },
    // Agrega más compañías según sea necesario
  ];
  
  // Generar 10 compañías adicionales
  for (let i = 3; i <= 12; i++) {
    const nuevaCompania = {
      id_centro_comercial: i,
      direccion: `Dirección ${i}`,
      nombre_cc: `Centro Comercial ${String.fromCharCode(65 + i)}`,
      estado_cuenta: i % 2 === 0 ? "Activo" : "Inactivo",
      correo: `correo${i}@example.com`,
      numero_telefono: `555-555-555${i}`,
      imagen: `imagen${i}.jpg`,
      longitud: -75.54321 + (i * 0.1),
      latitud: 40.12345 + (i * 0.1),
    };
    companias.push(nuevaCompania);
  }
  
  // Ahora `companias` contiene las 12 compañías
  
  
  
  const Headers = [
    { titulo: "ID Centro Comercial", fila: "id_centro_comercial", class: "text-center" },
    { titulo: "Dirección", fila: "direccion", class: "text-left" },
    { titulo: "Nombre CC", fila: "nombre_cc", class: "text-center" },
    { titulo: "Estado de Cuenta", fila: "estado_cuenta", class: "text-center" },
    { titulo: "Correo", fila: "correo", class: "text-center" },
    { titulo: "Número de Teléfono", fila: "numero_telefono", class: "text-center" },
    { titulo: "Imagen", fila: "imagen", class: "text-center" },
    { titulo: "Longitud", fila: "longitud", class: "text-right" },
    { titulo: "Latitud", fila: "latitud", class: "text-right" },
    // Agrega más títulos y filas según sea necesario
  ];
  

  const deleteItem = (item) => {
    console.log(item)
  }

  return (
    <>
      <Table 
        headers={Headers} 
        content={companias} 
        showActions={true} 
        onDelete={(newValue)=> deleteItem(newValue)}
      />
    </>
  )
}

export default Comerciales