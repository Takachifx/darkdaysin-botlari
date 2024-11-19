const mongoose = require('mongoose');

const pGuild = mongoose.Schema({
guildId: { type: String, default: "" },
private_voices: {
mode: { type: Boolean, default: false },
categoryId: { type: String, default: "" },
channelId: { type: String, default: "" },
textId: { type: String, default: "" },
}
});

module.exports = mongoose.model('pGuild', pGuild);