const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["transfer", "gönder", "yolla", "transf"],
name: "transfer",
help: "transfer @Darkdays/ID Miktar",
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
let sec = args[1]
let regex = /^[0-9]+$/
if(!sec || !Number(sec) || Number(sec) < 0 || !regex.test(sec)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Kaç **${ayar.GuildName}** doları göndermek istiyorsun?`}).sil(15)
}
if(!dolarDatas.dolar) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `Hiç **${ayar.GuildName}** doların yok!`}).sil(15)
}
if(dolarDatas.dolar < sec) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Yeterli miktar da **${ayar.GuildName}** doları yok! **${ayar.GuildName}** Doların: (\` ${dolarDatas ? Math.floor(parseInt(dolarDatas.dolar)) : 0} \` **${ayar.GuildName}** Doları)`}).sil(15)
}
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content: `${message.member}, Başarıyla ${member} Kişisine \` ${Math.floor(parseInt(sec))} \` **${ayar.GuildName}** Doları Gönderdin. (Kalan **${ayar.GuildName}** Doların: \` ${dolarDatas ? Math.floor(parseInt(dolarDatas.dolar - sec)) : 0} \`)`})
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: -sec } }, { upsert: true });
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.id }, { $inc: { dolar: +sec } }, { upsert: true });
}
}