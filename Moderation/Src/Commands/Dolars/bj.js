const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
const Discord = require("discord.js")
const BlackJack = require("../../../../Src/Plugins/Games/BlackJack/index")
module.exports = {
conf: {
aliases: ["bj"],
name: "bj",
help: "bj <Miktar>",
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
await message.react(message.guild.emojiGöster(emojis.yes))
let winAmount = sec * 2
let winAmount2 = sec * 4
const game = await BlackJack(message, {
buttons: true,
transition: 'edit',
bahis: sec,
odul: winAmount,
doubleodul: Number(winAmount * 2)
})

if (game.result.includes('DOUBLE WIN') || game.result == 'BLACKJACK') {
await dolars.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: +winAmount2 } }, { upsert: true });
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({content: `${message.member} Tebrikler. 🎉 **${winAmount2}** **${ayar.GuildName}** Doları Kazandın!`})
} else if (
game.result.includes('WIN') ||
game.result == 'SPLIT LOSE-WIN' ||
game.result == 'SPLIT WIN-LOSE' ||
game.result == 'SPLIT LOSE-DOUBLE WIN' ||
game.result == 'SPLIT TIE-DOUBLE WIN' ||
game.result == 'SPLIT DOUBLE WIN-TIE' ||
game.result == 'SPLIT DOUBLE WIN-LOSE' ||
game.result == 'SPLIT WIN-TIE' ||
game.result == 'SPLIT TIE-WIN'
) {

await dolars.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: +winAmount } }, { upsert: true });
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({content: `${message.member} Tebrikler. 🎉 **${winAmount}** **${ayar.GuildName}** Doları Kazandın!`})
} else {
await dolars.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: -sec } }, { upsert: true });
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({content: `${message.member} Üzgünüm. 🥹 **${sec}** **${ayar.GuildName}** Doları Kaybettin!`})
}
}
}