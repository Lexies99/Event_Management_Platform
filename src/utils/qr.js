import QRCode from 'qrcode';

/**
 * Generates a data URL for a given text (ticket code or URL)
 */
export async function generateQrDataUrl(text, options = {}) {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: options.width || 240,
      margin: options.margin !== undefined ? options.margin : 1,
      color: {
        dark: options.darkColor || '#0f172a',
        light: options.lightColor || '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
    return dataUrl;
  } catch (err) {
    console.error('QR code generation failed:', err);
    return null;
  }
}
