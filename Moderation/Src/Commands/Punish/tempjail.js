const settings = require("../../../../Src/Settings/Settings.json");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup");
const Penalties = require("../../../../Src/Schemas/Penalties");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const jailLimit = new Map();
const cezapuan = require("../../../../Src/Schemas/PenaltyPoints");
const ms = require("ms");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
name: "tempjail",
aliases: ["tempjail", "tjail"],
help: "tempjail @Darkdays/ID Sebep Süre",
category: "cezalandirma",
cooldown: 15,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["tempjail", "tjail"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.jailHammer.some(x => message.member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content :"Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!"}).sil(15)
return }
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) {
await message.reply({ content :"Bir üye belirtmelisin!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
if (ayar.jailRoles.some(x => member.roles.cache.has(x))) {
await message.reply({ content :"Bu Kullanıcı Zaten Karantinada!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const reason = args.slice(2).join(" ")
const duration = args[1] ? ms(args[1]) : undefined;
if(reason && reason.toLowerCase().includes('reklam')) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content :`Yanlış Kullanım.\nDoğru Kullanım: ${settings.Moderation.prefix}reklam @Darkdays/ID`}).sil(15)
return }
if(!duration) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content :"Lütfen Bir Süre Belirtin!"}).sil(15)
return }
if(member.user.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendin Üzerinde İşlem Yapamazsın"}).sil(15)
}
if(ayar.SafeBots.includes(member.user.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Botlara İşlem Yapamazsın"}).sil(15)
}
if (message.member.roles.highest.position <= member.roles.highest.position) {
await message.reply({ content :"Kendinle Aynı Yetkide Ya da Daha Üst Yetkili Olan Birini Karantina'ya Atamazsın!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
if (!member.manageable) {
await message.reply({ content :"Bu Kullanıcıyı Karantina'ya Atamam!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
if (ayar.jailLimites > 0 && jailLimit.has(message.author.id) && jailLimit.get(message.author.id) == ayar.jailLimites) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content :"Saatlik Karantina Sınırına Ulaştın!"}).sil(15)
return }
const data = await Penalties.findOne({ userID: member.user.id, guildID: settings.Moderation.guildID, $or: [{ type: "TEMP-JAIL" }], active: true });
if (data) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content :"Bu Kullanıcı Zaten Karantinada!"}).sil(15)
return }
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { cezapuan: ayar.jailPenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
await message.react(message.guild.emojiGöster(emojis.yes))
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
const penal = await client.Punished(settings.Moderation.guildID, member.user.id, "TEMP-JAIL", true, message.author.id, reason, true, Date.now() + duration, member.roles.cache.filter(x => x.name != "@everyone" && !ayar.jailRoles.some(y => y == x.id)).map(x => x.id));
await member.setRoles(ayar.jailRoles).catch(e => {});
const logs = await client.kanalBul("ceza-log");
await logs.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
await message.reply({ content :`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından \` ${time} \` Süresi Boyunca Karantina'ya Atıldı Ceza Numarası: **(${penal.id})**`})
const log = embed
.setAuthor({ name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL:  member.user.avatarURL({ dynamic: true }) })
.setColor("Random")
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısı ${message.member.toString()} Tarafından Karantina'ya Atıldı.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Ceza Süresi :\` \` ${time} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: ${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("jail-log");
await logKanal.send({ embeds: [log]});
if (ayar.jailLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
setTimeout(() => {
if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
}