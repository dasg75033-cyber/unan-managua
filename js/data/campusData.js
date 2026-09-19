/**
 * Fuente única de verdad (Single Source of Truth) para todos los destinos del campus UNAN Managua.
 * Contiene coordenadas verificadas, categorías, códigos oficiales, alias de búsqueda y traducciones en 6 idiomas.
 */
export const CAMPUS_DATA = [
  {
    id: "BIB_CENTRAL",
    code: "BC",
    category: "library",
    coords: "12.107808810323178, -86.2708299826929",
    aliases: ["biblioteca", "central", "libros", "estudio", "library", "buk", "tlahtolamoxtli"],
    translations: {
      es: "Biblioteca Central",
      mi: "Buk pliska",
      cab: "Agúrugu Wéyu Húndan",
      nah: "Tlahtolamoxtli Kalpolli Yeyantli",
      yan: "Buk Wawalnî Dî Ka Tara",
      en: "Main Library"
    },
    aulas: []
  },
  {
    id: "PAB_23",
    code: "23",
    category: "pavilion",
    coords: "12.106943158957009, -86.27347516644704",
    aliases: ["23", "pabellon 23", "pabellón 23", "edificio 23", "building 23"],
    translations: {
      es: "Pabellón 23",
      mi: "Rumka watla 23",
      cab: "Pabellón Úriñi Bísibiti (23 Wéyu Húndan)",
      nah: "Pabellón Ompowalli Ome (23)",
      yan: "Pabellón Wanta Pîtni 23",
      en: "Pavilion 23"
    },
    aulas: [
      {
        id: "LAB_MAQUINAS",
        code: "LM-23",
        coords: "12.107006645306395, -86.27350390620063",
        aliases: ["maquinas", "máquinas", "taller", "mecanica", "machinery", "motors", "laboratorio maquinas"],
        translations: {
          es: "Laboratorio de Máquinas",
          mi: "Wark misinka nani watla",
          cab: "Mákinarü Tarábahu Límu",
          nah: "Tlahkwahwahtli Tlatlamantli Yeyantli",
          yan: "Makîn Dî Ka Warkranî Pliska",
          en: "Machinery Laboratory"
        }
      },
      {
        id: "LAB_REDES",
        code: "LR-23",
        coords: "12.106994156189668, -86.27343046016368",
        aliases: ["redes", "cisco", "networking", "telecomunicaciones", "internet", "computo redes"],
        translations: {
          es: "Laboratorio de Redes",
          mi: "Pasara aisaya nani pliska",
          cab: "Rédi Tarábahu Límu",
          nah: "Ketzalistli Tlatlamantli Yeyantli",
          yan: "Red Dî Ka Warkranî Pliska",
          en: "Networking Laboratory"
        }
      }
    ]
  },
  {
    id: "PAB_21",
    code: "21",
    category: "pavilion",
    coords: "12.106745414490817, -86.27330911453713",
    aliases: ["21", "pabellon 21", "pabellón 21", "edificio 21", "building 21"],
    translations: {
      es: "Pabellón 21",
      mi: "Rumka watla 21",
      cab: "Pabellón Úriñi Bísibiti (21 Wéyu Húndan)",
      nah: "Pabellón Ompowalli Ome (21)",
      yan: "Pabellón Wanta Pîtni 21",
      en: "Pavilion 21"
    },
    aulas: [
      {
        id: "LAB_BASICA_1",
        code: "LB1-21",
        coords: "12.106819308491719, -86.27335062751453",
        aliases: ["basica 1", "básica 1", "lab basica 1", "computacion 1", "basic lab 1"],
        translations: {
          es: "Laboratorio de Computación Básica 1",
          mi: "Warkka aihiwa nani pliska 1",
          cab: "Sirígua Tarábahu Límu 1",
          nah: "Tlatlamantli Yeyantli Achto 1",
          yan: "Sirpi Warkranî Pliska 1",
          en: "Basic Computing Lab 1"
        }
      },
      {
        id: "LAB_BASICA_2",
        code: "LB2-21",
        coords: "12.106688172645068, -86.27335914299708",
        aliases: ["basica 2", "básica 2", "lab basica 2", "computacion 2", "basic lab 2"],
        translations: {
          es: "Laboratorio de Computación Básica 2",
          mi: "Warkka aihiwa nani pliska 2",
          cab: "Sirígua Tarábahu Límu 2",
          nah: "Tlatlamantli Yeyantli Achto 2",
          yan: "Sirpi Warkranî Pliska 2",
          en: "Basic Computing Lab 2"
        }
      },
      {
        id: "LAB_PLC",
        code: "PLC-21",
        coords: "12.106787879084706, -86.2732643074708",
        aliases: ["plc", "automatizacion", "robotica", "control", "electronica", "plc lab"],
        translations: {
          es: "Laboratorio de Controladores Lógicos (PLC)",
          mi: "Warkka aihiwa nani pliska PLC",
          cab: "PLC Tarábahu Límu",
          nah: "PLC Tlatlamantli Yeyantli",
          yan: "PLC Warkranî Pliska",
          en: "PLC Automation Laboratory"
        }
      }
    ]
  }
];
