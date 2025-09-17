const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// JSON storage file for receipts
const receiptsFile = path.join(__dirname, "receipts.json");

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://ceofreddy.onrender.com"
  })
);

// Helpers for receipts
function readReceipts() {
  if (!fs.existsSync(receiptsFile)) return {};
  return JSON.parse(fs.readFileSync(receiptsFile));
}
function writeReceipts(data) {
  fs.writeFileSync(receiptsFile, JSON.stringify(data, null, 2));
}

// Phone formatter
function formatPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 9 && digits.startsWith("7")) return "254" + digits;
  if (digits.length === 10 && digits.startsWith("07"))
    return "254" + digits.substring(1);
  if (digits.length === 12 && digits.startsWith("254")) return digits;
  return null;
}

// 1ï¸âƒ£ Initiate Payment
app.post("/pay", async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const formattedPhone = formatPhone(phone);

    if (!formattedPhone) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid phone format" });
    }
    if (!amount || amount < 1) {
      return res
        .status(400)
        .json({ success: false, error: "Amount must be >= 1" });
    }

    const reference = "ORDER-" + Date.now();

    const payload = {
      amount: Math.round(amount),
      phone_number: formattedPhone,
      external_reference: reference,
      customer_name: "Customer",
      callback_url: "https://dormainsearch.onrender.com/callback",
      channel_id: "000103"
    };

    const url = "https://swiftwallet.co.ke/pay-app-v2/payments.php";
    const resp = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer fb53284f56ed14a6ea3ca908c70763b5d00d03e769576611e5f337709d4c7f5a`,
        "Content-Type": "application/json"
      }
    });

    console.log("SwiftWallet response:", resp.data);

    if (resp.data.success) {
      // Save pending receipt
      let receipts = readReceipts();
      receipts[reference] = {
        reference,
        transaction_id: resp.data.transaction_id || null,
        transaction_code: null,
        amount: Math.round(amount),
        phone: formattedPhone,
        status: "pending",
        timestamp: new Date().toISOString()
      };
      writeReceipts(receipts);

      res.json({
        success: true,
        message: "STK push sent, check your phone",
        reference
      });
    } else {
      res.status(400).json({
        success: false,
        error: resp.data.error || "Failed to initiate payment"
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.response?.data?.error || "Server error"
    });
  }
});

// 2ï¸âƒ£ Callback handler
app.post("/callback", (req, res) => {
  console.log("Callback received:", req.body);

  const data = req.body;
  const ref = data.external_reference;

  let receipts = readReceipts();

  receipts[ref] = {
    reference: ref,
    transaction_id: data.transaction_id,
    transaction_code: data.result?.MpesaReceiptNumber || null,
    amount: data.result?.Amount || null,
    phone: data.result?.Phone || null,
    status: data.status,
    timestamp: data.timestamp
  };

  writeReceipts(receipts);

  // Must always return 200
  res.json({ ResultCode: 0, ResultDesc: "Success" });
});

// 3ï¸âƒ£ Fetch receipt endpoint
app.get("/receipt/:reference", (req, res) => {
  const receipts = readReceipts();
  const receipt = receipts[req.params.reference];

  if (!receipt) {
    return res
      .status(404)
      .json({ success: false, error: "Receipt not found" });
  }

  res.json({ success: true, receipt });
});

// Start server
app.listen(PORT, () => {
  console.log(`ðŸš€ Server running on port ${PORT}`);
});
