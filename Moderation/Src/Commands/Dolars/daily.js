const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["günlük", "gunluk"],
name: "daily",
help: "daily",
category: "kullanici",
cooldown: 86400
},
Cyrstal: async (client, message, args) => {
if (!message.guild) return;
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
let kanallar = ["dolar", "dolar-chat"]
if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `${message.guild.emojiGöster(emojis.no)} dolar kanallarında kullanabilirsiniz.`}).sil(15)
return }
let data = await dolars.findOne({userID: message.author.id, guildID: settings.Moderation.guildID});
if (!data || data && !data.hesap.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Komutu kullanabilmek için Hesap oluşturmanız gerekmektedir.`}).sil(15)
}
const sayi = Math.floor(Math.random() * 450) + 1
await dolars.findOneAndUpdate({userID: message.author.id, guildID: settings.Moderation.guildID}, {$inc: {dolar: sayi}, $set: {dolarTime: Date.now()}}, {upsert: true})
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.yes)} ${message.author} Başarılı bir şekilde günlük ödülünü aldın. (Ödülün: **${sayi}** **${ayar.GuildName}** Doları)`})
}
}