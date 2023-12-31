/* eslint-disable no-useless-catch */
// api.js

// Función para realizar una solicitud GET
export async function getFromAPI(endpoint) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('La solicitud GET no fue exitosa');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Función para realizar una solicitud POST con datos JSON
export async function postToAPI(endpoint, dataToSend) {
  console.log(dataToSend)
  console.log(JSON.stringify(dataToSend))
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });
    if (!response.ok) {
      throw new Error('La solicitud POST no fue exitosa');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
