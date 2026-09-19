import { i18nService } from './js/services/i18nService.js';
import { searchService } from './js/services/searchService.js';
import { mapService } from './js/services/mapService.js';
import { qrService } from './js/services/qrService.js';
import { storageService } from './js/services/storageService.js';
import { toast } from './js/ui/toast.js';
import { CAMPUS_DATA } from './js/data/campusData.js';
import { CAMPUS_CONFIG } from './js/config/constants.js';
import * as DOM from './loads/domElements.js';

let searchDebounceTimer = null;
let currentMapsDirectUrl = '';
let currentTargetName = 'UNAN Managua';

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
        clearQrAndMap();
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
 * Limpia la tarjeta QR y el mapa cuando no hay destino válido
 */
function clearQrAndMap() {
    if (DOM.qrHolder) DOM.qrHolder.innerHTML = '';
    if (DOM.qrLocationTitle) DOM.qrLocationTitle.textContent = 'UNAN Managua';
    if (DOM.qrLocationSubtitle) DOM.qrLocationSubtitle.textContent = '';
    currentMapsDirectUrl = '';
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
    
    // Botones de acción QR
    if (DOM.textBtnOpenMaps) DOM.textBtnOpenMaps.textContent = i18nService.t('abrirEnMaps');
    if (DOM.textBtnCopyLink) DOM.textBtnCopyLink.textContent = i18nService.t('copiarEnlace');
    if (DOM.textBtnDownloadQr) DOM.textBtnDownloadQr.textContent = i18nService.t('descargarQR');

    // Modo oscuro
    if (DOM.btnDarkMode) { 
        const isDark = document.body.classList.contains('dark-mode');
        DOM.btnDarkMode.textContent = isDark ? i18nService.t('modoClaro') : i18nService.t('modoOscuro');
    }

    if (DOM.idiomaSelect && DOM.idiomaSelect.value !== idioma) {
        DOM.idiomaSelect.value = idioma;
    }

    updateOfflineState();
}

/**
 * Genera el código QR de alto contraste y actualiza el mapa interactivo de Google Maps
 */
async function generateQR() {
    if (DOM.destinoSelect.disabled || !DOM.destinoSelect.value) {
        clearQrAndMap();
        return;
    }

    const isAulaSelected = !!DOM.aulaSelect.value;
    const coords = DOM.aulaSelect.value || DOM.destinoSelect.value;
    const destName = DOM.destinoSelect.selectedOptions[0]?.textContent || 'UNAN Managua';
    const aulaName = isAulaSelected ? DOM.aulaSelect.selectedOptions[0]?.textContent : '';
    const fullName = isAulaSelected ? `${destName} - ${aulaName}` : destName;
    const idioma = i18nService.getLanguage();

    currentTargetName = fullName;

    if (!mapService.isValidCoords(coords)) {
        clearQrAndMap();
        return;
    }

    // Actualizar encabezado de la tarjeta QR
    if (DOM.qrLocationTitle) DOM.qrLocationTitle.textContent = isAulaSelected ? aulaName : destName;
    if (DOM.qrLocationSubtitle) DOM.qrLocationSubtitle.textContent = isAulaSelected ? `${destName} • UNAN Managua` : 'Recinto Universitario Rubén Darío';

    // Generar URL para Maps e iframe
    currentMapsDirectUrl = mapService.getDirectUrl(coords, fullName, idioma);
    DOM.mapFrame.src = mapService.getEmbedUrl(coords, fullName, idioma);

    // Generar Código QR de Alto Contraste con QrService
    if (DOM.qrHolder) {
        DOM.qrHolder.innerHTML = '';
        try {
            const canvas = document.createElement('canvas');
            await qrService.renderToCanvas(canvas, currentMapsDirectUrl, {
                width: 180,
                margin: 2
            });
            DOM.qrHolder.appendChild(canvas);
        } catch (e) {
            console.error('[QRCode] Error al generar código QR:', e);
            DOM.qrHolder.innerHTML = `<p style="color: #666; font-size: 13px; text-align: center; padding: 12px;">${i18nService.t('errorQR')}</p>`;
        }
    }

    saveCurrentSelection();
}

/**
 * Copia el enlace de Google Maps al portapapeles con feedback accesible
 */
async function handleCopyLink() {
    if (!currentMapsDirectUrl) return;

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(currentMapsDirectUrl);
        } else {
            // Fallback para navegadores antiguos
            const textarea = document.createElement('textarea');
            textarea.value = currentMapsDirectUrl;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        toast.show(i18nService.t('enlaceCopiado'));
    } catch (e) {
        console.error('[Clipboard] Error al copiar enlace:', e);
        toast.show('Error al copiar enlace');
    }
}

/**
 * Abre el destino directamente en la app / web de Google Maps
 */
function handleOpenMaps() {
    if (!currentMapsDirectUrl) return;
    window.open(currentMapsDirectUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Descarga el código QR como imagen PNG de alta resolución
 */
async function handleDownloadQr() {
    if (!currentMapsDirectUrl) return;
    const cleanFileName = `UNAN_QR_${currentTargetName.replace(/\s+/g, '_')}.png`;
    const success = await qrService.downloadQr(currentMapsDirectUrl, cleanFileName);
    if (success) {
        toast.show('Código QR descargado con éxito');
    }
}

/**
 * Gestiona el estado y alerta visual de conexión offline
 */
function updateOfflineState() {
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    if (DOM.offlineNotice) {
        DOM.offlineNotice.classList.toggle('d-none', !isOffline);
        if (DOM.offlineNoticeText) {
            DOM.offlineNoticeText.textContent = i18nService.t('modoOffline');
        }
    }
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

// Event Listeners de Selección y Búsqueda
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

// Botones de Acción de la Tarjeta QR
if (DOM.btnOpenMaps) DOM.btnOpenMaps.addEventListener('click', handleOpenMaps);
if (DOM.btnCopyLink) DOM.btnCopyLink.addEventListener('click', handleCopyLink);
if (DOM.btnDownloadQr) DOM.btnDownloadQr.addEventListener('click', handleDownloadQr);

// Monitoreo de Conectividad (Online / Offline)
window.addEventListener('online', updateOfflineState);
window.addEventListener('offline', updateOfflineState);

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