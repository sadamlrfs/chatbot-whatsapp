const express = require('express');
const WhatsApp = require('whatsapp');
const { sendText, firtMessage, pendaftaranPeserta, pelayananJaminan, informasiPelayanan } = require('../sections/sections');
const { startFormBpu, sendStartButton, handleFormBpuReply, userFormState } = require('../sections/pendaftaran/bpu/pendaftaranBpu');
const { startFormJht, sendStartJhtButton, handleFormJhtReply, userFormJhtState } = require('../sections/pelayanan/jht/klaimJht');
const { startFormTagihan, handleFormTagihanReply, userFormTagihanState } = require('../sections/informasi/iuran/iuran');




const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID;
const app = express();
const wa = new WhatsApp(WA_PHONE_NUMBER_ID);

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

    if (userFormState[from] || userFormJhtState[from] || userFormTagihanState[from]) {
  if (type === 'text') {
    const text = messages.text.body;

    if (userFormState[from]) {
      const handledBpu = await handleFormBpuReply(waInstance, from, text);
      if (handledBpu) return res.status(200).send('Form BPU handled');
    }

    if (userFormJhtState[from]) {
      const handledJht = await handleFormJhtReply(waInstance, from, text);
      if (handledJht) return res.status(200).send('Form JHT handled');
    }

    if (userFormTagihanState[from]) {
  const handledTagihan = await handleFormTagihanReply(waInstance, from, text);
  if (handledTagihan) return res.status(200).send('Form Tagihan handled');
}
  }

  return res.status(200).send('Waiting for form input');
}


    if (type === 'text') {
      await firtMessage(waInstance, from);
    } else if (type === 'interactive') {
      const interactive = messages.interactive;

      if (interactive.type === 'list_reply') {
  const { id, title } = interactive.list_reply;

  switch (id) {
    case 'pendaftaran_bpu':
      await sendStartButton(waInstance, from);
      break;

      case 'klaim_jht':
      await sendStartJhtButton(waInstance, from);
      break;

      case 'info_tagihan':
    await startFormTagihan(waInstance, from);
    break;
    
    default:
      await sendText(waInstance, from, 'Anda memilih ' + title +'. Fitur masih dalam pengembangan.');
  }
}


     if (interactive.type === 'button_reply') {
  const { id, title } = interactive.button_reply;

  if (id === 'mulai_form_bpu') {
    await startFormBpu(waInstance, from);
    
  } else if (id === 'menu') {
    await firtMessage(waInstance, from);} else if (id === 'pendaftaran') {
          await pendaftaranPeserta(waInstance, from);
        } else if (id === 'pelayanan') {
          await pelayananJaminan(waInstance, from);
        } else if (id === 'informasi') {
          await informasiPelayanan(waInstance, from);
        } else if (id === 'form_jht') {
  await startFormJht(waInstance, from);
} else if (id === 'info_iuran') {
  await startFormTagihan(waInstance, from);
}           
        else {
          await sendText(waInstance, from, `Anda memilih tombol: ${title} (${id})`);
        }
      }
    } else {
      await firtMessage(waInstance, from);
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
