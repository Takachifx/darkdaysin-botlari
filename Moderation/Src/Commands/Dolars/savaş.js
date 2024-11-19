const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
const Discord = require("discord.js")
const Fight = require("../../../../Src/Plugins/Games/Fight")
module.exports = {
conf: {
aliases: ["fight", "savas"],
name: "savaş",
help: "savaş @Darkdays/ID <Miktar>",
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
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Bir kullanıcı belirt.`}).sil(15)
}
const memberData = await dolars.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(!memberData || memberData && !memberData.hesap.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${member} Kullanıcısının Hesabı Bulunamadı.`}).sil(15)
}
if(memberData && !memberData.dolar) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${member} Kullanıcısının **${ayar.GuildName}** dolarına ihtiyacı var.`}).sil(15)
}
if(member.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Kendinle Oynayamazsın.`}).sil(15)
}
let sec = args[1]
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
if(res.dolar <= sec) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Yeterli miktar da **${ayar.GuildName}** doları yok! **${ayar.GuildName}** Doların: (**${res.dolar}** **${ayar.GuildName}** Doları)`}).sil(15)
}
if(memberData && memberData.dolar <= sec) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${member} Kullanıcısının **${ayar.GuildName}** dolarına ihtiyacı var.`}).sil(15)
}
await message.react(message.guild.emojiGöster(emojis.yes))
await Fight({
message: message,
opponent: member,
embed: {
title: message.member.user.username + ' Vs ' + member.user.username,
color: '#5865F2',
footer: message.guild.name,
timestamp: true
},
buttons: {
hit: 'Vur',
heal: 'Yenilen',
cancel: 'İptal Et',
accept: 'Kabul Et',
deny: 'Reddet'
},
bahis: sec,
parabirim: ayar.GuildName,
ödül: sec*2,
acceptMessage: '<@{{challenger}}> Kullanıcısı <@{{opponent}}> Kullanıcısına Meydan Okuyor.',
winMessage: '<@{{winner}}> Kullanıcısı Kazandı!',
endMessage: '<@{{opponent}}> Kullanıcısı Yanıt Vermediği İçin İptal Edildi.',
cancelMessage: '<@{{opponent}}> Kullanıcısı Savaşı Reddetti.',
fightMessage: '{{player}} Sıra Sende.',
opponentsTurnMessage: 'Lütfen Rakiplerinizin Hamle Yapmasını Bekleyin!',
highHealthMessage: "HP'niz 80'in Üzerindeyse İyileşemezsiniz!",
lowHealthMessage: "HP'niz 50'nin Altındaysa Dövüşü İptal Edemezsiniz!",
returnWinner: false,
othersMessage: 'Buttonu Sadece {{author}} Kullanabilir!'
});
}
}