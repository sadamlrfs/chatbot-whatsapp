const express = require('express');
const WhatsApp = require('whatsapp');
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID;
const { sendText, firtMessage, pendaftaranPeserta, pelayananJaminan, informasiPelayanan } = require('../sections/sections');

const wa = new WhatsApp(WA_PHONE_NUMBER_ID);
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Whatsapp with Node.js and Webhooks (using whatsapp lib)');
});

app.get('/webhook', handleWebhookGet);

app.post('/webhook', (req, res) => handleWebhookPost(req, res, wa));

async function handleWebhookPost(req, res, waInstance) {
  const { entry } = req.body;

  if (!entry || entry.length === 0) {
    return res.status(400).send('Invalid Request');
  }

  const changes = entry[0].changes;
  if (!changes || changes.length === 0) {
    return res.status(400).send('Invalid Request');
  }

  const statuses = changes[0].value.statuses?.[0];
  const messages = changes[0].value.messages?.[0];

  if (statuses) {
    console.log(`MESSAGE STATUS UPDATE: ID: ${statuses.id}, STATUS: ${statuses.status}`);
  }

  if (messages) {
    const from = messages.from;
    const type = messages.type;

    if (type === 'text') {
      const text = messages.text.body.toLowerCase();

      if (text === 'hello') {
        await sendText(waInstance, from, 'Hello. How are you?');
      } else if (text === 'list') {
        await pendaftaranPeserta(waInstance, from);
      } else if (text === 'buttons') {
        await firtMessage(waInstance, from);
      }
    }

    if (type === 'interactive') {
      const interactive = messages.interactive;

      if (interactive.type === 'list_reply') {
        const { id, title } = interactive.list_reply;
        await sendText(waInstance, from, `You selected: ${title} (${id})`);
      }

      

      if (interactive.type === 'button_reply') {
        const { id, title } = interactive.button_reply;

        if (id === 'pendaftaran') {
          await pendaftaranPeserta(waInstance, from);
        } else if (id === 'pelayanan') {
          await pelayananJaminan(waInstance, from);
        }  else if (id === 'informasi') {
          await informasiPelayanan(waInstance, from);
        } else {
          await sendText(waInstance, from, `You selected button: ${title} (${id})`);
        }
      }
    }

    console.log(JSON.stringify(messages, null, 2));
  }

  res.status(200).send('Webhook processed');
}

function handleWebhookGet(req, res) {
  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const token = req.query['hub.verify_token'];

  if (mode && token === WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
}

module.exports = app;
