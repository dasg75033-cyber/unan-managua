import { i18nService } from './js/services/i18nService.js';
import { searchService } from './js/services/searchService.js';
import { mapService } from './js/services/mapService.js';
import { storageService } from './js/services/storageService.js';
import { CAMPUS_DATA } from './js/data/campusData.js';
import { CAMPUS_CONFIG } from './js/config/constants.js';
import * as DOM from './loads/domElements.js';

let searchDebounceTimer = null;

/**
 * Renderiza los destinos según el término de búsqueda y selecciona la mejor coincidencia
 */
function renderDestinos(filter = '', preserveSelection = false) {
    const idioma = i18nService.getLanguage();
    const query = (filter || '').trim();

    // Gestionar visibilidad del botón de limpiar búsqueda
    if (DOM.btnClearSearch) {
        DOM.btnClearSearch.classList.toggle('d-none', !query);
    }

    const matches = searchService.search(query, idioma);

    // Si no hay resultados de búsqueda
    if (matches.length === 0) {
        DOM.destinoSelect.innerHTML = `<option value="">-- ${i18nService.t('sinResultados')} --</option>`;
        DOM.destinoSelect.disabled = true;
        DOM.aulaSelect.innerHTML = `<option value="">--</option>`;
        DOM.aulaSelect.disabled = true;

        showEmptyState(query);
        announceLiveFeedback(i18nService.t('sinResultados'));
        return;
    }

    // Hay resultados: reactivar controles y ocultar empty state
    DOM.destinoSelect.disabled = false;
    DOM.aulaSelect.disabled = false;
    hideEmptyState();

    // Obtener lista única de destinos principales a partir de las coincidencias
    const uniqueDestMap = new Map();
    matches.forEach(m => {
        if (!uniqueDestMap.has(m.destination.id)) {
            uniqueDestMap.set(m.destination.id, m.destination);
        }
    });

    const previousDestId = DOM.destinoSelect.selectedOptions[0]?.getAttribute('data-id');
    const previousAulaId = DOM.aulaSelect.selectedOptions[0]?.getAttribute('data-id');

    DOM.destinoSelect.innerHTML = '';
    uniqueDestMap.forEach(dest => {
        const opt = document.createElement('option');
        opt.value = dest.coords;
        opt.textContent = i18nService.getLocationName(dest, idioma);
        opt.setAttribute('data-id', dest.id);
        DOM.destinoSelect.appendChild(opt);
    });

    const topMatch = matches[0];

    if (preserveSelection && previousDestId && uniqueDestMap.has(previousDestId)) {
        // Preservar la selección previa si existe en el resultado
        DOM.destinoSelect.value = uniqueDestMap.get(previousDestId).coords;
        updateAulas(previousAulaId);
    } else if (topMatch.type === 'subLocation' && topMatch.subLocation) {
        // Si la mejor coincidencia es un aula específica (ej: PLC, Redes, Máquinas)
        DOM.destinoSelect.value = topMatch.destination.coords;
        updateAulas(topMatch.subLocation.id);
    } else {
        DOM.destinoSelect.selectedIndex = 0;
        updateAulas();
    }

    announceLiveFeedback(`${uniqueDestMap.size} ${i18nService.t('resultadosEncontrados')}`);
    saveCurrentSelection();
}

/**
 * Actualiza el selector de aulas para el destino activo
 */
function updateAulas(preselectAulaId = null) {
    const idioma = i18nService.getLanguage();
    const destinoId = DOM.destinoSelect.selectedOptions[0]?.getAttribute('data-id');
    const dest = CAMPUS_DATA.find(d => d.id === destinoId);

    DOM.aulaSelect.innerHTML = `<option value="">${i18nService.t('opcionSinAula')}</option>`;

    if (dest?.aulas?.length > 0) {
        dest.aulas.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.coords;
            opt.textContent = i18nService.getSubLocationName(a, idioma);
            opt.setAttribute('data-id', a.id);
            if (preselectAulaId && a.id === preselectAulaId) {
                opt.selected = true;
            }
            DOM.aulaSelect.appendChild(opt);
        });
    }
}

/**
 * Muestra el componente interactivo de estado vacío con sugerencias
 */
function showEmptyState(query) {
    if (!DOM.emptyState) return;
    
    DOM.emptyState.classList.remove('d-none');
    if (DOM.emptyStateText) {
        DOM.emptyStateText.textContent = `${i18nService.t('sinResultados')} ${i18nService.t('sugerenciaBusqueda')}`;
    }

    if (DOM.emptyStateChips) {
        DOM.emptyStateChips.innerHTML = '';
        const suggestions = searchService.getQuickSuggestions(i18nService.getLanguage());
        suggestions.forEach(s => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'suggestion-chip';
            chip.textContent = s.label;
            chip.addEventListener('click', () => {
                DOM.busquedaInput.value = s.query;
                renderDestinos(s.query);
                generateQR();
                DOM.busquedaInput.focus();
            });
            DOM.emptyStateChips.appendChild(chip);
        });
    }
}

/**
 * Oculta el componente de estado vacío
 */
function hideEmptyState() {
    if (DOM.emptyState) {
        DOM.emptyState.classList.add('d-none');
    }
}

/**
 * Emite mensaje accesible en la región en vivo para lectores de pantalla
 */
function announceLiveFeedback(message) {
    if (DOM.searchLiveFeedback) {
        DOM.searchLiveFeedback.textContent = message;
    }
}

/**
 * Actualiza todos los textos de la interfaz según el idioma actual
 */
