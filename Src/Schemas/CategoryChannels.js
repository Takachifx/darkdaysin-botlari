const { Schema, model } = require("mongoose");

const CategoryChannels = Schema({
    channelID: {type: String, default: ''},
    name: {type: String, default: ''},
    position: {type: Number, default: 0},
    overwrites: {type: Array, default: []},
});

module.exports = model("categoryChannels", CategoryChannels);