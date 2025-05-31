const formTagihanSteps = [
  {
    key: 'npp',
    prompt: '*Masukkan Nomor NPP Perusahaan (8 digit):*\nContoh: 12345678'
  }
];

const userFormTagihanState = {};

async function startFormTagihan(wa, from) {
  userFormTagihanState[from] = { step: 0, data: {} };

  await wa.messages.text({ body: formTagihanSteps[0].prompt }, from);
}

async function handleFormTagihanReply(wa, from, message) {
  const state = userFormTagihanState[from];
  if (!state) return false;

  const currentStep = formTagihanSteps[state.step];
  const key = currentStep.key;
  const value = message.trim();

  if (!/^\d{8}$/.test(value)) {
    await wa.messages.text(
      { body: '❌ NPP harus terdiri dari 8 digit angka.\nCoba lagi.' },
      from
    );
    return true;
  }

  state.data[key] = value;
  state.step++;

  const totalTagihan = 'Rp. 1.500.000';
  const button_message = {
      type: 'button',
      header: {
        type: 'text',
        text: '✅ Informasi Tagihan Iuran'
      },
      body: {
        text: `*NPP Perusahaan:* ${value}\n` +
        `*Total Tagihan:* ${totalTagihan}`
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'menu',
              title: 'Menu Utama'
            }
          }
        ]
      }
  };

  await wa.messages.interactive(button_message, from);

  delete userFormTagihanState[from];
  return true;
}

module.exports = {
  startFormTagihan,
  handleFormTagihanReply,
  userFormTagihanState,
};