function updateTextos() {
    const idioma = i18nService.getLanguage();

    DOM.lemaH2.textContent = i18nService.t('lema');
    DOM.labelDestino.textContent = i18nService.t('seleccionarDestino');
    DOM.labelAula.textContent = i18nService.t('seleccionarAula');
    DOM.genBtn.textContent = i18nService.t('generarQR');
    DOM.labelIdioma.textContent = i18nService.t('idiomaLabel');
    DOM.labelBusqueda.textContent = i18nService.t('labelBusqueda');
    DOM.busquedaInput.placeholder = i18nService.t('placeholderBusqueda');
    
    if (DOM.btnDarkMode) { 
        const isDark = document.body.classList.contains('dark-mode');
        DOM.btnDarkMode.textContent = isDark ? i18nService.t('modoClaro') : i18nService.t('modoOscuro');
    }

    if (DOM.idiomaSelect && DOM.idiomaSelect.value !== idioma) {
        DOM.idiomaSelect.value = idioma;
    }
}

/**
 * Genera el código QR y actualiza el mapa interactivo de Google Maps
 */
async function generateQR() {
    if (DOM.destinoSelect.disabled) {
        DOM.qrHolder.innerHTML = '';
        return;
    }

    const coords = DOM.aulaSelect.value || DOM.destinoSelect.value;
    const selectedOption = (DOM.aulaSelect.value ? DOM.aulaSelect.selectedOptions[0] : DOM.destinoSelect.selectedOptions[0]);
    const nombre = selectedOption ? selectedOption.textContent : 'UNAN Managua';
    const idioma = i18nService.getLanguage();

    if (!mapService.isValidCoords(coords)) {
        DOM.qrHolder.innerHTML = '';
        return;
    }

    const mapsUrl = mapService.getDirectUrl(coords, nombre, idioma);
    DOM.mapFrame.src = mapService.getEmbedUrl(coords, nombre, idioma);

    DOM.qrHolder.innerHTML = '';
    try {
        if (typeof QRCode !== 'undefined') {
            const canvas = document.createElement('canvas');
            await QRCode.toCanvas(canvas, mapsUrl, { errorCorrectionLevel: 'H', margin: 2, width: 160 });
            DOM.qrHolder.appendChild(canvas);

            const label = document.createElement('div');
            label.textContent = nombre;
            label.style.fontSize = '13px';
            label.style.fontWeight = 'bold';
            label.style.marginTop = '8px';
            label.style.textAlign = 'center';
            DOM.qrHolder.appendChild(label);
        } else {
            DOM.qrHolder.innerHTML = `<p style="color: #666; font-size: 13px;">${i18nService.t('errorQR')}</p>`;
        }
    } catch (e) {
        console.error('[QRCode] Error al generar código:', e);
        DOM.qrHolder.textContent = i18nService.t('errorQR');
    }

    saveCurrentSelection();
}

/**
 * Persiste la selección actual en localStorage de forma segura
 */
function saveCurrentSelection() {
    const destId = DOM.destinoSelect.selectedOptions[0]?.getAttribute('data-id');
    const aulaId = DOM.aulaSelect.selectedOptions[0]?.getAttribute('data-id');
    if (destId) {
        storageService.setItem(CAMPUS_CONFIG.storageKeys.lastLocation, JSON.stringify({ destId, aulaId: aulaId || null }));
    }
}

/**
 * Carga la última selección guardada del usuario
 */
function loadLastSelection() {
    try {
        const saved = storageService.getItem(CAMPUS_CONFIG.storageKeys.lastLocation);
        if (saved) {
            const { destId, aulaId } = JSON.parse(saved);
            if (destId) {
                const dest = CAMPUS_DATA.find(d => d.id === destId);
                if (dest) {
                    DOM.destinoSelect.value = dest.coords;
                    updateAulas(aulaId);
                }
            }
        }
    } catch (e) {
        console.warn('[Storage] No se pudo restaurar la última selección:', e);
    }
}

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    storageService.setItem(CAMPUS_CONFIG.storageKeys.theme, isDarkMode ? 'dark' : 'light');
    storageService.setItem(CAMPUS_CONFIG.legacyStorageKeys.theme, isDarkMode ? 'enabled' : 'disabled');
    updateTextos();
    generateQR(); 
}

function loadDarkModePreference() {
    const theme = storageService.getItem(CAMPUS_CONFIG.storageKeys.theme) ||
                  (storageService.getItem(CAMPUS_CONFIG.legacyStorageKeys.theme) === 'enabled' ? 'dark' : 'light');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateTextos();
}

// Event Listeners
DOM.destinoSelect.addEventListener('change', () => {
    updateAulas();
    generateQR();
});

DOM.aulaSelect.addEventListener('change', generateQR);

DOM.busquedaInput.addEventListener('input', () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        renderDestinos(DOM.busquedaInput.value);
        generateQR();
    }, 150);
});

if (DOM.btnClearSearch) {
    DOM.btnClearSearch.addEventListener('click', () => {
        DOM.busquedaInput.value = '';
        renderDestinos('');
        generateQR();
        DOM.busquedaInput.focus();
    });
}

DOM.genBtn.addEventListener('click', generateQR);

DOM.idiomaSelect.addEventListener('change', (e) => {
    i18nService.setLanguage(e.target.value);
    updateTextos();
    renderDestinos(DOM.busquedaInput.value, true);
    generateQR();
});

if (DOM.btnDarkMode) {
    DOM.btnDarkMode.addEventListener('click', toggleDarkMode);
}

// Inicialización de la aplicación
const initialLang = i18nService.getLanguage();
if (DOM.idiomaSelect) {
    DOM.idiomaSelect.value = initialLang;
}
renderDestinos(); 
loadLastSelection();
updateTextos(); 
loadDarkModePreference();
generateQR();