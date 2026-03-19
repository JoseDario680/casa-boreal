/* Casa Boreal · Wellness Club · JS */

(function () {
  "use strict";

  /* ── Burger menu ── */
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  if (burger) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  /* ── Scroll fade-in ── */
  const faders = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    faders.forEach((el) => io.observe(el));
  } else {
    faders.forEach((el) => el.classList.add("visible"));
  }

  /* ── Form feedback ── */
  const form = document.querySelector(".form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = "Enviado ✓";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        form.reset();
      }, 2500);
    });
  }
})();
