const express = require("express");
const WhatsApp = require("whatsapp");
const { handleWebhookPost, handleWebhookGet } = require("../hooks/mutations");

const { token, phone } = require("../../config");

const app = express();
const wa = new WhatsApp(phone);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Whatsapp with Node.js and Webhooks (using whatsapp lib)");
});

app.get("/webhook", (req, res) => handleWebhookGet(req, res, token));

app.post("/webhook", (req, res) => handleWebhookPost(req, res, wa));

module.exports = app;
