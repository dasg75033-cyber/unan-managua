import { CAMPUS_CONFIG } from '../config/constants.js';

export class MapService {
  /**
   * Valida formato de coordenadas lat, lng
   */
  isValidCoords(coords) {
    if (!coords || typeof coords !== 'string') return false;
    return /^[-\d.]+\s*,\s*[-\d.]+$/.test(coords.trim());
  }

  /**
   * Parsea coordenadas en objeto { lat, lng }
   */
  parseCoords(coordsStr) {
    if (!this.isValidCoords(coordsStr)) {
      return CAMPUS_CONFIG.defaultCoords;
    }
    const [lat, lng] = coordsStr.split(',').map(n => parseFloat(n.trim()));
    return { lat, lng };
  }

  /**
   * Genera la URL para el iframe embebido de Google Maps
   * @param {string} coords - Cadena de coordenadas "lat, lng"
   * @param {string} label - Nombre de la ubicación para el pin
   * @param {string} lang - Código de idioma para Google Maps (hl=es, hl=en, etc.)
   */
  getEmbedUrl(coords, label = 'UNAN Managua', lang = 'es') {
    const safeCoords = this.isValidCoords(coords) ? coords.trim() : `${CAMPUS_CONFIG.defaultCoords.lat},${CAMPUS_CONFIG.defaultCoords.lng}`;
    const cleanLabel = (label || 'UNAN Managua').replace(/[()]/g, '');
    const encodedCoords = encodeURIComponent(safeCoords);
    const encodedLabel = encodeURIComponent(cleanLabel);
    const safeLang = encodeURIComponent(lang.split('-')[0]);

    return `https://maps.google.com/maps?q=${encodedCoords}+(${encodedLabel})&t=&z=17&ie=UTF8&iwloc=B&hl=${safeLang}&output=embed`;
  }

  /**
   * Genera el enlace directo para abrir en la app de Google Maps o navegador móvil
   */
  getDirectUrl(coords, label = '', lang = 'es') {
    const safeCoords = this.isValidCoords(coords) ? coords.trim() : `${CAMPUS_CONFIG.defaultCoords.lat},${CAMPUS_CONFIG.defaultCoords.lng}`;
    const safeLang = encodeURIComponent(lang.split('-')[0]);
    return `https://maps.google.com/?q=${encodeURIComponent(safeCoords)}&hl=${safeLang}`;
  }
}

export const mapService = new MapService();
