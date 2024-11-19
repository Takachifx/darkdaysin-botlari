const {Schema, model} = require("mongoose");
const schema = new Schema({
guildID: {type: String, default: ""},
channelID: {type: String, default: ""},
Owner: {type: String, default: ""},
Date: {type: Number, default: 0},
AllowStreamer: {type: Array, default: []},
DenyStreamer: {type: Array, default: []},
})
module.exports = model("streamer", schema)