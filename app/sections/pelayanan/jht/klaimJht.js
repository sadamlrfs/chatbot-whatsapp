const sendText = require("../../../utils/sendText");

const databaseJht = [
  {
    nik: "1234567890123456",
    nama: "Hendra Aditya",
    kpj: "123456",
    ttl: "Bali, 20 Februari 1995",
    ibu_kandung: "Rihanna",
    perusahaan: "Herdaya Inti Sejahtera",
  },
];

const formJhtSteps = [
  { key: "nama", prompt: "*Masukkan Nama Lengkap:*\nContoh: Hendra Aditya" },
  {
    key: "nik",
    prompt: "*Masukkan Nomor NIK (16 digit):*\nContoh: 3723000000000000",
  },
  { key: "kpj", prompt: "*Masukkan Nomor KPJ (6 digit):*\nContoh: 123456" },
  {
    key: "ttl",
    prompt:
      "*Masukkan Tempat dan Tanggal Lahir:*\nContoh: Bandung, 01 Januari 1990",
  },
  {
    key: "ibu_kandung",
    prompt: "*Masukkan Nama Ibu Kandung:*\nContoh: Maria Magdalena",
  },
  {
    key: "perusahaan",
    prompt: "*Masukkan Nama Perusahaan Tempat Bekerja:*\nContoh: PT Maju Jaya",
  },
  {
    key: "alamat",
    prompt:
      "*Masukkan Alamat Lengkap:* \nContoh: Jl. Melati No. 10, Surabaya, Jawa Timur",
  },
  { key: "bank", prompt: "*Masukkan Nama Bank:*\nContoh: BCA, BRI, Mandiri" },
  {
    key: "nama_rekening",
    prompt: "*Masukkan Nama Pemilik Rekening:* \nContoh: Hendra Aditya",
  },
  {
    key: "rekening",
    prompt: "*Masukkan Nomor Rekening Bank:*\nContoh: 1234567890",
  },
  { key: "foto_ktp", prompt: "*Silakan kirim foto KTP kamu sekarang.*" },
  {
    key: "foto_kartu",
    prompt: "*Silakan kirim foto Kartu Peserta kamu sekarang.*",
  },
  {
    key: "foto_dokumen",
    prompt:
      "*Silakan kirim dokumen tambahan (jika ada). Jika tidak, kirim foto kosong.*",
  },
  { key: "foto_tabungan", prompt: "*Silakan kirim foto Buku Tabungan kamu.*" },
  {
    key: "foto_selfie",
    prompt: "*Silakan kirim foto Selfie kamu sambil memegang KTP.*",
  },
];

const userFormJhtState = {};

async function sendStartJhtButton(wa, to) {
  const button_message = {
    type: "button",
    header: {
      type: "text",
      text: "📋FORMULIR KLAIM JHT",
    },
    body: {
      text: "Kamu akan diminta mengisi data untuk klaim JHT. *Mohon isi dengan benar!*",
    },
    action: {
      buttons: [
        {
          type: "reply",
          reply: { id: "form_jht", title: "Mulai Isi Form" },
        },
      ],
    },
  };

  await wa.messages.interactive(button_message, to);
}

async function startFormJht(wa, from) {
  userFormJhtState[from] = { step: 0, data: {} };
  await sendText(wa, from, formJhtSteps[0].prompt);
}

