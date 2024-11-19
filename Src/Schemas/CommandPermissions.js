const { Schema, model } = require("mongoose");

const schema = Schema({
guildID: { type: String, default: "" },
Command: { type: String, default: "" },
Permissions: { type: Array, default: [] },
});
module.exports = model("commandpermissions", schema);