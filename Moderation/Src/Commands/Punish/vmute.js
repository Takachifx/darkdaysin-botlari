const settings = require("../../../../Src/Settings/Settings.json");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup");
const Penalties = require("../../../../Src/Schemas/Penalties");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const muteLimit = new Map();
const cezapuan = require("../../../../Src/Schemas/PenaltyPoints");
const ms = require("ms");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
name: "vmute",
aliases: ["vmute", "voice-mute", "voice-sustur", "sesli-sustur", "sesli-mute"],
help: "vmute @Darkdays/ID Süre Sebep",
category: "cezalandirma",
cooldown: 15,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["vmute", "voice-mute", "voice-sustur", "sesli-sustur", "sesli-mute"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.muteHammer.some(x => message.member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!"}).sil(15)
return }
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) {
await message.reply({ content:"Bir Kullanıcı Belirtmelisin!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
if (ayar.vmuteRoles.some(x => member.roles.cache.has(x))) {
await message.reply({ content:"Bu Kullanıcı Zaten Susturulmuş!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const duration = args[1] ? ms(args[1]) : undefined;
const reason = args.slice(2).join(" ")
if(member.user.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendin Üzerinde İşlem Yapamazsın"}).sil(15)
}
if(ayar.SafeBots.includes(member.user.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Botlara İşlem Yapamazsın"}).sil(15)
}
if (message.member.roles.highest.position <= member.roles.highest.position) {
await message.reply({ content:"Kendinle Aynı Yetkide Ya da Daha Üst Yetkili Olan Birini Susturamazsın!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
if (!member.manageable) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu Kullanıcıyı Susturamıyorum!"}).sil(15)
return }
if (ayar.muteLimites > 0 && muteLimit.has(message.author.id) && muteLimit.get(message.author.id) == ayar.muteLimites) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Saatlik Susturma Sınırına Ulaştın!"}).sil(15)
return }
const data = await Penalties.findOne({ userID: member.user.id, guildID: settings.Moderation.guildID, $or: [{ type: "VOICE-MUTE" }], active: true });
if (data) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu Kullanıcı Zaten Susturulmuş!"}).sil(15)
return }
if(reason && duration) {
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { cezapuan: ayar.mutePenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(cezapuanData && cezapuanData.cezapuan >= ayar.totalPenaltiesPoint) {
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
await member.setRoles(ayar.jailRoles).catch(e => {});
await client.Punished(settings.Moderation.guildID, member.user.id, "JAIL", true, client.user.id, "Ceza Puan Sınırına Ulaştı.");
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.addRoles(ayar.vmuteRoles).catch(e => {});
const penal = await client.Punished(settings.Moderation.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından **Ses Kanallarında** \` ${time} \` Susturuldu. Ceza Numarası: **(${penal.id})**`})
const log = embed
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısı ${message.member.toString()} Tarafından **Ses Kanallarında** Susturuldu.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Süresi:  \` \` ${time} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: #${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("vmute-log");
await logKanal.send({ embeds : [log]});
if (ayar.muteLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
setTimeout(() => {
if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
} else if (!reason && !duration) {
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("voicemuteceza")
.setPlaceholder("Kullanıcının ceza türünü seçmek için tıkla!")
.addOptions([
{
emoji: `${message.guild.emojiGöster(emojis.bir).id}`,
label: `Küfür, Ortam bozma, Troll, Soundpad`,
description: `10 Dakika`,
value: "1",
},
{
emoji: `${message.guild.emojiGöster(emojis.iki).id}`,
label: `Dizi veya filmler hakkında spoiler vermek`,
description: `10 Dakika`,
value: "2",
},
{
emoji: `${message.guild.emojiGöster(emojis.uc).id}`,
label: `Tartışmak, kavga etmek veya rahatsızlık çıkarmak, kışkırtmak`,
description: `15 Dakika`,
value: "3",
},
{
emoji: `${message.guild.emojiGöster(emojis.dort).id}`,
label: `Ailevi küfür`,
description: `20 Dakika`,
value: "4",
},
{
emoji: `${message.guild.emojiGöster(emojis.bes).id}`,
label: `Siyaset`,
description: `20 Dakika`,
value: "5",
},
{
emoji: `${message.guild.emojiGöster(emojis.alti).id}`,
label: `Sorun çözme terk`,
description: `20 Dakika`,
value: "6",
},
{
emoji: `${message.guild.emojiGöster(emojis.yedi).id}`,
label: `Ortamı (${message.guild.name}) kötülemek`,
description: `30 Dakika`,
value: "7",
},
{
emoji: `${message.guild.emojiGöster(emojis.sekiz).id}`,
label: `Secreta uyarılara rağmen izinsiz giriş`,
description: `30 Dakika`,
value: "8",
},
{
emoji: `${message.guild.emojiGöster(emojis.dokuz).id}`,
label: `Taciz, Kadın üyelere sarkmak`,
description: `1 Saat`,
value: "9",
},
{
emoji: `${"1207317729258770432"}`,
label: `İptal`,
value: "iptal",
},
]),
);
var msg = await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.punish)} ${message.member} Merhaba! ${member} Kullanıcısına <t:${Math.floor(Date.now() / 1000)}> Tarihinde Vermek İstediğiniz Ceza Türünü Aşağıdan Seçiniz.`)], components: [row]})
var filter = (button) => button.user.id === message.author.id;
const collector = msg.createMessageComponentCollector({
filter,
time: 30000,
});
collector.on("collect", async (button) => {
if (button.values[0] === "1") {
await button.deferUpdate();
var duration = ms("10m")
var reason = "Küfür, Ortam bozma, Troll, Soundpad"
await msg.delete().catch(e => {});
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { cezapuan: ayar.mutePenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(cezapuanData && cezapuanData.cezapuan >= ayar.totalPenaltiesPoint) {
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
await member.setRoles(ayar.jailRoles).catch(e => {});
await client.Punished(settings.Moderation.guildID, member.user.id, "JAIL", true, client.user.id, "Ceza Puan Sınırına Ulaştı.");
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.addRoles(ayar.vmuteRoles).catch(e => {});
const penal = await client.Punished(settings.Moderation.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından **Ses Kanallarında** \` ${time} \` Susturuldu. Ceza Numarası: **(${penal.id})**`})
const log = embed
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısı ${message.member.toString()} Tarafından **Ses Kanallarında** Susturuldu.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Süresi:  \` \` ${time} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: #${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("vmute-log");
await logKanal.send({ embeds : [log]});
if (ayar.muteLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
setTimeout(() => {
if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
if (button.values[0] === "2") {
await button.deferUpdate();
var duration = ms("10m")
var reason = "Dizi veya filmler hakkında spoiler vermek"
await msg.delete().catch(e => {});
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { cezapuan: ayar.mutePenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(cezapuanData && cezapuanData.cezapuan >= ayar.totalPenaltiesPoint) {
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
await member.setRoles(ayar.jailRoles).catch(e => {});
await client.Punished(settings.Moderation.guildID, member.user.id, "JAIL", true, client.user.id, "Ceza Puan Sınırına Ulaştı.");
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.addRoles(ayar.vmuteRoles).catch(e => {});
const penal = await client.Punished(settings.Moderation.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından **Ses Kanallarında** \` ${time} \` Susturuldu. Ceza Numarası: **(${penal.id})**`})
const log = embed
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısı ${message.member.toString()} Tarafından **Ses Kanallarında** Susturuldu.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Süresi:  \` \` ${time} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: #${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("vmute-log");
await logKanal.send({ embeds : [log]});
if (ayar.muteLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
setTimeout(() => {
if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
if (button.values[0] === "3") {
await button.deferUpdate();
var duration = ms("15m")
var reason = "Tartışmak, kavga etmek veya rahatsızlık çıkarmak, kışkırtmak"
await msg.delete().catch(e => {});
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { cezapuan: ayar.mutePenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(cezapuanData && cezapuanData.cezapuan >= ayar.totalPenaltiesPoint) {
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
await member.setRoles(ayar.jailRoles).catch(e => {});
await client.Punished(settings.Moderation.guildID, member.user.id, "JAIL", true, client.user.id, "Ceza Puan Sınırına Ulaştı.");
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.addRoles(ayar.vmuteRoles).catch(e => {});
const penal = await client.Punished(settings.Moderation.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından **Ses Kanallarında** \` ${time} \` Susturuldu. Ceza Numarası: **(${penal.id})**`})
const log = embed
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısı ${message.member.toString()} Tarafından **Ses Kanallarında** Susturuldu.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Süresi:  \` \` ${time} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: #${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("vmute-log");
await logKanal.send({ embeds : [log]});
if (ayar.muteLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
setTimeout(() => {
if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
if (button.values[0] === "4") {
await button.deferUpdate();
var duration = ms("20m")
var reason = "Ailevi güven"
await msg.delete().catch(e => {});
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { cezapuan: ayar.mutePenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(cezapuanData && cezapuanData.cezapuan >= ayar.totalPenaltiesPoint) {
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
await member.setRoles(ayar.jailRoles).catch(e => {});
await client.Punished(settings.Moderation.guildID, member.user.id, "JAIL", true, client.user.id, "Ceza Puan Sınırına Ulaştı.");
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.addRoles(ayar.vmuteRoles).catch(e => {});
const penal = await client.Punished(settings.Moderation.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından **Ses Kanallarında** \` ${time} \` Susturuldu. Ceza Numarası: **(${penal.id})**`})
const log = embed
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısı ${message.member.toString()} Tarafından **Ses Kanallarında** Susturuldu.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Süresi:  \` \` ${time} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: #${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("vmute-log");
await logKanal.send({ embeds : [log]});
if (ayar.muteLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
setTimeout(() => {
if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
if (button.values[0] === "5") {
await button.deferUpdate();
var duration = ms("20m")
var reason = "Siyaset"
await msg.delete().catch(e => {});
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { cezapuan: ayar.mutePenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(cezapuanData && cezapuanData.cezapuan >= ayar.totalPenaltiesPoint) {
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
await member.setRoles(ayar.jailRoles).catch(e => {});
await client.Punished(settings.Moderation.guildID, member.user.id, "JAIL", true, client.user.id, "Ceza Puan Sınırına Ulaştı.");
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.addRoles(ayar.vmuteRoles).catch(e => {});
const penal = await client.Punished(settings.Moderation.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından **Ses Kanallarında** \` ${time} \` Susturuldu. Ceza Numarası: **(${penal.id})**`})
const log = embed
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısı ${message.member.toString()} Tarafından **Ses Kanallarında** Susturuldu.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Süresi:  \` \` ${time} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: #${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("vmute-log");
await logKanal.send({ embeds : [log]});
if (ayar.muteLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
setTimeout(() => {
if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
if (button.values[0] === "6") {
await button.deferUpdate();
var duration = ms("20m")
var reason = "Sorun çözme terk"
await msg.delete().catch(e => {});
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { cezapuan: ayar.mutePenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(cezapuanData && cezapuanData.cezapuan >= ayar.totalPenaltiesPoint) {
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
await member.setRoles(ayar.jailRoles).catch(e => {});
await client.Punished(settings.Moderation.guildID, member.user.id, "JAIL", true, client.user.id, "Ceza Puan Sınırına Ulaştı.");
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.addRoles(ayar.vmuteRoles).catch(e => {});
const penal = await client.Punished(settings.Moderation.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından **Ses Kanallarında** \` ${time} \` Susturuldu. Ceza Numarası: **(${penal.id})**`})
const log = embed
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısı ${message.member.toString()} Tarafından **Ses Kanallarında** Susturuldu.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Süresi:  \` \` ${time} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: #${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("vmute-log");
await logKanal.send({ embeds : [log]});
if (ayar.muteLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
setTimeout(() => {
if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
if (button.values[0] === "7") {
await button.deferUpdate();
var duration = ms("30m")
var reason = "Ortamı (kötülemek)"
await msg.delete().catch(e => {});
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { cezapuan: ayar.mutePenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(cezapuanData && cezapuanData.cezapuan >= ayar.totalPenaltiesPoint) {
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
await member.setRoles(ayar.jailRoles).catch(e => {});
await client.Punished(settings.Moderation.guildID, member.user.id, "JAIL", true, client.user.id, "Ceza Puan Sınırına Ulaştı.");
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.addRoles(ayar.vmuteRoles).catch(e => {});
const penal = await client.Punished(settings.Moderation.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından **Ses Kanallarında** \` ${time} \` Susturuldu. Ceza Numarası: **(${penal.id})**`})
const log = embed
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısı ${message.member.toString()} Tarafından **Ses Kanallarında** Susturuldu.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Süresi:  \` \` ${time} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: #${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("vmute-log");
await logKanal.send({ embeds : [log]});
if (ayar.muteLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
setTimeout(() => {
if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
if (button.values[0] === "8") {
await button.deferUpdate();
var duration = ms("30m")
var reason = "Secreta uyarılara rağmen izinsiz giriş"
await msg.delete().catch(e => {});
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { cezapuan: ayar.mutePenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(cezapuanData && cezapuanData.cezapuan >= ayar.totalPenaltiesPoint) {
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
await member.setRoles(ayar.jailRoles).catch(e => {});
await client.Punished(settings.Moderation.guildID, member.user.id, "JAIL", true, client.user.id, "Ceza Puan Sınırına Ulaştı.");
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.addRoles(ayar.vmuteRoles).catch(e => {});
const penal = await client.Punished(settings.Moderation.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından **Ses Kanallarında** \` ${time} \` Susturuldu. Ceza Numarası: **(${penal.id})**`})
const log = embed
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısı ${message.member.toString()} Tarafından **Ses Kanallarında** Susturuldu.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Süresi:  \` \` ${time} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: #${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("vmute-log");
await logKanal.send({ embeds : [log]});
if (ayar.muteLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
setTimeout(() => {
if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
if (button.values[0] === "9") {
await button.deferUpdate();
var duration = ms("1h")
var reason = "Taciz, Kadın üyelere sarkmak"
await msg.delete().catch(e => {});
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $inc: { cezapuan: ayar.mutePenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(cezapuanData && cezapuanData.cezapuan >= ayar.totalPenaltiesPoint) {
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
await member.setRoles(ayar.jailRoles).catch(e => {});
await client.Punished(settings.Moderation.guildID, member.user.id, "JAIL", true, client.user.id, "Ceza Puan Sınırına Ulaştı.");
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Ceza Puan Limitine Ulaştı. Otomatik Olarak (\` JAİL \`) Cezası Verildi.`});
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await member.addRoles(ayar.vmuteRoles).catch(e => {});
const penal = await client.Punished(settings.Moderation.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
const cezas = await client.kanalBul("ceza-log");
await cezas.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
await message.reply({ content:`${message.guild.emojiGöster(emojis.punish)} ${member.toString()} Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından **Ses Kanallarında** \` ${time} \` Susturuldu. Ceza Numarası: **(${penal.id})**`})
const log = embed
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.username}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısı ${message.member.toString()} Tarafından **Ses Kanallarında** Susturuldu.

\`Kullanıcı:    \` \` ${member.user.globalName ? member.user.globalName : member.user.username} - ${member.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ceza Süresi:  \` \` ${time} \`
\`Ceza Sebebi:  \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: #${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("vmute-log");
await logKanal.send({ embeds : [log]});
if (ayar.muteLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
setTimeout(() => {
if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
if(button.values[0] === "iptal") {
if(msg) msg.delete().catch(e => {})
}
})
collector.on("end", (_, reason) => {
if(reason == "time" && msg) msg.delete().catch(e => {})
})
}
}
};