const { Schema, model } = require("mongoose");

const schema = Schema({
 guildID: { type: String, default: "" },
 channels: { type: Object, default: {} },
});

module.exports = model("vk", schema);