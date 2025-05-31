const express = require('express');

module.exports = function(wa) {
  const router = express.Router();
  const { handleWebhookGet, handleWebhookPost } = require('../hooks/mutations');

  router.get('/', handleWebhookGet);
  router.post('/', (req, res) => handleWebhookPost(req, res, wa));

  return router;
};
