async function sendText(wa, to, body) {
  const message = {
    body,
    preview_url: false,
  };
  await wa.messages.text(message, to);
}

module.exports = sendText;
