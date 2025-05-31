const sendText = require('../../../utils/sendText');
const sendButton = require('../../../utils/sendButton');

const formSteps = [
  { 
    key: 'nama', 
    prompt: '*Masukkan Nama Lengkap:*\nContoh: Lorem Ipsum' 
  },
  { 
    key: 'nik', 
    prompt: '*Masukkan Nomor NIK:*\nContoh: 3723000000000000' 
  },
  { 
    key: 'tanggalLahir', 
    prompt: '*Masukkan Tanggal Lahir (hari-tanggal-tahun) :*\nContoh: 01-01-2000' 
  },
  { 
    key: 'ibuKandung', 
    prompt: '*Masukkan nama ibu kandung:*\nContoh: Lorem Ipsum' 
  },
  { 
    key: 'pekerjaan', 
    prompt: '*Masukkan jenis pekerjaan:*\nContoh: Pegawai Swasta' 
  },
  { 
    key: 'penghasilan', 
    prompt: '*Masukkan nominal penghasilan rata-rata:*\nContoh: 5000000' 
  },
];


const userFormState = {}; 

async function startFormBpu(wa, from) {
  userFormState[from] = { step: 0, data: {} };
  await sendText(wa, from, formSteps[0].prompt);
}

async function sendStartButton(wa, from) {
  await sendText(wa, from, '*Formulir Pendaftaran BPU*\n\nKamu akan diminta mengisi data informasi untuk pendaftaran perserta BPU, *mohon isi data dengan benar!*');
  await sendButton(
    wa,
    from,
      'Tekan untuk memulai!',
    [
      { id: 'mulai_form_bpu', title: 'Mulai Isi Form' }
    ]
  );
}

async function handleFormBpuReply(wa, from, message) {
  const state = userFormState[from];
  if (!state) return false;

  const currentStep = formSteps[state.step];
  const key = currentStep.key;
  const value = message.trim();

  // 🔒 Validasi input
  if (key === 'nik') {
    const nikRegex = /^\d{16}$/;
    if (!nikRegex.test(value)) {
      await sendText(wa, from, '❌ *NIK tidak valid.*\nHarus terdiri dari 16 digit angka.\nContoh: 3723000000000000\nCoba lagi.');
      return true;
    }
  }

  if (key === 'tanggalLahir') {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!dateRegex.test(value)) {
      await sendText(wa, from, '❌ *Format tanggal lahir salah.*\nGunakan format: *dd-mm-yyyy*\nContoh: 01-01-2000\nCoba lagi.');
      return true;
    }
  }

  if (key === 'penghasilan') {
    const incomeRegex = /^\d+$/;
    if (!incomeRegex.test(value)) {
      await sendText(wa, from, '❌ *Nominal penghasilan harus berupa angka.*\nTanpa titik, koma, atau huruf.\nContoh: 5000000\nCoba lagi.');
      return true;
    }
  }

  // ✅ Simpan data jika lolos validasi
  state.data[key] = value;
  state.step++;

  if (state.step < formSteps.length) {
    await sendText(wa, from, formSteps[state.step].prompt);
  } else {
    const d = state.data;
    await sendText(
      wa,
      from,
      `📋 *Seluruh Data Kamu Telah Diterima*\n\n` +
      `Terima kasih, data kamu telah disimpan dan terima dengan isi data sebagai berikut:\n\n` +
      `*Nama:* ${d.nama}\n` +
      `*NIK:* ${d.nik}\n` +
      `*Tanggal Lahir:* ${d.tanggalLahir}\n` +
      `*Nama Ibu Kandung:* ${d.ibuKandung}\n` +
      `*Pekerjaan:* ${d.pekerjaan}\n` +
      `*Penghasilan:* ${d.penghasilan}\n\n` +
      `Untuk informasi selanjutnya akan kami hubungi kemudian hari setelah data diverifikasi, mohon untuk ditunggu.`
    );

    await sendButton(
      wa,
      from,
      'Tekan untuk kembali ke menu utama!',
      [
        { id: 'menu', title: 'Menu Utama' }
      ]
    );

    delete userFormState[from];
  }

  return true;
}



module.exports = {
  startFormBpu,
  sendStartButton,
  handleFormBpuReply,
  userFormState,
};
