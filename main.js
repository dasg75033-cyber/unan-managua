const textosBase = {
  seleccionarDestino: "Selecciona Pabellón o lugar",
  seleccionarAula: "Selecciona Aula (si aplica)",
  generarQR: "Generar QR y mostrar mapa",
  idiomaLabel: "Idioma",
  placeholderBusqueda: "Escribe nombre o número",
  modoOscuro: "Modo oscuro"
};

const textos = {
  es: { ...textosBase, lema: "2025: Eficiencia y calidad para seguir en victorias" },
  mi: { ...textosBase, lema: "2025: Eficiensia yan quality ta continú en victorias (Miskito)" },
  gn: { ...textosBase, lema: "2025: Efficiency and quality para seguir en victorias (Garífuna)" },
  nl: { ...textosBase, lema: "2025: Eficiencia yan calidad pa continuar en victorias (Náhuatl)" },
  en: { ...textosBase, lema: "2025: Efficiency and quality to continue in victories", idiomaLabel: "Language" }
};

const destinos = [
  { nombre: "Biblioteca Central", coords: "12.107808810323178, -86.2708299826929", aulas: [] },
  { nombre: "Pabellón 23", coords: "12.106943158957009, -86.27347516644704", aulas: [
    { nombre: "LAB. MAQUINAS", coords: "12.107006645306395, -86.27350390620063" },
    { nombre: "LAB. REDES", coords: "12.106994156189668, -86.27343046016368" }
  ]},
  { nombre: "Pabellón 21", coords: "12.106745414490817, -86.27330911453713", aulas: [
    { nombre: "LAB. BASICA 1", coords: "12.106819308491719, -86.27335062751453" },
    { nombre: "LAB. BASICA 2", coords: "12.106688172645068, -86.27335914299708" },
    { nombre: "LAB. PLC", coords: "12.106787879084706, -86.2732643074708" }
  ]}
];

const destinoSelect = document.getElementById('destino');
const aulaSelect = document.getElementById('aula');
const qrHolder = document.getElementById('qr');
const mapFrame = document.getElementById('map');
const genBtn = document.getElementById('gen');
const idiomaSelect = document.getElementById('idioma');
const lemaH2 = document.getElementById('lema');
const labelDestino = document.getElementById('labelDestino');
const labelAula = document.getElementById('labelAula');
const labelIdioma = document.getElementById('labelIdioma');
const busquedaInput = document.getElementById('busqueda');

function removeAccents(str) {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function renderDestinos(filter = '') {
  destinoSelect.innerHTML = '';
  destinos.forEach(d => {
    if (removeAccents(d.nombre).includes(removeAccents(filter)) || d.nombre.match(/\d+/)?.[0]?.includes(filter)) {
      const opt = document.createElement('option');
      opt.value = d.coords;
      opt.textContent = d.nombre;
      destinoSelect.appendChild(opt);
    }
  });

  if (destinoSelect.options.length > 0) {
    destinoSelect.selectedIndex = 0;
    updateAulas();
  }
}

function updateAulas() {
  const dest = destinos.find(d => d.coords === destinoSelect.value);
  aulaSelect.innerHTML = '<option value="">--</option>';
  if (dest?.aulas?.length > 0) {
    dest.aulas.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.coords;
      opt.textContent = a.nombre;
      aulaSelect.appendChild(opt);
    });
  }
}

function updateTextos() {
  const idioma = idiomaSelect.value;
  const t = textos[idioma];
  lemaH2.textContent = t.lema;
  labelDestino.textContent = t.seleccionarDestino;
  labelAula.textContent = t.seleccionarAula;
  genBtn.textContent = t.generarQR;
  labelIdioma.textContent = t.idiomaLabel;
  busquedaInput.placeholder = t.placeholderBusqueda;
  btnDarkMode.textContent = t.modoOscuro;

  localStorage.setItem('selectedLanguage', idioma);
}

async function generateQR() {
  const coords = aulaSelect.value || destinoSelect.value;
  const nombre = aulaSelect.selectedOptions[0]?.textContent || destinoSelect.selectedOptions[0]?.textContent;
  const idioma = idiomaSelect.value;

  if (!coords || !/^[-\d.]+,\s*[-\d.]+$/.test(coords)) {
    qrHolder.innerHTML = '';
    return;
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}&hl=${idioma}`;
  mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(coords)} (${encodeURIComponent(nombre)})&t=&z=17&ie=UTF8&iwloc=B&hl=${idioma}&output=embed`;

  qrHolder.innerHTML = '';
  try {
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, mapsUrl, { errorCorrectionLevel: 'H', margin: 1, width: 150 });
    qrHolder.appendChild(canvas);

    const label = document.createElement('div');
    label.textContent = nombre;
    label.style.fontSize = '12px';
    label.style.marginTop = '8px';
    qrHolder.appendChild(label);
  } catch (e) {
    console.error(e);
    qrHolder.textContent = "Error al generar el QR.";
  }
}

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    // Guardar la preferencia en el navegador
    if (isDarkMode) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}

function loadDarkModePreference() {
    // Comprueba si la preferencia está guardada como 'enabled'
    if (localStorage.getItem('darkMode') === 'enabled') {
        // Si lo está, aplica la clase 'dark-mode' al body
        document.body.classList.add('dark-mode');
    }
}

function loadLanguagePreference() {
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang) {
    idiomaSelect.value =savedLang;
  }
}
// Eventos
idiomaSelect.addEventListener('change', () => {
  updateTextos();
  generateQR();
});

destinoSelect.addEventListener('change', () => {
  updateAulas();
  generateQR();
});

aulaSelect.addEventListener('change', generateQR);
busquedaInput.addEventListener('input', () => renderDestinos(busquedaInput.value));
genBtn.addEventListener('click', generateQR);

// Inicialización
loadLanguagePreference();
renderDestinos();
updateTextos();
generateQR();
loadDarkModePreference();
