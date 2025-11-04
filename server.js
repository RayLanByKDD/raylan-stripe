// ✅ Serveur Express Stripe – Ray&Lan By KDD
import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();

// ✅ Clé secrète Stripe (test)
const stripe = new Stripe("sk_test_51SK0Ig9xTIHdFCkDSvEJxw3EYB2O8oA5Wn3tVSPPGqfJzMCj7uP6BoN0uxc3U1mOGXqG6VvW5xwRp5rOC8bVxHog00e8jIsv5a");

// ✅ Domaines autorisés
const ALLOWED_ORIGINS = [
  "https://sh-bombolone-028ed1.netlify.app", // ton site Netlify actuel
  "https://graceful-pothos-d95f48.netlify.app" // ancien site, facultatif
];

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Route principale Stripe
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, productName } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Montant invalide." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: productName || "Réservation Ray&Lan By KDD" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: "https://sh-bombolone-028ed1.netlify.app/success.html",
      cancel_url: "https://sh-bombolone-028ed1.netlify.app/cancel.html",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Erreur Stripe :", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Route de vérification
app.get("/health", (req, res) => res.send("✅ Serveur Stripe actif sur Render"));

// ✅ Lancement
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur Stripe en ligne sur le port ${PORT}`));
