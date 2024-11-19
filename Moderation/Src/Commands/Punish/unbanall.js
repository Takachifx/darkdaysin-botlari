const settings = require("../../../../Src/Settings/Settings.json");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const Penalties = require("../../../../Src/Schemas/Penalties");
module.exports = {
conf: {
name: "unbanall",
aliases: ["allyasak-kaldır"],
help: "unbanall",
category: "cezalandirma",
cooldown: 15,
owner: true,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
await message.react(message.guild.emojiGöster(emojis.yes))
const yarrak = await message.guild.bans.fetch();
for(const sex of [...yarrak.values()]){
const log = embed
.setAuthor({name: `${sex.user.globalName ? sex.user.globalName : sex.user.username}`, iconURL: sex.user.avatarURL({dynamic: true})})
.setFooter({ text:`${moment(Date.now()).format("LLL")}`, iconURL: message.guild.iconURL({dynamic: true})})
.setThumbnail(sex.user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} **${sex.user.globalName ? sex.user.globalName : sex.user.username}** Adlı Kullanıcının Yasağı ${message.member.toString()} Tarafından Kaldırıldı.

\`Kullanıcı:   \` \` ${sex.user.globalName ? sex.user.globalName : sex.user.username} - ${sex.user.id} \`
\`Yetkili:     \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Tarih:       \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
const banLog = await client.kanalBul("ban-log");
await banLog.send({ embeds: [log]})
await message.guild.members.unban(sex.user.id, `${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} tarafından kaldırıldı!`).catch(() => {});
const data = await Penalties.findOne({ userID: sex.user.id, guildID: settings.Moderation.guildID, type: "BAN", active: true });
if (data) {
data.active = false;
await data.save();
}
}
}
};