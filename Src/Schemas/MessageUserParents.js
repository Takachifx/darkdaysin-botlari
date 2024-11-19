const { Schema, model } = require("mongoose");

const schema = Schema({
guildID: { type: String, default: "" },
userID: { type: String, default: "" },
parentID: { type: String, default: "" },
parentData: { type: Number, default: 0 },
});

module.exports = model("messageUserParent", schema);
