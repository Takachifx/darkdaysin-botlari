const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Users = require("../../../../Src/Schemas/UsersDB")
const tasks = require("../../../../Src/Schemas/Tasks");
const messageUserChannel = require("../../../../Src/Schemas/MessageUserChannels");
const RankSystem = require("../../../../Src/Schemas/RankSystem");
const Puans = require("../../../../Src/Schemas/Puans");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
module.exports = {
conf: {
aliases: ["yme","ystat"],
name: "ystat",
help: "ystat @Darkdays/ID",
category: "yetkili"
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const rdata = await RankSystem.findOne({guildID: message.guild.id})
if(!rdata) return;
if(rdata.RankSystem == false) return await message.react(message.guild.emojiGöster(emojis.no))
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
const ranks = JSON.parse(await client.ranks(message.guild.id));
if(!ranks.map(x => x.roleID).some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)]}).sil(15)
}
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bir üye belirtmelisin!`)]}).sil(15)}
if(!ranks.map(x => x.roleID).some(x => member.roles.cache.has(x)) && !member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Belirttiğin üye yetkili değil!`)]}).sil(15)
}
const msj = await message.reply({embeds: [embed.setDescription(`${member} üyesinin verileri yükleniyor. Lütfen bekleyin!`)]})
const puanData = await Puans.findOne({ guildID: settings.Moderation.guildID, userID: member.id });
const maxValue = ranks[ranks.indexOf(ranks.find(x => x.puan >= (puanData ? puanData.puan : 0)))] || ranks[ranks.length-1];
const udb = await Users.findOne({ _id: member.user.id })
const mtask = await tasks.find({ guildID: settings.Moderation.guildID, userID: member.id });
const Task = mtask.filter((x) => x.active)
const terfiYt = ranks.map((x) => x.roleID);
let targetRoleIndex = -1;
for (let i = 0; i < terfiYt.length; i++) {
const roles = terfiYt[i];
if (member.roles.cache.some((role) => role.name === roles || role.id === roles)) {
targetRoleIndex = i;
break;
}
}
let rolu;
for (let i = 0; i < terfiYt.length; i++) {
const roles = terfiYt[i];
if (member.roles.cache.some((role) => role.name === roles || role.id === roles)) {
rolu = roles;
break;
}
}
const roleName = rolu
const rolePosition = targetRoleIndex + 1;
let currentRank = ranks.filter(x => (puanData ? puanData.puan : 0) >= x.puan);
currentRank = currentRank[currentRank.length-1];
const coinStatus = member.hasRole(terfiYt, false) && ranks.length > 0 ?
`${currentRank ? `${currentRank !== ranks[ranks.length-1] ? `${Array.isArray(maxValue.roleID) ? maxValue.roleID.length > 1 ? maxValue.roleID.slice(0, -1).map(x => `${message.guild.roles.cache.get(x)}`).join(', ') + ' ve ' + maxValue.roleID.map(x => `${message.guild.roles.cache.get(x)}`).slice(-1) : maxValue.roleID.map(x => `${message.guild.roles.cache.get(x)}`).join(", ") : `${message.guild.roles.cache.get(maxValue.roleID)}`} ` : "Şuan da En Yüksek Yetkidesiniz."}` : `${Array.isArray(maxValue.roleID) ? maxValue.roleID.length > 1 ? maxValue.roleID.slice(0, -1).map(x => `${message.guild.roles.cache.get(x)}`).join(', ') + ' ve ' + maxValue.roleID.map(x => `${message.guild.roles.cache.get(x)}`).slice(-1) : maxValue.roleID.map(x => `${message.guild.roles.cache.get(x)}`).join(", ") : `${message.guild.roles.cache.get(maxValue.roleID)}`}`}` : "";
const Active1 = await messageUserChannel.find({ guildID: settings.Moderation.guildID, userID: member.id }).sort({ channelData: -1 });
let messageTop;
Active1.length > 0 ? messageTop = Active1.splice(0, 5).map((x, index) => `${index+1} ${message.guild.channels.cache.get(x.channelID) ? message.guild.channels.cache.get(x.channelID) : "Silinmiş Kanal"}: **${x.channelData} Mesaj**`).join("\n") : messageTop = "Veri bulunmuyor.";
const bar = Task.length > 0 ? (await Promise.all(Task.filter(x => x.active == true).map(async (x, index) => `${await client.progressBar(x.completedCount, x.count, 6)}`))).join(`\n`) : 'Görev Bulunamadı.' || "Görev Bulunamadı."
const puan = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true }) })
.setThumbnail(member.user.avatarURL({ dynamic: true }))
.setFooter({ text: `${message.author.tag} tarafından istendi.`, iconURL: message.author.avatarURL({ dynamic: true }) })
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Kullanıcısının Yetki Bilgileri;

