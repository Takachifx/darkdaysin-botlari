const { Schema, model } = require('mongoose');
const Friends = Schema({
guildID: { type: String, default: "" },
userID: { type: String, default: "" },
repliedUserID: { type: String, default: "" },
replyLength: { type: Number, default: 0 }
});
module.exports = model('chatfriends', Friends);
