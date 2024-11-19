const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Discord = require("discord.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = {
conf: {
aliases: ["profil", "p", "profile"],
name: "profil",
help: "profil @Darkdays/ID",
category: "kullanici",
cooldown: 900
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
var member = args[0] ? (message?.mentions?.members.first() || message.guild.members.cache.find((m) => m.user.username.toLocaleLowerCase() == args[0].toLocaleLowerCase()) || message.guild.members.cache.get(args[0])) : message.member;
if (!member && args[0]) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content:`>>> Yanlış ID/kullanıcı adı veya sunucuda olmayan birisini belirttiniz. Lütfen bilgileri kontrol edip tekrar deneyiniz.`}).sil(15);
};
await member.fetch()
if (member.user.bot) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `>>> Bu komutu botlar üstünde kullanmanın sebebini tam olarak anlamış değilim. :smiley:`}).sil(15);
}
let joinDate = member.joinedAt;
let guildMembers = member.guild.members.cache;
var memberBefore = Array.from(guildMembers.values())
.filter(m => !m.user.bot && (m.joinedAt < joinDate))
.sort((a, b) => b.joinedAt - a.joinedAt)
.find(() => true);
var memberAfter = Array.from(guildMembers.values())
.filter(m => !m.user.bot && (m.joinedAt > joinDate))
.sort((a, b) => a.joinedAt - b.joinedAt)
.find(() => true);
var rolleri = member.roles.cache.filter((r) => r.name != "@everyone").sort((a, b) => b.position - a.position).map((r) => `${r}`).join(", ");
var userCustom = null;
var userCustomEmoji;
var createdEmoji = false;
if (member.presence && member.presence.activities && member.presence.activities.length > 0 && ["dnd", "idle", "online"].includes(member?.presence?.status)) {
if (member.presence.activities.find((act) => act.name == 'Custom Status' && act.type == 4)) {
var act = member.presence.activities.find((act) => act.name == 'Custom Status' && act.type == 4);
if (act.emoji && !act.emoji.id && act.emoji.name) {
userCustomEmoji = `${act.emoji.name}`;
} else if (act.emoji && act.emoji.id) {
let ext = act.emoji.animated ? ".gif" : ".png";
let url = `https://cdn.discordapp.com/emojis/${act.emoji.id}${ext}`;
await message.guild.emojis.create({ name: `DS_${member.id}`, attachment: url, reason: "Bot Profile | 'profil' komutu kullanıldı, otomatik işlem." });
createdEmoji = true;
userCustomEmoji = message.guild.emojis.cache.find((e) => e.name == `DS_${member.id}`);
}
if (act.emoji && !act.state) {
userCustom = `${userCustomEmoji}`;
} else if (act.emoji && act.state) {
userCustom = `${userCustomEmoji} ${act.state}`;
} else if (!act.emoji && act.state) {
userCustom = `${act.state}`;
}
}
};
var memberPresences = [];
var editedMemberPresences = [];
if (member.presence && member.presence.activities && member.presence.activities.length > 0 && (member.presence.activities.filter((act) => act.type !== 4 && act.name !== 'Custom Status').length > 0)) {
member.presence.activities.filter((act) => act.type !== 4 && act.name !== 'Custom Status').forEach((act) => {
let priority = 1;
if (act.type == 2) priority = -1;
if (act.type == 1 && act.name == 'YouTube Music') priority = -1; else if (act.type == 1 && (act.name == 'Visual Studio Code' || act.name == 'Visual Studio')) priority = 1; else if (act.type == 1 && act.name == 'League of Legends') priority = 2; else if (act.type == 1) priority = 3;
memberPresences.push({
priority: priority,
name: act.name,
type: act.type,
details: act.details,
state: act.state,
applicationId: act.applicationId,
timestamps: act.timestamps,
party: act.party,
assets: act.assets,
flags: act.flags,
emoji: act.emoji,
buttons: act.buttons,
createdTimestamp: act.createdTimestamp
});
});
};
memberPresences.sort((a, b) => a.priority - b.priority).forEach((act) => {
if (act.name == 'Spotify' || act.name == 'YouTube Music') {
if (act.state) {
editedMemberPresences.push(`**${act.name}** üzerinden **${act.name == 'YouTube Music' ? act.state.split(' - ')[0] : act.state.replace(/; /g, ", ")}** adlı sanatçının ${act.name == 'Spotify' && act.assets && act.assets.largeText && act.assets.largeText !== act.details ? ` **${act.assets.largeText}** isimli albümünden ` : " "}**${act.details}** isimli şarkısını dinliyor.`);
}
} else if (act.name == 'Visual Studio' || act.name == 'Visual Studio Code') {
if (act.state && act.details) {
let stateSplit = act.state.split(": ");
let detailsSplit = act.details.split(" ");
editedMemberPresences.push(`**${act.name}** programında ${stateSplit.length > 1 ? `**${stateSplit[1].split("[SSH")[0]}** projesi üzerinde ` : ""}**${detailsSplit.length > 1 ? detailsSplit[1] : ""}** dosyasını düzenliyor.`);
}
} else if (act.name == 'League of Legends') {
if (act.state) {
if (act.state == 'Lobide' || act.state == 'In Lobby') editedMemberPresences.push(`**${act.name}** oynuyor ve şuan **lobide**.`);
else if (act.state == 'Sırada' || act.state == 'In Queue') editedMemberPresences.push(`**${act.name}** oynuyor ve şuan **sıra bekliyor**.`);
else if (act.state == 'Şampiyon Seçiminde' || act.state == 'In Champion Select') editedMemberPresences.push(`**${act.name}** oynuyor ve şuan **şampiyon seçiminde**.`);
else if (act.state == 'Oyunda' || act.state == 'In Game') editedMemberPresences.push(`**${act.name}** oynuyor ve şuan **maçta**, **${act.assets.largeText}** oynuyor..`);
else editedMemberPresences.push(`**${act.name}** oynuyor.`);
}
} else editedMemberPresences.push(`**${act.name}** oynuyor.`);
})
var memberProfileEmbed = new Discord.EmbedBuilder()
.setAuthor({ name: `${member.user.discriminator ? member.user.tag : `@${member.user.username}`} | Profil`, iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }) })
.setDescription(`__**Hesap Bilgileri**__
**Kullanıcı Adı**: ${member.user.discriminator ? member.user.tag : `@${member.user.username}`}
**Görünen Ad**: ${member.user.globalName || member.user.username}
**ID**: ${member.user.id}
**Kuruluş Tarihi**: ${Discord.time(member.user.createdAt)} (${Discord.time(member.user.createdAt, "R")})

__**Kullanıcı Bilgisi**__
**Takma Adı**: ${member.nickname || "Bulunmuyor"}
**Sunucuya Giriş**: ${Discord.time(member.joinedAt)} (${Discord.time(member.joinedAt, "R")})
**Sunucuya Giriş Sıralaması**: ${Array.from(guildMembers.values()).sort((a, b) => a.joinedAt - b.joinedAt).indexOf(member) + 1}/${message.guild.memberCount} (${memberBefore ? memberBefore.user.username : "Bulunmadı"} > ${member.user.username} > ${memberAfter ? memberAfter.user.username : "Bulunamadı"})
**Kullanıcının Rolleri (${member.roles.cache.size - 1})**: ${rolleri}

__**Durum Bilgisi**__
**Durum**: ${member?.presence?.status.replace("dnd", `:red_circle: Rahatsız Etmeyin`).replace("online", `:green_circle: Çevrimiçi`).replace("idle", `:yellow_circle: Boşta`) || `:white_circle: Çevrimdışı`}
${["dnd", "idle", "online"].includes(member?.presence?.status) ? `**Custom Status**: ${userCustom || "Bulunmuyor"}\n` : ""}${["dnd", "idle", "online"].includes(member?.presence?.status) ? `**Giriş Yaptığı Cihazlar (${Object.keys(member.presence.clientStatus).length})**: ${Object.keys(member.presence.clientStatus).map((platform) => `${platform.replace("mobile", "📱").replace("web", "🌐").replace("desktop", "💻")}`).join(" ")}\n` : ""}
${["dnd", "idle", "online"].includes(member?.presence?.status) ? `**__Aktiviteler__ (${member.presence.activities.filter((act) => act.name !== 'Custom Status' && act.type !== 4).length})**: ${member.presence.activities.filter((act) => act.name !== 'Custom Status' && act.type !== 4).length > 0 ? `\n${editedMemberPresences.map((actString) => `${actString}`).join("\n")}` : "Kullanıcı hiçbir aktivite yapmıyor."}` : ""}`)
.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
.setImage(member.user.bannerURL({ dynamic: true, size: 2048 }))
.setColor("Blurple")
.setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true, size: 1024 }) })
.setTimestamp()
message.reply({ embeds: [memberProfileEmbed] }).then((msg) => setTimeout(() => {
if (createdEmoji) message.guild.emojis.cache.filter((e) => e.name.startsWith("ds_")).forEach((e) => e.delete({ reason: "Bot Profile | 'Profil' Komutu Kullanıldı, Otomatik İşlem." }).catch(() => { }));
}, 15000))
}
}