const firtMessage = require("./components/firstMessage");
const pendaftaranPeserta = require("./pendaftaran/pendaftaran");
const pelayananJaminan = require("./pelayanan/pelayanan");
const informasiPelayanan = require("./informasi/informasi");
const {
  startFormBpu,
  handleFormBpuReply,
  userFormState,
} = require("./pendaftaran/bpu/pendaftaranBpu");
const sendText = require("../utils/sendText");
const sendImage = require("./components/sendImages");

module.exports = {
  sendText,
  sendImage,
  firtMessage,
  pendaftaranPeserta,
  pelayananJaminan,
  informasiPelayanan,
  startFormBpu,
  handleFormBpuReply,
};
