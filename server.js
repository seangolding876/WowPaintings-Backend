
const express = require("express");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

app.use(cors());
app.use(express.json());

const PRICE_MAP = {
  "price_50GBP": "price_50GBP",
  "price_100GBP": "price_100GBP",
  "price_150GBP": "price_150GBP"
};

app.post("/create-checkout-session", async (req, res) => {
  const { priceId } = req.body;
  const realPriceId = PRICE_MAP[priceId];

  if (!realPriceId) return res.status(400).send("Invalid price ID");

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: realPriceId,
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: "https://wowpaintings.co.uk/success",
      cancel_url: "https://wowpaintings.co.uk/commission"
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
