const { Schema, model } = require("mongoose");

const schema = new Schema({
    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    total: { type: Number, default: 0, min: 0 },
    total1: { type: Number, default: 0, min: 0 },
    total7: { type: Number, default: 0, min: 0 },
    total30: { type: Number, default: 0, min: 0 },
    regular: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    leave: { type: Number, default: 0, min: 0 },
    leave1: { type: Number, default: 0, min: 0 },
    leave7: { type: Number, default: 0, min: 0 },
    leave30: { type: Number, default: 0, min: 0 },
    fake: { type: Number, default: 0, min: 0 },
    fake1: { type: Number, default: 0, min: 0 },
    fake7: { type: Number, default: 0, min: 0 },
    fake30: { type: Number, default: 0, min: 0 },
});

module.exports = model("inviter", schema);