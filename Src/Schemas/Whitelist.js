const { Schema, model } = require("mongoose");

const SafeMember = Schema({
    guildID: {type: String, default: ''},
    full: {type: Array, default: []},
    guild: {type: Array, default: []},
    roles: {type: Array, default: []},
    channel: {type: Array, default: []},
    ban: {type: Array, default: []},
    kick: {type: Array, default: []},
    emoji: {type: Array, default: []},
    bot: {type: Array, default: []},
    sticker: {type: Array, default: []},
    swear: {type: Array, default: []},
    advert: {type: Array, default: []},
    capslock: {type: Array, default: []},
    spam: {type: Array, default: []},
    web: {type: Array, default: []},
    offline: {type: Array, default: []},
    });

module.exports = model("SafeMember", SafeMember);