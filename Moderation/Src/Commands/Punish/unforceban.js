const settings = require("../../../../Src/Settings/Settings.json");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const ForceBans = require("../../../../Src/Schemas/ForceBans");
module.exports = {
conf: {
name: "unforceban",
aliases: ["unkalıcıban", "unfban"],
help: "unforceban @Darkdays/ID",
category: "cezalandirma",
cooldown: 15,
owner: true,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
if (!args[0]) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bir Kullanıcı Belirtmelisin!"}).sil(15)
return }
const ban = await client.fetchBan(message.guild, args[0]);
if (!ban) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu Kullanıcı Banlı Değil!"}).sil(15)
return }
const forcebans = await ForceBans.findOne({userID: args[0]})
if(!forcebans) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu Kullanıcı Kalıcı Banlı Değil!"}).sil(15)
return }
await ForceBans.deleteMany({userID: args[0]})
await message.guild.members.unban(args[0], `${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} tarafından kaldırıldı!`).catch(() => {});
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} **(${ban.user.globalName ? ban.user.globalName : ban.user.username} - ${ban.user.id})** Adlı Kullanıcının Kalıcı Banı <t:${String(Date.now()).slice(0, 10)}:R> ${message.member.toString()} Tarafından Kaldırıldı!`})
const log = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({name: `${ban.user.globalName ? ban.user.globalName : ban.user.username}`, iconURL: ban.user.displayAvatarURL({dynamic: true})})
.setThumbnail(ban.user.displayAvatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} **(${ban.user.globalName ? ban.user.globalName : ban.user.username} - ${ban.user.id})** Adlı Kullanıcının Kalıcı Banı ${message.member.toString()} Tarafından Kaldırıldı!

\`Kullanıcı:    \` \`${ban.user.globalName ? ban.user.globalName : ban.user.username} - ${ban.user.id}\`
\`Yetkili:      \` \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id}\`
\`Tarih:        \`   <t:${String(Date.now()).slice(0, 10)}:R>`)
const banLog = await client.kanalBul("ban-log");
await banLog.send({ embeds: [log]});
}
};