// server.js
import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
const stripe = new Stripe("sk_test_VOTRE_CLE_SECRETE_ICI"); // Mets ta clé secrète Stripe ici
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Réservation Ray&Lan" },
            unit_amount: 2000, // Prix en centimes (€20)
          },
          quantity: 1,
        },
      ],
      success_url: "https://tonsite.netlify.app/success.html",
      cancel_url: "https://tonsite.netlify.app/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(10000, () => console.log("Serveur Stripe en ligne sur Render"));