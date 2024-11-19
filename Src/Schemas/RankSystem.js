const { Schema, model } = require("mongoose");
const schema = Schema({
guildID: { type: String, default: "" },
RankSystem: { type: Boolean, default: false },
ranks: { type: Array, default: [] },
messageCount: { type: Number, default: 10 },
messageCoin: { type: Number, default: 1 },
voiceCount: { type: Number, default: 5 },
voiceCoin: { type: Number, default: 1 },
streamCount: { type: Number, default: 5 },
streamCoin: { type: Number, default: 1 },
cameraCount: { type: Number, default: 5 },
cameraCoin: { type: Number, default: 1 },
inviteCount: { type: Number, default: 1 },
inviteCoin: { type: Number, default: 10 },
registerCount: { type: Number, default: 1 },
registerCoin: { type: Number, default: 1 },
tagCount: { type: Number, default: 1 },
tagCoin: { type: Number, default: 30 },
staffCount: { type: Number, default: 1 },
staffCoin: { type: Number, default: 50 },
});

module.exports = model("ranksystem", schema);