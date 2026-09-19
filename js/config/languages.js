/**
 * Configuración oficial de idiomas soportados en el Mapa Interactivo UNAN Managua.
 * Cumple con estándares ISO 639-1 / BCP 47 para accesibilidad y tecnologías de asistencia.
 */
export const SUPPORTED_LANGUAGES = [
  {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    isoCode: 'es-NI',
    dir: 'ltr'
  },
  {
    code: 'mi',
    name: 'Miskito',
    nativeName: 'Miskitu',
    isoCode: 'mi',
    dir: 'ltr'
  },
  {
    code: 'cab',
    name: 'Garífuna',
    nativeName: 'Garífuna (Garinagu)',
    isoCode: 'cab',
    dir: 'ltr'
  },
  {
    code: 'nah',
    name: 'Náhuatl',
    nativeName: 'Nāhuatl (Pipil)',
    isoCode: 'nah',
    dir: 'ltr'
  },
  {
    code: 'yan',
    name: 'Mayagna',
    nativeName: 'Mayangna (Panamahka/Twahka)',
    isoCode: 'yan',
    dir: 'ltr'
  },
  {
    code: 'en',
    name: 'Inglés',
    nativeName: 'English',
    isoCode: 'en-US',
    dir: 'ltr'
  }
];

export const DEFAULT_LANGUAGE = 'es';
