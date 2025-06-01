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

module.exports = {
  sendText,
  firtMessage,
  pendaftaranPeserta,
  pelayananJaminan,
  informasiPelayanan,
  startFormBpu,
  handleFormBpuReply,
};
