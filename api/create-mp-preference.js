const PLANS = {
  popular: {
    title: "Membresía Fundadora Popular · 12 Clases",
    price: 1100,
    currency: "MXN"
  },
  ilimitado: {
    title: "Membresía Fundadora Ilimitada · 30 días",
    price: 2200,
    currency: "MXN"
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
    const { plan } = req.body;

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ error: "Plan inválido" });
    }

    const selectedPlan = PLANS[plan];
    const siteUrl = process.env.SITE_URL || "https://casa-boreal.vercel.app";

    const preference = {
      items: [
        {
          title: selectedPlan.title,
          unit_price: selectedPlan.price,
          quantity: 1,
          currency_id: selectedPlan.currency
        }
      ],
      back_urls: {
        success: `${siteUrl}/checkout?payment_status=approved&plan=${plan}`,
        failure: `${siteUrl}/checkout?payment_status=failure&plan=${plan}`,
        pending: `${siteUrl}/checkout?payment_status=pending&plan=${plan}`
      },
      auto_return: "approved",
      statement_descriptor: "Casa Boreal",
      metadata: {
        plan: plan,
        type: "membresia_fundadora"
      }
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("MercadoPago error:", errorData);
      return res.status(500).json({ error: "Error al crear la preferencia" });
    }

    const data = await response.json();

    res.status(200).json({
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point
    });
  } catch (err) {
    console.error("MercadoPago error:", err.message);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};
