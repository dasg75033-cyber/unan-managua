/**
 * Módulo de compatibilidad para loads/destinations.js -> redirigido a js/data/campusData.js
 */
import { CAMPUS_DATA } from '../js/data/campusData.js';

export const destinos = CAMPUS_DATA.map(d => ({
  key: d.id,
  coords: d.coords,
  aulas: d.aulas.map(a => ({
    key: a.id,
    coords: a.coords
  }))
}));