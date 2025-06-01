async function firtMessage(wa, to) {
  const button_message = {
    type: "button",
    header: {
      type: "text",
      text: "BPJS KETENAGAKERJAAN",
    },
    body: {
      text: "Silahkan, anda dapat memperoleh informasi dengan memilih layanan berikut:",
    },
    action: {
      buttons: [
        {
          type: "reply",
          reply: {
            id: "pendaftaran",
            title: "Pendaftaran ",
          },
        },
        {
          type: "reply",
          reply: {
            id: "pelayanan",
            title: "Pelayanan Jaminan",
          },
        },
        {
          type: "reply",
          reply: {
            id: "informasi",
            title: "Informasi",
          },
        },
      ],
    },
  };

  await wa.messages.interactive(button_message, to);
}

module.exports = firtMessage;
