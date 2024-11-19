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
name: "forceban",
aliases: ["kalıcıban", "fban"],
help: "forceban @Darkdays/ID Sebep",
category: "cezalandirma",
cooldown: 15,
owner: true,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
if (!args[0]) {
await message.reply({ content:"Bir Kullanıcı Belirtmelisin!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const user = message.mentions.users.first() || await client.fetchUser(args[0]);
if (!user) {
await message.reply({ content:"Böyle Bir Kullanıcı Bulunamadı!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const ban = await ForceBans.findOne({ guildID: settings.Moderation.guildID, userID: user.id });
if (ban) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content :"Bu üye zaten banlı!"}).then((e) => setTimeout(() => { e.delete(); }, 15000));
return }
const reason = args.slice(1).join(" ")  || "Belirtilmedi!";
const member = message.guild.members.cache.get(user.id);
if (message.guild.members.cache.has(user.id) && message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) {
await message.reply({ content:"Kendinle Aynı Yetkide Ya da Daha Üst Yetkili Olan Birini Banlayamazsın!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
if(member.user.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendin Üzerinde İşlem Yapamazsın"}).sil(15)
}
if(ayar.SafeBots.includes(member.user.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Botlara İşlem Yapamazsın"}).sil(15)
}
if (member && !member.bannable) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content :"Bu Kullanıcıyı Banlayamıyorum!"}).sil(15)
return }
await message.guild.members.ban(user.id, { reason: `Yetkili: ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username}` }).catch(() => {});
await new ForceBans({ guildID: settings.Moderation.guildID, userID: user.id, staff: message.author.id }).save();
const penal = await client.Punished(settings.Moderation.guildID, user.id, "FORCE-BAN", true, message.author.id, reason);
await message.reply({ content :`${message.guild.emojiGöster(emojis.punish)} **${member ? member.toString() : user.username}** Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından **Kalıcı Olarak** Yasaklandı. Ceza Numarası: **(${penal.id})**`})
await message.react(message.guild.emojiGöster(emojis.yes))
let log = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({name: `${user.globalName ? user.globalName : user.username}`, iconURL: user.avatarURL({dynamic: true})})
.setThumbnail(user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} **${member ? member.toString() : user.username}** Kullanıcısı ${message.member.toString()} Tarafından **Kalıcı Olarak** Yasaklandı!

\`Kullanıcı:    \` \` ${user.globalName ? user.globalName : user.username} - ${user.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ban Sebebi:   \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: ${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("ban-log");
await logKanal.send({ embeds: [log]});
}
};