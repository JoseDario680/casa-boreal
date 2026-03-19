/* ═══════════════════════════════════════════════
   Casa Boreal · Wellness Club — Script
   ═══════════════════════════════════════════════ */

const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.main-nav');
const contactForm = document.querySelector('.contact-form');
const faqItems = document.querySelectorAll('.faq details');

/* ─── Mobile menu ─── */
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─── Reveal on scroll ─── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => {
  observer.observe(el);
});

/* ─── FAQ accordion ─── */
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

/* ─── Contact form ─── */
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');

    if (button) {
      button.textContent = '¡Enviado!';
      button.disabled = true;
    }

    contactForm.reset();

    setTimeout(() => {
      if (button) {
        button.textContent = 'Quiero mi clase prueba';
        button.disabled = false;
      }
    }, 2200);
  });
}
