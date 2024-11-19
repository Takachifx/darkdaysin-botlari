const mongoose = require("mongoose");

const schema = mongoose.model('User', new mongoose.Schema({
    _id: { type: String, default: "" },
    Tagged: { type: Boolean, default: false },
    Taggeds: { type: Object },
    Staff: { type: Boolean, default: false },
    TaggedGiveAdmin: { type: String, default: "" },
    StaffGiveAdmin: { type: String, default: "" },
    Staffs: { type: Object },
    Date: { type: Number, default: 0 },
}));

module.exports = schema;