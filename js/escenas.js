"use strict";

ScrollCraft.mount(document.body);

const linea = document.querySelector(".linea");

if (linea) {
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = linea.querySelector("[data-sc-stage]");
  const rail = linea.querySelector(".linea-rail");
  const hitos = Array.from(linea.querySelectorAll(".hito"));
  const paradas = Array.from(linea.querySelectorAll(".pista li"));
  const enlaces = paradas.map((li) => li.querySelector("a"));
  const lista = linea.querySelector(".pista ol");
  const disco = linea.querySelector(".disco");
  const pista = linea.querySelector(".pista");
  const INDICE_STREAMING = 2;
  let pendiente = false;

  const centro = (el) => {
    const r = el.getBoundingClientRect();
    return r.left + r.width / 2;
  };

  const posicionFraccional = () => {
    const medio = window.innerWidth / 2;
    const centros = hitos.map(centro);
    if (medio <= centros[0]) {
      return 0;
    }
    for (let i = 0; i < centros.length - 1; i++) {
      if (medio <= centros[i + 1]) {
        return i + (medio - centros[i]) / (centros[i + 1] - centros[i]);
      }
    }
    return centros.length - 1;
  };

  const pintar = () => {
    pendiente = false;
    const f = posicionFraccional();
    const activo = Math.round(f);
    const caja = lista.getBoundingClientRect();
    const xs = paradas.map((li) => {
      const r = li.getBoundingClientRect();
      return r.left + r.width / 2 - caja.left;
    });
    const base = Math.min(Math.floor(f), xs.length - 2);
    const resto = f - base;
    const x = xs[base] + (xs[base + 1] - xs[base]) * resto;
    const ancho = xs[xs.length - 1] - xs[0];

    lista.style.setProperty("--avance", ancho > 0 ? (x - xs[0]) / ancho : 0);
    disco.style.setProperty("--disco-x", x + (caja.left - pista.getBoundingClientRect().left) + "px");
    disco.style.setProperty("--giro", f * 300 + "deg");
    disco.classList.toggle("es-play", f >= INDICE_STREAMING - 0.02);

    paradas.forEach((li, i) => {
      li.classList.toggle("pasado", i <= f + 0.02);
      li.classList.toggle("activo", i === activo);
      if (i === activo) {
        enlaces[i].setAttribute("aria-current", "step");
      } else {
        enlaces[i].removeAttribute("aria-current");
      }
    });

    const medio = window.innerWidth / 2;
    hitos.forEach((h) => {
      const d = Math.abs(centro(h) - medio) / window.innerWidth;
      h.style.setProperty("--llegada", Math.max(0, Math.min(1, 1.25 - d * 1.6)).toFixed(3));
    });
  };

  const pedir = () => {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(pintar);
    }
  };

  const irA = (i, suave) => {
    const hito = hitos[i];
    if (reducido) {
      hito.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
      return;
    }
    const recorrido = rail.scrollWidth - stage.clientWidth;
    const objetivo = hito.offsetLeft + hito.offsetWidth / 2 - stage.clientWidth / 2;
    const p = recorrido > 0 ? Math.max(0, Math.min(1, objetivo / recorrido)) : 0;
    const arriba = linea.getBoundingClientRect().top + window.scrollY;
    const y = arriba + p * (linea.offsetHeight - window.innerHeight);
    window.scrollTo({ top: y, behavior: suave ? "smooth" : "auto" });
  };

  enlaces.forEach((a, i) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      history.replaceState(null, "", "#hito-" + (i + 1));
      irA(i, true);
    });
  });

  window.addEventListener("scroll", pedir, { passive: true });
  window.addEventListener("resize", pedir);
  stage.addEventListener("scroll", pedir, { passive: true });

  window.addEventListener("load", () => {
    const m = location.hash.match(/^#hito-(\d)$/);
    if (m) {
      irA(Number(m[1]) - 1, false);
    }
    pedir();
  });

  pedir();
}
