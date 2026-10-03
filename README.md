# Landing de tienda de ropa · versión boutique

> Esta es la versión elaborada del demo. La versión simple está en el repositorio [tienda-ropa-landing](https://github.com/AlxzDiaz/tienda-ropa-landing).

Página para tiendas de ropa y boutiques que venden por WhatsApp desde el celular. Es la evolución de la landing del restaurante ([GUIA-LANDINGS.md](../restaurante-landing/GUIA-LANDINGS.md)), adaptada al rubro de moda.

Usa HTML, CSS y JavaScript, sin build. Solo hay que subir la carpeta.

```
tienda-ropa-landing-boutique/
├── index.html          estructura + SEO + fotos de portada y de "Nosotros"
├── css/styles.css      estilos (paleta en :root, arriba del archivo)
├── js/config.js        ← DATOS DE LA TIENDA: casi todo se cambia aquí
├── js/main.js          lógica (no hace falta tocarlo)
└── images/
    ├── logo.svg        emblema (colgador + hoja)
    ├── favicon.svg
    └── ropa/ …         ilustraciones de respaldo por categoría (se ven si una foto no carga)
```

## Qué tiene de nuevo frente al restaurante

| Restaurante | Tienda de ropa |
|---|---|
| Botón "Agregar" directo | **Vista rápida** de cada prenda: galería, colores, tallas, cantidad, material y cuidado |
| Un solo producto por plato | **Variantes de color** con sus propias fotos (también se cambian desde la tarjeta) |
| — | **Tallas con stock**: las agotadas aparecen tachadas y las que tienen 1–2 unidades dicen "Quedan 2" |
| — | **Guía de tallas** con medidas y botón para enviar tus medidas por WhatsApp |
| — | **Favoritos** con corazón (se guardan en el navegador y tienen su propio filtro) |
| Filtros por categoría | Filtros + **ordenar** por precio o novedades + filtro de **ofertas** |
| Combo del día | **Oferta con cuenta regresiva** que se oculta sola al terminar |
| — | **Looks armados**: 3 prendas juntas con descuento; se elige la talla de cada una |
| — | **Probador virtual**: un espejo en forma de arco donde combinas una blusa con un pantalón (flechas o deslizando el dedo), botón "Sorpréndeme" y outfit con 10% de descuento |
| — | **Tarjeta de la prenda destacada** en la portada: se toca y abre la prenda (`destacadoPortada` en config) |
| — | **Cupón de descuento** (no se suma a ofertas ni a looks) |
| Delivery o recojo | Delivery local, **envío a provincia** (ciudad, agencia y DNI) o recojo en tienda |
| Aviso "agrega S/ X más" | **Barra de progreso** hacia el envío gratis |
| — | "Pide antes de las 4 p. m. y **te llega hoy**", calculado con la hora de Perú |
| — | **Compartir prenda**: enlace directo `index.html#prenda-pantalon-lino` |
| Una frase en el anuncio | Anuncios que **rotan** |
| — | **Preguntas frecuentes** (cambios, tallas, envíos, pagos, separar prendas) |
| — | Sección de **comunidad** de Instagram con hashtag |
| Reseñas | Reseñas que indican **qué compró la clienta y en qué talla** |

**Librerías (por CDN):** [Phosphor Icons](https://phosphoricons.com), [AOS](https://michalsnik.github.io/aos/) y Google Fonts (**Bodoni Moda** para títulos, estilo revista de moda, y **Manrope** para el texto).

**Paleta "Esmeralda & Rubor" (boutique tropical):** esmeralda `#0E2A24` (header, footer y probador), frambuesa `#B23A5E` (botones, texto blanco 5.7:1), champaña `#D9B77E` (acentos, texto oscuro), menta `#A8C5B5` y fondos marfil `#FBF7F4` y rubor `#F6E6E3`. Todos los pares de texto pasan el contraste 4.5:1. Es distinta a propósito de las otras demos (restaurante, hostal y hotel).

**Detalle botánico:** hojas de monstera en línea dorada (`images/hojas.svg`) detrás de la portada y en el probador.

## Personalizar para un cliente

1. **`js/config.js`:**
   - **Datos básicos:** nombre, eslogan, WhatsApp (`51` + número, sin espacios), dirección, coordenadas, Instagram y hashtag.
   - **Ventas:** anuncios, calificación de Google, envíos (costos, montos para envío gratis y hora de corte), medios de pago, días para cambios, cupón y oferta con fecha de fin.
   - **Catálogo:** categorías, guía de tallas, productos (colores con fotos y stock por talla), looks, prenda destacada de la portada y categorías que usa el probador.
   - **Confianza:** logros, reseñas, fotos de la comunidad y preguntas frecuentes.
2. **`index.html`:** cambia el `<title>`, la `meta description`, la `og:image`, las dos fotos del hero, la foto y la historia de "Nosotros", y el título de la oferta.
3. **Logo:** reemplaza `images/logo.svg` y `favicon.svg`.
4. **Colores:** edita las variables de `:root` en `css/styles.css`.

### Cómo cargar una prenda

```js
{ id: "pantalon-lino", categoria: "pantalones", nombre: "Pantalón de lino", precio: 99,
  precioAntes: 129,        // opcional: precio tachado + insignia "-23%"
  nuevo: true,             // opcional: insignia "Nuevo"
  etiqueta: "Más vendido", // opcional
  descripcion: "…", material: "100% lino",
  colores: [
    { nombre: "Mostaza", hex: "#D9A21B", imagenes: ["images/ropa/pantalon-mostaza.webp", "images/ropa/pantalon-mostaza-2.webp"] },
    { nombre: "Castaña", hex: "#6B4E3A", imagenes: ["images/ropa/pantalon-castana.webp"] },
  ],
  tallas: { S: 6, M: 8, L: 5, XL: 0 } },   // 0 = agotada · 1 o 2 = "Quedan 2"
```

- El `id` no debe tener espacios y no conviene cambiarlo después: con él se guardan la bolsa y los favoritos.
- Para bolsos y accesorios usa `tallas: { "Única": 8 }`.
- **Actualiza el stock** cuando se agote una talla: así nadie pide algo que no hay.

### Fotos

- Las fotos de ejemplo son de [Unsplash](https://unsplash.com) (licencia gratuita, uso comercial permitido) y se cargan desde su CDN.
- Para un cliente real, lo ideal es **fondo blanco o liso, la misma luz y el mismo encuadre** en todas las prendas. Así el catálogo se ve profesional aunque las fotos sean de celular.
- Formato vertical **3:4 (600 × 800 px)** en **WebP** de menos de 120 KB. Comprímelas en [squoosh.app](https://squoosh.app).
- La segunda foto de cada color aparece al pasar el mouse por la tarjeta (espalda, detalle o con la prenda puesta).
- **Para el probador** usa fotos de cuerpo entero sobre fondo liso: la mitad de arriba del espejo muestra la blusa y la de abajo el pantalón.
- En celular el catálogo descarga las fotos en tamaño reducido (360 px) gracias a `srcset`.

### Datos que deben ser reales

La calificación, el número de reseñas, los logros, las reseñas, el stock y la fecha de la oferta son **de ejemplo**. Con un cliente real usa solo sus datos. Una cuenta regresiva falsa o un "Quedan 2" inventado es engañoso: si se descubre, la clienta deja de confiar en la tienda.

## Cómo llega el pedido

```
Hola Wayra Studio 👋, quiero hacer este pedido:

• 2 x Pantalón de lino — Achiote · Talla M — S/ 198.00
• 1 x Look Tarde en el malecón — Blusa palmeras Verde palma (M) + Pantalón de lino Mostaza (S) + Mini bolso Mango (Única) — S/ 222.00

Subtotal: S/ 420.00
Cupón WAYRA10 (-10%): -S/ 19.80
Envío: Gratis
*Total: S/ 400.20*

👤 Nombre: Ana Torres
🚚 Entrega: Envío a provincia por Shalom
📍 Destino: Cusco
🪪 DNI: 45678912
💳 Pago: Yape
📝 Notas: Para regalo
```

La bolsa, los favoritos y el cupón se guardan en el navegador de la clienta: si cierra la página y vuelve, los sigue teniendo.

## Probar en tu computadora

Abre una terminal en la carpeta y ejecuta:

```bash
python -m http.server 8000
```

Luego entra a `http://localhost:8000`.

## Publicar en Netlify (gratis)

1. Entra a [app.netlify.com/drop](https://app.netlify.com/drop) y arrastra la carpeta.
2. En *Site settings → Change site name* ponle un nombre como `wayra-studio.netlify.app`.
3. Opcional: conecta un dominio `.pe` o `.com`.

Después de publicar, agrega la URL en el **Google Business Profile**, la bio de Instagram y TikTok, y en un QR para el mostrador y las bolsas.

## Checklist antes de entregar

- [ ] Se ve bien en un celular real
- [ ] "Enviar pedido" abre WhatsApp con el número correcto y el mensaje completo
- [ ] Los precios, colores y el stock por talla son los reales
- [ ] La guía de tallas tiene las medidas de la tienda
- [ ] Los costos de envío, la hora de corte y los montos para envío gratis son los del cliente
- [ ] El cupón existe de verdad y la tienda sabe que no aplica a ofertas ni a looks
- [ ] La fecha de fin de la oferta es real
- [ ] Las fotos son de la tienda (o al menos coinciden con sus prendas)
- [ ] La calificación, las reseñas y los logros son reales
- [ ] El "Tienda abierta" coincide con el horario real
- [ ] Título, descripción, logo y redes sociales son los del cliente
