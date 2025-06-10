const sendText = require("../../../utils/sendText");

const formSteps = [
  {
    key: "nama",
    prompt: "*Masukkan Nama Lengkap:*\nContoh: Hendra Aditya",
  },
  {
    key: "nik",
    prompt: "*Masukkan Nomor NIK:*\nContoh: 3723000000000000",
  },
  {
    key: "tanggalLahir",
    prompt: "*Masukkan Tanggal Lahir (hari-bulan-tahun) :*\nContoh: 01-01-2000",
  },
  {
    key: "ibuKandung",
    prompt: "*Masukkan nama ibu kandung:*\nContoh:  Hendra Aditya",
  },
  {
    key: "pekerjaan",
    prompt: "*Masukkan jenis pekerjaan:*\nContoh: Pegawai Swasta",
  },
  {
    key: "penghasilan",
    prompt: "*Masukkan nominal penghasilan rata-rata:*\nContoh: 5000000",
  },
];

const userFormState = {};

async function startFormBpu(wa, from) {
  userFormState[from] = { step: 0, data: {} };
  await sendText(wa, from, formSteps[0].prompt);
}

async function sendStartButton(wa, from) {
  const button_message = {
    type: "button",
    header: {
      type: "text",
      text: "📋FORMULIR PENDAFTARAN BPU",
    },
    body: {
      text: "Kamu akan diminta mengisi data informasi untuk pendaftaran perserta BPU, *mohon isi data dengan benar!*",
    },
    action: {
      buttons: [
        {
          type: "reply",
          reply: { id: "mulai_form_bpu", title: "Mulai Isi Form" },
        },
      ],
    },
  };

  await wa.messages.interactive(button_message, from);
}

async function handleFormBpuReply(wa, from, message) {
  const state = userFormState[from];
  if (!state) return false;

  const currentStep = formSteps[state.step];
  const key = currentStep.key;
  const value = message.trim();

  if (key === "nik") {
    const nikRegex = /^\d{16}$/;
    if (!nikRegex.test(value)) {
      await sendText(
        wa,
        from,
        "❌ *NIK tidak valid.*\nHarus terdiri dari 16 digit angka.\nContoh: 3723000000000000\nCoba lagi."
      );
      return true;
    }
  }

  if (key === "tanggalLahir") {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!dateRegex.test(value)) {
      await sendText(
        wa,
        from,
        "❌ *Format tanggal lahir salah.*\nGunakan format: *dd-mm-yyyy*\nContoh: 01-01-2000\nCoba lagi."
      );
      return true;
    }
  }

  if (key === "penghasilan") {
    const incomeRegex = /^\d+$/;
    if (!incomeRegex.test(value)) {
      await sendText(
        wa,
        from,
        "❌ *Nominal penghasilan harus berupa angka.*\nTanpa titik, koma, atau huruf.\nContoh: 5000000\nCoba lagi."
      );
      return true;
    }
  }

  state.data[key] = value;
  state.step++;

  if (state.step < formSteps.length) {
    await sendText(wa, from, formSteps[state.step].prompt);
  } else {
    const d = state.data;
    const button_message = {
      type: "button",
      header: {
        type: "text",
        text: "📋DATA PENDAFTARAN DITERIMA",
      },
      body: {
        text:
          `Terima kasih, data kamu telah disimpan dan terima dengan isi data sebagai berikut:\n\n` +
          `*Nama:* ${d.nama}\n` +
          `*NIK:* ${d.nik}\n` +
          `*Tanggal Lahir:* ${d.tanggalLahir}\n` +
          `*Nama Ibu Kandung:* ${d.ibuKandung}\n` +
          `*Pekerjaan:* ${d.pekerjaan}\n` +
          `*Penghasilan:* ${d.penghasilan}\n\n` +
          `Kami akan memproses pendaftaran akum BPU kamu. Silakan tunggu informasi selanjutnya🙏🏻`,
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: { id: "menu", title: "Menu Utama" },
          },
        ],
      },
    };

    // Kirim pesan tombol ini:
    await wa.messages.interactive(button_message, from);

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
