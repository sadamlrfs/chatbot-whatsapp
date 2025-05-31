const sendText = require('../../../utils/sendText');
const sendButton = require('../../../utils/sendButton');

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

async function sendStartJhtButton(wa, from) {
  await sendText(wa, from, '*Formulir Klaim JHT*\n\nKamu akan diminta mengisi data untuk klaim JHT. *Mohon isi dengan benar!*');
  await sendButton(
    wa,
    from,
    'Tekan untuk memulai klaim JHT',
    [{ id: 'form_jht', title: 'Mulai Klaim JHT' }]
  );
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

  // Simpan jawaban dan lanjut
  state.data[key] = value;
  state.step++;

  if (state.step < formJhtSteps.length) {
    await sendText(wa, from, formJhtSteps[state.step].prompt);
  } else {
    const d = state.data;
    await sendText(
      wa,
      from,
      `📋 *Data Klaim JHT Telah Diterima*\n\n` +
      `*Nama:* ${d.nama}\n` +
      `*NIK:* ${d.nik}\n` +
      `*KPJ:* ${d.kpj}\n` +
      `*No. Rekening:* ${d.rekening}\n\n` +
      `Kami akan memproses klaim JHT kamu. Silakan tunggu informasi selanjutnya.`
    );

    await sendButton(
      wa,
      from,
      'Tekan tombol di bawah untuk kembali ke Menu Utama',
      [{ id: 'menu', title: 'Menu Utama' }]
    );

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
