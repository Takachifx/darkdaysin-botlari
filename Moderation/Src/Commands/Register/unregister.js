const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const emojis = require("../../../../Src/Settings/emojiName.json");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const Discord = require("discord.js");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
aliases: ["kayitsiz", "unregister", "unreg", "kayıtsız"],
name: "unregister",
help: "kayıtsız @Darkdays/ID",
category: "kayit",
cooldown: 0
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID });
if(!ayar) return;
const Name = ["kayitsiz", "unregister", "unreg", "kayıtsız"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.registerRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.staffRoles.some(oku => message.member.roles.cache.has(oku))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Yetkin bulunmamakta. Yetkili olmak istersen başvuru yapabilirsin.`)]}).sil(15)
}
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bir üye belirtmelisin!`)]}).sil(15)
}
if(ayar.unregRoles.some(x => member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Belirttiğin üye zaten kayıtsız!`)]}).sil(15)
}
if(member.roles.highest.position >= message.member.roles.highest.position) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Belirttiğin Kullanıcı Senden Üst Yada Aynı Pozisyonda!`)]}).sil(15)
}
if(member.user.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendin Üzerinde İşlem Yapamazsın"}).sil(15)
}
if(ayar.SafeBots.includes(member.user.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Botlara İşlem Yapamazsın"}).sil(15)
}
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({embeds: [embed.setDescription(`${member} Üyesi Başarıyla Kayıtsıza Atıldı!`).setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })}).setFooter({ text: `${moment(Date.now()).format("LLL")}`, iconURL: message.guild.iconURL({ dynamic: true })}).setThumbnail(member.user.avatarURL({ dynamic: true }))]})
await member.setRoles(ayar.unregRoles).catch(e => { })
await member.setNickname(`${ayar.defaultTag} ${ayar.unregName}`).catch(e => {})
}
}
