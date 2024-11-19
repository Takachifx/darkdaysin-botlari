const {Schema, model} = require("mongoose")

const schema = new Schema({
guildID: {type: String, default: ""},
userID: {type: String, default: ""},
Data: {type: Object, default: {}},
})

module.exports = model("userVoice", schema)