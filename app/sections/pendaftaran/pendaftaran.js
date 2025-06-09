async function pendaftaranPeserta(wa, to) {
  const list_message = {
    type: "list",
    header: {
      type: "text",
      text: "PENDAFTARAN PESERTA",
    },
    body: {
      text: "Silahkan pilih pendaftaran yang diinginkan",
    },
    action: {
      button: "Lihat Pilihan",
      sections: [
        {
          title: "Menu Pendaftaran",
          rows: [
            {
              id: "pendaftaran_peserta",
              title: "Pendaftaran Peserta",
              description: "",
            },
            {
              id: "pendaftaran_bpu",
              title: "Pendaftaran Peserta BPU",
              description: "",
            },
            {
              id: "pendaftaran_pmi",
              title: "Pendaftaran PMI",
              description: "",
            },
            {
              id: "pendaftaran_jakon",
              title: "Pendaftaran Jakon",
              description: "",
            },
          ],
        },
      ],
    },
  };

  await wa.messages.interactive(list_message, to);
}

module.exports = pendaftaranPeserta;
