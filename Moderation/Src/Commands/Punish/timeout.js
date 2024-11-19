const settings = require("../../../../Src/Settings/Settings.json");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const TimeoutLimit = new Map();
const ms = require("ms");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
name: "timeout",
aliases: ["timeout", "timeoutat", "tm"],
help: "timeout @Darkdays/ID Süre Sebep",
category: "cezalandirma",
cooldown: 15,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["timeout", "timeoutat", "tm"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!"}).sil(15)
return }
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) {
await message.reply({ content:"Bir Kullanıcı Belirtmelisin!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const duration = args[1] ? ms(args[1]) : undefined
const reason = args.slice(2).join(" ")
if (message.member.roles.highest.position <= member.roles.highest.position) {
await message.reply({ content:"Kendinle Aynı Yetkide Ya da Daha Üst Yetkili Olan Birini Susturamazsın!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
if (!member.manageable) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu Kullanıcıyı Susturamıyorum!"}).sil(15)
return }
if (ayar.timeoutLimites > 0 && TimeoutLimit.has(message.author.id) && TimeoutLimit.get(message.author.id) == ayar.timeoutLimites) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Saatlik Susturma Sınırına Ulaştın!"}).sil(15)
return }
if(member.user.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendin Üzerinde İşlem Yapamazsın"}).sil(15)
}
if(ayar.SafeBots.includes(member.user.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Botlara İşlem Yapamazsın"}).sil(15)
}
if(member.timeout == true) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu Kullanıcı Zaten Susturulmuş!"}).sil(15)
return }
if(!duration) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Süre Belirtmelisin!"}).sil(15)
return }
if(!reason) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Sebep Belirtmelisin!"}).sil(15)
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.timeout(duration, reason).catch(e => {});
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısına <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından \` ${time} \` Timeout Atıldı.`})
const log = embed
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısına ${message.member.toString()} Tarafından \n\` ${time} \` Timeout Atıldı.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Süresi:  \` \` ${time} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")}`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("timeout-log");
await logKanal.send({ embeds : [log]});
if (ayar.timeoutLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!TimeoutLimit.has(message.author.id)) TimeoutLimit.set(message.author.id, 1);
else TimeoutLimit.set(message.author.id, TimeoutLimit.get(message.author.id) + 1);
setTimeout(() => {
if (TimeoutLimit.has(message.author.id)) TimeoutLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
};