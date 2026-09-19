# 🗺️ Mapa Interactivo UNAN Managua (Campus RURD)

[![Licencia](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
[![Estándar](https://img.shields.io/badge/Accesibilidad-WCAG%202.1%20AA-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![QR Standard](https://img.shields.io/badge/QR%20Code-ISO%2FIEC%2018004-orange.svg)](https://www.iso.org/standard/62021.html)

Aplicación web estática, inclusiva y de alto rendimiento diseñada para la comunidad universitaria de la **Universidad Nacional Autónoma de Nicaragua (UNAN Managua)**. Permite a estudiantes, docentes y visitantes explorar el Recinto Universitario Rubén Darío (RURD), localizar pabellones, aulas y laboratorios en tiempo real, generar códigos QR de alto contraste y abrir rutas directas en Google Maps.

---

## ✨ Características Principales

- 🔍 **Búsqueda Jerárquica Inteligente**:
  - Búsqueda en tiempo real por número de pabellón (ej: `23`, `21`), nombre del edificio (ej: `Biblioteca Central`), alias o aula/laboratorio específico (ej: `PLC`, `Redes`, `Máquinas`, `Básica 1`).
  - Preselección automática del pabellón padre y aula coincidente.
  - *Empty State* con sugerencias interactivas de búsqueda rápida.
- 🌐 **Soporte Multilingüe (6 Idiomas)**:
  - **Español** (`es-NI`) — Idioma base.
  - **Miskito / Miskitu** (`mi`).
  - **Garífuna / Garinagu** (`cab`).
  - **Náhuatl / Pipil** (`nah`).
  - **Mayagna / Mayangna** (`yan`).
  - **Inglés / English** (`en-US`).
- 📱 **Código QR de Alto Contraste (ISO/IEC 18004)**:
  - Tarjeta QR sobre canvas blanco aislado con *quiet zone*, garantizando **100% de legibilidad** bajo luz solar en smartphones.
  - Acciones rápidas en un clic: **Abrir en Maps**, **Copiar Enlace** y **Descargar QR (PNG)** en alta resolución.
- 🎨 **Sistema de Diseño Premium & Dark Mode**:
  - Paleta institucional UNAN Managua (Azul `#002B5C`, Dorado `#E6A100`, modo oscuro `#0A192F`).
  - Tipografía moderna `Plus Jakarta Sans`.
  - Detección automática del tema del sistema (`prefers-color-scheme`) con persistencia en `localStorage`.
- ♿ **Accesibilidad WCAG 2.1 AA**:
  - Anillos de foco visibles universales (`:focus-visible`).
  - Región en vivo (`aria-live="polite"`) para anuncios a lectores de pantalla.
  - Botonera táctil optimizada (touch targets $\ge 44 \times 44$ px).
  - Enlace de salto rápido al contenido (*Skip Link*).
- 📶 **Resiliencia y Modo Offline**:
  - Detección de conectividad en tiempo real con indicador visual cuando se pierde la conexión a internet.
  - Manejo defensivo ante fallos de CDN o bloqueo de `localStorage`.

---

## 🏛️ Estructura del Proyecto

El código está estructurado bajo una arquitectura limpia y modular basada en **ES Modules (Vanilla JS)**:

```text
.
├── index.html                  # Estructura semántica, accesible y optimizada
├── styles.css                  # Sistema de diseño con variables CSS, tokens HSL y Dark Mode
├── main.js                     # Controlador principal de la aplicación
├── assets/                     # Recursos gráficos y favicons
│   ├── logo.png
│   ├── QR-Background.jpg
│   └── favicon/
└── js/
    ├── config/
    │   ├── constants.js        # Coordenadas por defecto, claves de storage y config
    │   └── languages.js        # Metadatos oficiales de idiomas (ISO 639 / BCP 47)
    ├── data/
    │   ├── campusData.js       # Fuente única de verdad (Pabellones, Aulas, Coords, Alias)
    │   └── i18n/               # Diccionarios atómicos por idioma
    │       ├── es.js
    │       ├── mi.js
    │       ├── cab.js
    │       ├── nah.js
    │       ├── yan.js
    │       ├── en.js
    │       └── index.js
    ├── services/
    │   ├── i18nService.js      # Gestor de internacionalización reactivo con fallbacks
    │   ├── searchService.js    # Motor de búsqueda jerárquica y normalización Unicode
    │   ├── mapService.js       # Constructor seguro de URLs para Google Maps e iframe
    │   ├── qrService.js        # Generador y descargador de QR de alto contraste
    │   └── storageService.js   # Wrapper seguro con fallback en memoria para localStorage
    └── ui/
        └── toast.js            # Componente de notificaciones accesible
```

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

Al ser una aplicación web moderna basada en módulos ES (`type="module"`), se recomienda servirla mediante un servidor HTTP local:

### Opción 1: Con Node.js (npx)
```bash
npx serve .
```

### Opción 2: Con Python 3
```bash
python -m http.server 8000
```
Luego abre en tu navegador: [http://localhost:8000](http://localhost:8000)

### Opción 3: Con la extensión Live Server de VS Code / Antigravity
Haz clic derecho en `index.html` y selecciona **Open with Live Server**.

---

## 🛠️ Guía para Desarrolladores y Administradores

### 1. ¿Cómo agregar un nuevo Edificio o Pabellón?
Edita el archivo [`js/data/campusData.js`](js/data/campusData.js) y agrega un nuevo objeto al array `CAMPUS_DATA`:

```javascript
{
  id: "PAB_10",
  code: "10",
  category: "pavilion",
  coords: "12.1071234, -86.2731234",
  aliases: ["10", "pabellon 10", "edificio 10", "ciencias"],
  translations: {
    es: "Pabellón 10",
    mi: "Rumka watla 10",
    cab: "Pabellón Úriñi Bísibiti (10)",
    nah: "Pabellón Matlactli (10)",
    yan: "Pabellón Wanta Pîtni 10",
    en: "Pavilion 10"
  },
  aulas: [
    {
      id: "LAB_QUIMICA",
      code: "LQ-10",
      coords: "12.1071500, -86.2731500",
      aliases: ["quimica", "laboratorio quimica", "chemistry"],
      translations: {
        es: "Laboratorio de Química",
        mi: "Warkka quimica pliska",
        cab: "Kímika Tarábahu Límu",
        nah: "Kimika Tlatlamantli Yeyantli",
        yan: "Kimika Warkranî Pliska",
        en: "Chemistry Laboratory"
      }
    }
  ]
}
```

### 2. ¿Cómo agregar o editar textos de la interfaz?
Los textos de la interfaz se encuentran organizados en [`js/data/i18n/`](js/data/i18n/). Solo debes modificar la clave correspondiente en cada archivo (`es.js`, `en.js`, etc.). Si una clave no existe en un idioma originario, el sistema aplicará automáticamente el *fallback* al español.

### 3. ¿Cómo añadir un nuevo idioma?
1. Registra el nuevo idioma en [`js/config/languages.js`](js/config/languages.js).
2. Crea el archivo de diccionario en `js/data/i18n/[codigo].js`.
3. Impórtalo y expórtalo en `js/data/i18n/index.js`.
4. Agrega las traducciones correspondientes en `js/data/campusData.js`.

---

## 📄 Créditos y Licencia

Desarrollado para la **Universidad Nacional Autónoma de Nicaragua (UNAN Managua)**.  
Distribuido bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

## 👥 Autores y Contribuidores

- **[Revisar GitHub]**