const {Schema, model} = require("mongoose")
const schema = new Schema({
guildID: { type: String, default: "" },
Type: { type: String, default: "" },
Level: { type: Number, default: 0 },
Roles: { type: Array, default: [] },
User: { type: Array, default: [] },
})
module.exports = model("levelSystem", schema)