const mongoose = require("mongoose")
const team = mongoose.Schema({
guildID: { type: String, default: "" },
Teams: { type: Array, default: [] },
});

module.exports = mongoose.model("ekips", team)