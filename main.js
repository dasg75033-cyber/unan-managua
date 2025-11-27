import { textos } from './loads/translation.js';
import { destinos } from './loads/destinations.js';
import { destinosTraducidos } from './loads/data.js';

import * as DOM from './loads/domElements.js'; 

const DARK_MAP_STYLE = "&style=feature:all|element:labels.text.fill|color:0xffffffff&style=feature:road|element:geometry|color:0x515151|lightness:10&style=feature:water|element:geometry|color:0x3a3a3a";

function removeAccents(str) {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function renderDestinos(filter = '') {
    const idioma = DOM.idiomaSelect.value;
    const diccionario = destinosTraducidos[idioma] || destinosTraducidos.es;

    DOM.destinoSelect.innerHTML = '';

    destinos.forEach(d => {
        const nombreTraducido = diccionario[d.key] || d.key;

        if (removeAccents(nombreTraducido).includes(removeAccents(filter)) || d.key.match(/\d+/)?.[0]?.includes(filter)) {
            const opt = document.createElement('option');
            opt.value = d.coords;

            opt.textContent = nombreTraducido;
            opt.setAttribute('data-key', d.key);
            DOM.destinoSelect.appendChild(opt);
        }
    });

    if (DOM.destinoSelect.options.length > 0) {
        DOM.destinoSelect.selectedIndex = 0;
        updateAulas();
    }
}

function updateAulas() {
    const idioma = DOM.idiomaSelect.value;
    const diccionario = destinosTraducidos[idioma] || destinosTraducidos.es;

    const destinoKey = DOM.destinoSelect.selectedOptions[0]?.getAttribute('data-key');
    const dest = destinos.find(d => d.key === destinoKey);

    DOM.aulaSelect.innerHTML = '<option value="">--</option>';

    if (dest?.aulas?.length > 0) {
        dest.aulas.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.coords;

            opt.textContent = diccionario[a.key] || a.key;
            DOM.aulaSelect.appendChild(opt);
        });
    }
}

function updateTextos() {
    const idioma = DOM.idiomaSelect.value;
    const t = textos[idioma];

    DOM.lemaH2.textContent = t.lema;
    DOM.labelDestino.textContent = t.seleccionarDestino;
    DOM.labelAula.textContent = t.seleccionarAula;
    DOM.genBtn.textContent = t.generarQR;
    DOM.labelIdioma.textContent = t.idiomaLabel;

    DOM.labelBusqueda.textContent = t.labelBusqueda;

    DOM.busquedaInput.placeholder = t.placeholderBusqueda;
    
    if (DOM.btnDarkMode) { 
        DOM.btnDarkMode.textContent = t.modoOscuro;
    }

    localStorage.setItem('selectedLanguage', idioma);
}

async function generateQR() {
    const coords = DOM.aulaSelect.value || DOM.destinoSelect.value;
    const nombre = DOM.aulaSelect.selectedOptions[0]?.textContent || DOM.destinoSelect.selectedOptions[0]?.textContent;
    const idioma = DOM.idiomaSelect.value;
    
    // Lógica para el Modo Oscuro del Mapa
    const isDarkMode = document.body.classList.contains('dark-mode');
    const mapThemeParam = isDarkMode ? '&force=dark' : '&force=light' 

    if (!coords || !/^[-\d.]+,\s*[-\d.]+$/.test(coords)) {
        DOM.qrHolder.innerHTML = '';
        return;
    }

    const mapsUrl = `http://maps.google.com/?q=${encodeURIComponent(coords)}&hl=${idioma}`;
    
    // Se añade el estilo al iframe del mapa
    DOM.mapFrame.src = `http://maps.google.com/maps?q=${encodeURIComponent(coords)} (${encodeURIComponent(nombre)})&t=&z=17&ie=UTF8&iwloc=B&hl=${idioma}&output=embed${mapThemeParam}`;

    DOM.qrHolder.innerHTML = '';
    try {
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, mapsUrl, { errorCorrectionLevel: 'H', margin: 1, width: 150 });
        DOM.qrHolder.appendChild(canvas);

        const label = document.createElement('div');
        label.textContent = nombre;
        label.style.fontSize = '12px';
        label.style.marginTop = '8px';
        DOM.qrHolder.appendChild(label);
    } catch (e) {
        console.error(e);
        DOM.qrHolder.textContent = "Error al generar el QR.";
    }
}

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    if (isDarkMode) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
    
    generateQR(); 
}

function loadDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    generateQR(); 
}

function loadLanguagePreference() {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
        DOM.idiomaSelect.value = savedLang;
    }
}
// Eventos
DOM.destinoSelect.addEventListener('change', () => {
    updateAulas();
    generateQR();
});

DOM.aulaSelect.addEventListener('change', generateQR);
DOM.busquedaInput.addEventListener('input', () => renderDestinos(DOM.busquedaInput.value));
DOM.genBtn.addEventListener('click', generateQR);

DOM.idiomaSelect.addEventListener('change', () => {
    updateTextos();
    renderDestinos(DOM.busquedaInput.value);
    generateQR();
});

if (DOM.btnDarkMode) {
    DOM.btnDarkMode.addEventListener('click', toggleDarkMode);
}

// INICIALIZACIÓN - ORDEN RECOMENDADO

loadLanguagePreference(); 
renderDestinos(); 
updateTextos(); 
loadDarkModePreference();