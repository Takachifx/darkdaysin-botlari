const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const RankSystem = require("../../../../Src/Schemas/RankSystem");
const Puans = require("../../../../Src/Schemas/Puans");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["düşür"],
name: "düşür",
help: "düşür @Darkdays/ID",
category: "ustyetkili"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if(!ayar) return;
const Name = ["dusur", "düşür"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.ownerRoles.some(x => message.member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bu komutu kullanabilmek için yeterli yetkiye sahip olmalısın!`)]}).sil(15)
}
const rdata = await RankSystem.findOne({guildID: message.guild.id})
if(!rdata) return;
if(rdata.RankSystem == false) return await message.react(message.guild.emojiGöster(emojis.no))
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
const ranks = JSON.parse(await client.ranks(message.guild.id));
if(!ranks.map(x => x.roleID).some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)]}).sil(15)
}
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bir üye belirtmelisin!`)]}).sil(15)
}
if(!ranks.map(x => x.roleID).some(x => member.roles.cache.has(x)) && !member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Belirttiğin üye yetkili değil!`)]}).sil(15)
}
if(member.user.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendin Üzerinde İşlem Yapamazsın"}).sil(15)
}
if(ayar.SafeBots.includes(member.user.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Botlara İşlem Yapamazsın"}).sil(15)
}
if(message.member.roles.highest.position <= member.roles.highest.position) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendinden Üstteki Kullanıcıya İşlem Yapamazsın"}).sil(15)
}
const puanData = await Puans.findOne({ guildID: settings.Moderation.guildID, userID: member.id });
const terfiYt = ranks.map((x) => x.roleID);
let currentRank = ranks.filter(x => (puanData ? puanData.puan : 0) >= x.puan);
currentRank = currentRank[currentRank.length-1];
let lowerRankIndex = ranks.indexOf(currentRank) - 1;
let lowerRank = lowerRankIndex >= 0 ? ranks[lowerRankIndex] : null;
if (currentRank && lowerRank) {
const demoteStatus = member.hasRole(terfiYt, false) && ranks.length > 0 ?
`${currentRank ? `${currentRank !== ranks[0] ? `${Array.isArray(lowerRank.roleID) ? lowerRank.roleID.length > 1 ? lowerRank.roleID.slice(0, -1).map(x => `${message.guild.roles.cache.get(x)}`).join(', ') + ' ve ' + lowerRank.roleID.map(x => `${message.guild.roles.cache.get(x)}`).slice(-1) : lowerRank.roleID.map(x => `${message.guild.roles.cache.get(x)}`).join(", ") : `${message.guild.roles.cache.get(lowerRank.roleID)}`} ` : "En Düşük Yetkiye Sahipsiniz."}` : `${Array.isArray(lowerRank.roleID) ? lowerRank.roleID.length > 1 ? lowerRank.roleID.slice(0, -1).map(x => `${message.guild.roles.cache.get(x)}`).join(', ') + ' ve ' + lowerRank.roleID.map(x => `${message.guild.roles.cache.get(x)}`).slice(-1) : lowerRank.roleID.map(x => `${message.guild.roles.cache.get(x)}`).join(", ") : `${message.guild.roles.cache.get(lowerRank.roleID)}`}`}` : "";
await message.react(message.guild.emojiGöster(emojis.yes));
await message.reply({embeds: [embed.setDescription(`${member} Yetkilisi ${demoteStatus} Rolüne Düşürüldü.`)]});
await member.removeRoles(currentRank ? currentRank.roleID : "").catch(e => {});
await member.removeRoles(currentRank.hammer || "").catch(e => {});
await member.addRoles(lowerRank ? lowerRank.roleID : "").catch(e => {});
await member.addRoles(lowerRank.hammer || "").catch(e => {});
await Puans.updateOne({ guildID: settings.Moderation.guildID, userID: member.id }, { $set: { puan: lowerRank ? lowerRank.puan : 0  } }, { upsert: true });
await Puans.updateOne({ guildID: settings.Moderation.guildID, userID: member.id }, { $inc: { puan: 1  } }, { upsert: true });
const channel = await client.kanalBul("terfi-sistem-log")
if(channel) await channel.send({embeds: [embed.setDescription(`${member} Yetkilisi ${message.member} Tarafından <t:${String(Date.now()).slice(0, 10)}> Tarihinde ${demoteStatus} Rolüne Düşürüldü.`)]})
} else {
await message.react(message.guild.emojiGöster(emojis.no));
await message.reply({embeds: [embed.setDescription(`${member} en düşük yetkide, daha fazla düşürülemez.`)]}).sil(15)
}
}
}