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
name: "unmute",
aliases: ["uncmute", "unmute", "un-sustur", "un-susturma", "un-chat-mute", "un-chat-sustur"],
help: "unmute @Darkdays/ID",
category: "cezalandirma",
cooldown: 15,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["uncmute", "unmute", "un-sustur", "un-susturma", "un-chat-mute", "un-chat-sustur"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.muteHammer.some(x => message.member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content: "Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!"}).sil(15)
return }
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply( { content:"Bir Kullanıcı Belirtmelisin!"}).sil(15)
return }
if (!ayar.muteRoles.some(x => member.roles.cache.has(x))) {
message.react(message.guild.emojiGöster(emojis.no))
message.reply( { content:"Bu Kullanıcı Zaten Susturulmamış!"}).sil(15)
return }
if (!message.member.permissions.has(8n) && member.roles.highest.position >= message.member.roles.highest.position) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Kendinle Aynı Yetkide Ya Da Daha Üst Yetkide Olan Birini Susturamazsın!"}).sil(15)
return }
if (!member.manageable) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu Kullanıcıya Dokunamıyorum!"}).sil(15)
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.removeRoles(ayar.muteRoles).catch(e => {});
const data = await Penalties.findOne({ userID: member.user.id, guildID: settings.Moderation.guildID, type: "CHAT-MUTE", active: true });
if (data) {
data.active = false;
await data.save();
}
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Üyesinin **Text Kanallarındaki** Susturması <t:${String(Date.now()).slice(0, 10)}:R> ${message.member.toString()} Tarafından Kaldırıldı!`})
const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Adlı Kullanıcının **Text Kanallarındaki** Susturması ${message.member.toString()} Tarafından Kaldırıldı.

\`Kullanıcı:   \`    \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:     \`    \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Tarih:       \`       <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")}`, iconURL: message.guild.iconURL({dynamic: true})})
const muteLog = await client.kanalBul("mute-log");
await muteLog.send({ embeds: [log]});
}
};