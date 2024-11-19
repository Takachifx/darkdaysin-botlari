const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["hesapolustur", "hesap-olustur", "hesapoluştur","hesap-oluştur"],
name: "hesapoluştur",
help: "hesapoluştur",
category: "kullanici",
cooldown: 15
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
if(!data || data && !data.hesap.length) {
await dolars.findOneAndUpdate({userID: message.author.id, guildID: settings.Moderation.guildID}, {$push: {hesap: 1}}, {upsert: true})
await dolars.findOneAndUpdate({userID: message.author.id, guildID: settings.Moderation.guildID}, {$inc: {dolar: 500}}, {upsert: true})
await message.reply({ content:`${message.guild.emojiGöster(emojis.yes)} ${message.author} Başarıyla **${ayar.GuildName}** doları hesabını oluşturdun, oyunlarımızı deneyimlemen için hesabına **500** hediye **${ayar.GuildName}** doları yolladım. İyi eğlenceler!`})
await message.react(message.guild.emojiGöster(emojis.yes))
} else if(data) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Zaten daha önceden bir hesap oluşturmuşsun!`}).sil(15)
}
}}