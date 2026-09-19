import { CAMPUS_DATA } from '../data/campusData.js';
import { i18nService } from './i18nService.js';

export class SearchService {
  constructor(data = CAMPUS_DATA) {
    this.data = data;
  }

  /**
   * Normaliza texto eliminando acentos, diacríticos, mayúsculas y espacios extra
   */
  normalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  }

  /**
   * Ejecuta búsqueda jerárquica sobre destinos y subdestinos/aulas
   * @param {string} query - Término de búsqueda
   * @param {string} [lang] - Idioma para la resolución de nombres
   * @returns {Array<Object>} Lista estructurada de coincidencias con prioridad
   */
  search(query, lang = i18nService.getLanguage()) {
    const cleanQuery = this.normalize(query);
    if (!cleanQuery) {
      return this.data.map(dest => ({
        type: 'destination',
        destination: dest,
        subLocation: null,
        displayName: i18nService.getLocationName(dest, lang),
        score: 1
      }));
    }

    const results = [];

    for (const dest of this.data) {
      const destName = i18nService.getLocationName(dest, lang);
      const cleanDestName = this.normalize(destName);
      const cleanCode = this.normalize(dest.code);
      const codeMatches = cleanCode === cleanQuery || cleanCode.includes(cleanQuery);
      const nameMatches = cleanDestName.includes(cleanQuery);
      const aliasMatch = dest.aliases?.some(alias => this.normalize(alias).includes(cleanQuery));

      // 1. Coincidencia directa con el destino principal
      if (nameMatches || codeMatches || aliasMatch) {
        let score = 10;
        if (cleanCode === cleanQuery) score += 50;
        if (cleanDestName.startsWith(cleanQuery)) score += 20;

        results.push({
          type: 'destination',
          destination: dest,
          subLocation: null,
          displayName: destName,
          matchedOn: codeMatches ? 'code' : aliasMatch ? 'alias' : 'name',
          score
        });
      }

      // 2. Coincidencia en aulas/subdestinos
      if (dest.aulas && dest.aulas.length > 0) {
        for (const aula of dest.aulas) {
          const aulaName = i18nService.getSubLocationName(aula, lang);
          const cleanAulaName = this.normalize(aulaName);
          const cleanAulaCode = this.normalize(aula.code);
          const aulaCodeMatch = cleanAulaCode.includes(cleanQuery);
          const aulaNameMatch = cleanAulaName.includes(cleanQuery);
          const aulaAliasMatch = aula.aliases?.some(alias => this.normalize(alias).includes(cleanQuery));

          if (aulaNameMatch || aulaCodeMatch || aulaAliasMatch) {
            let score = 15;
            if (cleanAulaCode === cleanQuery) score += 40;
            if (cleanAulaName.startsWith(cleanQuery)) score += 15;

            results.push({
              type: 'subLocation',
              destination: dest,
              subLocation: aula,
              displayName: `${destName} - ${aulaName}`,
              matchedOn: aulaCodeMatch ? 'aulaCode' : aulaAliasMatch ? 'aulaAlias' : 'aulaName',
              score
            });
          }
        }
      }
    }

    // Ordenar resultados por relevancia (score descendente)
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Obtiene sugerencias rápidas populares para estados vacíos o búsqueda rápida
   */
  getQuickSuggestions(lang = i18nService.getLanguage()) {
    return [
      { label: 'Pabellón 23', query: '23' },
      { label: 'Pabellón 21', query: '21' },
      { label: i18nService.t('appTitle') === 'UNAN Managua' ? 'Biblioteca Central' : 'Biblioteca', query: 'Biblioteca' },
      { label: 'Laboratorio PLC', query: 'PLC' },
      { label: 'Laboratorio Redes', query: 'Redes' },
      { label: 'Laboratorio Máquinas', query: 'Máquinas' }
    ];
  }
}

export const searchService = new SearchService();
