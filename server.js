// ✅ Serveur Express Stripe – Ray&Lan By KDD
import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();

// ✅ Ta clé secrète Stripe (test)
const stripe = new Stripe("sk_test_51SK0Ig9xTIHdFCkDSvEJxw3EYB2O8oA5Wn3tVSPPGqfJzMCj7uP6BoN0uxc3U1mOGXqG6VvW5xwRp5rOC8bVxHog00e8jIsv5a");

// ✅ Domaines autorisés (Netlify uniquement)
const ALLOWED_ORIGINS = [
  "https://beamish-bombolone-028ed1.netlify.app", // ton site actuel
];

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS bloqué pour : " + origin));
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Route de création de session Stripe
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, productName } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Montant invalide ou manquant." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: productName || "Course Ray&Lan" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: "https://beamish-bombolone-028ed1.netlify.app/success.html",
      cancel_url: "https://beamish-bombolone-028ed1.netlify.app/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Erreur Stripe :", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route test
app.get("/health", (req, res) => res.send("✅ Serveur Stripe actif sur Render 🚀"));

// ✅ Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur en ligne sur le port ${PORT}`));
