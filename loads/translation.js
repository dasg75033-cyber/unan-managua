const textosBase = {
  idiomaLabel: "Idioma",
  generarQR: "Generar QR y mostrar mapa",
  placeholderBusqueda: "Escribe nombre o número",
  seleccionarDestino: "Selecciona Pabellón o lugar",
  seleccionarAula: "Selecciona Aula (si aplica)",
  modoOscuro: "Modo oscuro"
};

export const textos = {
  es: { ...textosBase, lema: "2025: Eficiencia y calidad para seguir en victorias" },

  // ---Miskito--- //
  mi: {
     ...textosBase, 
        lema: "2025: Yamni an wapni wal dauki wan kainara pura lui waya",
        idiomaLabel: "Bila aisanka",
        generarQR: "Paskaia mapka ba marikaia",
        labelBusqueda: "Pliska kum plikaia",
        placeholderBusqueda: "Nina an numba ba ulbaia",
        seleccionarDestino: "Pliska wahbi sakaya",
        seleccionarAula: "Smalkaia pliska kum wahbi sakaia",
        modoOscuro: "Param ra apia ba"
      },
  
  // ---Garífuna---//
  gn: {
     ...textosBase,
        lema: "2025: Aranseruni Badi (Barañu) Furendei Lanu",
        idiomaLabel: "Aranu",
        generarQR: "QR Hóu lára lun líhigi mepu",
        labelBusqueda: "Dan líchiga ámu / Dan líchiga límu",
        placeholderBusqueda: "Fóuya ñí o Númaru",
        seleccionarDestino: "Tásahani Pabellón ó Límu",
        seleccionarAula: "Tásahani Áula (ítima láu)",
        modoOscuro: "Húngua Móodu" 
      },

  // ---Náhuatl-- //
  nl: { 
     ...textosBase,
        lema: "2025: Kuali Tlahkwahwahtilistli iwan Tlamachtilistli pampa kintlahtlaniskeh",
        idiomaLabel: "Tlahtolli / Tlahtolmatiliztli",
        generarQR: "Xikchiwa QR iwan xiktlalnamaka Tlaltikpak",
        labelBusqueda: "Xiktemo Tlali / Xiktemo Tlahkwatl",
        placeholderBusqueda: "Xikihkuilo itoka o itlapowalli",
        seleccionarDestino: "Xiktlahtla Pabellón o Tlali",
        seleccionarAula: "Xiktlahtla Tlachantli (intla mochiwa)",
        modoOscuro: "Tlayohtli Tentli"
      },

  // ---Inglés-- //
  en: { 
        ...textosBase, 
        lema: "2025: Efficiency and Quality for Continued Success",
        idiomaLabel: "Language",
        generarQR: "Generate QR and Show Map",
        labelBusqueda: "Search Location / Find a Place",
        placeholderBusqueda: "Enter Name or Number",
        seleccionarDestino: "Select Building Number or Loaction",
        seleccionarAula: "Select Classroom (just if it applicable)",
        modoOscuro: "Dark Mode"
      },

  // --Mayagna--//
  ma: { 
        ...textosBase, 
        lema: "2025: Pain Dîka Bilara Warkras Kulwa Kidia La Yamwi",
        idiomaLabel: "Tî / Yamna",
        generarQR: "QR Sawnî Balanî / Patni Balanî Wipnis",
        labelBusqueda: "Patni Tûnis",
        placeholderBusqueda: "Nâsa O Nampa Kûnis",
        seleccionarDestino: "Pabellón O Patni Talanis",
        seleccionarAula: "Klas Wawalnî Talanis (Bamna Sa Kidî)",
        modoOscuro: "Dawkî Warkranî Lani"
    }
};