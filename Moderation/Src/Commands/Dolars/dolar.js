const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["dolar"],
name: "dolar",
help: "dolar [ekle/sil] [kullanıcı] [sayı]",
owner: true,
category: "owner",
},
Cyrstal: async (client, message, args, embed, prefix) => {
if (!message.guild) return;
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
if (!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:"Bir kullanıcı belirtmelisin!"}).sil(15)
}
if (args[0] === "ekle" || args[0] === "add") {
const count = parseInt(args[2]);
if (!count) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:"Eklemek için bir sayı belirtmelisin!"}).sil(15)
}
if (!count < 0) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:"Eklenecek sayı 0'dan küçük olamaz!"}).sil(15)
}
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { dolar: count } }, { upsert: true });
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ embeds: [embed.setDescription(`Başarıyla ${member.toString()} kullanıcısına **${count}** **${ayar.GuildName}** Doları eklendi!`)]});
} else if (args[0] === "sil" || args[0] === "remove") {
const count = parseInt(args[2]);
if (!count) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:"Çıkarılacak için bir sayı belirtmelisin!"}).sil(15)
}
if (!count < 0) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:"Çıkarılacak sayı 0'dan küçük olamaz!"}).sil(15)
}
let dolarData = await dolars.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if (!dolarData || dolarData && count > dolarData.dolar) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:`Çıkarmak istediğiniz sayı, kişinin mevcut **${ayar.GuildName}** dolarından büyük olamaz!`});
}
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { dolar: -count } }, { upsert: true });
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ embeds: [embed.setDescription(`Başarıyla ${member.toString()} kullanıcısından **${count}** **${ayar.GuildName}** Doları silindi!`)]});
}
}
}