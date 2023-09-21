/* eslint-disable no-useless-catch */
// api.js
const CryptoJS = require('crypto-js');
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

// Función para realizar una solicitud GET con parámetros
export async function getFromAPIWithParams(endpoint, queryParams) {
  try {
    // Construir la URL completa con el host y el endpoint
    const url = new URL(endpoint);

    // Agregar los parámetros a la URL
    Object.keys(queryParams).forEach((key) => {
      url.searchParams.append(key, queryParams[key]);
    });

    const response = await fetch(url.href);

    if (!response.ok) {
      throw new Error('La solicitud GET no fue exitosa');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  // }
  }
}

// Función para encriptar y guardar en localStorage
export function encryptAndSetLocalStorage(key, data) {
  const password = 'tu_contraseña_secreta'; // Coloca aquí tu contraseña secreta
  try {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
    localStorage.setItem(key, encryptedData);
    return true;
  } catch (error) {
    console.error('Error al encriptar y guardar en localStorage:', error);
    return false;
  }
}

// Función para desencriptar y obtener desde localStorage
export function decryptAndGetLocalStorage(key) {
  const password = 'tu_contraseña_secreta'; // Coloca aquí tu contraseña secreta
  try {
    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) return null;

    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error('Error al desencriptar y obtener desde localStorage:', error);
    return null;
  }
}


export function pathGen() {
  const min = 1000000; // El número mínimo de 7 dígitos
  const max = 9999999; // El número máximo de 7 dígitos
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

