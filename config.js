require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 8080,
  token: process.env.WEBHOOK_VERIFY_TOKEN,
  phone: process.env.WA_PHONE_NUMBER_ID,
};
