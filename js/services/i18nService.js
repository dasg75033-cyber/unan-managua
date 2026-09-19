import { TRANSLATIONS } from '../data/i18n/index.js';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../config/languages.js';
import { CAMPUS_CONFIG } from '../config/constants.js';
import { storageService } from './storageService.js';

class I18nService {
  constructor() {
    this.currentLanguage = this.loadInitialLanguage();
    this.listeners = new Set();
  }

  /**
   * Normaliza códigos de idiomas heredados a códigos estándar BCP 47
   */
  normalizeLangCode(code) {
    if (!code) return DEFAULT_LANGUAGE;
    const mapping = {
      gn: 'cab',
      nl: 'nah',
      ma: 'yan'
    };
    return mapping[code] || code;
  }

  loadInitialLanguage() {
    const saved = storageService.getItem(CAMPUS_CONFIG.storageKeys.language) ||
                  storageService.getItem(CAMPUS_CONFIG.legacyStorageKeys.language);

    const normalized = this.normalizeLangCode(saved);
    const exists = SUPPORTED_LANGUAGES.some(l => l.code === normalized);
    return exists ? normalized : DEFAULT_LANGUAGE;
  }

  getLanguage() {
    return this.currentLanguage;
  }

  getLanguageMeta() {
    return SUPPORTED_LANGUAGES.find(l => l.code === this.currentLanguage) ||
           SUPPORTED_LANGUAGES.find(l => l.code === DEFAULT_LANGUAGE);
  }

  setLanguage(langCode) {
    const normalized = this.normalizeLangCode(langCode);
    const isValid = SUPPORTED_LANGUAGES.some(l => l.code === normalized);
    
    if (!isValid) {
      console.warn(`[I18nService] Idioma no soportado: "${langCode}". Se mantendrá "${this.currentLanguage}".`);
      return false;
    }

    this.currentLanguage = normalized;
    storageService.setItem(CAMPUS_CONFIG.storageKeys.language, normalized);
    storageService.setItem(CAMPUS_CONFIG.legacyStorageKeys.language, normalized);

    // Actualizar atributo lang en el documento raíz para lectores de pantalla si está en navegador
    if (typeof document !== 'undefined' && document.documentElement) {
      const meta = this.getLanguageMeta();
      document.documentElement.lang = meta?.isoCode || normalized;
      document.documentElement.dir = meta?.dir || 'ltr';
    }

    this.notifyListeners();
    return true;
  }

  /**
   * Obtiene la traducción de una clave con fallback a español
   */
  t(key, lang = this.currentLanguage) {
    const normalizedLang = this.normalizeLangCode(lang);
    const dict = TRANSLATIONS[normalizedLang] || TRANSLATIONS[DEFAULT_LANGUAGE];
    
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }

    // Fallback a español si falta en el idioma seleccionado
    const fallbackDict = TRANSLATIONS[DEFAULT_LANGUAGE];
    if (fallbackDict && fallbackDict[key] !== undefined) {
      return fallbackDict[key];
    }

    return key;
  }

  /**
   * Obtiene el nombre traducido de un destino del campus
   */
  getLocationName(location, lang = this.currentLanguage) {
    if (!location) return '';
    const normalizedLang = this.normalizeLangCode(lang);
    return location.translations?.[normalizedLang] ||
           location.translations?.[DEFAULT_LANGUAGE] ||
           location.id ||
           '';
  }

  /**
   * Obtiene el nombre traducido de un aula/subdestino
   */
  getSubLocationName(subLocation, lang = this.currentLanguage) {
    if (!subLocation) return '';
    const normalizedLang = this.normalizeLangCode(lang);
    return subLocation.translations?.[normalizedLang] ||
           subLocation.translations?.[DEFAULT_LANGUAGE] ||
           subLocation.id ||
           '';
  }

  onLanguageChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    for (const callback of this.listeners) {
      try {
        callback(this.currentLanguage);
      } catch (e) {
        console.error('[I18nService] Error en callback de language change:', e);
      }
    }
  }
}

export const i18nService = new I18nService();
