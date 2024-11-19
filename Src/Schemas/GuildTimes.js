const { Schema, model } = require("mongoose");
const schema = new Schema({
guildID: { type: String, default: "" },
Day: { type: Number, default: 1 },
NextUpdate: { type: Number, default: new Date().setHours(24, 0, 0, 0) }
});

module.exports = model("Date", schema);