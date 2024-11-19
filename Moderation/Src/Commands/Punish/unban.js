const settings = require("../../../../Src/Settings/Settings.json");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup");
const Penalties = require("../../../../Src/Schemas/Penalties");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
name: "unban",
aliases: ["yasak-kaldır", "yasakkaldır"],
help: "unban @Darkdays/ID",
category: "cezalandirma",
cooldown: 15,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["yasak-kaldır", "yasakkaldır", "unban"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.BanMembers) && !ayar.banHammer.some(x => message.member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!"}).sil(15)
return }
if (!args[0]) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bir Kullanıcı Belirtmelisin!"}).sil(15);
return }
const ban = await client.fetchBan(message.guild, args[0]);
if (!ban) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu Kullanıcı Zaten Banlı Değil!"}).sil(15);
return }
await message.guild.members.unban(args[0], `${message.author.displayName} Tarafından Kaldırıldı.`).catch(() => {});
const data = await Penalties.findOne({ userID: ban.user.id, guildID: settings.Moderation.guildID, type: "BAN", active: true });
if (data) {
data.active = false;
await data.save();
}
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} **(${ban.user.globalName ? ban.user.globalName : ban.user.username} - ${ban.user.id})** Adlı Kullanıcının Yasağı <t:${String(Date.now()).slice(0, 10)}:R> ${message.author} Tarafından Kaldırıldı.`})
const log = embed
.setAuthor({name: `${ban.user.globalName ? ban.user.globalName : ban.user.username}`, iconURL: ban.user.avatarURL({dynamic: true})})
.setThumbnail(ban.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} **${ban.user.globalName ? ban.user.globalName : ban.user.username}** Adlı Kullanıcının Yasağı ${message.member.toString()} Tarafından Kaldırıldı.

\`Kullanıcı:   \` \` ${ban.user.globalName ? ban.user.globalName : ban.user.username} - ${ban.user.id} \`
\`Yetkili:     \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Tarih:       \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
const banLog = await client.kanalBul("ban-log");
await banLog.send({ embeds: [log]});
}
};