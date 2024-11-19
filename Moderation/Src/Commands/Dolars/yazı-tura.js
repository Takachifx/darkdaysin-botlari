const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
const Discord = require("discord.js")
module.exports = {
conf: {
aliases: ["yazıtura", "yazitura", "yazi-tura"],
name: "yazı-tura",
help: "yazı-tura <Miktar>",
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
const row = new Discord.ActionRowBuilder()
.setComponents(
new Discord.ButtonBuilder().setCustomId("Yazı").setLabel("Yazı").setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder().setCustomId("Tura").setLabel("Tura").setStyle(Discord.ButtonStyle.Secondary))
const msg = await message.reply({
components: [row],
embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} ${message.member}, Dolarını 2'ye katlamak için yazı mı ?, tura mı ? sorusuna cevap vermelisin!
**
Yazı mı ?
Tura mı ?
**`)]})
var filter = (button) => button.user.id === message.author.id;
const collector = msg.createMessageComponentCollector({ filter, time: 30000 });
collector.on('collect', async (inter) => {
await inter.deferUpdate()
row.components.forEach((x) => { x.setDisabled(true) })
const ihtimaller = ["Yazı", "Tura"];
const sonuc = await ihtimaller[Number(Math.floor(Math.random()*2))];
const secim = inter.customId;
await msg.edit({embeds: [embed.setDescription(`${message.member}, **Para Fırlatıldı!**`)], components: [row]})
setTimeout(async() => {
if(secim == sonuc){
await dolars.updateOne({guildID:message.guild.id, userID:message.member.id}, {$inc: { dolar:(sec*2) } }, {upsert:true})
await msg.edit({embeds: [embed.setDescription(`**${secim} Çıktı, ${message.member} ${(sec*2)} \` ${ayar.GuildName} \` Doları kazandın!**`)], components: [row]})
} else {
await dolars.updateOne({guildID:message.guild.id, userID:message.member.id}, {$inc: { dolar:(-sec) } }, {upsert:true})
await msg.edit({embeds: [embed.setDescription(`**Üzgünüm ${message.member}, ${sonuc} Çıktı ve ${sec} Adet \` ${ayar.GuildName} \`Doları kaybettin!**`)], components: [row]})
}
}, 3000);
})
}
}