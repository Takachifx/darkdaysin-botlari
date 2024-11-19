const { Schema, model } = require("mongoose");

const schema = Schema({
userID: { type: String, default: "" },
guildID: { type: String, default: "" },
top: { type: Number, default: 0 },
top1: { type: Number, default: 0 },
top7 : { type: Number, default: 0 },
erkek: { type: Number, default: 0 },
erkek1: { type: Number, default: 0 },
erkek7 : { type: Number, default: 0 },
erkek30 : { type: Number, default: 0 },
kadin: { type: Number, default: 0 },
kadin1: { type: Number, default: 0 },
kadin7 : { type: Number, default: 0 },
kadin30 : { type: Number, default: 0 },
});

module.exports = model("registerStats", schema);
