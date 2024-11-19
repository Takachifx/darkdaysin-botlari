const rankDB = require("../../../../Src/Schemas/RankSystem")
const Puans = require("../../../../Src/Schemas/Puans")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["ytpuan", "puan"],
name: "puan",
help: "puan [Ekle/Sil] [@Darkdays/ID] [Sayı]",
owner: true,
category: "owner"
},
Cyrstal: async (client, message, args, embed) => {
const ranks = JSON.parse(await client.ranks(message.guild.id));
const data = await rankDB.findOne({guildID: message.guild.id})
if(!data) return;
if(data.RankSystem === false) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Terfi sistemi aktif değil!`)]}).sil(15)
}
const channel = await client.kanalBul("terfi-sistem-log")
const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
if (!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bir kullanıcı belirtmelisin!`)]}).sil(15)
}
if (args[0] === "ekle" || args[0] === "add") {
if (!message.member.permissions.has(8n)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)]}).sil(15)
}
const count = parseInt(args[2]);
if (!count) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Eklemek için bir sayı belirtmelisin!`)]}).sil(15)
}
if (!count < 0) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Eklenecek sayı 0'dan küçük olamaz!`)]}).sil(15)
}
await Puans.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { puan: count } }, { upsert: true });
const puanData = await Puans.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
let addedRoles = "";
if (puanData && ranks.some(x => puanData.puan > x.puan && !member.roles.cache.has(x.roleID))) {
const roles = ranks.filter(x => puanData.puan >= x.puan && !member.roles.cache.has(x.roleID));
addedRoles = roles;
await member.addRoles(roles[roles.length-1].roleID || "").catch(e => {})
await member.addRoles(roles[roles.length-1].hammer || "").catch(e => {})
embed.setColor("Random");
channel.send({ embeds: [embed.setDescription(`${member.toString()} Üyesine ${message.member.toString()} Tarafından **${count}** Adet Puan Eklendi ve Kişiye ${roles.filter(x => roles.indexOf(x) === roles.length-1).map(x => `${message.guild.roles.cache.get(x.roleID)}`).join(", ")} Rolleri Verildi!`)]});
}
message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla ${member.toString()} Kullanıcısına **${count}** Adet Puan Eklendi! \n\n${addedRoles.length > 0 ? `Verilen Roller: \n${addedRoles.filter(x => addedRoles.indexOf(x) === addedRoles.length-1).map(x => `${message.guild.roles.cache.get(x.roleID)}`).join(", ")}` : ""}`)]});
} else if (args[0] === "sil" || args[0] === "remove") {
if (!message.member.permissions.has(8n)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)]}).sil(15)
}
const count = Number(args[2]);
if (!count) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Çıkarmak için bir sayı belirtmelisin!`)]}).sil(15)
}
if (!count < 0) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Çıkarılacak sayı 0'dan küçük olamaz!`)]}).sil(15)
}
let puanData = await Puans.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if (puanData && count > puanData.puan) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Kullanıcının Puanı Çıkarmak İstediğiniz Sayıdan Büyük Olamaz!`)]}).sil(15)
}
await Puans.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { puan: -count } }, { upsert: true });
puanData = await Puans.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
let removedRoles = "";
if (puanData && ranks.some(x => puanData.puan < x.puan && member.roles.cache.has(x.roleID))) {
const roles = ranks.filter(x =>  puanData.puan <= x.puan && member.roles.cache.has(x.roleID));
removedRoles = roles;
await member.removeRoles(roles[roles.length-1].roleID || "").catch(e => {})
await member.removeRoles(roles[roles.length-1].hammer || "").catch(e => {})
embed.setColor("Random");
channel.send({ embeds: [embed.setDescription(`${member.toString()} Üyesinden ${message.member.toString()} Tarafından **${count}** Adet Puan Çıkarıldı ve Kişiden ${roles.map(x => `${message.guild.roles.cache.get(x.roleID)}`).join(", ")} Rolleri Alındı!`)]});
}
message.channel.send({ embeds: [embed.setDescription(`Başarıyla ${member.toString()} Kullanıcısından **${count}** Adet Puan Çıkarıldı! \n\n${removedRoles.length > 0 ? `Alınan Roller: \n${removedRoles.map(x => `${message.guild.roles.cache.get(x.roleID)}`).join(", ")}` : ""}`)]});
}
}
}