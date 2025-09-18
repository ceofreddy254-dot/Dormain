const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit"); // ✅ Keep this one only

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

// 1️⃣ Initiate Payment
app.post("/pay", async (req, res) => {
  try {
    const { phone, amount, loan_amount } = req.body;
    const formattedPhone = formatPhone(phone);

    if (!formattedPhone) {
      return res.status(400).json({ success: false, error: "Invalid phone format" });
    }
    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, error: "Amount must be >= 1" });
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
      const receiptData = {
        reference,
        transaction_id: resp.data.transaction_id || null,
        transaction_code: null,
        amount: Math.round(amount),
        loan_amount: loan_amount || "50000",
        phone: formattedPhone,
        status: "pending",
        status_note: `STK push sent to ${formattedPhone}. Please enter your M-Pesa PIN to complete payment.`,
        timestamp: new Date().toISOString()
      };

      let receipts = readReceipts();
      receipts[reference] = receiptData;
      writeReceipts(receipts);

      res.json({
        success: true,
        message: "STK push sent, check your phone",
        reference,
        receipt: receiptData
      });
    } else {
      const failedReceiptData = {
        reference,
        transaction_id: resp.data.transaction_id || null,
        transaction_code: null,
        amount: Math.round(amount),
        loan_amount: loan_amount || "50000",
        phone: formattedPhone,
        status: "stk_failed",
        status_note: "STK push failed to send. Please try again or contact support.",
        timestamp: new Date().toISOString()
      };

      let receipts = readReceipts();
      receipts[reference] = failedReceiptData;
      writeReceipts(receipts);

      res.status(400).json({
        success: false,
        error: resp.data.error || "Failed to initiate payment",
        receipt: failedReceiptData
      });
    }
  } catch (err) {
    console.error("Payment initiation error:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });

    const reference = "ORDER-" + Date.now();
    const { phone, amount, loan_amount } = req.body;
    const formattedPhone = formatPhone(phone);

    const errorReceiptData = {
      reference,
      transaction_id: null,
      transaction_code: null,
      amount: amount ? Math.round(amount) : null,
      loan_amount: loan_amount || "50000",
      phone: formattedPhone,
      status: "error",
      status_note: "System error occurred. Please try again later.",
      timestamp: new Date().toISOString()
    };

    let receipts = readReceipts();
    receipts[reference] = errorReceiptData;
    writeReceipts(receipts);

    res.status(500).json({
      success: false,
      error: err.response?.data?.error || err.message || "Server error",
      receipt: errorReceiptData
    });
  }
});

  // 2️⃣ Callback handler
