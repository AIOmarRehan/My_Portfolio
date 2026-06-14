/* =========================================================
   BRUTE — Interactions & Motion
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Custom cursor ---------- */
  const cursor = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  let mx = innerWidth / 2, my = innerHeight / 2;
  let cx = mx, cy = my;

  if (cursor && window.matchMedia("(min-width: 901px)").matches) {
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll("[data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("grow"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
    });
  }

  /* ---------- Scroll progress + nav hide ---------- */
  const progress = document.getElementById("scrollProgress");
  const nav = document.getElementById("nav");
  let lastY = 0;
  addEventListener("scroll", () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = scrolled * 100 + "%";

    const y = h.scrollTop;
    if (y > lastY && y > 300) nav.classList.add("hidden");
    else nav.classList.remove("hidden");
    lastY = y;
  });

  /* ---------- Theme toggle ---------- */
  const toggle = document.getElementById("themeToggle");
  const icon = toggle.querySelector(".toggle-icon");
  const saved = localStorage.getItem("brute-theme");
  if (saved === "dark") { document.documentElement.setAttribute("data-theme", "dark"); icon.textContent = "☾"; }
  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) { document.documentElement.removeAttribute("data-theme"); icon.textContent = "☀"; localStorage.setItem("brute-theme", "light"); }
    else { document.documentElement.setAttribute("data-theme", "dark"); icon.textContent = "☾"; localStorage.setItem("brute-theme", "dark"); }
  });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("burger");
  burger.addEventListener("click", () => nav.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );

  /* ---------- Floating hero shapes ---------- */
  const shapesWrap = document.getElementById("heroShapes");
  const palette = ["var(--yellow)", "var(--pink)", "var(--cyan)", "var(--lime)", "var(--purple)", "var(--orange)"];
  const shapes = [];
  if (shapesWrap && !prefersReduced) {
    const count = innerWidth < 700 ? 5 : 9;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      s.className = "floaty";
      const size = 40 + Math.random() * 90;
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.left = Math.random() * 90 + "%";
      s.style.top = Math.random() * 90 + "%";
      s.style.background = palette[i % palette.length];
      if (Math.random() > 0.6) s.style.borderRadius = "50%";
      s.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
      shapesWrap.appendChild(s);
      shapes.push({ el: s, sx: (Math.random() - 0.5) * 2.2, sy: (Math.random() - 0.5) * 2.2, rot: Math.random() * 0.4 });
    }
    // parallax + drift
    let pmx = 0, pmy = 0;
    addEventListener("mousemove", (e) => { pmx = (e.clientX / innerWidth - 0.5); pmy = (e.clientY / innerHeight - 0.5); });
    let t = 0;
    (function drift() {
      t += 0.01;
      shapes.forEach((o, i) => {
        const fx = Math.sin(t + i) * 14 + pmx * (30 + i * 6);
        const fy = Math.cos(t + i) * 14 + pmy * (30 + i * 6);
        o.el.style.transform = `translate(${fx}px, ${fy}px) rotate(${t * 20 * o.rot + i * 15}deg)`;
      });
      requestAnimationFrame(drift);
    })();
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-word, .card, .stat-box");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => el.classList.add("in-view"), (el.dataset.delay || 0) * 1);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  // stagger words and cards
  document.querySelectorAll(".reveal-word").forEach((w, i) => (w.dataset.delay = i * 90));
  document.querySelectorAll(".card").forEach((c, i) => { c.classList.add("reveal-up"); c.dataset.delay = i * 80; });
  document.querySelectorAll(".stat-box").forEach((c, i) => { c.classList.add("reveal-up"); c.dataset.delay = i * 80; });
  revealEls.forEach((el) => io.observe(el));

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll(".stat-num");
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const dur = 1400; const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => cio.observe(c));

  /* ---------- 3D tilt on cards ---------- */
  if (!prefersReduced && window.matchMedia("(min-width: 901px)").matches) {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll(".acc-item").forEach((item) => {
    const head = item.querySelector(".acc-head");
    const body = item.querySelector(".acc-body");
    head.addEventListener("click", () => {
      const open = item.classList.contains("active");
      document.querySelectorAll(".acc-item").forEach((o) => { o.classList.remove("active"); o.querySelector(".acc-body").style.maxHeight = null; });
      if (!open) { item.classList.add("active"); body.style.maxHeight = body.scrollHeight + "px"; }
    });
  });
  // open first by default
  const first = document.querySelector(".acc-item");
  if (first) { first.classList.add("active"); first.querySelector(".acc-body").style.maxHeight = first.querySelector(".acc-body").scrollHeight + "px"; }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    success.classList.add("show");
    form.reset();
    setTimeout(() => success.classList.remove("show"), 4000);
  });

  /* ---------- Hero title initial reveal ---------- */
  addEventListener("load", () => {
    document.querySelectorAll(".hero .reveal-word").forEach((w, i) => {
      setTimeout(() => w.classList.add("in-view"), 200 + i * 110);
    });
    document.querySelectorAll(".hero .reveal-up").forEach((el, i) => {
      setTimeout(() => el.classList.add("in-view"), 700 + i * 120);
    });
  });
})();
