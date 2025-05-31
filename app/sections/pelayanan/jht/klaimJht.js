const sendText = require('../../../utils/sendText');

const formJhtSteps = [
  {
    key: 'nama',
    prompt: '*Masukkan Nama Lengkap:*\nContoh: Lorem Ipsum'
  },
  {
    key: 'nik',
    prompt: '*Masukkan Nomor NIK (16 digit):*\nContoh: 3723000000000000'
  },
  {
    key: 'kpj',
    prompt: '*Masukkan Nomor KPJ (6 digit):*\nContoh: 123456'
  },
  {
    key: 'rekening',
    prompt: '*Masukkan Nomor Rekening Bank:*\nContoh: 1234567890'
  },
];

const userFormJhtState = {};

async function sendStartJhtButton(wa, to) {
  const button_message = {
    type: 'button',
    header: {
      type: 'text',
      text: 'FORMULIR KLAIM JHT'
    },
    body: {
      text: 'Kamu akan diminta mengisi data untuk klaim JHT. *Mohon isi dengan benar!*'
    },
    action: {
      buttons: [
        {
          type: 'reply',
          reply: { id: 'form_jht', title: 'Mulai Isi Form' }
        },
      ]
    }
  };

  await wa.messages.interactive(button_message, to);
}

async function startFormJht(wa, from) {
  userFormJhtState[from] = { step: 0, data: {} };
  await sendText(wa, from, formJhtSteps[0].prompt);
}

async function handleFormJhtReply(wa, from, message) {
  const state = userFormJhtState[from];
  if (!state) return false;

  const currentStep = formJhtSteps[state.step];
  const key = currentStep.key;
  const value = message.trim();

  // === Validasi ===
  switch (key) {
    case 'nama':
      if (!/^[A-Za-z\s]+$/.test(value)) {
        await sendText(wa, from, '❌ Nama hanya boleh berisi huruf dan spasi.\nCoba lagi.');
        return true;
      }
      break;
    case 'nik':
      if (!/^\d{16}$/.test(value)) {
        await sendText(wa, from, '❌ NIK harus 16 digit angka.\nCoba lagi.');
        return true;
      }
      break;
    case 'kpj':
      if (!/^\d{6}$/.test(value)) {
        await sendText(wa, from, '❌ KPJ harus 6 digit angka.\nCoba lagi.');
        return true;
      }
      break;
    case 'rekening':
      if (!/^\d+$/.test(value)) {
        await sendText(wa, from, '❌ Nomor rekening harus berupa angka.\nCoba lagi.');
        return true;
      }
      break;
  }

  state.data[key] = value;
  state.step++;

  if (state.step < formJhtSteps.length) {
    await sendText(wa, from, formJhtSteps[state.step].prompt);
  } else {
    const d = state.data;
   const button_message = {
  type: 'button',
  header: {
    type: 'text',
    text: '📋DATA KLAIM JHT DITERIMA',
  },
  body: {
    text:
      `*Nama:* ${d.nama}\n` +
      `*NIK:* ${d.nik}\n` +
      `*KPJ:* ${d.kpj}\n` +
      `*No. Rekening:* ${d.rekening}\n\n` +
      `Kami akan memproses klaim JHT kamu. Silakan tunggu informasi selanjutnya🙏🏻`,
  },
  action: {
    buttons: [
      {
        type: 'reply',
        reply: { id: 'menu', title: 'Menu Utama' },
      },
    ],
  },
};

// Kirim pesan tombol ini:
await wa.messages.interactive(button_message, from);


    delete userFormJhtState[from];
  }

  return true;
}

module.exports = {
  startFormJht,
  sendStartJhtButton,
  handleFormJhtReply,
  userFormJhtState,
};
