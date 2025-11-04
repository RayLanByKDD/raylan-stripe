// ✅ Serveur Express Stripe – Ray&Lan By KDD
import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();

// ✅ Clé secrète Stripe (test)
const stripe = new Stripe("sk_test_51SK0Ig9xTIHdFCkDSvEJxw3EYB2O8oA5Wn3tVSPPGqfJzMCj7uP6BoN0uxc3U1mOGXqG6VvW5xwRp5rOC8bVxHog00e8jIsv5a");

// ✅ Domaines autorisés (ton site Netlify)
const ALLOWED_ORIGINS = [
  "https://graceful-pothos-d95f48.netlify.app",
  "https://beamish-bombolone-028ed1.netlify.app",
  "https://sh-bombolone-028ed1.netlify.app"
];

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Non autorisé par CORS"));
  },
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ Route pour créer une session Stripe Checkout
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, productName } = req.body;
    if (!amount) return res.status(400).json({ error: "Montant manquant" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: productName || "Course Ray&Lan By KDD" },
          unit_amount: amount
        },
        quantity: 1
      }],
      success_url: "https://graceful-pothos-d95f48.netlify.app/success.html",
      cancel_url: "https://graceful-pothos-d95f48.netlify.app/cancel.html"
    });

    res.json({ url: session.url }); // ✅ renvoie bien l'URL Stripe
  } catch (err) {
    console.error("Erreur Stripe:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Test rapide
app.get("/", (req, res) => res.send("🚀 Serveur Stripe Ray&Lan actif"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Serveur Stripe en ligne sur le port ${PORT}`));
