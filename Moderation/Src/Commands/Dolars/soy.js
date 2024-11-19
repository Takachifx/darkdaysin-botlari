const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["soy", "soygun"],
name: "soy",
help: "soy @Darkdays/ID",
category: "kullanici",
cooldown: 7200
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
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if (!member) { message.reply({ content:"Bir üye belirtmelisin!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return }
let dolarDatas = await dolars.findOne({ guildID: settings.Moderation.guildID, userID: message.member.id });
let dolarData = await dolars.findOne({ guildID: settings.Moderation.guildID, userID: member.id });
if (!dolarDatas || dolarDatas && !dolarDatas.hesap.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Hesabın Bulunmamakta.`}).sil(15)
}
if (!dolarData || dolarData && !dolarData.hesap.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${member} Üyesinin Hesabı Bulunmamakta.`}).sil(15)
}
if(dolarDatas.dolar < 1) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `${message.guild.emojiGöster(emojis.no)} Hesabında yeterli miktarda **${ayar.GuildName}** Doları bulunmamakta!`}).sil(15)
}
if(dolarData.dolar < 1) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${member} kişisinin hesabında yeterli miktarda **${ayar.GuildName}** Doları bulunmamakta!`}).sil(15)
}
const maxValue = 2000;
const random = Math.floor(Math.random() * (maxValue - 1 + 1)) + 1;
let randomizeCoinCal = Math.random();
if(randomizeCoinCal >= 0.5) {
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: message.member.id }, { $inc: { dolar: +random } }, { upsert: true });
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.id }, { $inc: { dolar: -random } }, { upsert: true });
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} ${member} kişisinden **${random}** **${ayar.GuildName}** Doları çaldın!`})
} else if(randomizeCoinCal < 0.5) {
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: message.member.id }, { $inc: { dolar: -random } }, { upsert: true });
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.id }, { $inc: { dolar: +random } }, { upsert: true });
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${member} kişisi seni soydu ve **${random}** **${ayar.GuildName}** Doları aldı!`})
}
}
}