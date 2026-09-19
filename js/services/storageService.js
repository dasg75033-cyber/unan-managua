/**
 * Servicio de almacenamiento seguro con gestión de excepciones y fallback en memoria.
 * Previene fallos cuando localStorage está bloqueado o en modo incógnito estricto.
 */
class StorageService {
  constructor() {
    this.memoryStorage = new Map();
    this.isAvailable = this.testAvailability();
  }

  testAvailability() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    if (this.isAvailable) {
      try {
        const item = window.localStorage.getItem(key);
        return item !== null ? item : defaultValue;
      } catch (e) {
        console.error(`[StorageService] Error al leer clave "${key}":`, e);
      }
    }
    return this.memoryStorage.has(key) ? this.memoryStorage.get(key) : defaultValue;
  }

  setItem(key, value) {
    const stringValue = String(value);
    if (this.isAvailable) {
      try {
        window.localStorage.setItem(key, stringValue);
        return true;
      } catch (e) {
        console.error(`[StorageService] Error al escribir clave "${key}":`, e);
      }
    }
    this.memoryStorage.set(key, stringValue);
    return true;
  }

  removeItem(key) {
    if (this.isAvailable) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        console.error(`[StorageService] Error al eliminar clave "${key}":`, e);
      }
    }
    this.memoryStorage.delete(key);
  }
}

export const storageService = new StorageService();
