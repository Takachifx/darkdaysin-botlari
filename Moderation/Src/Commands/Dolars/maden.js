const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["maden", "kazma"],
name: "maden",
help: "maden",
category: "kullanici",
cooldown: 21600
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
let dolarDatas = await dolars.findOne({ guildID: settings.Moderation.guildID, userID: message.member.id });
if (!dolarDatas || dolarDatas && !dolarDatas.hesap.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Hesabın Bulunmamakta.`}).sil(15)
}
const msg = await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} Maden kazma işlemi başladı!\n\n**Not:** Maden kazma işlemi 1 saate biticektir!`})
setTimeout(async() => {
let random = Math.floor(Math.random() * 1000) + 1;
let randomizeCoinCal = Math.random();
await message.react(message.guild.emojiGöster(emojis.yes))
if(randomizeCoinCal >= 0.5) {
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: message.member.id }, { $inc: { dolar: +random } }, { upsert: true });
msg.edit({ content: `${message.guild.emojiGöster(emojis.yes)} Maden kazma işlemi başarılı! Toplam **${random}** **${ayar.GuildName}** Doları kazandın!`}).catch(() => {})
message.member.send({ content: `Maden kazma işlemi başarılı! Toplam **${random}** **${ayar.GuildName}** Doları kazandın!`}).catch(() => {})
} else if(randomizeCoinCal < 0.5) {
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: message.member.id }, { $inc: { dolar: -random } }, { upsert: true });
msg.edit({ content: `${message.guild.emojiGöster(emojis.no)} Maden kazma işlemi başarısız oldu maden kazarken kaza yaşadın! Toplam **${random}** **${ayar.GuildName}** Doları kaybettin!`}).catch(() => {})
message.member.send({ content: `Maden kazma işlemi başarısız oldu maden kazarken kaza yaşadın! Toplam **${random}** **${ayar.GuildName}** Doları kaybettin!`}).catch(() => {})
}
}, 1000 * 60 * 60 * 1)
}
}