const { MessageMedia } = require("whatsapp-web.js");

async function sendImage(client, to) {
  const media = await MessageMedia.fromUrl(
    "https://61fb-114-10-47-37.ngrok-free.app/app/assets/bpjs-welcome.jpg"
  );
  await client.sendMessage(to, media, {
    caption: "Selamat datang di layanan BPJS Ketenagakerjaan 👋",
  });
}

module.exports = sendImage;
