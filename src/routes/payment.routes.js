const express = require("express");
const router = express.Router();

const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

// Initialize payment
router.post("/pay", async (req, res) => {
  try {
    const { email, amount, name } = req.body;

    if (!email || !amount || !name) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    const tx_ref = "TX-" + Date.now(); // unique transaction reference

    const payload = {
      tx_ref,
      amount,
      currency: "NGN",
      payment_options: "card, banktransfer, ussd",
      redirect_url: "https://your-backend.onrender.com/api/payments/callback", //auto verify
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

    const response = await flw.Payment.initialize(payload);

    if (response.status === "success" && response.data && response.data.link) {
      return res.status(200).json({ status: "success", link: response.data.link });
    } else {
      return res.status(400).json({ status: "error", message: response.message || "Failed to initialize payment" });
    }
  } catch (error) {
    console.error("Payment Init Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

//Auto-verify after Flutterwave redirects here
router.get("/callback", async (req, res) => {
  try {
    const { transaction_id } = req.query; // Flutterwave adds this automatically

    if (!transaction_id) {
      return res.status(400).json({ status: "error", message: "Transaction ID missing" });
    }

    const response = await flw.Transaction.verify({ id: transaction_id });

    if (response.data.status === "successful") {
      // TODO: save payment record to DB here
      console.log("Payment verified:", response.data);

      return res.json({
        status: "success",
        message: "Payment verified successfully",
        data: response.data,
      });
    } else {
      return res.json({ status: "failed", message: "Payment failed", data: response.data });
    }
  } catch (error) {
    console.error("Callback Verify Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
