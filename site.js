/* Urban Soul — progressive enhancement layer.
   Everything readable works without JS; JS adds reveals, nav, filters, booking. */
document.documentElement.classList.add("js");

(function () {
  "use strict";

  /* ---- populate BUSINESS constants into [data-b] slots ---- */
  function hydrateBusiness() {
    if (typeof BUSINESS === "undefined") return;
    document.querySelectorAll("[data-b]").forEach(function (el) {
      var k = el.getAttribute("data-b");
      if (BUSINESS[k] !== undefined && !el.dataset.bDone) {
        if (el.tagName === "A" && k === "whatsapp") el.href = BUSINESS.whatsapp;
        else if (el.tagName === "A" && k === "phoneIntl") el.href = "tel:+" + BUSINESS.phoneIntl;
        else el.textContent = BUSINESS[k];
        el.dataset.bDone = "1";
      }
    });
    document.querySelectorAll("a[data-wa]").forEach(function (a) {
      a.href = BUSINESS.whatsapp;
    });
    var tel = document.querySelector('a[href^="tel:"]');
    if (tel) tel.href = "tel:+" + BUSINESS.phoneIntl;
  }

  /* ---- mobile nav ---- */
  function nav() {
    var btn = document.querySelector(".nav-toggle");
    var menu = document.getElementById("nav-mobile");
    if (!btn || !menu) return;
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- masked line-rise reveals (trigger on view; finish to completion) ---- */
  function reveals() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.35 });
    els.forEach(function (e, i) {
      e.style.transitionDelay = Math.min(i * 0.08, 0.4) + "s";
      io.observe(e);
    });
  }

  /* ---- gallery filters ---- */
  function filters() {
    var chips = document.querySelectorAll(".chip");
    var items = document.querySelectorAll(".g-item");
    if (!chips.length) return;
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        var f = chip.getAttribute("data-filter");
        items.forEach(function (it) {
          var show = f === "all" || it.getAttribute("data-cat") === f;
          it.classList.toggle("hidden", !show);
        });
      });
    });
  }

  /* ---- booking form → WhatsApp prefilled message ---- */
  function booking() {
    var form = document.getElementById("reserva-form");
    if (!form || typeof BUSINESS === "undefined") return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var get = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };
      var nombre = get("f-nombre"), tel = get("f-tel"),
          servicio = get("f-servicio"), fecha = get("f-fecha"), nota = get("f-nota");
      if (!form.reportValidity()) return;
      var lines = [
        "Hola " + BUSINESS.name + ", quiero reservar una cita.",
        "Nombre: " + nombre,
        "Teléfono: " + tel,
        "Servicio: " + servicio,
        fecha ? "Fecha preferida: " + fecha : "Fecha preferida: a convenir"
      ];
      if (nota) lines.push("Notas: " + nota);
      lines.push("(Mensaje enviado desde el sitio web — ejemplo de propuesta)");
      window.open(BUSINESS.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
      var ok = document.getElementById("reserva-ok");
      if (ok) { ok.hidden = false; ok.focus(); }
    });
  }

  /* ---- sticky mobile CTA (appears after hero) ---- */
  function stickyCta() {
    var bar = document.querySelector(".sticky-cta");
    if (!bar) return;
    var hero = document.querySelector(".hero") || document.querySelector("main");
    var onScroll = function () {
      var past = window.scrollY > (hero ? hero.offsetHeight * 0.7 : 400);
      bar.classList.toggle("show", past);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  hydrateBusiness();
  nav();
  reveals();
  filters();
  booking();
  stickyCta();
})();
