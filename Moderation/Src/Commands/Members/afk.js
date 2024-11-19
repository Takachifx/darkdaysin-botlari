const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Afk = require("../../../../Src/Schemas/Afk")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = {
conf: {
aliases: ["afk", "awayfromkeyboard"],
name: "afk",
help: "afk",
category: "kullanici",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const data = await Afk.findOne({guildID: message.guild.id, userID: message.author.id})
if(data && data.reason) {
await Afk.updateOne({guildID: message.guild.id, userID: message.author.id}, {$set: {reason: "", date: 0 } }, {upsert: true})
await message.react(message.guild.emojiGöster(emojis.yes))
return message.reply({content: `Başarıyla Afk Modundan Çıktınız!`}).sil(15)
}
const reason = args.join(" ") || "Sebep Belirtilmedi!"
await Afk.updateOne({guildID: message.guild.id, userID: message.author.id}, {$set: {reason: reason, date: Date.now() } }, {upsert: true})
await message.react(message.guild.emojiGöster(emojis.yes))
return message.reply({content: `Başarıyla Afk Moduna Girdiniz!\n\n**Sebep:** ${reason}\n**Tarih:** <t:${Math.floor(Date.now() / 1000)}>`}).sil(15)
}
}