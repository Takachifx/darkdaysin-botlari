const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const setups = require("../../../../Src/Schemas/Setup")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["kes", "baglanti-kes", "bağlantıkes", "voice-disconnect", "bağlantı-kes", "baglantikes"],
name: "voice-disconnect",
help: "bağlantı-kes @Darkdays/ID",
category: "yetkili"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({ guildID: message.guild.id });
if (!ayar) return;
const Name = ["kes", "baglanti-kes", "bağlantıkes", "voice-disconnect", "bağlantı-kes", "baglantikes"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.staffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.owner.some(x => x === message.author.id) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no));
return await message.reply({ embeds: [embed.setDescription(`*Bu Komutu Kullanabilmek İçin Yeterli Yetkiye Sahip Değilsin!*`)] }).sil(15);
}
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content: "Bir üye belirtmelisin."}).sil(15)
return }
if(message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: "Rolleri senden yüksek birinin ses kanallarında ki bağlantısını kesemezsin."}).sil(15)
return }
if(member.id == message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: "Kendi Bağlantınızı kesemezsiniz."}).sil(15)
return }
if(!member.voice.channel) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: "Belirtilen üye herhangi bir ses kanalında bulunmamakta."}).sil(15)
return }
if(member.user.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendin Üzerinde İşlem Yapamazsın"}).sil(15)
}
if(ayar.SafeBots.includes(member.user.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Botlara İşlem Yapamazsın"}).sil(15)
}
if(message.member.roles.highest.position <= member.roles.highest.position) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendinden Üstteki Kullanıcıya İşlem Yapamazsın"}).sil(15)
}
const Embed = new Discord.EmbedBuilder().setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) }).setFooter({text: `${member.user.username} | ${member.id}`, iconURL: member.user.avatarURL({ dynamic: true })}).setThumbnail(member.user.avatarURL({ dynamic: true }))
if(!ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !message.member.permissions.has(Discord.PermissionFlagsBits.ViewAuditLog) && !message.member.permissions.has(8n) && ayar.staffRoles.some(x => message.member.roles.cache.has(x))) {
if(ayar.registerParents.some((x) => x !== member.voice.channel.parentId)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: "Yalnızca kayıt odalarından birisinin bağlantısını kesebilirsiniz! Bu kullanıcı şu an ses kanalında bulunmakta."}).sil(15)
return }
Embed.setAuthor({name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
Embed.setDescription(`${member} Kullanıcısı ${message.member} Tarafından **${member.voice.channel.name}** Ses Kanalından Çıkarıldı.`)
Embed.setColor("Random");
await member.voice.disconnect().catch(e => {})
await message.reply({ embeds: [Embed] })
} else if(message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && message.member.permissions.has(Discord.PermissionFlagsBits.ViewAuditLog) && message.member.permissions.has(8n)) {
Embed.setAuthor({name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
Embed.setDescription(`${member} Kullanıcısı ${message.member} Tarafından **${member.voice.channel.name}** Ses Kanalından Çıkarıldı.`)
Embed.setColor("Random");
await member.voice.disconnect().catch(e => {})
await message.reply({ embeds: [Embed] })
}
},
};
