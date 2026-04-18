const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  popular: {
    amount: 110000,
    description: "Membresía Fundadora Popular · 12 Clases"
  },
  ilimitado: {
    amount: 220000,
    description: "Membresía Fundadora Ilimitada · 30 días"
  }
};

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { plan, email } = req.body;

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ error: "Plan inválido" });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    const selectedPlan = PLANS[plan];

    const paymentIntent = await stripe.paymentIntents.create({
      amount: selectedPlan.amount,
      currency: "mxn",
      description: selectedPlan.description,
      receipt_email: email,
      metadata: {
        plan: plan,
        type: "membresia_fundadora"
      }
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};
