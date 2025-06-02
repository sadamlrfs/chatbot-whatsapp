require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 8181,
  token: process.env.WEBHOOK_VERIFY_TOKEN,
  phone: process.env.WA_PHONE_NUMBER_ID,
};