async function handleFormJhtReply(
  wa,
  from,
  message = "",
  type = "text",
  image = null
) {
  const state = userFormJhtState[from];
  if (!state) return false;

  if (message === "Saya Setuju" || message === "Tidak Setuju") {
    const d = state.data;

    if (message === "Saya Setuju") {
      const found = databaseJht.find(
        (item) =>
          item.nik === d.nik &&
          item.nama.toUpperCase() === d.nama.toUpperCase() &&
          item.kpj === d.kpj
      );

      if (!found) {
        await wa.messages.interactive(
          {
            type: "button",
            header: { type: "text", text: "❌ Data Tidak Ditemukan" },
            body: {
              text: "Data yang kamu masukkan tidak ditemukan di sistem kami.\nMohon periksa kembali data yang kamu isi dan isi ulang formulir dengan benar.",
            },
            action: {
              buttons: [
                { type: "reply", reply: { id: "menu", title: "Menu Utama" } },
              ],
            },
          },
          from
        );
        return true;
      }

      await wa.messages.interactive(
        {
          type: "button",
          header: { type: "text", text: "✅ Klaim JHT Sedang Diproses" },
          body: {
            text: `*Pengajuan klaim JHT* \n NIK ${
              d.nik
            } a.n. ${d.nama.toUpperCase()}dengan nomor KPJ ${
              d.kpj
            } pekerja di ${d.perusahaan.toUpperCase()} sedang dalam proses.\n\nMohon menunggu dengan estimasi penyelesaian klaim dalam *5 hari kerja*. Terima kasih 🙏🏻`,
          },
          action: {
            buttons: [
              { type: "reply", reply: { id: "menu", title: "Menu Utama" } },
            ],
          },
        },
        from
      );
    } else {
      await wa.messages.interactive(
        {
          type: "button",
          header: { type: "text", text: "❌ Klaim Dibatalkan" },
          body: {
            text: "Semua data yang kamu kirim telah *dibatalkan* dan tidak akan diproses.",
          },
          action: {
            buttons: [
              { type: "reply", reply: { id: "menu", title: "Menu Utama" } },
            ],
          },
        },
        from
      );
    }

    delete userFormJhtState[from];
    return true;
  }

  const currentStep = formJhtSteps[state.step];
  const key = currentStep.key;

  if (key.startsWith("foto_")) {
    if (type !== "image" || !image) {
      await sendText(
        wa,
        from,
        "❌ Mohon kirim berupa *foto/gambar*, bukan teks.\nCoba lagi."
      );
      return true;
    }

    state.data[key] = image;
    state.step++;
  } else {
    const value = message.trim();

    switch (key) {
      case "nama":
      case "ibu_kandung":
      case "nama_rekening":
        if (!/^[A-Za-z\s]+$/.test(value)) {
          await sendText(
            wa,
            from,
            "❌ Hanya huruf dan spasi yang diperbolehkan.\nCoba lagi."
          );
          return true;
        }
        break;
      case "nik":
        if (!/^\d{16}$/.test(value)) {
          await sendText(wa, from, "❌ NIK harus 16 digit angka.\nCoba lagi.");
          return true;
        }
        break;
      case "kpj":
        if (!/^\d{6}$/.test(value)) {
          await sendText(wa, from, "❌ KPJ harus 6 digit angka.\nCoba lagi.");
          return true;
        }
        break;
      case "ttl":
        if (!/^.+,\s\d{2}\s\w+\s\d{4}$/.test(value)) {
          await sendText(
            wa,
            from,
            "❌ Format salah. Contoh: Bandung, 01 Januari 1990"
          );
          return true;
        }
        break;
      case "perusahaan":
        if (value.length < 3) {
          await sendText(
            wa,
            from,
            "❌ Nama perusahaan tidak valid.\nCoba lagi."
          );
          return true;
        }
        break;
      case "alamat":
        if (value.length < 10) {
          await sendText(
            wa,
            from,
            "❌ Alamat terlalu pendek. Masukkan alamat lengkap.\nCoba lagi."
          );
          return true;
        }
        break;
      case "bank":
        if (!/^[A-Za-z\s]+$/.test(value)) {
          await sendText(
            wa,
            from,
            "❌ Nama bank hanya boleh huruf dan spasi.\nContoh: BRI, BCA"
          );
          return true;
        }
        break;
      case "rekening":
        if (!/^\d{6,20}$/.test(value)) {
          await sendText(
            wa,
            from,
            "❌ Nomor rekening harus berupa angka dan panjang antara 6–20 digit.\nCoba lagi."
          );
          return true;
        }
        break;
    }

    state.data[key] = value;
    state.step++;
  }

  if (state.step < formJhtSteps.length) {
    await sendText(wa, from, formJhtSteps[state.step].prompt);
  } else {
    const d = state.data;

    const summary = `*Nama:* ${d.nama}\n*NIK:* ${d.nik}\n*KPJ:* ${d.kpj}\n*TTL:* ${d.ttl}\n*Ibu Kandung:* ${d.ibu_kandung}\n*Perusahaan:* ${d.perusahaan}\n*Alamat:* ${d.alamat}\n*Bank:* ${d.bank}\n*Nama Rekening:* ${d.nama_rekening}\n*No. Rekening:* ${d.rekening}`;

    await sendText(wa, from, `📋DATA KLAIM JHT DITERIMA\n\n${summary}`);

    const fotoKeys = [
      { key: "foto_ktp", caption: "✅ Foto KTP" },
      { key: "foto_kartu", caption: "✅ Kartu Peserta" },
      { key: "foto_dokumen", caption: "✅ Dokumen Tambahan" },
      { key: "foto_tabungan", caption: "✅ Buku Tabungan" },
      { key: "foto_selfie", caption: "✅ Foto Selfie dengan KTP" },
    ];

    for (const item of fotoKeys) {
      const img = d[item.key];
      if (img && img.id) {
        await wa.messages.image({ id: img.id, caption: item.caption }, from);
      }
    }

    await wa.messages.text(
      {
        body:
          "📄 *PERNYATAAN PERSETUJUAN*\n\n" +
          "Melalui pengisian data ini maka dengan ini saya menyatakan bahwa:\n\n" +
          "*INFORMASI YANG SAYA SAMPAIKAN DI ATAS DIBUAT DENGAN SEBENARNYA.*\n\n" +
          "Jika di kemudian hari ternyata terdapat hal-hal yang tidak benar, baik mengenai dokumen maupun keterangan yang saya berikan, " +
          "maka saya bersedia mengembalikan semua uang yang saya terima serta bersedia untuk dituntut secara hukum.\n\n" +
          "Silakan balas dengan:\n" +
          "Saya Setuju\n" +
          "atau, Tidak Setuju",
      },
      from
    );
  }

  return true;
}

module.exports = {
  startFormJht,
  sendStartJhtButton,
  handleFormJhtReply,
  userFormJhtState,
  formJhtSteps,
};
