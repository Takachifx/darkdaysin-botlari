const { Schema, model } = require("mongoose");
const schema = Schema({
guildID: { type: String, default: "" },
sözler: { type: Array, default: [] },
});
module.exports = model("sözlerdb", schema);