const settings = require("../../../../Src/Settings/Settings.json");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const banLimit = new Map();
const cezapuan = require("../../../../Src/Schemas/PenaltyPoints");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
name: "ban",
aliases: ["yasakla"],
help: "ban @Darkdays/ID Sebep",
category: "cezalandirma",
cooldown: 15,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["ban", "yasakla"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.BanMembers) && !ayar.banHammer.some(x => message.member.roles.cache.has(x))) {
await message.reply({ content:"Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
if (!args[0]) {
await message.reply({ content:"Bir üye belirtmelisin!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const user = message.mentions.users.first() || await client.fetchUser(args[0]);
if (!user) {
await message.reply({ content:"Böyle bir kullanıcı bulunamadı!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const ban = await client.fetchBan(message.guild, args[0]);
if (ban) {
await message.reply({ content:"Bu Kullanıcı Zaten Banlı!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const reason = args.slice(1).join(" ") || "Belirtilmedi!";
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
await message.reply({ content:"Bu Kullanıcıyı Banlayamıyorum!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
if (ayar.banLimites > 0 && banLimit.has(message.author.id) && banLimit.get(message.author.id) == ayar.banLimites) {
await message.reply({ content:"Saatlik Ban Sınırına Ulaştın!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
await message.react(message.guild.emojiGöster(emojis.yes))
const penal = await client.Punished(settings.Moderation.guildID, user.id, "BAN", true, message.author.id, reason);
if(message.guild.members.cache.get(user.id)) {
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: member.id }, { $inc: { cezapuan: ayar.banPenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
const logs = await client.kanalBul("ceza-log");
await logs.send({ content:`${message.guild.emojiGöster(emojis.info)} ${member} Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
} else {
await cezapuan.updateOne({ guildID: settings.Moderation.guildID, userID: user.id }, { $inc: { cezapuan: ayar.banPenaltiesPoint } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.Moderation.guildID, userID: user.id });
const logs = await client.kanalBul("ceza-log");
await logs.send({ content:`${message.guild.emojiGöster(emojis.info)} **${member ? member.toString() : user.username}** Aldığın **${penal.id}** Numaralı Ceza İle **${cezapuanData ? cezapuanData.cezapuan : 0}** Ceza Puanına Ulaştın.`});
}
await message.guild.members.ban(user.id, { reason: reason });
const Embed = embed
.setColor("Random")
.setAuthor({ name: `${message.member.user.globalName ? message.member.user.globalName : message.member.user.username}`, iconURL: message.author.avatarURL({ dynamic: true }) })
.setImage("https://cdn.discordapp.com/attachments/1203050539064107018/1235945331674452052/thor-ban.gif?ex=66363749&is=6634e5c9&hm=c7fcc3b365a9adefe1033e3ef0174916c8a99b2389604570bc6e8e5febd464ce&")
.setDescription(`${message.guild.emojiGöster(emojis.punish)} **${member ? member.toString() : user.username}** Kullanıcısı <t:${String(Date.now()).slice(0, 10)}:R> Sunucudan " **${reason}** " Sebebiyle ${message.member.toString()} Tarafından Banlandı! Ceza Numarası: (**${penal.id}**)`)
await message.reply({ embeds: [Embed]});
const log = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({name: `${user.globalName ? user.globalName : user.tag}`, iconURL: user.avatarURL({dynamic: true})})
.setThumbnail(user.avatarURL({dynamic: true}))
.setDescription(`${message.guild.emojiGöster(emojis.info)} **${member ? member.toString() : user.username}** Kullanıcısı ${message.member.toString()} Tarafından Sunucudan Yasaklandı.

\`Kullanıcı:    \` \` ${user.globalName ? user.globalName : user.username} - ${user.id} \`
\`Yetkili:      \` \` ${message.member.user.globalName ? message.member.user.globalName : message.member.user.username} - ${message.author.id} \`
\`Ban Sebebi:   \` \` ${reason} \`
\`Ceza Numarası:\` \` ${penal.id} \`
\`Tarih:        \`    <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza Numarası: ${penal.id})`, iconURL: message.guild.iconURL({dynamic: true})})
const logKanal = await client.kanalBul("ban-log");
await logKanal.send({ embeds: [log]});
if (ayar.banLimites > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!banLimit.has(message.author.id)) banLimit.set(message.author.id, 1);
else banLimit.set(message.author.id, banLimit.get(message.author.id) + 1);
setTimeout(() => {
if (banLimit.has(message.author.id)) banLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
};