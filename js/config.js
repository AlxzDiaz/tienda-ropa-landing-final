/* ==========================================================
   CONFIGURACIÓN DE LA TIENDA
   Todo lo que cambia de un cliente a otro está en este archivo.
   No hace falta tocar main.js para personalizar la página.
   ========================================================== */

// Fotos de Unsplash (licencia gratuita, uso comercial permitido).
// Para un cliente real: reemplaza por sus fotos, p. ej. "images/ropa/vestido-camisero.webp"
// Las prendas usan formato vertical 3:4 (600 × 800 px).
const foto = (id, w = 600, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? "&h=" + h : ""}&q=70`;

const CONFIG = {
  nombre: "Wayra Studio",
  eslogan: "Moda fresca · Puerto Maldonado",

  // WhatsApp: código de país + número, sin "+", espacios ni guiones
  whatsapp: "51999999999",
  telefono: "+51 999 999 999",
  instagram: "@wayrastudio",
  hashtag: "#WayraLook",

  // Prenda que aparece en la tarjeta flotante de la portada (id de un producto)
  destacadoPortada: "vestido-camisero",

  // Probador virtual: combina una prenda de arriba con una de abajo (id de categorías)
  probador: { descuento: 10, arriba: ["blusas"], abajo: ["pantalones"] },

  // Fotos de la portada: van cambiando solas con un zoom suave
  portada: [
    { imagen: foto("1767396858128-85b1262a7677", 1100, 1400), alt: "Mujer sonriente con vestido claro entre palmeras", pie: "Lino al atardecer" },
    { imagen: foto("1777545151770-000221c89fde", 1100, 1400), alt: "Mujer con conjunto blanco entre hojas de monstera", pie: "Blanco que respira" },
    { imagen: foto("1729287568453-b0f5bad73983", 1100, 1400), alt: "Mujer con sombrero y camisa estampada entre palmeras", pie: "Estampados de la selva" },
  ],

  // Estilista virtual de la portada: la clienta elige la ocasión y ve un outfit sugerido
  ocasiones: [
    { id: "trabajo", nombre: "Trabajo", icono: "ph-briefcase", texto: "Fresco y formal, para aguantar el calor de la oficina.",
      prendas: [{ producto: "blusa-calada", color: "Blanco" }, { producto: "pantalon-lino", color: "Castaña" }, { producto: "mini-bolso", color: "Achiote" }] },
    { id: "paseo", nombre: "Paseo", icono: "ph-sun", texto: "Color y tela fluida para caminar por el malecón.",
      prendas: [{ producto: "blusa-palmeras", color: "Verde palma" }, { producto: "palazzo-tropical", color: "Hojas" }, { producto: "mini-bolso", color: "Mango" }] },
    { id: "fiesta", nombre: "Fiesta", icono: "ph-champagne", texto: "Estampado de selva, brillo dorado y un toque de rojo.",
      prendas: [{ producto: "maxi-floral", color: "Floral" }, { producto: "sandalias-tiras", color: "Dorado" }, { producto: "mini-bolso", color: "Achiote" }] },
    { id: "finde", nombre: "Fin de semana", icono: "ph-tree-palm", texto: "Lino verde selva para la feria o el almuerzo familiar.",
      prendas: [{ producto: "vestido-yute", color: "Selva" }, { producto: "sandalias-tiras", color: "Dorado" }, { producto: "mini-bolso", color: "Mango" }] },
  ],

  // Empaque de regalo opcional en la bolsa (costo en soles). null = sin opción de regalo.
  regalo: { costo: 6 },

  direccion: "Jr. Loreto 245, frente a la Plaza de Armas",
  ciudad: "Puerto Maldonado",
  region: "Madre de Dios",
  // En Google Maps: clic derecho sobre el local → copiar coordenadas
  ubicacion: { lat: -12.5933, lng: -69.1891 },

  // Deja una red en "" para ocultarla
  redes: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
  },

  // Mensajes de la barra superior (rotan cada pocos segundos). [] = se oculta.
  anuncios: [
    "Envío gratis en Puerto Maldonado desde S/ 150",
    "Enviamos a todo el Perú por Shalom y Olva",
    "Primera compra: 10% de descuento con el código WAYRA10",
  ],

  // Usa los datos REALES del perfil de Google del cliente
  rating: { valor: 4.9, total: 214, fuente: "Google" },

  // Envíos. "corte": hora límite para que el delivery local llegue el mismo día.
  envios: {
    local: { costo: 8, gratisDesde: 150, tiempo: "el mismo día", corte: "16:00" },
    provincia: { costo: 15, gratisDesde: 300, tiempo: "2 a 4 días", agencias: ["Shalom", "Olva Courier"] },
  },
  pagos: ["Yape", "Plin", "Transferencia", "Tarjeta", "Efectivo"],
  cambiosDias: 7,

  // Cupón que el cliente puede escribir en la bolsa. null = sin cupón.
  cupon: { codigo: "WAYRA10", porcentaje: 10, texto: "10% en tu primera compra" },

  // Oferta con cuenta regresiva. Al pasar la fecha, la sección se oculta sola. null = sin oferta.
  promo: {
    titulo: "Sale de temporada",
    texto: "Hasta 25% de descuento en vestidos, blusas y faldas seleccionadas. Cuando se acaban las tallas, no volvemos a traerlas.",
    fin: "2026-10-12T23:59:00-05:00",
    imagen: foto("1789111161016-795db6925e99", 700, 900),
  },

  // Números que generan confianza (se animan al aparecer)
  logros: [
    { valor: 6, sufijo: "", texto: "años vistiendo Maldonado" },
    { valor: 9, sufijo: "k", texto: "prendas vendidas" },
    { valor: 4.9, sufijo: "★", texto: "en Google", decimales: 1 },
  ],

  // dias: 0 = domingo, 1 = lunes … 6 = sábado. Horas en formato 24 h.
  horarios: [
    { etiqueta: "Lunes a sábado", dias: [1, 2, 3, 4, 5, 6], abre: "09:30", cierra: "21:00" },
    { etiqueta: "Domingo", dias: [0], abre: "10:00", cierra: "14:00" },
  ],

  // Frases de la cinta que se desplaza
  cinta: ["Lino que respira", "Estampados de la selva", "Tallas S a XL", "Cambios en 7 días", "Envíos a todo el Perú", "Hecho para el calor"],

  // corto: nombre opcional para el botón de filtro (si el nombre es largo)
  categorias: [
    { id: "vestidos", nombre: "Vestidos", icono: "ph-dress", imagen: foto("1789110853872-f416085557fa", 500, 640) },
    { id: "blusas", nombre: "Blusas", icono: "ph-t-shirt", imagen: foto("1789110854879-2c7b50ecb37f", 500, 640) },
    { id: "pantalones", nombre: "Pantalones y faldas", corto: "Pantalones", icono: "ph-pants", imagen: foto("1789110520143-9f54f069b43f", 500, 640) },
    { id: "conjuntos", nombre: "Conjuntos", icono: "ph-coat-hanger", imagen: foto("1789110519547-5c912778f10c", 500, 640) },
    { id: "accesorios", nombre: "Bolsos y sandalias", corto: "Accesorios", icono: "ph-handbag", imagen: foto("1789110854914-000c8af68b3a", 500, 640) },
  ],

  // Guía de tallas (medidas en cm)
  guiaTallas: {
    columnas: ["Talla", "Busto", "Cintura", "Cadera"],
    filas: [
      ["S", "84–88", "66–70", "90–94"],
      ["M", "89–93", "71–75", "95–99"],
      ["L", "94–99", "76–81", "100–105"],
      ["XL", "100–106", "82–88", "106–112"],
    ],
    consejo: "¿Estás entre dos tallas? En lino elige la mayor: es una tela que no estira.",
  },

  /* Prendas
     - id: único y sin espacios (se usa para guardar la bolsa)
     - colores: cada color con sus fotos (la primera es la principal; la segunda aparece al pasar el mouse)
     - tallas: unidades disponibles por talla. 0 = agotada. 1 o 2 = muestra "Quedan 2".
     - precioAntes: precio tachado (opcional). nuevo / etiqueta: insignias (opcional). */
  productos: [
    { id: "vestido-camisero", categoria: "vestidos", nombre: "Vestido camisero", precio: 119, etiqueta: "Más vendido",
      descripcion: "Corte recto con botones al frente, cinturón del mismo tono y bolsillos. Se ve elegante y se siente como una camisa vieja.",
      material: "55% lino, 45% algodón",
      colores: [{ nombre: "Terracota", hex: "#C0573A", imagenes: [foto("1789110853872-f416085557fa"), foto("1789110853833-bc1a883da2d6")] }],
      tallas: { S: 4, M: 2, L: 5, XL: 0 } },

    { id: "vestido-yute", categoria: "vestidos", nombre: "Vestido con cinturón de yute", precio: 129, nuevo: true,
      descripcion: "Lino ligero, escote redondo y cinturón trenzado de yute natural. Va del trabajo a la feria sin cambiarte.",
      material: "100% lino",
      colores: [
        { nombre: "Arena", hex: "#E9E1D2", imagenes: [foto("1789110520302-3df8ce0410f0")] },
        { nombre: "Selva", hex: "#66704F", imagenes: [foto("1789110853844-d1a86b2c5b9b")] },
      ],
      tallas: { S: 3, M: 6, L: 4, XL: 2 } },

    { id: "vestido-botones", categoria: "vestidos", nombre: "Vestido de botones", precio: 109, precioAntes: 139,
      descripcion: "Sin mangas, con botones de coco y lazo en la cintura. El color del mango maduro, para que no pases desapercibida.",
      material: "Algodón y viscosa",
      colores: [{ nombre: "Mango", hex: "#E3A51E", imagenes: [foto("1789111161016-795db6925e99"), foto("1789111161022-1970ba92f3b9")] }],
      tallas: { S: 2, M: 3, L: 1, XL: 0 } },

    { id: "vestido-bordado", categoria: "vestidos", nombre: "Vestido bordado", precio: 135,
      descripcion: "Algodón calado con mangas de vuelo y cintura elástica. Fresco, femenino y perfecto para fotos.",
      material: "100% algodón",
      colores: [{ nombre: "Blanco", hex: "#F7F5F0", imagenes: [foto("1789110854264-0512e2a4bcd7")] }],
      tallas: { S: 3, M: 4, L: 2, XL: 1 } },

    { id: "maxi-floral", categoria: "vestidos", nombre: "Maxi vestido floral", precio: 149, nuevo: true,
      descripcion: "Largo, con hombros descubiertos y mangas acampanadas. Estampado de flores de la selva sobre fondo azul.",
      material: "Viscosa",
      colores: [{ nombre: "Floral", hex: "#3E7F78", imagenes: [foto("1789110854664-85d0c8cb6573")] }],
      tallas: { S: 1, M: 2, L: 1, XL: 0 } },

    { id: "blusa-palmeras", categoria: "blusas", nombre: "Blusa palmeras", precio: 69, nuevo: true,
      descripcion: "Tirantes regulables y frunce elástico en la espalda. Estampado de hojas de palmera.",
      material: "Algodón",
      colores: [{ nombre: "Verde palma", hex: "#5C7A4E", imagenes: [foto("1789110854879-2c7b50ecb37f")] }],
      tallas: { S: 5, M: 5, L: 3, XL: 2 } },

    { id: "blusa-calada", categoria: "blusas", nombre: "Blusa calada", precio: 75,
      descripcion: "Algodón bordado con mangas de volante. Combina con todo: jean, falda o palazzo.",
      material: "100% algodón",
      colores: [{ nombre: "Blanco", hex: "#F7F5F0", imagenes: [foto("1789110854285-8e8a56b05fc9")] }],
      tallas: { S: 4, M: 3, L: 0, XL: 2 } },

    { id: "blusa-flores", categoria: "blusas", nombre: "Blusa flor de achiote", precio: 59, precioAntes: 79,
      descripcion: "Con botones y nudo al frente. Rojo achiote con florcitas blancas.",
      material: "Viscosa",
      colores: [{ nombre: "Achiote", hex: "#C2322E", imagenes: [foto("1789110521592-044c58391f7f")] }],
      tallas: { S: 2, M: 4, L: 3, XL: 0 } },

    { id: "pantalon-lino", categoria: "pantalones", nombre: "Pantalón de lino", precio: 99, etiqueta: "Más vendido",
      descripcion: "Tiro alto, pierna recta y pretina con cordón. El pantalón que vas a querer en tres colores.",
      material: "100% lino",
      colores: [
        { nombre: "Mostaza", hex: "#D9A21B", imagenes: [foto("1789110520143-9f54f069b43f")] },
        { nombre: "Castaña", hex: "#6B4E3A", imagenes: [foto("1789110520148-bb52ba37759b")] },
        { nombre: "Achiote", hex: "#C2402F", imagenes: [foto("1789110854331-6d3cabfef781"), foto("1789110854823-381c81e48b4b")] },
      ],
      tallas: { S: 6, M: 8, L: 5, XL: 3 } },

    { id: "palazzo-tropical", categoria: "pantalones", nombre: "Palazzo tropical", precio: 109, nuevo: true,
      descripcion: "Pierna ancha y tela fluida que se mueve contigo. Estampado de hojas tropicales.",
      material: "Viscosa",
      colores: [
        { nombre: "Hojas", hex: "#D9A441", imagenes: [foto("1789110520500-de902eeb2b16")] },
        { nombre: "Palma roja", hex: "#C9604F", imagenes: [foto("1789110520665-f07353f0afbe")] },
      ],
      tallas: { S: 3, M: 4, L: 2, XL: 1 } },

    { id: "falda-lunares", categoria: "pantalones", nombre: "Falda midi de lunares", precio: 79, precioAntes: 105,
      descripcion: "Botones al frente y abertura que deja caminar. Rojo vino con lunares blancos.",
      material: "Viscosa",
      colores: [{ nombre: "Vino", hex: "#8E2230", imagenes: [foto("1789110520324-9e4d30ad899b"), foto("1789110519584-ce21260be4e6")] }],
      tallas: { S: 2, M: 3, L: 2, XL: 0 } },

    { id: "enterizo-oliva", categoria: "conjuntos", nombre: "Enterizo de tirantes", precio: 129,
      descripcion: "Una sola pieza y listo. Pierna recta y escote cuadrado.",
      material: "Lino y algodón",
      colores: [{ nombre: "Oliva", hex: "#4F5537", imagenes: [foto("1789110519915-7548f7e2c0d8")] }],
      tallas: { S: 2, M: 3, L: 3, XL: 1 } },

    { id: "conjunto-salvia", categoria: "conjuntos", nombre: "Conjunto túnica y pantalón", precio: 139,
      descripcion: "Túnica larga con abertura lateral y pantalón a juego. Cómodo como pijama, elegante como sastre.",
      material: "100% lino",
      colores: [{ nombre: "Salvia", hex: "#8FA07E", imagenes: [foto("1789110519547-5c912778f10c")] }],
      tallas: { S: 3, M: 2, L: 4, XL: 2 } },

    { id: "mini-bolso", categoria: "accesorios", nombre: "Mini bolso", precio: 79,
      descripcion: "Pequeño pero entra todo: celular, llaves y labial. Con correa larga desmontable.",
      material: "Cuero sintético",
      colores: [
        { nombre: "Achiote", hex: "#C2322E", imagenes: [foto("1789110855208-f346356650df")] },
        { nombre: "Mango", hex: "#E3B21E", imagenes: [foto("1789110854914-000c8af68b3a")] },
      ],
      tallas: { "Única": 8 } },

    { id: "sandalias-tiras", categoria: "accesorios", nombre: "Sandalias de tiras", precio: 119,
      descripcion: "Taco de 9 cm con plantilla acolchada. Para la noche o el matrimonio del fin de semana.",
      material: "Cuero sintético",
      colores: [
        { nombre: "Dorado", hex: "#C9A452", imagenes: [foto("1789110519533-a8b183a458ce")] },
        { nombre: "Noche", hex: "#1D1A1A", imagenes: [foto("1789110519528-7b20c28b64d4")] },
      ],
      tallas: { "35": 1, "36": 3, "37": 4, "38": 2, "39": 0 } },
  ],

  // Looks armados: se agregan a la bolsa como un solo artículo con descuento
  looks: [
    { id: "look-malecon", nombre: "Tarde en el malecón", descuento: 10,
      descripcion: "Fresco, con color y listo para caminar junto al río Madre de Dios al atardecer.",
      piezas: [
        { producto: "blusa-palmeras", color: "Verde palma" },
        { producto: "pantalon-lino", color: "Mostaza" },
        { producto: "mini-bolso", color: "Mango" },
      ] },
    { id: "look-noche", nombre: "Noche de fiesta", descuento: 10,
      descripcion: "Lino blanco, brillo dorado y un toque de rojo. Infalible para un cumpleaños o una cena.",
      piezas: [
        { producto: "vestido-yute", color: "Arena" },
        { producto: "sandalias-tiras", color: "Dorado" },
        { producto: "mini-bolso", color: "Achiote" },
      ] },
  ],

  // Fotos para la sección de comunidad (Instagram)
  comunidad: [
    { imagen: foto("1777545151770-000221c89fde", 600, 600), alt: "Clienta con conjunto blanco entre hojas de monstera" },
    { imagen: foto("1729287568453-b0f5bad73983", 600, 600), alt: "Clienta con sombrero y camisa estampada entre palmeras" },
    { imagen: foto("1788562767053-6d185dad6e2e", 600, 600), alt: "Retrato con top marrón de cuello halter" },
    { imagen: foto("1769107805412-90d9191d53e9", 600, 600), alt: "Repisa de la tienda con prendas de lino colgadas" },
    { imagen: foto("1767451629607-d368381d1e4c", 600, 600), alt: "Clienta con conjunto estampado sentada junto a palmeras" },
    { imagen: foto("1566446687891-0bad218d0cbe", 600, 600), alt: "Clienta con vestido blanco caminando por un sendero tropical" },
  ],

  // Usa reseñas REALES del cliente (copiadas de Google o Facebook)
  testimonios: [
    { nombre: "Rosa M.", fuente: "Google", estrellas: 5, compra: "Vestido camisero · talla M",
      texto: "Me asesoraron por WhatsApp con la talla y me quedó perfecto. El lino es fresquito, ideal para el calor de Maldonado." },
    { nombre: "Daniela P.", fuente: "Facebook", estrellas: 5, compra: "Palazzo tropical · talla S",
      texto: "Pedí desde Cusco y llegó por Shalom en dos días, bien empacado. Ya voy por mi segundo palazzo." },
    { nombre: "Kelly V.", fuente: "Google", estrellas: 5, compra: "Look Tarde en el malecón",
      texto: "Compré el look completo y me salió más barato que por separado. Todas me preguntan dónde lo compré." },
    { nombre: "Milagros T.", fuente: "Google", estrellas: 4, compra: "Blusa calada · talla L",
      texto: "Bonita calidad y muy buena atención en la tienda. Me cambiaron la talla al día siguiente sin problema." },
  ],

  preguntas: [
    { p: "¿Cómo sé cuál es mi talla?",
      r: "Revisa la guía de tallas que aparece en cada prenda. Si tienes dudas, escríbenos por WhatsApp con tu talla de siempre y tus medidas y te recomendamos la ideal." },
    { p: "¿Puedo cambiar una prenda?",
      r: "Sí. Tienes 7 días desde que la recibes para cambiarla por otra talla o modelo. Debe estar sin usar y con su etiqueta. Las prendas en oferta también se cambian." },
    { p: "¿Hacen envíos a otras ciudades?",
      r: "Sí, a todo el Perú por Shalom u Olva Courier. Llega en 2 a 4 días y lo recoges en la agencia con tu DNI. El envío es gratis en compras desde S/ 300." },
    { p: "¿Cómo pago?",
      r: "Con Yape, Plin, transferencia o tarjeta. En la tienda también aceptamos efectivo. Te enviamos los datos de pago por WhatsApp cuando confirmamos tu pedido." },
    { p: "¿Puedo separar una prenda?",
      r: "Sí, con un adelanto de S/ 20 te la guardamos hasta 3 días. Escríbenos por WhatsApp con la prenda, el color y la talla." },
  ],
};
