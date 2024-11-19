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
name: "unjail",
aliases: ["unkarantina"],
help: "unjail @Darkdays/ID",
category: "cezalandirma",
cooldown: 15,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["unkarantina", "unjail"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.jailHammer.some(x => message.member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!"}).sil(15)
return }
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bir Kullanıcı Belirtmelisin!"}).sil(15)
return }
if (!ayar.jailRoles.some(x => member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu Kullanıcı Zaten Karantinada Değil!"}).sil(15)
return }
if (!message.member.permissions.has(8n) && member.roles.highest.position >= message.member.roles.highest.position) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Kendinle Aynı Yetkide Ya da Daha Üst Yetkili Olan Birini Karantina'dan Çıkaramazsın!"}).sil(15)
return }
if (!member.manageable) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu Kullanıcıyı Karantinadan Çıkaramıyorum!"}).sil(15)
return }
const data = await Penalties.findOne({ userID: member.user.id, guildID: settings.Moderation.guildID, $or: [{ type: "JAIL" }, { type: "TEMP-JAIL" }], active: true });
if (data) {
data.active = false;
await data.save();
}
await member.setRoles(ayar.unregRoles).catch(e => {});
await member.setNickname(`${ayar.defaultTag} ${ayar.unregName}`)
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Üyesinin Karantinası <t:${String(Date.now()).slice(0, 10)}:R> ${message.author} Tarafından Kaldırıldı!`})
const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Adlı Kullanıcının Karantinası ${message.member.toString()} Tarafından Kaldırıldı.

\`Kullanıcı:   \`    \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:     \`    \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Tarih:       \`       <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")}`, iconURL: message.guild.iconURL({dynamic: true})})
const jailLog = await client.kanalBul("jail-log");
await jailLog.send({ embeds: [log]});
}
};