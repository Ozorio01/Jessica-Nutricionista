/* ==========================================================
   Jéssica Ferreira Nutricionista – script.js
   ========================================================== */
(function () {
  "use strict";

  const WHATS_NUMBER = "5511940194676";

  /* ---------- Ano no rodapé ---------- */
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  function closeMenu() {
    if (!toggle || !menu) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Sombra do header ao rolar ---------- */
  const header = document.querySelector(".header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Animação de entrada (reveal) ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Link ativo no menu ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll('.nav a[href^="#"]:not(.btn)');
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Abas das dicas ---------- */
  const tabs = Array.from(document.querySelectorAll(".tabs__btn"));
  function activateTab(tab) {
    tabs.forEach(function (t) {
      const selected = t === tab;
      t.classList.toggle("is-active", selected);
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) {
        panel.hidden = !selected;
        panel.classList.toggle("is-active", selected);
      }
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { activateTab(tab); });
    tab.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      activateTab(next);
      next.focus();
    });
  });

  /* ---------- Formulário -> WhatsApp ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    function setError(input, msg) {
      const field = input.closest(".field");
      field.classList.toggle("has-error", Boolean(msg));
      field.querySelector(".error").textContent = msg || "";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nome = form.nome;
      const interesse = form.interesse;
      const mensagem = form.mensagem;
      let ok = true;

      if (nome.value.trim().length < 2) { setError(nome, "Informe seu nome."); ok = false; }
      else setError(nome, "");

      if (!interesse.value) { setError(interesse, "Selecione uma opção."); ok = false; }
      else setError(interesse, "");

      if (!ok) return;

      const texto =
        "Olá, Jéssica! Meu nome é " + nome.value.trim() + ".\n" +
        "Tenho interesse em: " + interesse.value + ".\n" +
        (mensagem.value.trim() ? "Mensagem: " + mensagem.value.trim() : "");

      const url = "https://wa.me/" + WHATS_NUMBER + "?text=" + encodeURIComponent(texto);
      window.open(url, "_blank", "noopener");
      form.reset();
    });
  }
})();
