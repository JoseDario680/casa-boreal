/* Casa Boreal · Wellness Club · JS */

(function () {
  "use strict";

  /* ── Burger menu ── */
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  if (burger) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      burger.classList.toggle("active", isOpen);
      burger.setAttribute("aria-expanded", isOpen);
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.classList.remove("active");
        burger.setAttribute("aria-expanded", "false");
      })
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

  /* ── Hero carousel ── */
  const track = document.querySelector(".hero-track");
  const dots = document.querySelectorAll(".dot");
  if (track && dots.length > 1) {
    let current = 0;
    const total = dots.length;

    function goTo(idx) {
      current = idx;
      track.style.transform = "translateX(-" + (current * 100) + "vw)";
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));

    setInterval(() => goTo((current + 1) % total), 3000);
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
