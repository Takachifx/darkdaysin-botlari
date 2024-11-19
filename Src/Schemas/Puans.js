const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  puan: { type: Number, default: 0 }
});

module.exports = model("puans", schema);