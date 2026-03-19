const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.main-nav');
const contactForm = document.querySelector('.contact-form');
const faqItems = document.querySelectorAll('.faq details');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => {
  observer.observe(el);
});

faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) {
      return;
    }

    faqItems.forEach((other) => {
      if (other !== item) {
        other.open = false;
      }
    });
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');

    if (button) {
      button.textContent = 'Enviado';
      button.disabled = true;
    }

    contactForm.reset();

    setTimeout(() => {
      if (button) {
        button.textContent = 'Quiero mi clase prueba';
        button.disabled = false;
      }
    }, 1800);
  });
}
