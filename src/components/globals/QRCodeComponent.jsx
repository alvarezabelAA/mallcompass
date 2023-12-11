import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { createCanvas } from 'canvas';

const QRCodeComponent = ({ productData, onSaveImage }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const jsonString = JSON.stringify(productData);
        const canvas = createCanvas(200, 200);
        const context = canvas.getContext('2d');

        await QRCode.toCanvas(canvas, jsonString, { errorCorrectionLevel: 'M' });
        context.drawImage(canvas, 0, 0, 200, 200);

        const qrCodeImage = canvas.toDataURL('image/png');

        // Llamada a la función de retorno para guardar la imagen en la base de datos
        onSaveImage(qrCodeImage);
      } catch (error) {
        console.error('Error al generar el código QR:', error);
      }
    };

    generateQRCode();
  }, [productData, onSaveImage]);

  return <img ref={canvasRef} alt="Código QR" />;
};

export default QRCodeComponent;