${message.guild.emojiGöster(emojis.sagok)} \`Yetki Süresi: \` ${udb && udb.Staff == true ? `<t:${Math.floor(udb.Date / 1000)}:R>` : 'Bulunamadı.'}
${message.guild.emojiGöster(emojis.sagok)} \`Yetki Başlatan: \` ${udb && udb.StaffGiveAdmin ? message.guild.members.cache.get(udb.StaffGiveAdmin) : 'Bulunamadı.'}
${message.guild.emojiGöster(emojis.sagok)} \`Yetki: \` ${message.guild.roles.cache.get(roleName)}
${message.guild.emojiGöster(emojis.sagok)} \`Yetki Sırası: \` \`(${rolePosition})\`
${message.guild.emojiGöster(emojis.sagok)} \`Sonraki Yetki: \` ${coinStatus}
${message.guild.emojiGöster(emojis.sagok)} \`Sonraki Yetki Sırası: \` \`(${rolePosition + 1})\`
${message.guild.emojiGöster(emojis.sagok)} \`Gerekli Puan: \` \`(${maxValue.puan})\`
${message.guild.emojiGöster(emojis.sagok)} \`Kalan Puan: \` \`(${maxValue.puan - (puanData ? puanData.puan : 0)})\`
${message.guild.emojiGöster(emojis.sagok)} \`Toplam Puan: \` \`(${puanData ? Math.floor(puanData.puan) : 0})\`

${message.guild.emojiGöster(emojis.sagok)} \`YETKİ UPDOWN BAR: \` ${await client.progressBar(puanData ? puanData.puan : 0, maxValue.puan, 6)} (\`%${Math.floor((puanData ? puanData.puan : 0) / maxValue.puan * 100)}\`)
${message.guild.emojiGöster(emojis.warn)} Yetki Atlamak İçin [** ${puanData && maxValue ? maxValue.puan - Math.floor(puanData.puan) : 0} **] Puan Toplaman Gerekli.

${message.guild.emojiGöster(emojis.sagok)} \`Görev Alma Tarihi: \`\n${Task.length > 0 ? Task.filter(x => x.active == true).map((x, index) => `${message.guild.emojiGöster(emojis.sagok)} <t:${String(x.date).slice(0, 10)}:R>`).join(`\n`) : 'Görev Bulunamadı.' || "Görev Bulunamadı."}
${message.guild.emojiGöster(emojis.sagok)} \`Görev Bitiş Tarihi: \`\n${Task.length > 0 ? Task.filter(x => x.active == true).map((x, index) => `${message.guild.emojiGöster(emojis.sagok)} <t:${Math.floor(x.finishDate / 1000)}:R>`).join(`\n`) : 'Görev Bulunamadı.' || "Görev Bulunamadı."}
${message.guild.emojiGöster(emojis.sagok)} \`Görev Puanı: \`\n ${Task.length > 0 ? Task.filter(x => x.active == true).map((x, index) => `${message.guild.emojiGöster(emojis.sagok)} **${x.prizeCount}**`).join(`\n`) : 'Görev Bulunamadı.'}
${message.guild.emojiGöster(emojis.sagok)} \`Görev: \`\n ${Task.length > 0 ? Task.filter(x => x.active == true).map((x, index) => `${message.guild.emojiGöster(emojis.sagok)} **${x.message}**`).join(`\n`) : 'Görev Bulunamadı.' || "Görev Bulunamadı."}

${message.guild.emojiGöster(emojis.sagok)} \`GÖREV UPDOWN BAR: \`${bar} (\`%${Math.floor( ((Task.filter((x) => x.active == true).length >= 1 ? Task.filter((x) => x.active == true).map((x) => x.completedCount) : 0) / (Task.filter((x) => x.active == true).length >= 1 ? Task.filter((x) => x.active == true).map((x) => x.count) : 1)) * 100)}\`)
${message.guild.emojiGöster(emojis.warn)} Daha Hızlı Yetki Atlamak İçin Görevlerimizden Seçebilirsin.`)
await msj.edit({embeds: [puan]})

}
}
