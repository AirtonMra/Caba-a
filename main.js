(() => {
  const PHONE = "543548633176";
  const wa = t => `https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;

  // Menú móvil
  const b = document.querySelector(".burger"), m = document.querySelector(".menu");
  if (b) {
    b.addEventListener("click", () => {
      const o = m.classList.toggle("open");
      b.setAttribute("aria-expanded", o);
    });
    m.addEventListener("click", e => { if (e.target.closest("a")) { m.classList.remove("open"); b.setAttribute("aria-expanded", false); } });
  }

  // Enlaces WhatsApp con mensaje precargado según la unidad (data-unit)
  document.querySelectorAll("[data-unit]").forEach(a => {
    const u = a.dataset.unit;
    const msg = u === "general"
      ? "Hola! Quisiera recibir información, disponibilidad y tarifas de Cabañas La Oma."
      : `Hola! Quisiera consultar disponibilidad y tarifas para ${u} en Cabañas La Oma.`;
    a.href = wa(msg);
    a.target = "_blank"; a.rel = "noopener";
  });

  // Formulario -> WhatsApp (sin backend)
  const f = document.getElementById("consulta");
  if (f) f.addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    const parts = [`Hola! Quisiera consultar disponibilidad y tarifas para ${d.unidad} en Cabañas La Oma.`];
    if (d.desde) parts.push(`Ingreso: ${d.desde}.`);
    if (d.hasta) parts.push(`Salida: ${d.hasta}.`);
    if (d.personas) parts.push(`Personas: ${d.personas}.`);
    if (d.nombre) parts.push(`Nombre: ${d.nombre}.`);
    window.open(wa(parts.join(" ")), "_blank", "noopener");
  });
  const hoy = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('input[type=date]').forEach(i => i.min = hoy);

  // Preselecciona unidad por ?unidad=
  const q = new URLSearchParams(location.search).get("unidad");
  const sel = document.querySelector("select[name=unidad]");
  if (q && sel) [...sel.options].forEach(o => { if (o.value.toLowerCase().includes(q.toLowerCase())) sel.value = o.value; });

  // Revelado suave
  const rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add("in"));

  // Galería / lightbox
  const items = [...document.querySelectorAll(".gal button")];
  if (items.length) {
    const lb = document.createElement("div");
    lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Galería de fotos");
    lb.innerHTML = '<button class="x" aria-label="Cerrar">✕</button><button class="p" aria-label="Anterior">‹</button><img alt=""><button class="n" aria-label="Siguiente">›</button>';
    document.body.appendChild(lb);
    const im = lb.querySelector("img"); let i = 0, last;
    const show = k => { i = (k + items.length) % items.length; const s = items[i].querySelector("img"); im.src = s.src; im.alt = s.alt; };
    const open = k => { last = document.activeElement; show(k); lb.classList.add("on"); lb.querySelector(".x").focus(); };
    const close = () => { lb.classList.remove("on"); last && last.focus(); };
    items.forEach((el, k) => el.addEventListener("click", () => open(k)));
    lb.querySelector(".x").onclick = close; lb.querySelector(".p").onclick = () => show(i - 1); lb.querySelector(".n").onclick = () => show(i + 1);
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("on")) return;
      if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1);
    });
  }
})();
