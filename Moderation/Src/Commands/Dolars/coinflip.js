const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["cf"],
name: "coinflip",
help: "coinflip <Miktar>",
category: "kullanici",
cooldown: 15
},
Cyrstal: async (client, message, args, embed, prefix) => {
if (!message.guild) return;
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
let kanallar = ["dolar", "dolar-chat"]
if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `${message.guild.emojiGöster(emojis.no)} dolar kanallarında kullanabilirsiniz.`}).sil(15)
return }
let dolarData = await dolars.findOne({ guildID: settings.Moderation.guildID, userID: message.author.id });
if (!dolarData || dolarData && !dolarData.hesap.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Komutu kullanabilmek için Hesap oluşturmanız gerekmektedir.`}).sil(15)
}
if (!dolarData || dolarData && !dolarData.dolar) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Komutu kullanabilmek için **${ayar.GuildName}** dolarına ihtiyacın var.`}).sil(15)
}
let sec = args[0]
let regex = /^[0-9]+$/
if(!sec || !Number(sec) || Number(sec) < 0 || !regex.test(sec)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Kaç **${ayar.GuildName}** doları ile oynamak istiyorsun?`}).sil(15)
}
if(isNaN(Number(sec))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Geçerli bir sayı gir.`}).sil(15)
}
let res = await dolars.findOne({guildID: settings.Moderation.guildID, userID: message.author.id})
if(!res.dolar) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `Hiç **${ayar.GuildName}** doların yok!`})
}
if(res.dolar < sec) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Yeterli miktar da **${ayar.GuildName}** doları yok! **${ayar.GuildName}** Doların: (**${res.dolar}** **${ayar.GuildName}** Doları)`}).sil(15)
}
let carpma = sec * 2
await message.react(message.guild.emojiGöster(emojis.yes))
let mesaj = await message.reply({ content:`
**Bahis Devam Ediyor!**

\` ${carpma} \` **${ayar.GuildName}** Doları için bahis döndürülüyor!

Belirlenen Miktar: \` ${sec} \` **${ayar.GuildName}** Doları`})
let randomizeCoinCal = Math.random();
if (randomizeCoinCal >= 0.5) {
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: -sec } }, { upsert: true });
setTimeout(() => {
mesaj.edit({ content:`
**Bahis Bitti!**

${message.guild.emojiGöster(emojis.no)} **Kaybettin!**
Kaybedilen Miktar: \` ${sec} \` **${ayar.GuildName}** Doları`})
}, 2000)
} else if(randomizeCoinCal < 0.5) {
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: +carpma } }, { upsert: true });
setTimeout(() => {
mesaj.edit({ content:`
**Bahis Bitti!**

:tada: **Kazandın!**
Kazanılan Miktar: \` ${carpma} \` **${ayar.GuildName}** Doları`})
}, 2000)
}
}
}