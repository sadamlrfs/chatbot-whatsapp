function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function firtMessage(wa, to) {
  const sendImage = {
    link: new URL(
      "https://chatbot-whatsapp-production-3fcd.up.railway.app/assets/start-messages.jpg"
    ).href,
    caption: " ",
  };

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
            title: "Pendaftaran",
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

  await wa.messages.image(sendImage, to);

  await delay(2000);

  await wa.messages.interactive(button_message, to);
}

module.exports = firtMessage;
