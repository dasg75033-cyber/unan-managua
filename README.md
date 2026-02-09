# Mapa interactivo UNAN Managua

Aplicación web estática para ubicar destinos dentro del campus de la **UNAN Managua**, generar un enlace de Google Maps y mostrar su **código QR** en tiempo real.

## Características

- Selección de destino principal y aulas/subdestinos.
- Búsqueda por nombre o por número del edificio.
- Interfaz multilingüe:
  - Español
  - Miskito
  - Garífuna
  - Náhuatl
  - Inglés
- Modo oscuro con persistencia en `localStorage`.
- Generación de código QR del destino seleccionado.
- Vista embebida de Google Maps en `iframe`.

## Tecnologías usadas

- HTML5
- CSS3
- JavaScript (ES Modules)
- [Bootstrap 5](https://getbootstrap.com/)
- [QRCode.js (CDN)](https://github.com/soldair/node-qrcode)

## Estructura del proyecto

```text
.
├── index.html
├── main.js
├── styles.css
├── assets/
│   ├── logo.png
│   └── QR-Background.jpg
└── loads/
    ├── data.js
    ├── destinations.js
    ├── domElements.js
    └── translation.js
```

## Cómo ejecutar el proyecto

Como es un sitio estático, puedes abrirlo de dos formas:

### Opción 1: abrir directamente en navegador

1. Descarga o clona el repositorio.
2. Abre `index.html` en tu navegador.

> Nota: algunas funciones pueden comportarse mejor sirviendo el proyecto desde un servidor local.

### Opción 2 (recomendada): servidor local

Con Python:

```bash
python3 -m http.server 8000
```

Luego abre:

```text
http://localhost:8000
```

## Flujo de uso

1. Selecciona el idioma.
2. Busca y elige un destino.
3. (Opcional) selecciona un aula específica.
4. Presiona **Generar QR**.
5. Escanea el QR o usa el mapa embebido.

## Personalización

- **Traducciones**: `loads/translation.js`
- **Destinos y aulas**: `loads/destinations.js`
- **Textos traducidos por destino**: `loads/data.js`
- **Estilos**: `styles.css`
