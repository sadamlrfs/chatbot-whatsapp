// app/routes/route.js
const express = require("express");
const WhatsApp = require("whatsapp");
const { handleWebhookPost, handleWebhookGet } = require("../hooks/mutations");

const { token, phone } = require("../../config");

const app = express();
const wa = new WhatsApp(phone);
const path = require("path");

app.use(express.json());

// ✅ Serve static files (gambar) dari folder public
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.send("Whatsapp with Node.js and Webhooks (using whatsapp lib)");
});

app.get("/webhook", (req, res) => handleWebhookGet(req, res, token));

// ✅ Kirim instance WhatsApp ke handler POST
app.post("/webhook", (req, res) => handleWebhookPost(req, res, wa));

module.exports = app;
