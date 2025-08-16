const express = require("express");
const router = express.Router();  // ✅ define router

const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

// Initialize payment
router.post("/pay", async (req, res) => {
  try {
    const { email, amount, name } = req.body;

    if (!email || !amount || !name) {
      return res.status(400).json({ status: "error", message: "Missing required fields: email, amount, or name." });
    }

    const payload = {
      tx_ref: "TX-" + Date.now(),
      amount,
      currency: "NGN",
      payment_options: "card, banktransfer, ussd",
      redirect_url: "https://your-frontend.com/payment-callback",
      customer: {
        email,
        phonenumber: "08012345678",
        name,
      },
      customizations: {
        title: "TechyJaunt Payment",
        description: "Payment for services",
        logo: "https://yourdomain.com/logo.png",
      },
    };

    const response = await flw.PaymentInitiation.initialize(payload); // ✅ FIXED

    if (response.status === "success" && response.data && response.data.link) {
      res.status(200).json({
        status: "success",
        link: response.data.link,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: response.message || "Failed to initialize payment."
      });
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Verify payment
router.get("/verify", async (req, res) => {
  try {
    const { transaction_id } = req.query;

    if (!transaction_id) {
      return res.status(400).json({ status: "error", message: "Transaction ID is missing." });
    }

    const response = await flw.Transaction.verify({ id: transaction_id });

    if (response.data.status === "successful") {
      return res.json({ status: "success", data: response.data });
    }

    res.json({ status: "failed", data: response.data });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
