"use strict";

const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const formato = new Intl.NumberFormat("es-ES");

function animarContador(el) {
  const objetivo = Number(el.dataset.count);
  const prefijo = el.dataset.prefix || "";
  const sufijo = el.dataset.suffix || "";
  const pintar = (valor) => {
    el.textContent = prefijo + formato.format(valor) + sufijo;
  };

  if (reducirMovimiento) {
    pintar(objetivo);
    return;
  }

  const duracion = 1800;
  const inicio = performance.now();

  const paso = (ahora) => {
    const t = Math.min((ahora - inicio) / duracion, 1);
    const suavizado = 1 - Math.pow(1 - t, 3);
    pintar(Math.round(objetivo * suavizado));
    if (t < 1) {
      requestAnimationFrame(paso);
    }
  };

  requestAnimationFrame(paso);
}

function mostrar(el) {
  if (el.classList.contains("visible")) {
    return;
  }
  el.classList.add("visible");
  el.querySelectorAll("[data-count]").forEach(animarContador);
  const retraso = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
  setTimeout(() => el.classList.add("listo"), 900 + retraso * 1000);
}

const elementos = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        mostrar(entrada.target);
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });

  elementos.forEach((el) => {
    const caja = el.getBoundingClientRect();
    if (caja.top < window.innerHeight && caja.bottom > 0) {
      mostrar(el);
    } else {
      observador.observe(el);
    }
  });
} else {
  elementos.forEach(mostrar);
}

const timeline = document.querySelector(".timeline");
const progreso = document.querySelector(".timeline-progreso");

if (timeline && progreso) {
  let pendiente = false;

  const actualizar = () => {
    const caja = timeline.getBoundingClientRect();
    const recorrido = window.innerHeight * 0.6 - caja.top;
    const alto = Math.max(0, Math.min(recorrido, caja.height));
    progreso.style.height = alto + "px";
    pendiente = false;
  };

  const pedir = () => {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(actualizar);
    }
  };

  window.addEventListener("scroll", pedir, { passive: true });
  window.addEventListener("resize", pedir);
  actualizar();
}
