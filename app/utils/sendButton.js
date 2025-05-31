const axios = require('axios');

async function sendButton(waInstance, to, text, buttons) {
  const token = process.env.CLOUD_API_ACCESS_TOKEN;
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;

  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: text,
      },
      action: {
        buttons: buttons.map((btn, i) => ({
          type: "reply",
          reply: {
            id: btn.id,
            title: btn.title,
          },
        })),
      },
    },
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to send button message:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = sendButton;
