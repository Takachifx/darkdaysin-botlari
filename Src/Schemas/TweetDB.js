const {Schema, model} = require("mongoose")

const schema = new Schema({
 guildID: {type: String, default: ""},
 userID: {type: String, default: ""},
 messageID: {type: String, default: ""},
 Clicking: {type: Array, default: []},
 Retweet: {type: Array, default: []},
 Likes: {type: Number, default: 0},
 Dislikes: {type: Number, default: 0},
})

module.exports = model("TweetDB", schema)