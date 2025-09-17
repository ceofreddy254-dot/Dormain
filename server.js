// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

// In-memory store (replace with DB in production)
const receipts = {};

app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://ceofreddy.onrender.com", // frontend URL
  })
);

function formatPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 9 && digits.startsWith("7")) return "254" + digits;
  if (digits.length === 10 && digits.startsWith("07")) return "254" + digits.substring(1);
  if (digits.length === 12 && digits.startsWith("254")) return digits;
  return null;
}

app.post("/pay", async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const formattedPhone = formatPhone(phone);

    if (!formattedPhone) {
      return res.status(400).json({ success: false, error: "Invalid phone format" });
    }
    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, error: "Amount must be >= 1" });
    }

    const reference = "INV-" + Date.now();

    // Save pending receipt
    receipts[reference] = {
      reference,
      phone: formattedPhone,
      amount,
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    const payload = {
      amount: Math.round(amount),
      phone_number: formattedPhone,
      external_reference: reference,
      customer_name: "Investor",
      callback_url: "https://dormainsearch.onrender.com/callback",
      channel_id: "000103",
    };

    const url = "https://swiftwallet.co.ke/pay-app-v2/payments.php";
    const resp = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer YOUR_API_KEY`,
        "Content-Type": "application/json",
      },
    });

    if (resp.data.success) {
      res.json({ success: true, message: "STK push sent, check your phone", reference });
    } else {
      res.status(400).json({
        success: false,
        error: resp.data.error || "Failed to initiate payment",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.response?.data?.error || "Server error",
    });
  }
});

app.post("/callback", (req, res) => {
  console.log("Callback received:", req.body);

  const ref =
    req.body?.Body?.stkCallback?.MerchantRequestID ||
    req.body?.external_reference;

  if (ref && receipts[ref]) {
    const receipt = receipts[ref];
    receipt.status =
      req.body.Body?.stkCallback?.ResultCode === 0 ? "completed" : "failed";
    receipt.transaction_id =
      req.body.Body?.stkCallback?.CheckoutRequestID || null;
    receipt.transaction_code =
      req.body.Body?.stkCallback?.MpesaReceiptNumber || null;
    receipt.timestamp = new Date().toISOString();

    if (receipt.status === "completed") {
      receipt.note = `Investment of KES ${receipt.amount} was successful. Your portfolio has been updated.`;
    } else {
      receipt.note = "Investment failed. Please try again.";
    }
  }

  res.json({ ResultCode: 0, ResultDesc: "Success" });
});

app.get("/receipt/:reference", (req, res) => {
  const receipt = receipts[req.params.reference];
  if (!receipt) {
    return res.status(404).json({ success: false, error: "Receipt not found" });
  }
  res.json({ success: true, receipt });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
