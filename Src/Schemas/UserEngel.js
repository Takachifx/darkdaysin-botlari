const { Schema, model } = require('mongoose');

const schema = Schema({
guildID: { type: String, default: '' },
userID: { type: String, default: '' },
veri: { type: Array, default: [] }
});

module.exports = model('engelDB', schema);