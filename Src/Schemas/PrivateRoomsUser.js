const mongoose = require('mongoose');

const pUser = mongoose.Schema({
guildId: { type: String, default: "" },
userId: { type: String, default: "" },
private_voices: {
voiceId: {type: String, default: null},
textId: {type: String, default: null},
lock: { type: Boolean, default: true }
}
})

module.exports = mongoose.model('pUser', pUser);