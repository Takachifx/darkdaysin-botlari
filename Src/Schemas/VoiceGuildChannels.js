const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  channelID: { type: String, default: "" },
  channelData: { type: Number, default: 0 },
});

module.exports = model("voiceGuildChannel", schema);
