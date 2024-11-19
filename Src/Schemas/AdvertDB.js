const { Schema, model } = require("mongoose");
const schema = Schema({
guildID: { type: String, default: "" },
advert: { type: Array, default: [] },
});
module.exports = model("advertdb", schema);