app.post("/callback", (req, res) => {
  console.log("Callback received:", req.body);

  const data = req.body;
  const ref = data.external_reference;
  let receipts = readReceipts();
  const existingReceipt = receipts[ref] || {};

  // Normalize status
  const status = data.status?.toLowerCase();
  const resultCode = data.result?.ResultCode;

  // Try to build customer name from result
  const customerName = data.result?.Name 
    || [data.result?.FirstName, data.result?.MiddleName, data.result?.LastName].filter(Boolean).join(" ")
    || existingReceipt.customer_name
    || "N/A";

  if ((status === "completed" && data.success === true) || resultCode === 0) {
    receipts[ref] = {
      reference: ref,
      transaction_id: data.transaction_id,
      transaction_code: data.result?.MpesaReceiptNumber || null,
      amount: data.result?.Amount || existingReceipt.amount || null,
      loan_amount: existingReceipt.loan_amount || "50000",
      phone: data.result?.Phone || existingReceipt.phone || null,
      customer_name: customerName,   // ✅ store name
      status: "success",
      status_note: `Loan withdrawal is successful and the fee was accepted. You will receive the applied loan amount in the next 19 minutes.\n\nRegards Swift Loan Kenya 🇰🇪`,
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } else {
    receipts[ref] = {
      reference: ref,
      transaction_id: data.transaction_id,
      transaction_code: null,
      amount: data.result?.Amount || existingReceipt.amount || null,
      loan_amount: existingReceipt.loan_amount || "50000",
      phone: data.result?.Phone || existingReceipt.phone || null,
      customer_name: customerName,   // ✅ keep name even in failed/cancelled
      status: "cancelled",
      status_note: data.result?.ResultDesc || "Payment was cancelled or failed. Your loan will remain on hold (expire) for 24 hours and will not be withdrawn. Retry or contact customer care for assistance.",
      timestamp: data.timestamp || new Date().toISOString(),
    };
  }

  writeReceipts(receipts);

  // Must always return 200
  res.json({ ResultCode: 0, ResultDesc: "Success" });
});

// 3️⃣ Fetch receipt
app.get("/receipt/:reference", (req, res) => {
  const receipts = readReceipts();
  const receipt = receipts[req.params.reference];

  if (!receipt) {
    return res.status(404).json({ success: false, error: "Receipt not found" });
  }

  res.json({ success: true, receipt });
});

// 4️⃣ PDF receipt
app.get("/receipt/:reference/pdf", (req, res) => {
  const receipts = readReceipts();
  const receipt = receipts[req.params.reference];

  if (!receipt) {
    return res.status(404).json({ success: false, error: "Receipt not found" });
  }

  if (receipt.status !== "success") {
    return res.status(400).json({
      success: false,
      error: "PDF receipt only available after successful payment"
    });
  }

  generateReceiptPDF(receipt, res);
});

// ✅ PDF generator
   
function generateReceiptPDF(receipt, res) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=receipt-${receipt.reference}.pdf`);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  // 🎨 Header background
  doc
    .rect(0, 0, doc.page.width, 80)
    .fill("#2196F3");

  // ⚡ Flash logo (emoji as logo)
  doc
    .fillColor("yellow")
    .fontSize(40)
    .text("⚡", 20, 20, { align: "left" });

  // Company name
  doc
    .fillColor("white")
    .fontSize(24)
    .text("SwiftLoan Kenya", 70, 25, { align: "left" })
    .fontSize(12)
    .text("Loan & Payment Receipt", 70, 55);

  doc.moveDown(3);

  // 🧾 Receipt details
  doc.fillColor("black").fontSize(14).text("Receipt Details", { underline: true });
  doc.moveDown();

  const details = [
  ["Reference", receipt.reference],
  ["Transaction ID", receipt.transaction_id || "N/A"],
  ["Transaction Code", receipt.transaction_code || "N/A"],
  ["Fee Amount", `KSH ${receipt.amount}`],
  ["Loan Amount", `KSH ${receipt.loan_amount}`],
  ["Phone", receipt.phone],
  ["Customer Name", receipt.customer_name || "N/A"],   // ✅ new line
  ["Status", receipt.status.toUpperCase()],
  ["Time", new Date(receipt.timestamp).toLocaleString()],
];

  details.forEach(([key, value]) => {
    doc.fontSize(12).text(`${key}: `, { continued: true }).text(value);
  });

  doc.moveDown();

  // 📝 Status note
  if (receipt.status_note) {
    doc
      .fontSize(12)
      .fillColor("#555")
      .text("Note:", { underline: true })
      .moveDown(0.5)
      .text(receipt.status_note);
  }

  // ✅ Watermark for success
  if (receipt.status === "success") {
    doc
      .fontSize(60)
      .fillColor("green")
      .opacity(0.2)
      .rotate(-30, { origin: [300, 400] })
      .text("PAID", 150, 400, { align: "center" })
      .rotate(30, { origin: [300, 400] })
      .opacity(1);
  }

  // Footer
  doc.moveDown(2);
  doc
    .fontSize(10)
    .fillColor("gray")
    .text("⚡ SwiftLoan Kenya © 2024", { align: "center" });

  doc.end();
}
// 5️⃣ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
