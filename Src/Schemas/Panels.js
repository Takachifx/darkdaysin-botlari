const { Schema, model } = require("mongoose");

const Panels = Schema({
   guildID: {type: String, default: ''},
   urlShield: {type: Boolean, default: true},
   guildShield: {type: Boolean, default: true},
   roleShield: {type: Boolean, default: true},
   channelShield: {type: Boolean, default: true},
   botShield: {type: Boolean, default: true},
   emojiShield: {type: Boolean, default: true},
   stickerShield: {type: Boolean, default: true},
   bankickShield: {type: Boolean, default: true},
   swearShield: {type: Boolean, default: true},
   advertShield: {type: Boolean, default: true},
   capslockShield: {type: Boolean, default: true},
   spamShield: {type: Boolean, default: true},
   webShield: {type: Boolean, default: true},
   offlineShield: {type: Boolean, default: true},
});

module.exports = model("Panels", Panels);