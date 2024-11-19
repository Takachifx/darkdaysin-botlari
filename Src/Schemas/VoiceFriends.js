const { model, Schema} = require('mongoose')

module.exports = model('voicefriends',
    new Schema({
        guildID: { type: String, default: '' },
        userID: { type: String, default: '' },
        voices: { type: Object, default: { channels: {}, total: 0 } },
        voiceFriends: { type: Object, default: {} }
    })
)