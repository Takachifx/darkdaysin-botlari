const { Schema, model } = require("mongoose");
const schema = Schema({
guildID: { type: String, default: ""},
userID: { type: String, default: ""},
friendsID: { type: String, default: ""},
yüzük: { type: String, default: ""},
Date: { type: Number, default: 0 }
})
module.exports = model("evlilik", schema);