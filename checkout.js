/* ══════════════════════════════════════
   Casa Boreal · Checkout JS
   Stripe + MercadoPago integration
   ══════════════════════════════════════

   CONFIGURACIÓN DE KEYS:
   ─────────────────────────────────────
   1. Reemplaza STRIPE_PUBLIC_KEY con tu Publishable Key de Stripe
      (comienza con pk_live_ o pk_test_)

   2. Reemplaza MP_PUBLIC_KEY con tu Public Key de MercadoPago
      (comienza con APP_USR-)

   3. El backend (server-side) deberá:
      - Stripe: crear un PaymentIntent y devolver el client_secret
      - MP: crear una preferencia y devolver el preference_id o token
   ══════════════════════════════════════ */

(function () {
  "use strict";

  /* ─── Public Keys (solo las publishable, seguras para el frontend) ─── */
  const STRIPE_PUBLIC_KEY = "pk_live_51TMgfvC4V2NjeA4izmoMLnGl0IwmZrgRPhAqToSQuZD6KxXhaFBs6C7R9UWe5ClUBJNTenljZUKqyxl5YVZZYD4M00t8bNaztp";
  const MP_PUBLIC_KEY     = "APP_USR-b7705b04-96db-4979-9e72-2611260491fd";

  /* ─── Planes disponibles ─── */
  const PLANS = {
    popular: {
      label: "Popular · 12 Clases",
      price: "$1,100",
      amount: 110000, // centavos MXN para Stripe
      display: "$1,100 <span>/mes</span>"
    },
    ilimitado: {
      label: "Ilimitado · 30 días",
      price: "$2,200",
      amount: 220000,
      display: "$2,200 <span>/mes</span>"
    }
  };

  /* ─── Estado ─── */
  let selectedPlan = null;
  let stripeInstance = null;
  let stripeCard = null;

  /* ─── Referencias DOM ─── */
  const screenMain    = document.getElementById("checkout-main");
  const screenPayment = document.getElementById("checkout-payment");
  const screenThanks  = document.getElementById("checkout-thanks");

  const radios       = document.querySelectorAll('input[name="plan"]');
  const btnContinuar = document.getElementById("btn-continuar");
  const btnBack      = document.getElementById("btn-back");
  const methodTabs   = document.querySelectorAll(".co-method-tab");
  const formStripe   = document.getElementById("form-stripe");
  const formMP       = document.getElementById("form-mercadopago");

  /* ═══════════════════════════════════
     NAVEGACIÓN ENTRE PANTALLAS
     ═══════════════════════════════════ */
  function showScreen(id) {
    [screenMain, screenPayment, screenThanks].forEach(s => {
      if (s) s.classList.add("hidden");
    });
    const target = document.getElementById(id);
    if (target) {
      target.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Disparar fade-in
      target.querySelectorAll(".fade-in").forEach(el => {
        el.classList.remove("visible");
        requestAnimationFrame(() => el.classList.add("visible"));
      });
    }
  }

  /* ═══════════════════════════════════
     SELECCIÓN DE PLAN
     ═══════════════════════════════════ */
  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      selectedPlan = radio.value;
      btnContinuar.disabled = false;
      // Actualizar texto del botón
      const plan = PLANS[selectedPlan];
      btnContinuar.textContent = `Continuar al pago · ${plan.price}`;
    });
  });

  /* ═══════════════════════════════════
     CONTINUAR AL PAGO
     ═══════════════════════════════════ */
  if (btnContinuar) {
    btnContinuar.addEventListener("click", () => {
      if (!selectedPlan) return;
      const plan = PLANS[selectedPlan];
      // Actualizar header de pago
      const titleEl = document.getElementById("payment-plan-title");
      const priceEl = document.getElementById("payment-plan-price");
      if (titleEl) titleEl.textContent = plan.label;
      if (priceEl) priceEl.innerHTML = plan.display;
      // Actualizar botón de pago
      const stripeSubmit = document.getElementById("stripe-submit");
      if (stripeSubmit) stripeSubmit.textContent = `Pagar ${plan.price} / mes`;
      const mpSubmit = document.getElementById("mp-submit");
      if (mpSubmit) mpSubmit.textContent = `Pagar ${plan.price} con MercadoPago`;

      showScreen("checkout-payment");
      initStripe();
    });
  }

  /* ─── Regresar ─── */
  if (btnBack) {
    btnBack.addEventListener("click", () => showScreen("checkout-main"));
  }

  /* ═══════════════════════════════════
     TABS: STRIPE / MERCADOPAGO
     ═══════════════════════════════════ */
  methodTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      methodTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const method = tab.dataset.method;
      if (method === "stripe") {
        formStripe.classList.remove("hidden");
        formMP.classList.add("hidden");
        initStripe();
      } else {
        formStripe.classList.add("hidden");
        formMP.classList.remove("hidden");
        initMercadoPago();
      }
    });
  });

  /* ═══════════════════════════════════
     STRIPE
     ═══════════════════════════════════ */
  function initStripe() {
    if (stripeCard) return; // ya montado
    if (!window.Stripe) {
      console.warn("Stripe.js aún no cargó");
      return;
    }

    stripeInstance = Stripe(STRIPE_PUBLIC_KEY);
    const elements = stripeInstance.elements({
      fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Jost:wght@300;400&display=swap" }],
      locale: "es"
    });

    stripeCard = elements.create("card", {
      style: {
        base: {
          fontFamily: "'Jost', sans-serif",
          fontWeight: "300",
          fontSize: "15px",
          color: "#4d453b",
          "::placeholder": { color: "#b8ad9e", fontWeight: "300" },
          iconColor: "#b8ad9e"
        },
        invalid: {
          color: "#a0776a",
          iconColor: "#a0776a"
        }
      }
    });

    const cardEl = document.getElementById("stripe-card-element");
    if (cardEl) stripeCard.mount(cardEl);

    stripeCard.on("change", (e) => {
      const errEl = document.getElementById("stripe-card-errors");
      if (errEl) errEl.textContent = e.error ? e.error.message : "";
    });
  }

  /* ─── Submit Stripe ─── */
  const stripeForm = document.getElementById("stripe-form");
  if (stripeForm) {
    stripeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!stripeInstance || !stripeCard) return;

      const name  = document.getElementById("stripe-name")?.value.trim();
      const email = document.getElementById("stripe-email")?.value.trim();
      if (!name || !email) return;

      const form = document.getElementById("form-stripe");
      form.classList.add("loading");

      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: selectedPlan,
            email: email
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Error del servidor");
        }

        const { clientSecret } = await response.json();

        const { error } = await stripeInstance.confirmCardPayment(clientSecret, {
          payment_method: {
            card: stripeCard,
            billing_details: { name, email }
          }
        });

        if (error) throw error;

        showThanks(email);

      } catch (err) {
        const errEl = document.getElementById("stripe-card-errors");
        if (errEl) errEl.textContent = err.message || "Ocurrió un error. Intenta de nuevo.";
      } finally {
        form.classList.remove("loading");
      }
    });
  }

  /* ═══════════════════════════════════
     MERCADOPAGO
     ═══════════════════════════════════ */
  let mpInitialized = false;

  function initMercadoPago() {
    if (mpInitialized) return;
    if (!window.MercadoPago) {
      console.warn("MercadoPago SDK aún no cargó");
      return;
    }
    mpInitialized = true;

    /* La integración completa de MP requiere genera un preference_id desde
       el backend. El CardForm se monta aquí cuando tengas las keys. */
    const mpForm = document.getElementById("mp-card-form");
    if (mpForm) {
      mpForm.innerHTML = `
        <p style="font-size:0.82rem;color:var(--taupe);font-style:italic;padding:1rem 0;">
          Serás redirigido al checkout seguro de MercadoPago al hacer clic en el botón.
        </p>`;
    }
  }

  /* ─── Submit MercadoPago ─── */
  const mpSubmitBtn = document.getElementById("mp-submit");
  if (mpSubmitBtn) {
    mpSubmitBtn.addEventListener("click", async () => {
      const form = document.getElementById("form-mercadopago");
      form.classList.add("loading");

      try {
        const response = await fetch("/api/create-mp-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: selectedPlan })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Error del servidor");
        }

        const { init_point } = await response.json();
        window.location.href = init_point;

      } catch (err) {
        console.error(err);
      } finally {
        form.classList.remove("loading");
      }
    });
  }

  /* ═══════════════════════════════════
     PANTALLA DE GRACIAS
     ═══════════════════════════════════ */
  function showThanks(email) {
    const plan = PLANS[selectedPlan] || {};
    const detail = document.getElementById("thanks-detail");
    if (detail && email) {
      detail.querySelector("p").textContent =
        `Recibirás la confirmación en ${email} en los próximos minutos con todos los detalles de tu membresía ${plan.label || ""}.`;
    }
    showScreen("checkout-thanks");
  }

  /* ═══════════════════════════════════
     VERIFICAR PAGO DE RETORNO (MP redirect)
     ═══════════════════════════════════ */
  function checkReturnFromMP() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("payment_status") || params.get("status");
    if (status === "approved") {
      selectedPlan = params.get("plan") || "popular";
      showThanks(params.get("email") || "");
    }
  }

  checkReturnFromMP();

  /* ═══════════════════════════════════
     FADE-IN INICIO (pantalla principal)
     ═══════════════════════════════════ */
  /* ═══════════════════════════════════
     PRESELECCIONAR POR QUERYSTRING
     ═══════════════════════════════════ */
  function preselectPlan() {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get("plan");
    if (planParam && PLANS[planParam]) {
      const radio = document.querySelector(`input[value="${planParam}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change"));
      }
    }
  }
  preselectPlan();

  document.querySelectorAll("#checkout-main .fade-in").forEach(el => {
    el.classList.add("visible");
  });

})();
