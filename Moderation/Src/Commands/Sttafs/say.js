const moment = require("moment");
moment.locale("tr");
const clients = global.client;
const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const setups = require("../../../../Src/Schemas/Setup")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["say"],
name: "say",
help: "say",
category: "yetkili"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: message.guild.id})
if(!ayar) return;
const Name = ["Say", "say"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.staffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.ownerRoles.some(x => message.member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır.`}).sil(15)
}
var takviye = await client.rakam(message.guild.premiumSubscriptionCount)
var TotalMember = await client.rakam(message.guild.memberCount)
var tagges = await client.rakam(message.guild.members.cache.filter(m => ayar.serverTag.some(t => m.user.globalName && m.user.globalName.includes(t) || m.user.username.includes(t))).size)
var sesli = await client.rakam(message.guild.members.cache.filter((x) => x.voice.channel && !x.user.bot).size)
var bot = message.guild.channels.cache.filter(channel => channel.type == Discord.ChannelType.GuildVoice).map(channel => channel.members.filter(member => member.user.bot).size).reduce((a, b) => a + b);
await message.reply({ embeds: [embed
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
.setDescription(`
\` ❯ \` Şu anda Toplam **${sesli}** Kişi Seslide. (\`+${bot} Bot\`)${ayar.tagSystem == true ? `\n\` ❯ \` Toplamda ${tagges} Kişi Sunucu Tagımızı Almış.` : ""}
\` ❯ \` Sunucuda **${TotalMember}** Adet Üye Var (\`+${message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size} Aktif.\`)
\` ❯ \` Toplamda **${takviye}** Adet Boost Basılmış. (\`${message.guild.premiumTier ? `${message.guild.premiumTier}. Seviye` : `0. Seviye`}\`)`)]})
},
};
