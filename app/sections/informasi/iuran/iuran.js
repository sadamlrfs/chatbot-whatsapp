const sendText = require('../../../utils/sendText');
const sendButton = require('../../../utils/sendButton');

const formTagihanSteps = [
  {
    key: 'npp',
    prompt: '*Masukkan Nomor NPP Perusahaan (8 digit):*\nContoh: 12345678'
  }
];

const userFormTagihanState = {};

async function startFormTagihan(wa, from) {
  userFormTagihanState[from] = { step: 0, data: {} };
  await sendText(wa, from, formTagihanSteps[0].prompt);
}

async function handleFormTagihanReply(wa, from, message) {
  const state = userFormTagihanState[from];
  if (!state) return false;

  const currentStep = formTagihanSteps[state.step];
  const key = currentStep.key;
  const value = message.trim();

  if (!/^\d{8}$/.test(value)) {
    await sendText(wa, from, '❌ NPP harus terdiri dari 8 digit angka.\nCoba lagi.');
    return true;
  }

  state.data[key] = value;
  state.step++;

  const totalTagihan = 'Rp. 1.500.000'; 
  await sendText(
    wa,
    from,
    `✅ *Informasi Tagihan Iuran*\n\n` +
    `*NPP Perusahaan:* ${value}\n` +
    `*Total Tagihan:* ${totalTagihan}`
  );

  await sendButton(
    wa,
    from,
    'Klik tombol di bawah untuk kembali ke Menu Utama',
    [{ id: 'menu', title: 'Menu Utama' }]
  );

  delete userFormTagihanState[from];
  return true;
}

module.exports = {
  
  startFormTagihan,
  handleFormTagihanReply,
  userFormTagihanState,
};
