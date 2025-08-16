const express = require("express");
const router = express.Router();

const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

// Initialize Payment
router.post("/pay", async (req, res) => {
  try {
    const { email, amount, name } = req.body;

    if (!email || !amount || !name) {
      return res.status(400).json({ status: "error", message: "Missing fields: email, amount, name." });
    }

    const payload = {
      tx_ref: "TX-" + Date.now(),
      amount,
      currency: "NGN",
      payment_options: "card, banktransfer, ussd",
      redirect_url: "https://techyjaunt.onrender.com/api/payments/verify", //must point to your backend
      customer: {
        email,
        phonenumber: "08012345678",
        name,
      },
      customizations: {
        title: "TechyJaunt Car Rental",
        description: "Payment for car rental",
        logo: "https://yourdomain.com/logo.png",
      },
    };

    const response = await flw.Payment.initialize(payload); 

    if (response.status === "success" && response.data && response.data.link) {
      return res.json({ status: "success", link: response.data.link });
    } else {
      return res.status(400).json({ status: "error", message: response.message });
    }
  } catch (error) {
    console.error("Flutterwave Init Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Verify Payment
router.get("/verify", async (req, res) => {
  try {
    const { transaction_id } = req.query;

    if (!transaction_id) {
      return res.status(400).json({ status: "error", message: "Transaction ID is required" });
    }

    const response = await flw.Transaction.verify({ id: transaction_id });

    if (response.data.status === "successful") {
      return res.json({ status: "success", data: response.data });
    }

    res.json({ status: "failed", data: response.data });
  } catch (error) {
    console.error("Flutterwave Verify Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
