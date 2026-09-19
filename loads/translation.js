/**
 * Módulo de compatibilidad para loads/translation.js -> redirigido a js/data/i18n/
 */
import { TRANSLATIONS } from '../js/data/i18n/index.js';

export const textos = {
  es: { ...TRANSLATIONS.es },
  mi: { ...TRANSLATIONS.mi },
  gn: { ...TRANSLATIONS.cab },
  nl: { ...TRANSLATIONS.nah },
  ma: { ...TRANSLATIONS.yan },
  en: { ...TRANSLATIONS.en },
  cab: { ...TRANSLATIONS.cab },
  nah: { ...TRANSLATIONS.nah },
  yan: { ...TRANSLATIONS.yan }
};