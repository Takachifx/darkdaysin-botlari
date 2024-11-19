const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const emojis = require("../../../../Src/Settings/emojiName.json");
const RankSystem = require("../../../../Src/Schemas/RankSystem");
const Puans = require("../../../../Src/Schemas/Puans");
const Tasks = require("../../../../Src/Schemas/Tasks");
const VoiceUser = require("../../../../Src/Schemas/VoiceUsers");
const MessageUser = require("../../../../Src/Schemas/MessageUsers");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
module.exports = {
conf: {
aliases: ["görevler", "görevlerim", "görevlerim", "görevlerim", "tasks"],
name: "tasks",
help: "görevler @Darkdays/ID",
category: "yetkili",
cooldown: 0
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID });
if(!ayar) return;
const rdata = await RankSystem.findOne({ guildID: message.guild.id });
if(!rdata) return;
if(rdata.RankSystem == false) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Rank sistemi aktif değil!`)]}).sil(15)
}
const ranks = JSON.parse(await client.ranks(message.guild.id));
if(!ranks.map(x => x.roleID).some(x => message.member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)]}).sil(15)
}
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bir üye belirtmelisin!`)]}).sil(15)
}
if(!ranks.map(x => x.roleID).some(x => member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Belirttiğin üye yetkili değil!`)]}).sil(15)
}
const msj = await message.reply({embeds: [embed.setDescription(`${message.guild.name} sunucusunda ${member} kullanıcısına ait veriler yükleniyor. Lütfen bekleyin!`)]})
const vtask = await VoiceUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
const mmtask = await MessageUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
const mtask = await Tasks.find({ guildID: settings.Moderation.guildID, userID: member.user.id });
const puanData = await Puans.findOne({ guildID: settings.Moderation.guildID, userID: member.id });
const maxValue = ranks[ranks.indexOf(ranks.find(x => x.puan >= (puanData ? puanData.puan : 0)))] || ranks[ranks.length-1];
await msj.edit({embeds: [embed.setDescription(`${member} Adlı Üyenin Görev Durumu;

${message.guild.emojiGöster(emojis.warn)} Genel Bilgiler;
${message.guild.emojiGöster(emojis.sagok)} \`Görev Seçim Tarihi      :\` ${mtask.filter((x) => x.active == true).length >= 1 ? `<t:${Math.floor(mtask[0].date / 1000)}>` : "\` Görev Seçilmedi. \`"}
${message.guild.emojiGöster(emojis.sagok)} \`Görev Bitiş Tarihi      :\` ${mtask.filter((x) => x.active == true).length >= 1 ? `<t:${Math.floor(mtask[0].finishDate / 1000)}>` : "\` Görev Seçilmedi. \`"}
${message.guild.emojiGöster(emojis.sagok)} \`Yetki İlerleme Durumu   :\` ${await client.progressBar(puanData ? puanData.puan : 0, maxValue.puan, 6)} (\`%${Math.floor((puanData ? puanData.puan : 0) / maxValue.puan * 100)}\`)
${message.guild.emojiGöster(emojis.sagok)} \`Toplam Kazanılcak Puan  :\` \` ${mtask.filter((x) => x.active == true).length >= 1 ? mtask[0].prizeCount : 0} \`
${message.guild.emojiGöster(emojis.sagok)} \`Son Görülme             :\` 🔉 <t:${Math.floor(vtask.Date / 1000)}> / 💭 <t:${Math.floor(mmtask.Date / 1000)}>
${message.guild.emojiGöster(emojis.sagok)} \`Görev Türü              :\` \` ${mtask.filter((x) => x.active == true).length >= 1 ? mtask[0].type : "Görev Seçilmedi."} \`

${message.guild.emojiGöster(emojis.warn)} Görevler Bilgisi;
${message.guild.emojiGöster(emojis.sagok)} \`Tamamlanan Görev Sayısı :\` \` ${mtask.filter((x) => x.completedCount >= x.count).length} \`
${message.guild.emojiGöster(emojis.sagok)} \`Görev Durumu            :\` ${mtask.filter((x) => x.active == true).length >= 1 ? await client.progressBar(mtask.filter((x) => x.active == true).length >= 1 ? mtask[0].completedCount : 0, mtask.filter((x) => x.active == true).length >= 1 ? mtask[0].count : 0, 6) : "\` Görev Seçilmedi. \`"} (\`%${Math.floor( ((mtask.filter((x) => x.active == true).length >= 1 ? mtask[0].completedCount : 0) / (mtask.filter((x) => x.active == true).length >= 1 ? mtask[0].count : 1)) * 100)}\`)
${message.guild.emojiGöster(emojis.sagok)} \`Görev Bilgisi           :\` \` ${mtask.filter((x) => x.active == true).length >= 1 ? `(Devam Ediyor; %${Math.floor( ((mtask.filter((x) => x.active == true).length >= 1 ? mtask[0].completedCount : 0) / (mtask.filter((x) => x.active == true).length >= 1 ? mtask[0].count : 1)) * 100)})` : "Görev Seçilmedi."} \`
`).setAuthor({name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic: true})}).setThumbnail(member.user.displayAvatarURL({dynamic: true}))]})

}
}

function getRandomInt(min, max) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
}