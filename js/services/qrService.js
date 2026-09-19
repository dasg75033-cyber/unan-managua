/**
 * Servicio de generación de Códigos QR de Alto Contraste (ISO/IEC 18004).
 * Provee canvas aislado con quiet zone, exportación a PNG y resiliencia offline.
 */
export class QrService {
  /**
   * Genera el código QR sobre un canvas con fondo blanco sólido y módulos de alto contraste
   * @param {HTMLCanvasElement} canvasElement 
   * @param {string} url - URL destino a codificar
   * @param {Object} [options]
   */
  async renderToCanvas(canvasElement, url, options = {}) {
    if (!url || typeof url !== 'string') {
      throw new Error('[QrService] URL inválida para generación de QR.');
    }

    if (typeof QRCode === 'undefined') {
      throw new Error('[QrService] La biblioteca QRCode no está disponible (modo offline o CDN inaccesible).');
    }

    const defaultOptions = {
      errorCorrectionLevel: 'H', // Alta corrección para soportar escaneos en condiciones adversas
      type: 'image/png',
      quality: 0.95,
      margin: 3, // Quiet zone mínima recomendada
      color: {
        dark: '#002B5C',  // Azul institucional UNAN de alto contraste
        light: '#FFFFFF'  // Fondo blanco puro sólido
      },
      width: 180,
      ...options
    };

    return QRCode.toCanvas(canvasElement, url, defaultOptions);
  }

  /**
   * Genera una URL de datos (Data URL PNG) lista para descarga
   */
  async getQrDataUrl(url, options = {}) {
    if (typeof QRCode === 'undefined') {
      throw new Error('[QrService] QRCode no disponible.');
    }

    const defaultOptions = {
      errorCorrectionLevel: 'H',
      margin: 3,
      color: {
        dark: '#002B5C',
        light: '#FFFFFF'
      },
      width: 300, // Mayor resolución para exportación/impresión
      ...options
    };

    return QRCode.toDataURL(url, defaultOptions);
  }

  /**
   * Descarga el código QR como archivo PNG
   */
  async downloadQr(url, filename = 'UNAN-Managua-QR.png') {
    try {
      const dataUrl = await this.getQrDataUrl(url);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename.replace(/[^\w.-]/g, '_');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (e) {
      console.error('[QrService] Error al descargar código QR:', e);
      return false;
    }
  }
}

export const qrService = new QrService();
