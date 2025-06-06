
import QRCode from 'qrcode';

export const generateQRCodeDataURL = async (text: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    return '';
  }
};

export const generateSignatureQRCode = (cpf: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/signature/${encodeURIComponent(cpf)}`;
};
