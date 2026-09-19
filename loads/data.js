/**
 * Módulo de compatibilidad para loads/data.js -> generado dinámicamente desde js/data/campusData.js
 */
import { CAMPUS_DATA } from '../js/data/campusData.js';

const buildDestinosTraducidos = () => {
  const result = {
    es: {},
    mi: {},
    cab: {},
    nah: {},
    yan: {},
    en: {},
    gn: {},
    nl: {},
    ma: {}
  };

  CAMPUS_DATA.forEach(d => {
    Object.keys(d.translations).forEach(lang => {
      if (result[lang]) result[lang][d.id] = d.translations[lang];
    });
    // Alias legacy
    if (d.translations.cab) result.gn[d.id] = d.translations.cab;
    if (d.translations.nah) result.nl[d.id] = d.translations.nah;
    if (d.translations.yan) result.ma[d.id] = d.translations.yan;

    d.aulas.forEach(a => {
      Object.keys(a.translations).forEach(lang => {
        if (result[lang]) result[lang][a.id] = a.translations[lang];
      });
      if (a.translations.cab) result.gn[a.id] = a.translations.cab;
      if (a.translations.nah) result.nl[a.id] = a.translations.nah;
      if (a.translations.yan) result.ma[a.id] = a.translations.yan;
    });
  });

  return result;
};

export const destinosTraducidos = buildDestinosTraducidos();
