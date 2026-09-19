/**
 * Constantes de configuración globales para el Mapa Interactivo UNAN Managua.
 */
export const CAMPUS_CONFIG = {
  name: 'UNAN Managua - Recinto Universitario Rubén Darío (RURD)',
  defaultCoords: {
    lat: 12.1075,
    lng: -86.2725
  },
  defaultZoom: 17,
  storageKeys: {
    language: 'unan_map_language',
    theme: 'unan_map_theme',
    lastLocation: 'unan_map_last_location'
  },
  // Retrocompatibilidad con claves anteriores en localStorage
  legacyStorageKeys: {
    language: 'selectedLanguage',
    theme: 'darkMode'
  }
};
