const { Schema, model } = require("mongoose");

const koruma = Schema({
guildID: { type: String, default: ""},
Role: { type: String, default: ""},
Permissions: { type: String, default: ""},
});

module.exports = model("korumadb", koruma);