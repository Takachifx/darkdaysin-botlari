const {Schema, model} = require("mongoose")

const schema = new Schema({
guildID: {type: String, default: ""},
userID: {type: String, default: ""},
roller: {type: Array, default: []},
Date: {type: Number, default: 0},
endDate: {type: Number, default: 0}
})

module.exports = model("offlinedb", schema)