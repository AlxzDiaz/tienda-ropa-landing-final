/* ==========================================================
   Landing de tienda de ropa · lógica
   Lee los datos de CONFIG (js/config.js) y arma la página.
   ========================================================== */
(function () {
  "use strict";

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const redondear = (n) => Math.round(n * 100) / 100;
  const soles = (n) => "S/ " + (Number.isInteger(n) ? n : n.toFixed(2));   // para la página
  const solesExacto = (n) => "S/ " + n.toFixed(2);                          // para el mensaje
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  const estrellas = (n) => `${"★".repeat(Math.round(n))}<span class="vacia">${"★".repeat(5 - Math.round(n))}</span>`;
  const fallback = (cat) => `images/ropa/${cat}.svg`;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PRODUCTOS = new Map(CONFIG.productos.map((p) => [p.id, p]));
  const LOOKS = new Map(CONFIG.looks.map((l) => [l.id, l]));
  const CATEGORIAS = new Map(CONFIG.categorias.map((c) => [c.id, c]));
  const colorDe = (p, nombre) => p.colores.find((c) => c.nombre === nombre) || p.colores[0];
  const stockTotal = (p) => Object.values(p.tallas).reduce((a, b) => a + b, 0);
  const descuentoPct = (p) => (p.precioAntes ? Math.round((1 - p.precio / p.precioAntes) * 100) : 0);

  /* ---------- 0. Si una foto no carga, usar la ilustración de respaldo ---------- */
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && img.dataset.fallback && !img.src.endsWith(img.dataset.fallback)) img.src = img.dataset.fallback;
  }, true);
  $$("img[data-fallback]").forEach((img) => { if (img.complete && img.naturalWidth === 0 && img.src) img.src = img.dataset.fallback; });

  /* ---------- 1. Datos generales ---------- */
  $$("[data-config]").forEach((el) => { el.textContent = CONFIG[el.dataset.config]; });
  // Logo: primera palabra normal, el resto en cursiva dorada
  $$("[data-logo]").forEach((el) => {
    const [primera, ...resto] = CONFIG.nombre.split(" ");
    el.innerHTML = resto.length ? `${esc(primera)} <em>${esc(resto.join(" "))}</em>` : esc(primera);
  });

  $$("[data-wa]").forEach((a) => {
    a.href = waLink(a.dataset.wa || `Hola ${CONFIG.nombre}, quiero hacer una consulta.`);
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-red]").forEach((a) => {
    const url = CONFIG.redes[a.dataset.red];
    if (url) a.href = url; else a.remove();
  });
  $("#tel").href = "tel:" + CONFIG.telefono.replace(/\s/g, "");
  $("#anio").textContent = new Date().getFullYear();

  const direccionCompleta = `${CONFIG.direccion}, ${CONFIG.ciudad}, ${CONFIG.region}`;
  $("#direccion").textContent = direccionCompleta;
  $("#footer-direccion").textContent = direccionCompleta;
  $("#cambios-dias").textContent = CONFIG.cambiosDias;
  $("#pagos").innerHTML = CONFIG.pagos.map((p) => `<li>${esc(p)}</li>`).join("");
  $("#select-pago").innerHTML = CONFIG.pagos.map((p) => `<option>${esc(p)}</option>`).join("");
  $("#select-agencia").innerHTML = CONFIG.envios.provincia.agencias.map((a) => `<option>${esc(a)}</option>`).join("");

  // Beneficios
  $("#ben-cambios").textContent = `${CONFIG.cambiosDias} días para cambiar talla o modelo`;
  $("#ben-envios").textContent = `${CONFIG.envios.provincia.agencias.join(" y ")} · ${CONFIG.envios.provincia.tiempo}`;
  $("#ben-pagos").textContent = CONFIG.pagos.slice(0, 3).join(" · ");

  // Anuncio: varios mensajes que rotan
  const anuncios = CONFIG.anuncios || [];
  if (!anuncios.length) $("#anuncio").remove();
  else {
    const txt = $("#anuncio-txt");
    let i = 0;
    txt.textContent = anuncios[0];
    if (anuncios.length > 1 && !reduceMotion) {
      setInterval(() => {
        txt.classList.add("saliendo");
        setTimeout(() => { i = (i + 1) % anuncios.length; txt.textContent = anuncios[i]; txt.classList.remove("saliendo"); }, 350);
      }, 4500);
    }
  }

  // Calificación (hero + sección de opiniones)
  const r = CONFIG.rating;
  if (r) {
    $("#rating").innerHTML = `<span class="rating__g"><i class="ph-fill ph-google-logo" aria-hidden="true"></i></span>
      <span class="estrellas" aria-hidden="true">${"★".repeat(5)}</span><strong>${r.valor.toFixed(1)}</strong><span>· ${r.total} reseñas<span class="sr-only"> en ${esc(r.fuente)}</span></span>`;
    $("#resumen-rating").innerHTML = `<span class="num">${r.valor.toFixed(1)}</span>
      <span><span class="estrellas" role="img" aria-label="${r.valor} de 5 estrellas">${estrellas(r.valor)}</span><br><small>Basado en ${r.total} reseñas en ${esc(r.fuente)}</small></span>`;
  }

  // Cinta
  const cinta = CONFIG.cinta.map((t) => `${esc(t)} <i class="ph-fill ph-asterisk"></i>`).join(" ");
  $("#cinta").innerHTML = `<span>${cinta}</span><span>${cinta}</span>`;

  // Tarjeta flotante de la portada: la prenda destacada, se abre al tocarla
  const destacado = PRODUCTOS.get(CONFIG.destacadoPortada);
  if (destacado) {
    const t = $("#portada-destacado");
    t.dataset.abrir = destacado.id;
    t.setAttribute("aria-label", `Ver ${destacado.nombre}`);
    t.innerHTML = `<img src="${esc(destacado.colores[0].imagenes[0].replace(/w=\d+&h=\d+/, "w=120&h=160"))}" alt="" width="60" height="80">
      <span><small>${esc(destacado.etiqueta || "Nueva colección")}</small><strong>${esc(destacado.nombre)}</strong><em>${soles(destacado.precio)}</em></span>
      <i class="ph ph-arrow-up-right" aria-hidden="true"></i>`;
    t.hidden = false;
  }

  /* ---------- 2. Horarios y estado "Abierto ahora" (hora de Perú) ---------- */
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const aMinutos = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const formatoHora = (hhmm) => {
    let [h, m] = hhmm.split(":").map(Number);
    const sufijo = h >= 12 ? "p. m." : "a. m.";
    h = h % 12 || 12;
    return m === 0 ? `${h} ${sufijo}` : `${h}:${String(m).padStart(2, "0")} ${sufijo}`;
  };
  const horarioDe = (dia) => CONFIG.horarios.find((h) => h.dias.includes(dia));

  function ahoraEnLima() {
    const partes = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Lima", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date());
    const valor = (tipo) => partes.find((p) => p.type === tipo).value;
    return {
      dia: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(valor("weekday")),
      minutos: Number(valor("hour")) * 60 + Number(valor("minute")),
    };
  }

  // ¿El delivery local llega hoy? (día con atención y antes de la hora de corte)
  function llegaHoy() {
    const { dia, minutos } = ahoraEnLima();
    const hoy = horarioDe(dia);
    const corte = Math.min(aMinutos(CONFIG.envios.local.corte), hoy ? aMinutos(hoy.cierra) : 0);
    return Boolean(hoy) && minutos < corte;
  }

  function pintarHorarios() {
    const { dia, minutos } = ahoraEnLima();
    // Saludo de la portada según la hora de Puerto Maldonado
    const h = Math.floor(minutos / 60);
    const saludo = $("#saludo");
    if (saludo) saludo.innerHTML = `<span class="hb__punto" aria-hidden="true"></span>${h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches"} · ${esc(CONFIG.ciudad)} · ${formatoHora(`${h}:${String(minutos % 60).padStart(2, "0")}`)}`;
    const hoy = horarioDe(dia);
    const filas = CONFIG.horarios.map((h) => ({ h, rango: `${formatoHora(h.abre)} – ${formatoHora(h.cierra)}` }));

    $("#tabla-horarios").innerHTML = filas.map(({ h, rango }) =>
      `<tr class="${h === hoy ? "hoy" : ""}"><th scope="row">${esc(h.etiqueta)}</th><td>${rango}</td></tr>`).join("");
    $("#footer-horarios").innerHTML = filas.map(({ h, rango }) =>
      `<li><i class="ph ph-clock" aria-hidden="true"></i><span>${esc(h.etiqueta)}<br>${rango}</span></li>`).join("");
    $("#entrega-local-sub").textContent = llegaHoy() ? "Llega hoy" : "Llega mañana";
    $("#entrega-prov-sub").textContent = CONFIG.envios.provincia.tiempo;

    const estado = $("#estado");
    if (hoy && minutos >= aMinutos(hoy.abre) && minutos < aMinutos(hoy.cierra)) {
      estado.dataset.estado = "abierto";
      estado.textContent = `Tienda abierta · hasta las ${formatoHora(hoy.cierra)}`;
      return;
    }
    estado.dataset.estado = "cerrado";
    if (hoy && minutos < aMinutos(hoy.abre)) { estado.textContent = `Abrimos hoy a las ${formatoHora(hoy.abre)}`; return; }
    for (let d = 1; d <= 7; d++) {
      const sig = horarioDe((dia + d) % 7);
      if (sig) {
        estado.textContent = `Abrimos ${d === 1 ? "mañana" : "el " + DIAS[(dia + d) % 7]} a las ${formatoHora(sig.abre)}`;
        return;
      }
    }
  }
  pintarHorarios();
  setInterval(pintarHorarios, 60 * 1000);

  /* ---------- 3. Favoritos y bolsa (estado + persistencia en el navegador) ---------- */
  const CLAVE = "tienda-" + CONFIG.nombre;
  const leer = (k, def) => { try { return JSON.parse(localStorage.getItem(`${CLAVE}-${k}`)) ?? def; } catch (_) { return def; } };
  const escribir = (k, v) => { try { localStorage.setItem(`${CLAVE}-${k}`, JSON.stringify(v)); } catch (_) { /* almacenamiento no disponible */ } };

  const favs = new Set(leer("favs", []).filter((id) => PRODUCTOS.has(id)));
  // Talla que calculó la clienta en "Encuentra tu talla" (se marca en cada prenda)
  const TALLAS_GUIA = CONFIG.guiaTallas.filas.map((f) => f[0]);
  let miTalla = TALLAS_GUIA.includes(leer("talla", null)) ? leer("talla", null) : null;
  let actualizarEstilista = null;
  let cuponAplicado = CONFIG.cupon && leer("cupon", null) === CONFIG.cupon.codigo ? CONFIG.cupon.codigo : null;

  /* Cada artículo de la bolsa es:
     - una prenda: { tipo: "prenda", id, color, talla, n }
     - o un conjunto (look armado u outfit del probador):
       { tipo: "look", id, nombre, descuento, piezas: [{ producto, color, talla }], n } */
  const bolsa = new Map();
  const piezaValida = (pz) => {
    const p = PRODUCTOS.get(pz.producto);
    return p && p.colores.some((c) => c.nombre === pz.color) && p.tallas[pz.talla] > 0;
  };
  const itemValido = (it) => it.tipo === "prenda"
    ? piezaValida({ producto: it.id, color: it.color, talla: it.talla })
    : Array.isArray(it.piezas) && it.piezas.length > 0 && it.piezas.every(piezaValida);
  leer("bolsa", []).forEach(([k, it]) => { if (it && it.n > 0 && itemValido(it)) bolsa.set(k, it); });
  const guardarBolsa = () => escribir("bolsa", [...bolsa]);

  function precioConjunto(piezas, descuento) {
    const suma = piezas.reduce((t, pz) => t + PRODUCTOS.get(pz.producto).precio, 0);
    return { suma, precio: Math.round(suma * (1 - descuento / 100)) };
  }

  function infoItem(it) {
    if (it.tipo === "prenda") {
      const p = PRODUCTOS.get(it.id);
      return {
        nombre: p.nombre, precio: p.precio, cat: p.categoria,
        detalle: `${it.color} · ${it.talla === "Única" ? "Talla única" : "Talla " + it.talla}`,
        imagen: colorDe(p, it.color).imagenes[0], max: p.tallas[it.talla],
      };
    }
    const piezas = it.piezas.map((pz) => ({ ...pz, p: PRODUCTOS.get(pz.producto) }));
    return {
      nombre: it.nombre, precio: precioConjunto(it.piezas, it.descuento).precio, cat: piezas[0].p.categoria,
      detalle: piezas.map(({ p, color, talla }) => `${p.nombre} ${color} (${talla})`).join(" + "),
      imagen: colorDe(piezas[0].p, piezas[0].color).imagenes[0],
      max: Math.min(...piezas.map(({ p, talla }) => p.tallas[talla])),
    };
  }

  function agregar(clave, item, cantidad) {
    const actual = bolsa.get(clave);
    const max = infoItem(item).max;
    const n = Math.min(max, (actual ? actual.n : 0) + cantidad);
    bolsa.set(clave, { ...item, n });
    guardarBolsa();
    actualizarBolsa();
    pop($("#bolsa-btn"));
    return n;
  }
  function agregarConjunto(id, nombre, descuento, piezas) {
    const clave = `look:${id}|` + piezas.map((pz) => `${pz.producto}-${pz.color}-${pz.talla}`).join("|");
    agregar(clave, { tipo: "look", id, nombre, descuento, piezas }, 1);
  }

  function cambiar(clave, delta) {
    const it = bolsa.get(clave);
    if (!it) return;
    const n = Math.min(infoItem(it).max, it.n + delta);
    if (n > 0) it.n = n; else bolsa.delete(clave);
    guardarBolsa();
    actualizarBolsa();
  }

  const pop = (el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); };

  function alternarFav(id) {
    if (favs.has(id)) favs.delete(id); else favs.add(id);
    escribir("favs", [...favs]);
    const activo = favs.has(id);
    $$(`[data-fav="${CSS.escape(id)}"]`).forEach((b) => pintarFav(b, activo, true));
    if (pv.p && pv.p.id === id) pintarFav($("#pv-fav"), activo, true);
    actualizarFavs();
    if (activo) pop($("#favs-btn"));
    return activo;
  }
  function pintarFav(boton, activo, animar) {
    boton.setAttribute("aria-pressed", String(activo));
    boton.innerHTML = `<i class="${activo ? "ph-fill" : "ph"} ph-heart" aria-hidden="true"></i>`;
    if (animar) { boton.classList.remove("latido"); void boton.offsetWidth; boton.classList.add("latido"); }
  }
  function actualizarFavs() {
    $("#favs-n").hidden = favs.size === 0;
    $("#favs-n").textContent = favs.size;
    const n = $("#chip-favs-n");
    if (n) n.textContent = favs.size;
    if (filtro === "favoritos") aplicarFiltro();
  }

  /* ---------- 4. Categorías ---------- */
  $("#categorias-lista").innerHTML = CONFIG.categorias.map((c, i) => {
    const n = CONFIG.productos.filter((p) => p.categoria === c.id).length;
    return `<li class="categoria" data-aos="fade-up" data-aos-delay="${i * 60}">
      <button type="button" data-filtro="${c.id}">
        <img src="${esc(c.imagen)}" data-fallback="${fallback(c.id)}" alt="" loading="lazy" decoding="async" width="500" height="640">
        <span class="categoria__txt"><strong>${esc(c.nombre)}</strong><small>${n} ${n === 1 ? "prenda" : "prendas"} <i class="ph ph-arrow-right" aria-hidden="true"></i></small></span>
      </button>
    </li>`;
  }).join("");
  $("#footer-categorias").innerHTML = CONFIG.categorias.map((c) =>
    `<li><i class="ph ${c.icono}" aria-hidden="true"></i><button type="button" data-filtro="${c.id}">${esc(c.nombre)}</button></li>`).join("");

  /* ---------- 5. Colección: tarjetas, filtros y orden ---------- */
  const grid = $("#productos");
  const filtros = $("#filtros");
  let filtro = "todos";
  const hayOfertas = CONFIG.productos.some((p) => p.precioAntes);

  filtros.innerHTML = [
    { id: "todos", nombre: "Todo", icono: "ph-squares-four" },
    ...CONFIG.categorias,
    ...(hayOfertas ? [{ id: "ofertas", nombre: "Ofertas", icono: "ph-tag" }] : []),
    { id: "favoritos", nombre: "Favoritos", icono: "ph-heart" },
  ].map((c) => `<button type="button" class="chip" data-filtro-chip="${c.id}" aria-pressed="${c.id === "todos"}"><i class="ph ${c.icono}" aria-hidden="true"></i>${esc(c.corto || c.nombre)}${c.id === "favoritos" ? ' <span class="chip__n" id="chip-favs-n">0</span>' : ""}</button>`)
    .join("");

  function precioHTML(p) {
    return p.precioAntes
      ? `<div class="precio precio--oferta"><strong>${soles(p.precio)}</strong><s>${soles(p.precioAntes)}</s></div>`
      : `<div class="precio"><strong>${soles(p.precio)}</strong></div>`;
  }
  function tagsHTML(p) {
    const tags = [];
    if (stockTotal(p) === 0) tags.push('<span class="tag tag--pocas">Agotado</span>');
    if (p.precioAntes) tags.push(`<span class="tag tag--oferta">-${descuentoPct(p)}%</span>`);
    if (p.etiqueta) tags.push(`<span class="tag tag--top"><i class="ph-fill ph-star"></i>${esc(p.etiqueta)}</span>`);
    if (p.nuevo) tags.push('<span class="tag tag--nuevo">Nuevo</span>');
    if (stockTotal(p) > 0 && stockTotal(p) <= 4) tags.push('<span class="tag tag--pocas">Últimas unidades</span>');
    return tags.slice(0, 2).join("");
  }
  // Fotos de Unsplash en dos tamaños: el celular descarga la versión liviana
  const tamanos = (url) => /w=\d+&h=\d+/.test(url)
    ? ` srcset="${esc(url.replace(/w=\d+&h=\d+/, "w=360&h=480"))} 360w, ${esc(url)} 600w" sizes="(min-width: 1100px) 23vw, (min-width: 720px) 31vw, 48vw"`
    : "";
  function fotosTarjeta(p, color) {
    const [a, b] = color.imagenes;
    return `<img class="img-1${b ? " tiene-2" : ""}" src="${esc(a)}"${tamanos(a)} data-fallback="${fallback(p.categoria)}" alt="${esc(p.nombre)} color ${esc(color.nombre)}" width="600" height="800" loading="lazy" decoding="async">
      ${b ? `<img class="img-2" src="${esc(b)}"${tamanos(b)} alt="" width="600" height="800" loading="lazy" decoding="async">` : ""}`;
  }

  grid.innerHTML = CONFIG.productos.map((p, i) => `
    <li class="producto" data-id="${p.id}" data-color="0" data-aos="fade-up" data-aos-delay="${(i % 4) * 60}">
      <div class="producto__media">
        <button class="producto__abrir" type="button" data-abrir="${p.id}" aria-label="Ver ${esc(p.nombre)}: colores y tallas">
          <span class="producto__fotos">${fotosTarjeta(p, p.colores[0])}</span>
          <span class="producto__rapido" aria-hidden="true"><i class="ph ph-eye"></i>Elegir talla</span>
        </button>
        <span class="tags">${tagsHTML(p)}</span>
        <button class="fav-btn" type="button" data-fav="${p.id}" aria-pressed="false" aria-label="Guardar ${esc(p.nombre)} en favoritos"></button>
      </div>
      <div class="producto__cuerpo">
        <div class="swatches" role="group" aria-label="Colores de ${esc(p.nombre)}">
          ${p.colores.map((c, ci) => `<button type="button" class="swatch" style="--c:${c.hex}" data-color-tarjeta="${ci}" aria-pressed="${ci === 0}" aria-label="${esc(c.nombre)}" title="${esc(c.nombre)}"></button>`).join("")}
        </div>
        <span class="mi-talla" data-mi-talla hidden></span>
        <h3 class="producto__nombre">${esc(p.nombre)}</h3>
        ${precioHTML(p)}
        <button class="btn btn--add" type="button" data-abrir="${p.id}"><i class="ph ph-ruler" aria-hidden="true"></i>Elegir talla</button>
      </div>
    </li>`).join("");
  $$(".fav-btn", grid).forEach((b) => pintarFav(b, favs.has(b.dataset.fav), false));

  // Cambiar el color desde la tarjeta: muestra sus fotos
  grid.addEventListener("click", (e) => {
    const sw = e.target.closest("[data-color-tarjeta]");
    if (!sw) return;
    const li = sw.closest(".producto");
    const p = PRODUCTOS.get(li.dataset.id);
    const ci = Number(sw.dataset.colorTarjeta);
    li.dataset.color = ci;
    $$(".swatch", li).forEach((s) => s.setAttribute("aria-pressed", String(s === sw)));
    $(".producto__fotos", li).innerHTML = fotosTarjeta(p, p.colores[ci]);
  });

  // Buscador: ignora mayúsculas y tildes ("limon" encuentra "Limón")
  const normalizar = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const indiceBusqueda = new Map(CONFIG.productos.map((p) => [p.id, normalizar(
    [p.nombre, p.descripcion, p.material, CATEGORIAS.get(p.categoria)?.nombre, ...p.colores.map((c) => c.nombre)].join(" "))]));
  const coincide = (p, texto) => !texto || texto.split(/\s+/).every((w) => indiceBusqueda.get(p.id).includes(w));

  function aplicarFiltro() {
    const orden = $("#orden").value;
    const busqueda = $("#buscar").value.trim();
    const texto = normalizar(busqueda);
    const lista = CONFIG.productos.filter((p) => (
      filtro === "todos" ? true
        : filtro === "ofertas" ? Boolean(p.precioAntes)
          : filtro === "favoritos" ? favs.has(p.id)
            : p.categoria === filtro) && coincide(p, texto));
    const ordenada = [...lista];
    if (orden === "menor") ordenada.sort((a, b) => a.precio - b.precio);
    if (orden === "mayor") ordenada.sort((a, b) => b.precio - a.precio);
    if (orden === "nuevos") ordenada.sort((a, b) => Number(Boolean(b.nuevo)) - Number(Boolean(a.nuevo)));
    const posicion = new Map(ordenada.map((p, i) => [p.id, i]));

    $$(".producto", grid).forEach((li) => {
      const visible = posicion.has(li.dataset.id);
      li.hidden = !visible;
      li.style.order = visible ? posicion.get(li.dataset.id) : "";
    });
    $("#conteo").textContent = `${lista.length} ${lista.length === 1 ? "prenda" : "prendas"}`;
    $("#sin-resultados").hidden = lista.length > 0;
    $("#sin-resultados p").textContent = texto
      ? `No encontramos prendas con “${busqueda}”. Prueba con otra palabra o escríbenos.`
      : "Todavía no tienes favoritos. Toca el corazón de una prenda para guardarla aquí.";
    if (window.AOS) AOS.refresh();
  }

  // Marca en cada tarjeta si la talla de la clienta está disponible
  function pintarMiTalla() {
    $$(".producto", grid).forEach((li) => {
      const n = miTalla ? PRODUCTOS.get(li.dataset.id).tallas[miTalla] : undefined;
      const aviso = $("[data-mi-talla]", li);
      aviso.hidden = n === undefined;
      if (n === undefined) return;
      aviso.classList.toggle("mi-talla--agotada", n === 0);
      aviso.innerHTML = n > 0 ? `<i class="ph-fill ph-check-circle" aria-hidden="true"></i>Tu talla ${miTalla} disponible` : `Tu talla ${miTalla} agotada`;
    });
    $("#mi-talla-txt").textContent = miTalla ? `Tu talla: ${miTalla} · volver a calcular` : "Encuentra tu talla en 30 segundos";
    if (actualizarEstilista) actualizarEstilista();
  }

  function elegirFiltro(id, desplazar) {
    filtro = id;
    $$(".chip", filtros).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filtroChip === id)));
    const boton = $(`[data-filtro-chip="${id}"]`, filtros);
    if (boton) filtros.scrollTo({ left: boton.offsetLeft - (filtros.clientWidth - boton.offsetWidth) / 2, behavior: "smooth" });
    aplicarFiltro();
    if (desplazar) $("#coleccion").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
  filtros.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (b) elegirFiltro(b.dataset.filtroChip, false); });
  $("#orden").addEventListener("change", aplicarFiltro);
  $("#buscar").addEventListener("input", aplicarFiltro);
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-filtro]"); if (b) elegirFiltro(b.dataset.filtro, true); });
  $("#favs-btn").addEventListener("click", () => {
    elegirFiltro("favoritos", true);
    if (!favs.size) avisar("Toca el corazón de una prenda para guardarla", "ph-heart");
  });

  /* ---------- 5b. Portada boutique: fotos que cambian y estilista virtual ---------- */
  const slides = CONFIG.portada || [];
  const contSlides = $("#hb-slides");
  contSlides.innerHTML = slides.map((sl, i) =>
    `<img class="hb__slide${i === 0 ? " activa" : ""}" src="${esc(sl.imagen)}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" data-fallback="images/ropa/vestidos.svg">`).join("");
  let slideActual = 0;
  function mostrarSlide(i) {
    const imgs = $$(".hb__slide", contSlides);
    if (!imgs.length) return;
    slideActual = (i + imgs.length) % imgs.length;
    imgs.forEach((img, k) => {
      img.classList.toggle("activa", k === slideActual);
      img.alt = k === slideActual ? slides[k].alt : "";
    });
    $("#hb-num").textContent = String(slideActual + 1).padStart(2, "0");
    $("#hb-texto").textContent = slides[slideActual].pie || "";
    const barra = $("#hb-progreso");
    barra.classList.remove("corre"); void barra.offsetWidth; barra.classList.add("corre");
  }
  mostrarSlide(0);
  if (slides.length > 1 && !reduceMotion) setInterval(() => mostrarSlide(slideActual + 1), 6000);

  const ocasiones = CONFIG.ocasiones || [];
  if (!ocasiones.length) $(".estilista").remove();
  else {
    $("#ocasiones").innerHTML = ocasiones.map((o, i) =>
      `<button type="button" role="radio" class="ocasion" data-ocasion="${o.id}" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><i class="ph ${o.icono}" aria-hidden="true"></i>${esc(o.nombre)}</button>`).join("");
    const pintarOcasion = (id) => {
      const o = ocasiones.find((x) => x.id === id) || ocasiones[0];
      $$(".ocasion").forEach((b) => {
        const activa = b.dataset.ocasion === o.id;
        b.setAttribute("aria-checked", String(activa));
        b.tabIndex = activa ? 0 : -1;
      });
      const prendas = o.prendas.map((pz) => ({ ...pz, p: PRODUCTOS.get(pz.producto) })).filter((x) => x.p);
      $("#ocasion-texto").textContent = o.texto;
      $("#ocasion-prendas").innerHTML = prendas.map(({ p, color }, i) => {
        const ci = Math.max(0, p.colores.findIndex((c) => c.nombre === color));
        return `<button type="button" class="estilista__prenda" data-abrir="${p.id}" data-color-idx="${ci}" style="--retraso:${i * 70}ms" aria-label="Ver ${esc(p.nombre)} color ${esc(p.colores[ci].nombre)}">
          <img src="${esc(p.colores[ci].imagenes[0].replace(/w=\d+&h=\d+/, "w=240&h=320"))}" alt="" width="120" height="160">
          <span>${esc(p.nombre)}</span><strong>${soles(p.precio)}</strong></button>`;
      }).join("");
      const total = prendas.reduce((t, x) => t + x.p.precio, 0);
      $("#ocasion-total").innerHTML = `Look completo <strong>${soles(total)}</strong>`;
      const lista = prendas.map(({ p, color }) => `${p.nombre} (${color})`).join(", ");
      $("#ocasion-wa").href = waLink(`Hola ${CONFIG.nombre}, me interesa el look para ${o.nombre.toLowerCase()}: ${lista}.${miTalla ? ` Mi talla es ${miTalla}.` : ""} ¿Me ayudan con las tallas?`);
    };
    $("#ocasiones").addEventListener("click", (e) => { const b = e.target.closest("[data-ocasion]"); if (b) pintarOcasion(b.dataset.ocasion); });
    $("#ocasiones").addEventListener("keydown", (e) => {
      if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
      const lista = $$(".ocasion");
      const paso = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
      const sig = lista[(lista.indexOf(document.activeElement) + paso + lista.length) % lista.length];
      e.preventDefault();
      pintarOcasion(sig.dataset.ocasion);
      sig.focus();
    });
    actualizarEstilista = () => pintarOcasion($('.ocasion[aria-checked="true"]').dataset.ocasion);
    pintarOcasion(ocasiones[0].id);
  }

  /* ---------- 6. Oferta con cuenta regresiva ---------- */
  const promo = CONFIG.promo;
  const finPromo = promo ? new Date(promo.fin).getTime() : 0;
  if (!promo || !(finPromo > Date.now())) {
    $("#promo").remove();
  } else {
    const maxPct = Math.max(0, ...CONFIG.productos.map(descuentoPct));
    $("#promo-titulo").textContent = promo.titulo;
    $("#promo-texto").textContent = promo.texto;
    $("#promo-img").src = promo.imagen;
    $("#promo-img").alt = promo.titulo;
    $("#promo-max").textContent = `${maxPct}% menos`;
    $("#promo-sello").textContent = `-${maxPct}%`;
    $("#promo-ver").addEventListener("click", () => elegirFiltro(hayOfertas ? "ofertas" : "todos", true));
    if (!hayOfertas) $("#promo-ver").hidden = true;

    const unidades = Object.fromEntries($$("#cuenta [data-u]").map((el) => [el.dataset.u, el]));
    const tic = () => {
      const resta = finPromo - Date.now();
      if (resta <= 0) { $("#promo").remove(); clearInterval(timer); return; }
      const s = Math.floor(resta / 1000);
      const valores = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
      Object.entries(valores).forEach(([u, v]) => { unidades[u].textContent = String(v).padStart(2, "0"); });
    };
    const timer = setInterval(tic, 1000);
    tic();
  }

  /* ---------- 7. Vista rápida de la prenda ---------- */
  const modalPrenda = $("#modal-prenda");
  const modalGuia = $("#modal-guia");
  const pv = { p: null, color: 0, talla: null, cantidad: 1, foto: 0 };
  const CUIDADO = {
    accesorios: "Limpia con un paño húmedo y guárdalo lejos del sol directo.",
    otros: "Lava a mano o en ciclo delicado con agua fría. Seca a la sombra y plancha a temperatura media.",
  };

  function mensajeEntrega() {
    const e = CONFIG.envios;
    return llegaHoy()
      ? `Pide antes de las ${formatoHora(e.local.corte)} y te llega hoy en ${CONFIG.ciudad}.`
      : `Pide hoy y te llega mañana en ${CONFIG.ciudad}. A provincia: ${e.provincia.tiempo}.`;
  }

  function abrirPrenda(id, color = 0) {
    const p = PRODUCTOS.get(id);
    if (!p) return;
    const tallasDisponibles = Object.keys(p.tallas).filter((t) => p.tallas[t] > 0);
    Object.assign(pv, { p, color, talla: tallasDisponibles.length === 1 && Object.keys(p.tallas).length === 1 ? tallasDisponibles[0] : null, cantidad: 1, foto: 0 });
    if (!pv.talla && miTalla && p.tallas[miTalla] > 0) pv.talla = miTalla;   // preselecciona la talla calculada

    $("#pv-cat").textContent = CATEGORIAS.get(p.categoria)?.nombre || "";
    $("#pv-nombre").textContent = p.nombre;
    $("#pv-precio").innerHTML = p.precioAntes
      ? `<strong>${soles(p.precio)}</strong><s>${soles(p.precioAntes)}</s><span class="precio__ahorro">Ahorras ${soles(p.precioAntes - p.precio)}</span>`
      : `<strong>${soles(p.precio)}</strong>`;
    $("#pv-precio").classList.toggle("precio--oferta", Boolean(p.precioAntes));
    $("#pv-desc").textContent = p.descripcion;
    $("#pv-material").textContent = `${p.material}. ${p.categoria === "accesorios" ? CUIDADO.accesorios : CUIDADO.otros}`;
    $("#pv-tags").innerHTML = tagsHTML(p);
    $("#pv-entrega").innerHTML = `<i class="ph ph-truck" aria-hidden="true"></i><span>${esc(mensajeEntrega())}</span>`;
    $("#pv-error").textContent = "";
    pintarFav($("#pv-fav"), favs.has(p.id), false);
    $("#pv-fav").setAttribute("aria-label", `Guardar ${p.nombre} en favoritos`);

    $("#pv-colores").innerHTML = p.colores.map((c, ci) =>
      `<button type="button" class="swatch" role="radio" style="--c:${c.hex}" data-pv-color="${ci}" aria-label="${esc(c.nombre)}" title="${esc(c.nombre)}"></button>`).join("");

    const unaSola = Object.keys(p.tallas).length === 1;
    $("#pv-tallas").innerHTML = Object.entries(p.tallas).map(([t, n]) => `
      <button type="button" class="talla${t === miTalla ? " talla--tuya" : ""}" role="radio" data-talla="${esc(t)}" aria-checked="false" ${n === 0 ? "disabled" : ""}
        aria-label="${esc(t)}${t === miTalla ? ", tu talla" : ""}${n === 0 ? ", agotada" : n <= 2 ? `, quedan ${n}` : ""}">${esc(t)}${n > 0 && n <= 2 && !unaSola ? `<span class="talla__pocas">Quedan ${n}</span>` : ""}</button>`).join("");
    $("#pv-guia").hidden = p.categoria === "accesorios";
    pintarCompleta(p);

    pintarVista();
    if (!modalPrenda.open) modalPrenda.showModal();
    modalPrenda.querySelector(".modal__panel").scrollTop = 0;
  }

  // "Completa el look": primero las prendas que comparten look u ocasión, luego categorías que combinan
  const COMPLEMENTO = { blusas: ["pantalones"], pantalones: ["blusas"], vestidos: ["accesorios"], conjuntos: ["accesorios"], accesorios: ["vestidos", "blusas"] };
  function pintarCompleta(p) {
    const vistos = new Set([p.id]);
    const lista = [];
    const sumar = (id, color) => {
      const q = PRODUCTOS.get(id);
      if (!q || vistos.has(id) || stockTotal(q) === 0) return;
      vistos.add(id);
      lista.push({ q, ci: Math.max(0, q.colores.findIndex((c) => c.nombre === color)) });
    };
    [...CONFIG.looks.map((l) => l.piezas), ...(CONFIG.ocasiones || []).map((o) => o.prendas)]
      .filter((piezas) => piezas.some((pz) => pz.producto === p.id))
      .forEach((piezas) => piezas.forEach((pz) => sumar(pz.producto, pz.color)));
    CONFIG.productos.filter((q) => (COMPLEMENTO[p.categoria] || []).includes(q.categoria)).forEach((q) => sumar(q.id));
    const tres = lista.slice(0, 3);
    $("#pv-completa").hidden = !tres.length;
    $("#pv-completa-lista").innerHTML = tres.map(({ q, ci }) => `<button type="button" class="completa__item" data-abrir="${q.id}" data-color-idx="${ci}">
      <img src="${esc(q.colores[ci].imagenes[0].replace(/w=\d+&h=\d+/, "w=240&h=320"))}" alt="" width="120" height="160">
      <span>${esc(q.nombre)}</span><strong>${soles(q.precio)}</strong></button>`).join("");
  }

  function pintarVista() {
    const { p } = pv;
    const c = p.colores[pv.color];
    const fotos = c.imagenes;
    const img = $("#pv-img");
    img.src = fotos[pv.foto] || fotos[0];
    img.alt = `${p.nombre} color ${c.nombre}`;
    img.dataset.fallback = fallback(p.categoria);
    $("#pv-miniaturas").innerHTML = fotos.length > 1 ? fotos.map((f, i) =>
      `<button type="button" data-pv-foto="${i}" aria-label="Foto ${i + 1}" aria-current="${i === pv.foto}"><img src="${esc(f)}" alt="" loading="lazy"></button>`).join("") : "";
    $("#pv-color-nombre").textContent = c.nombre;
    $$("[data-pv-color]").forEach((b) => b.setAttribute("aria-checked", String(Number(b.dataset.pvColor) === pv.color)));
    $$(".talla", $("#pv-tallas")).forEach((b) => b.setAttribute("aria-checked", String(b.dataset.talla === pv.talla)));
    $("#pv-talla-nombre").textContent = pv.talla ? (pv.talla === "Única" ? "única" : pv.talla) : "elige una";
    $("#pv-cantidad").textContent = pv.cantidad;
    const max = pv.talla ? p.tallas[pv.talla] : 10;
    $("#pv-menos").disabled = pv.cantidad <= 1;
    $("#pv-mas").disabled = pv.cantidad >= max;
    const agotado = stockTotal(p) === 0;
    $("#pv-agregar").disabled = agotado;
    $("#pv-agregar").lastChild.textContent = agotado ? "Agotado" : "Agregar a la bolsa";
    $("#pv-preguntar").href = waLink(`Hola ${CONFIG.nombre}, ¿tienen el ${p.nombre} en color ${c.nombre}${pv.talla && pv.talla !== "Única" ? ` talla ${pv.talla}` : ""}?`);
  }

  modalPrenda.addEventListener("click", (e) => {
    const color = e.target.closest("[data-pv-color]");
    const talla = e.target.closest(".talla");
    const foto = e.target.closest("[data-pv-foto]");
    if (color) { pv.color = Number(color.dataset.pvColor); pv.foto = 0; pintarVista(); }
    if (talla && !talla.disabled) {
      pv.talla = talla.dataset.talla;
      pv.cantidad = Math.min(pv.cantidad, pv.p.tallas[pv.talla]);
      $("#pv-error").textContent = "";
      pintarVista();
    }
    if (foto) { pv.foto = Number(foto.dataset.pvFoto); pintarVista(); }
  });
  // Flechas del teclado dentro de los grupos de radio (colores y tallas)
  modalPrenda.addEventListener("keydown", (e) => {
    const actual = e.target.closest('[role="radio"]');
    if (!actual || !["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
    const grupo = $$('[role="radio"]:not(:disabled)', actual.parentElement);
    const paso = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    const sig = grupo[(grupo.indexOf(actual) + paso + grupo.length) % grupo.length];
    e.preventDefault();
    sig.click();
    sig.focus();
  });
  $("#pv-menos").addEventListener("click", () => { pv.cantidad = Math.max(1, pv.cantidad - 1); pintarVista(); });
  $("#pv-mas").addEventListener("click", () => { pv.cantidad += 1; pintarVista(); });
  $("#pv-fav").addEventListener("click", () => alternarFav(pv.p.id));
  $("#pv-guia").addEventListener("click", () => modalGuia.showModal());

  $("#pv-agregar").addEventListener("click", () => {
    const { p } = pv;
    if (!pv.talla) {
      $("#pv-error").textContent = "Elige tu talla para continuar.";
      const tallas = $("#pv-tallas");
      tallas.classList.remove("sacudir"); void tallas.offsetWidth; tallas.classList.add("sacudir");
      $(".talla:not(:disabled)", tallas)?.focus();
      return;
    }
    const color = p.colores[pv.color].nombre;
    const n = agregar(`${p.id}|${color}|${pv.talla}`, { tipo: "prenda", id: p.id, color, talla: pv.talla }, pv.cantidad);
    modalPrenda.close();
    avisar(n === p.tallas[pv.talla] && pv.cantidad > 1 ? `Agregaste las ${n} unidades disponibles` : `${p.nombre} (${pv.talla}) en tu bolsa`);
  });

  // Compartir el enlace directo a la prenda
  $("#pv-compartir").addEventListener("click", async () => {
    const url = `${location.origin}${location.pathname}#prenda-${pv.p.id}`;
    const texto = $("#pv-compartir span");
    try {
      if (navigator.share) { await navigator.share({ title: pv.p.nombre, text: `Mira este ${pv.p.nombre} de ${CONFIG.nombre}`, url }); return; }
      await navigator.clipboard.writeText(url);
      texto.textContent = "¡Enlace copiado!";
    } catch (_) {
      texto.textContent = "No se pudo copiar";
    }
    setTimeout(() => { texto.textContent = "Compartir"; }, 2000);
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-abrir]");
    if (!b) return;
    const li = b.closest(".producto");
    abrirPrenda(b.dataset.abrir, li ? Number(li.dataset.color) : Number(b.dataset.colorIdx || 0));
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-fav]");
    if (b) alternarFav(b.dataset.fav);
  });

  // Guía de tallas
  const g = CONFIG.guiaTallas;
  $("#tabla-tallas").innerHTML = `<thead><tr>${g.columnas.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead>
    <tbody>${g.filas.map(([t, ...m]) => `<tr><th scope="row">${esc(t)}</th>${m.map((v) => `<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody>`;
  $("#guia-consejo").innerHTML = `<i class="ph ph-lightbulb" aria-hidden="true"></i><span>${esc(g.consejo)}</span>`;

  // Lupa sobre la foto de la prenda (solo con mouse)
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    const marco = $(".pv__principal");
    marco.addEventListener("mousemove", (e) => {
      const r = marco.getBoundingClientRect();
      $("#pv-img").style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    });
    marco.addEventListener("mouseenter", () => marco.classList.add("zoom"));
    marco.addEventListener("mouseleave", () => marco.classList.remove("zoom"));
  }

  /* ---------- 7b. Encuentra tu talla ---------- */
  const modalTalla = $("#modal-talla");
  const formTalla = $("#form-talla");
  const resultadoTalla = $("#talla-resultado");
  const columna = (nombre) => CONFIG.guiaTallas.columnas.findIndex((c) => normalizar(c) === nombre);
  // Para cada medida busca la primera talla cuyo rango la cubre y se queda con la mayor
  function calcularTalla(medidas, ajuste) {
    let fuera = false;
    const indices = Object.entries(medidas).filter(([, v]) => v > 0).map(([k, v]) => {
      const col = columna(k);
      const i = CONFIG.guiaTallas.filas.findIndex((f) => v <= Number(String(f[col]).split(/[–-]/).pop()));
      if (i === -1) fuera = true;
      return i === -1 ? TALLAS_GUIA.length - 1 : i;
    });
    if (!indices.length) return null;
    let i = Math.max(...indices);
    if (ajuste === "ajustado" && Math.min(...indices) < i) i -= 1;
    if (ajuste === "holgado") i += 1;
    return { talla: TALLAS_GUIA[Math.min(i, TALLAS_GUIA.length - 1)], fuera };
  }
  formTalla.addEventListener("submit", (e) => {
    e.preventDefault();
    const medidas = Object.fromEntries(["busto", "cintura", "cadera"].map((k) => [k, Number(formTalla[k].value) || 0]));
    const r = calcularTalla(medidas, formTalla.ajuste.value);
    if (!r) { resultadoTalla.className = "talla-resultado error"; resultadoTalla.textContent = "Escribe al menos una medida."; return; }
    miTalla = r.talla;
    escribir("talla", miTalla);
    resultadoTalla.className = "talla-resultado ok";
    resultadoTalla.innerHTML = `Tu talla recomendada es <strong>${miTalla}</strong>. Ya la marcamos en cada prenda.${r.fuera ? " Tus medidas pasan nuestra guía: escríbenos y te ayudamos a elegir." : ""}`;
    $("#talla-borrar").hidden = false;
    pintarMiTalla();
  });
  $("#talla-borrar").addEventListener("click", () => {
    miTalla = null;
    escribir("talla", null);
    resultadoTalla.className = "talla-resultado";
    resultadoTalla.textContent = "Listo, borramos tu talla guardada.";
    $("#talla-borrar").hidden = true;
    pintarMiTalla();
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-abrir-talla]")) return;
    resultadoTalla.className = "talla-resultado";
    resultadoTalla.innerHTML = miTalla ? `Tu talla guardada es <strong>${miTalla}</strong>.` : "";
    $("#talla-borrar").hidden = !miTalla;
    modalTalla.showModal();
  });

  /* ---------- 8. Selector de talla compartido (looks y probador) ---------- */
  function selectorTalla(p) {
    const tallas = Object.entries(p.tallas);
    return `<select data-pieza="${p.id}" aria-label="Talla de ${esc(p.nombre)}">
      ${tallas.length === 1 ? "" : '<option value="">Talla</option>'}
      ${tallas.map(([t, n]) => `<option value="${esc(t)}" ${n === 0 ? "disabled" : ""}>${esc(t)}${n === 0 ? " · agotada" : ""}</option>`).join("")}
    </select>`;
  }
  // Devuelve { idProducto: talla } o marca los selects vacíos y devuelve null
  function leerTallas(contenedor) {
    const selects = $$("[data-pieza]", contenedor);
    selects.forEach((s) => s.setAttribute("aria-invalid", String(!s.value)));
    const vacio = selects.find((s) => !s.value);
    if (vacio) { vacio.focus(); avisar("Elige la talla de cada prenda", "ph-warning-circle"); return null; }
    return Object.fromEntries(selects.map((s) => [s.dataset.pieza, s.value]));
  }
  document.addEventListener("change", (e) => { if (e.target.matches("[data-pieza]")) e.target.removeAttribute("aria-invalid"); });

  /* ---------- 9. Looks armados ---------- */
  const tabs = $("#looks-tabs");
  tabs.innerHTML = CONFIG.looks.map((l, i) =>
    `<button type="button" role="tab" id="tab-${l.id}" aria-controls="panel-${l.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(l.nombre)}</button>`).join("");

  $("#looks-paneles").innerHTML = CONFIG.looks.map((l, i) => {
    const { suma, precio } = precioConjunto(l.piezas, l.descuento);
    const piezas = l.piezas.map((pz) => ({ ...pz, p: PRODUCTOS.get(pz.producto) }));
    return `<div class="look" role="tabpanel" id="panel-${l.id}" aria-labelledby="tab-${l.id}" ${i === 0 ? "" : "hidden"}>
      <div class="look__collage">
        ${piezas.map(({ p, color }) => `<figure>
          <img src="${esc(colorDe(p, color).imagenes[0])}" data-fallback="${fallback(p.categoria)}" alt="${esc(p.nombre)} color ${esc(color)}" loading="lazy" decoding="async">
          <figcaption>${esc(p.nombre)}</figcaption></figure>`).join("")}
      </div>
      <div class="look__info">
        <span class="eyebrow"><i class="ph-fill ph-sparkle" aria-hidden="true"></i> ${l.descuento}% menos por el look</span>
        <h3>${esc(l.nombre)}</h3>
        <p>${esc(l.descripcion)}</p>
        <ul class="piezas">
          ${piezas.map(({ p, color }) => `<li class="pieza">
              <img src="${esc(colorDe(p, color).imagenes[0])}" data-fallback="${fallback(p.categoria)}" alt="" loading="lazy">
              <div><strong>${esc(p.nombre)}</strong><small>${esc(color)} · ${soles(p.precio)}</small></div>
              ${selectorTalla(p)}
            </li>`).join("")}
        </ul>
        <div class="look__total">
          <strong>${soles(precio)}</strong><s>${soles(suma)}</s><span class="precio__ahorro">Ahorras ${soles(suma - precio)}</span>
        </div>
        <button class="btn btn--primario btn--lg btn--bloque" type="button" data-agregar-look="${l.id}"><i class="ph ph-tote-simple" aria-hidden="true"></i>Agregar el look completo</button>
      </div>
    </div>`;
  }).join("");

  function elegirTab(boton) {
    $$('[role="tab"]', tabs).forEach((t) => {
      const activo = t === boton;
      t.setAttribute("aria-selected", String(activo));
      t.tabIndex = activo ? 0 : -1;
      $("#" + t.getAttribute("aria-controls")).hidden = !activo;
    });
  }
  tabs.addEventListener("click", (e) => { const t = e.target.closest('[role="tab"]'); if (t) elegirTab(t); });
  tabs.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const lista = $$('[role="tab"]', tabs);
    const sig = lista[(lista.indexOf(document.activeElement) + (e.key === "ArrowRight" ? 1 : -1) + lista.length) % lista.length];
    elegirTab(sig);
    sig.focus();
  });

  $("#looks-paneles").addEventListener("click", (e) => {
    const b = e.target.closest("[data-agregar-look]");
    if (!b) return;
    const l = LOOKS.get(b.dataset.agregarLook);
    const tallas = leerTallas(b.closest(".look"));
    if (!tallas) return;
    agregarConjunto(l.id, `Look ${l.nombre}`, l.descuento, l.piezas.map((pz) => ({ ...pz, talla: tallas[pz.producto] })));
    avisar(`Look ${l.nombre} en tu bolsa`);
  });

  /* ---------- 10. El probador: combina una prenda de arriba con una de abajo ---------- */
  const PR = CONFIG.probador;
  const opciones = (cats) => CONFIG.productos
    .filter((p) => cats.includes(p.categoria) && stockTotal(p) > 0)
    .flatMap((p) => p.colores.map((c) => ({ p, color: c.nombre, imagen: c.imagenes[0] })));
  const prob = { arriba: opciones(PR.arriba), abajo: opciones(PR.abajo), i: { arriba: 0, abajo: 0 } };
  if (!prob.arriba.length || !prob.abajo.length) $("#probador").remove();
  else {
    $("#prob-desc").textContent = `${PR.descuento}%`;
    const pintarProbador = (mitad, paso) => {
      ["arriba", "abajo"].forEach((m) => {
        if (mitad && m !== mitad) return;   // solo se redibuja la mitad que cambió (conserva la talla de la otra)
        const o = prob[m][prob.i[m]];
        const img = $(`#prob-img-${m}`);
        img.src = o.imagen;
        img.alt = `${o.p.nombre} color ${o.color}`;
        img.dataset.fallback = fallback(o.p.categoria);
        if (paso && !reduceMotion) { img.classList.remove("entra-der", "entra-izq"); void img.offsetWidth; img.classList.add(paso > 0 ? "entra-der" : "entra-izq"); }
        $(`#prob-${m}`).innerHTML = `<img src="${esc(o.imagen)}" alt="" loading="lazy">
          <div><small>${m === "arriba" ? "Arriba" : "Abajo"} · ${prob.i[m] + 1} de ${prob[m].length}</small>
          <strong>${esc(o.p.nombre)}</strong><span>${esc(o.color)} · ${soles(o.p.precio)}</span></div>
          ${selectorTalla(o.p)}`;
      });
      const piezas = ["arriba", "abajo"].map((m) => ({ producto: prob[m][prob.i[m]].p.id }));
      const { suma, precio } = precioConjunto(piezas, PR.descuento);
      $("#prob-total").innerHTML = `<strong>${soles(precio)}</strong><s>${soles(suma)}</s><span class="precio__ahorro">Ahorras ${soles(suma - precio)}</span>`;
    };
    const mover = (mitad, paso) => {
      const n = prob[mitad].length;
      prob.i[mitad] = (prob.i[mitad] + paso + n) % n;
      pintarProbador(mitad, paso);
    };
    $("#espejo").addEventListener("click", (e) => {
      const b = e.target.closest("[data-mover]");
      if (b) mover(b.dataset.mover, Number(b.dataset.paso));
    });
    // En celular también se puede deslizar el dedo sobre cada mitad
    $$(".espejo__mitad").forEach((mitad) => {
      let x0 = null;
      mitad.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
      mitad.addEventListener("touchend", (e) => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) mover(mitad.dataset.mitad, dx < 0 ? 1 : -1);
        x0 = null;
      });
    });
    $("#prob-azar").addEventListener("click", () => {
      ["arriba", "abajo"].forEach((m) => { prob.i[m] = Math.floor(Math.random() * prob[m].length); });
      pintarProbador(null, 1);
    });
    $("#prob-agregar").addEventListener("click", () => {
      const tallas = leerTallas($("#prob-ficha"));
      if (!tallas) return;
      const piezas = ["arriba", "abajo"].map((m) => {
        const o = prob[m][prob.i[m]];
        return { producto: o.p.id, color: o.color, talla: tallas[o.p.id] };
      });
      agregarConjunto("probador", "Outfit del probador", PR.descuento, piezas);
      avisar("Tu outfit está en la bolsa");
    });
    pintarProbador();
  }

  /* ---------- 11. Bolsa, envío, cupón y pedido por WhatsApp ---------- */
  const drawer = $("#drawer");
  const form = $("#form-pedido");
  if (!CONFIG.regalo) $("#regalo-bloque").remove();
  else $("#regalo-costo").textContent = `(+${soles(CONFIG.regalo.costo)})`;

  function calcular() {
    let items = 0, subtotal = 0, baseCupon = 0;
    bolsa.forEach((it) => {
      const importe = it.n * infoItem(it).precio;
      items += it.n;
      subtotal += importe;
      // El cupón no se suma a otros descuentos: no aplica a looks, outfits ni prendas en oferta
      if (it.tipo === "prenda" && !PRODUCTOS.get(it.id).precioAntes) baseCupon += importe;
    });
    const entrega = form.entrega.value;
    const descuento = cuponAplicado ? redondear(baseCupon * CONFIG.cupon.porcentaje / 100) : 0;
    const regla = CONFIG.envios[entrega];
    const envio = regla && subtotal > 0 && subtotal < regla.gratisDesde ? regla.costo : 0;
    const regalo = CONFIG.regalo && form.regalo?.checked && items > 0 ? CONFIG.regalo.costo : 0;
    return { items, subtotal, descuento, envio, regalo, total: redondear(subtotal - descuento + envio + regalo), entrega, regla };
  }

  function actualizarBolsa() {
    const { items, subtotal, descuento, envio, regalo, total, entrega, regla } = calcular();

    // Header + barra
    $("#bolsa-n").hidden = items === 0;
    $("#bolsa-n").textContent = items;
    $("#barra").hidden = items === 0;
    $("#barra-n").textContent = items;
    $("#barra-total").textContent = soles(total);
    document.body.classList.toggle("con-pedido", items > 0);

    // Artículos
    $("#items").innerHTML = [...bolsa].map(([k, it]) => {
      const info = infoItem(it);
      return `<li class="item">
        <img src="${esc(info.imagen)}" data-fallback="${fallback(info.cat)}" alt="" loading="lazy">
        <div><strong>${esc(info.nombre)}</strong><small>${esc(info.detalle)}</small><small class="item__precio">${soles(info.precio * it.n)}</small></div>
        <div class="stepper">
          <button type="button" data-clave="${esc(k)}" data-op="-1" aria-label="Quitar uno: ${esc(info.nombre)}"><i class="ph ph-${it.n === 1 ? "trash" : "minus"}"></i></button>
          <span>${it.n}</span>
          <button type="button" data-clave="${esc(k)}" data-op="1" aria-label="Agregar otro: ${esc(info.nombre)}" ${it.n >= info.max ? "disabled" : ""}><i class="ph ph-plus"></i></button>
        </div>
      </li>`;
    }).join("");
    $("#vacio").hidden = items > 0;
    $("#checkout").hidden = items === 0;
    $("#drawer-pie").hidden = items === 0;

    // Barra de progreso hacia el envío gratis
    const progreso = $("#progreso");
    progreso.hidden = items === 0 || !regla;
    if (regla) {
      const falta = regla.gratisDesde - subtotal;
      progreso.classList.toggle("listo", falta <= 0);
      $("#progreso-txt").innerHTML = falta > 0
        ? `Te faltan <strong>${soles(falta)}</strong> para el envío gratis${entrega === "provincia" ? " a provincia" : ""}`
        : `<i class="ph-fill ph-check-circle" aria-hidden="true"></i> ¡Tu envío es gratis!`;
      $("#progreso-fill").style.width = `${Math.min(100, (subtotal / regla.gratisDesde) * 100)}%`;
    }

    // Campos según la forma de entrega
    $$("[data-entrega]", form).forEach((el) => { el.hidden = el.dataset.entrega !== entrega; });

    // Totales
    $("#t-subtotal").textContent = soles(subtotal);
    $("#fila-descuento").hidden = !cuponAplicado;
    if (cuponAplicado) $("#t-descuento-label").textContent = `Cupón ${cuponAplicado} (-${CONFIG.cupon.porcentaje}%)`;
    $("#t-descuento").textContent = "-" + soles(descuento);
    $("#fila-envio").hidden = entrega === "recojo";
    $("#fila-regalo").hidden = !regalo;
    $("#t-regalo").textContent = soles(regalo);
    if (form.regalo) $("#regalo-campo").hidden = !form.regalo.checked;
    $("#t-envio").textContent = envio ? soles(envio) : "Gratis";
    $("#t-total").textContent = soles(total);
  }

  // Botones +/− de la bolsa (mantienen el foco tras redibujar)
  drawer.addEventListener("click", (e) => {
    const b = e.target.closest("[data-clave][data-op]");
    if (!b) return;
    const { clave, op } = b.dataset;
    cambiar(clave, Number(op));
    requestAnimationFrame(() => {
      const mismo = $(`[data-clave="${CSS.escape(clave)}"][data-op="${op}"]:not(:disabled)`, drawer) || $(`[data-clave="${CSS.escape(clave)}"]`, drawer);
      (mismo || $("#drawer-titulo")).focus?.();
    });
  });

  // Cupón
  if (!CONFIG.cupon) $("#cupon-bloque").remove();
  else {
    const input = $("#cupon-input");
    const msg = $("#cupon-msg");
    const pintarCupon = () => {
      msg.className = "cupon__msg ok";
      msg.textContent = cuponAplicado ? `Cupón aplicado: ${CONFIG.cupon.texto}. No aplica a ofertas, looks ni outfits.` : "";
      if (cuponAplicado) input.value = cuponAplicado;
    };
    const aplicar = () => {
      const codigo = input.value.trim().toUpperCase();
      if (!codigo) return;
      if (codigo === CONFIG.cupon.codigo.toUpperCase()) {
        cuponAplicado = CONFIG.cupon.codigo;
        escribir("cupon", cuponAplicado);
        pintarCupon();
      } else {
        cuponAplicado = null;
        escribir("cupon", null);
        msg.className = "cupon__msg error";
        msg.textContent = "Ese cupón no existe o ya venció.";
      }
      actualizarBolsa();
    };
    $("#cupon-aplicar").addEventListener("click", aplicar);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); aplicar(); } });
    pintarCupon();
  }

  const abrirBolsa = () => { actualizarBolsa(); drawer.showModal(); };
  $("#barra").addEventListener("click", abrirBolsa);
  $("#bolsa-btn").addEventListener("click", abrirBolsa);
  $("#vacio-ver").addEventListener("click", () => { drawer.close(); $("#coleccion").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); });
  form.addEventListener("change", (e) => { if (["entrega", "regalo"].includes(e.target.name)) actualizarBolsa(); });

  // Cerrar cualquier modal con su botón o tocando fuera del panel
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-cerrar]"); if (b) b.closest("dialog").close(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { subtotal, descuento, envio, regalo, total, entrega } = calcular();
    const v = (campo) => form[campo].value.trim();

    // Validación mínima según la forma de entrega
    const requeridos = ["nombre", ...(entrega === "local" ? ["direccion"] : entrega === "provincia" ? ["ciudad", "dni"] : [])];
    const invalido = (c) => (c === "dni" ? !/^\d{8}$/.test(v(c)) : !v(c));
    ["nombre", "direccion", "ciudad", "dni"].forEach((c) => form[c].setAttribute("aria-invalid", String(requeridos.includes(c) && invalido(c))));
    const primero = requeridos.find(invalido);
    if (primero) return form[primero].focus();

    const lineas = [...bolsa.values()].map((it) => {
      const info = infoItem(it);
      return `• ${it.n} x ${info.nombre} — ${info.detalle} — ${solesExacto(info.precio * it.n)}`;
    });
    const textoEntrega = {
      local: `Delivery en ${CONFIG.ciudad}`,
      provincia: `Envío a provincia por ${form.agencia.value}`,
      recojo: "Recojo en tienda",
    }[entrega];

    const msg = [
      `Hola ${CONFIG.nombre} 👋, quiero hacer este pedido:`,
      "",
      ...lineas,
      "",
      `Subtotal: ${solesExacto(subtotal)}`,
      descuento ? `Cupón ${cuponAplicado} (-${CONFIG.cupon.porcentaje}%): -${solesExacto(descuento)}` : null,
      entrega !== "recojo" ? `Envío: ${envio ? solesExacto(envio) : "Gratis"}` : null,
      regalo ? `Empaque de regalo: ${solesExacto(regalo)}` : null,
      `*Total: ${solesExacto(total)}*`,
      "",
      `👤 Nombre: ${v("nombre")}`,
      `🚚 Entrega: ${textoEntrega}`,
      entrega === "local" ? `📍 Dirección: ${v("direccion")}` : null,
      entrega === "provincia" ? `📍 Destino: ${v("ciudad")}` : null,
      entrega === "provincia" ? `🪪 DNI: ${v("dni")}` : null,
      `💳 Pago: ${form.pago.value}`,
      regalo ? `🎁 Para regalo${v("dedicatoria") ? ` — Dedicatoria: "${v("dedicatoria")}"` : ""}` : null,
      v("notas") ? `📝 Notas: ${v("notas")}` : null,
    ].filter((l) => l !== null).join("\n");

    window.open(waLink(msg), "_blank", "noopener");
  });

  /* ---------- 12. Toast ---------- */
  let toastTimer;
  function avisar(texto, icono = "ph-check-circle") {
    const t = $("#toast");
    t.innerHTML = `<i class="ph-fill ${icono}" aria-hidden="true"></i>${esc(texto)}`;
    t.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("visible"), 2200);
  }

  /* ---------- 13. Logros con contador animado ---------- */
  $("#logros").innerHTML = CONFIG.logros.map((l) =>
    `<li><strong data-valor="${l.valor}" data-dec="${l.decimales || 0}" data-sufijo="${esc(l.sufijo || "")}">0</strong><span>${esc(l.texto)}</span></li>`).join("");
  const animarNumero = (el) => {
    const fin = Number(el.dataset.valor), dec = Number(el.dataset.dec), suf = el.dataset.sufijo;
    const t0 = performance.now(), dur = 1400;
    // Respaldo: si la pestaña está en segundo plano, requestAnimationFrame se pausa
    setTimeout(() => { el.textContent = fin.toFixed(dec) + suf; }, dur + 100);
    const paso = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (fin * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };
  $$("#logros strong").forEach((el) => {
    if (reduceMotion || !("IntersectionObserver" in window)) { el.textContent = Number(el.dataset.valor).toFixed(el.dataset.dec) + el.dataset.sufijo; return; }
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { animarNumero(el); io.disconnect(); } }, { threshold: .6 });
    io.observe(el);
  });

  /* ---------- 14. Opiniones, comunidad y preguntas ---------- */
  $("#testimonios").innerHTML = CONFIG.testimonios.map((t, i) => `
    <li class="testimonio" data-aos="fade-up" data-aos-delay="${i * 80}">
      <span class="testimonio__comilla" aria-hidden="true">“</span>
      <span class="estrellas" role="img" aria-label="${t.estrellas} de 5 estrellas">${estrellas(t.estrellas)}</span>
      <blockquote>${esc(t.texto)}</blockquote>
      ${t.compra ? `<span class="testimonio__compra"><i class="ph ph-tote-simple" aria-hidden="true"></i>${esc(t.compra)}</span>` : ""}
      <div class="autor">
        <span class="avatar" aria-hidden="true">${esc(t.nombre.charAt(0))}</span>
        <span><strong>${esc(t.nombre)}</strong>Reseña en ${esc(t.fuente)}</span>
      </div>
    </li>`).join("");

  $("#hashtag").textContent = CONFIG.hashtag;
  const ig = $("#ig-link");
  ig.textContent = CONFIG.instagram;
  ig.href = CONFIG.redes.instagram || "#";
  $("#comunidad-grid").innerHTML = CONFIG.comunidad.map((f, i) =>
    `<a href="${esc(CONFIG.redes.instagram || "#")}" target="_blank" rel="noopener" data-aos="fade-up" data-aos-delay="${(i % 6) * 60}" aria-label="${esc(f.alt)} (ver en Instagram)">
      <img src="${esc(f.imagen)}" data-fallback="${fallback("conjuntos")}" alt="" loading="lazy" decoding="async" width="600" height="600">
      <i class="ph ph-instagram-logo" aria-hidden="true"></i>
    </a>`).join("");

  $("#faq").innerHTML = CONFIG.preguntas.map((q) =>
    `<details><summary>${esc(q.p)}<i class="ph ph-plus" aria-hidden="true"></i></summary><p>${esc(q.r)}</p></details>`).join("");

  /* ---------- 15. Ubicación y mapa ---------- */
  const { lat, lng } = CONFIG.ubicacion;
  $("#mapa").src = `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
  $("#como-llegar").href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  /* ---------- 16. Header y menú móvil ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = $("#nav-toggle");
  const nav = $("#nav");
  const cerrarMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    nav.classList.remove("abierto");
  };
  toggle.addEventListener("click", () => {
    const abrirMenu = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(abrirMenu));
    toggle.setAttribute("aria-label", abrirMenu ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("abierto", abrirMenu);
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) cerrarMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });

  /* ---------- 17. SEO local: datos estructurados para Google ---------- */
  const precios = CONFIG.productos.map((p) => p.precio);
  const ld = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: CONFIG.nombre,
    telephone: CONFIG.telefono,
    priceRange: `S/ ${Math.min(...precios)} – S/ ${Math.max(...precios)}`,
    url: location.href.split("#")[0],
    paymentAccepted: CONFIG.pagos.join(", "),
    address: { "@type": "PostalAddress", streetAddress: CONFIG.direccion, addressLocality: CONFIG.ciudad, addressRegion: CONFIG.region, addressCountry: "PE" },
    geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
    openingHoursSpecification: CONFIG.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias.map((d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d]),
      opens: h.abre, closes: h.cierra,
    })),
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);

  /* ---------- 18. Inicio ---------- */
  actualizarFavs();
  aplicarFiltro();
  pintarMiTalla();
  actualizarBolsa();
  if (window.AOS) AOS.init({ once: true, duration: 700, easing: "ease-out-cubic", offset: 40, disable: reduceMotion });
  // Enlace directo a una prenda: index.html#prenda-pantalon-lino
  const enlace = location.hash.match(/^#prenda-(.+)$/);
  if (enlace && PRODUCTOS.has(enlace[1])) {
    abrirPrenda(enlace[1]);
    history.replaceState(null, "", location.pathname + location.search);
  }
})();
