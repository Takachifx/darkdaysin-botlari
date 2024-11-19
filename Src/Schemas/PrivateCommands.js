const mongoose = require("mongoose")

const privateCommands = mongoose.Schema({
guildID: { type: String, default: "" },
komutAd: { type: String, default: "" },
YetkiliRol: { type: Array, default: [] },
VerilecekRol: { type: Array, default: [] },
createdAt: { type: Number, default: 0 }
});

module.exports = mongoose.model("privateCommands", privateCommands)