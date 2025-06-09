const {
  sendText,
  firtMessage,
  pendaftaranPeserta,
  pelayananJaminan,
  informasiPelayanan,
} = require("../sections/sections");
const {
  startFormBpu,
  sendStartButton,
  handleFormBpuReply,
  userFormState,
} = require("../sections/pendaftaran/bpu/pendaftaranBpu");
const {
  startFormJht,
  sendStartJhtButton,
  handleFormJhtReply,
  userFormJhtState,
} = require("../sections/pelayanan/jht/klaimJht");
const {
  startFormTagihan,
  handleFormTagihanReply,
  userFormTagihanState,
} = require("../sections/informasi/iuran/iuran");

async function handleWebhookPost(req, res, waInstance) {
  try {
    const { entry } = req.body;

    if (!entry || entry.length === 0) {
      return res.status(400).send("Invalid Request");
    }

    const changes = entry[0].changes;
    if (!changes || changes.length === 0) {
      return res.status(400).send("Invalid Request");
    }

    const statuses = changes[0].value.statuses?.[0];
    const messages = changes[0].value.messages?.[0];

    if (statuses) {
      console.log(
        `MESSAGE STATUS UPDATE: ID: ${statuses.id}, STATUS: ${statuses.status}`
      );
    }

    if (messages) {
      const from = messages.from;
      const type = messages.type;

      // Batalkan form jika user tekan tombol
      if (
        type === "interactive" &&
        (messages.interactive.type === "list_reply" ||
          messages.interactive.type === "button_reply")
      ) {
        // Cek jika BUKAN tombol setuju/tidak setuju JHT
        const buttonId =
          messages.interactive.button_reply?.id ||
          messages.interactive.list_reply?.id ||
          "";

        if (buttonId !== "jht_setuju" && buttonId !== "jht_tidak") {
          const isInForm =
            userFormState[from] ||
            userFormJhtState[from] ||
            userFormTagihanState[from];

          if (isInForm) {
            delete userFormState[from];
            delete userFormJhtState[from];
            delete userFormTagihanState[from];

            await sendText(
              waInstance,
              from,
              "⛔ Formulir sebelumnya dibatalkan karena Anda menekan tombol lain."
            );
          }
        }
      }

      // Cek apakah user sedang dalam proses pengisian form
      const isInForm =
        userFormState[from] ||
        userFormJhtState[from] ||
        userFormTagihanState[from];

      if (isInForm) {
        if (type === "text") {
          const text = messages.text.body;

          if (userFormState[from]) {
            const handled = await handleFormBpuReply(
              waInstance,
              from,
              text,
              "text"
            );
            if (handled) return res.status(200).send("Form BPU handled");
          }

          if (userFormJhtState[from]) {
            const handled = await handleFormJhtReply(
              waInstance,
              from,
              text,
              "text"
            );
            if (handled) return res.status(200).send("Form JHT handled");
          }

          if (userFormTagihanState[from]) {
            const handled = await handleFormTagihanReply(
              waInstance,
              from,
              text,
              "text"
            );
            if (handled) return res.status(200).send("Form Tagihan handled");
          }
        } else if (type === "image" && messages.image?.id) {
          const imageInfo = {
            id: messages.image.id,
            caption: messages.image.caption || "",
            mime_type: messages.image.mime_type || "image/jpeg",
          };

          if (userFormState[from]) {
            const handled = await handleFormBpuReply(
              waInstance,
              from,
              null,
              "image",
              imageInfo
            );
            if (handled) return res.status(200).send("Form BPU image handled");
          }

          if (userFormJhtState[from]) {
            const handled = await handleFormJhtReply(
              waInstance,
              from,
              null,
              "image",
              imageInfo
            );
            if (handled) return res.status(200).send("Form JHT image handled");
          }

          if (userFormTagihanState[from]) {
            const handled = await handleFormTagihanReply(
              waInstance,
              from,
              null,
              "image",
              imageInfo
            );
            if (handled)
              return res.status(200).send("Form Tagihan image handled");
          }
        }

        return res.status(200).send("Waiting for form input");
      }

      // Jika bukan dalam form
      if (type === "text") {
        await firtMessage(waInstance, from);
      } else if (type === "interactive") {
        const interactive = messages.interactive;

        if (
          interactive.type === "list_reply" ||
          interactive.type === "button_reply"
        ) {
          delete userFormState[from];
          delete userFormJhtState[from];
          delete userFormTagihanState[from];
        }

        if (interactive.type === "list_reply") {
          const { id, title } = interactive.list_reply;

          switch (id) {
            case "pendaftaran_bpu":
              await sendStartButton(waInstance, from);
              break;
            case "klaim_jht":
              await sendStartJhtButton(waInstance, from);
              break;
            case "info_iuran":
              await startFormTagihan(waInstance, from);
              break;
            default:
              await sendText(
                waInstance,
                from,
                "Anda memilih " + title + ". Fitur masih dalam pengembangan."
              );
          }
        }

        if (interactive.type === "button_reply") {
          const { id, title } = interactive.button_reply;

          if (id === "menu") {
            await firtMessage(waInstance, from);
          } else if (id === "mulai_form_bpu") {
            await startFormBpu(waInstance, from);
          } else if (id === "form_jht") {
            await startFormJht(waInstance, from);
          } else if (id === "pendaftaran") {
            await pendaftaranPeserta(waInstance, from);
          } else if (id === "pelayanan") {
            await pelayananJaminan(waInstance, from);
          } else if (id === "informasi") {
            await informasiPelayanan(waInstance, from);
          } else if (id === "info_iuran") {
            await startFormTagihan(waInstance, from);
          } else {
            await sendText(
              waInstance,
              from,
              `Anda memilih tombol: ${title} (${id})`
            );
          }
        }
      } else {
        await firtMessage(waInstance, from);
      }

      console.log(JSON.stringify(messages, null, 2));
    }

    res.status(200).send("Webhook processed");
  } catch (error) {
    console.error("❌ ERROR dalam handleWebhookPost:", error);

    const from = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
    if (from) {
      await waInstance.messages.text(
        {
          body: "⚠️ Maaf, terjadi kesalahan atau chat dalam masa perbaikan. Silakan coba beberapa saat lagi.",
        },
        from
      );
    }

    res.status(500).send("Internal Server Error");
  }
}

function handleWebhookGet(req, res, verifyToken) {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
}

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

// Upload gambar lokal ke WhatsApp untuk mendapatkan media ID
async function uploadImageToWhatsApp() {
  const mediaPath = path.join(__dirname, "bpjs-welcome.jpg");

  const formData = new FormData();
  formData.append("file", fs.createReadStream(mediaPath));
  formData.append("type", "image/jpeg");
  formData.append("messaging_product", "whatsapp");

  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${process.env.WA_PHONE_NUMBER_ID}/media`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        ...formData.getHeaders(),
      },
    }
  );

  return response.data.id; // media_id
}

module.exports = {
  handleWebhookPost,
  handleWebhookGet,
};
