const rankDB = require("../../../../Src/Schemas/RankSystem")
const Puans = require("../../../../Src/Schemas/Puans")
const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["senkron", "senk"],
name: "senkronize",
help: "senkronize [Üye] @Darkdays/ID / [Role] @Rol/ID",
category: "ustyetkili",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
if (!message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`)]}).sil(15)
}
const ranks = JSON.parse(await client.ranks(message.guild.id));
const data = await rankDB.findOne({guildID: message.guild.id})
if(!data) return;
if(data.RankSystem === false) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Terfi sistemi aktif değil!`)]}).sil(15)
}
if (args[0] === "kişi" || args[0] === "üye") {
const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
if (!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bir kullanıcı belirtmelisin!`)]}).sil(15)
}
if (ranks.some(x => member.hasRole(x.roleID))) {
let rank = ranks.filter(x => member.hasRole(x.roleID));
rank = rank[rank.length-1];
await Puans.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { puan: rank.puan } }, { upsert: true });
await Puans.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { puan: 1 } }, { upsert: true });
if(rank && rank.hammer) await member.addRoles(rank.hammer || "").catch(e => {})
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ embeds: [embed.setDescription(`${member.toString()} Kullanıcısında **${message.guild.roles.cache.get(rank.roleID).name}** Rolü Bulundu ve Puanı ${rank.puan} Olarak Değiştirildi!`)]})
} else {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ embeds: [embed.setDescription(`${member.toString()} Kullanıcısında Sistemde Ayarlı Bir Rol Bulunamadı!`)]}).sil(15)
}
} else if (args[0] === "role" || args[0] === "rol") {
const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
if (!role) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription("Bir rol belirtmelisin!")]}).sil(15)
}
if (role.members.length === 0) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription("Bu rolde üye bulunmamakta!")]}).sil(15)
}
role.members.filter(member => !member.user.bot).forEach(async member => {
if (ranks.some(x => member.hasRole(x.roleID))) {
let rank = ranks.filter(x => member.hasRole(x.roleID));
rank = rank[rank.length-1];
await Puans.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { puan: rank.puan } }, { upsert: true });
await Puans.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { puan: 1 } }, { upsert: true });
if(rank && rank.hammer) await member.addRoles(rank.hammer || "").catch(e => {})
message.channel.send({ embeds: [embed.setDescription(`${member.toString()} Kullanıcısında **${message.guild.roles.cache.get(rank.roleID).name}** Rolü Bulundu ve Puanı ${rank.puan} Olarak Değiştirildi!`)]})
} else {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ embeds: [embed.setDescription(`${member.toString()} Kullanıcısında Sistemde Ayarlı Bir Rol Bulunamadı!`)]}).sil(15)
}
});
} else {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription("Geçerli bir argüman belirtmelisin! (kişi/rol)")]})
}
}
}