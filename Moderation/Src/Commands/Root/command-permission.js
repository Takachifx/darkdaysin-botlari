const settings = require('../../../../Src/Settings/Settings.json');
const Discord = require('discord.js');
const emojis = require("../../../../Src/Settings/emojiName.json");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
const setups = require("../../../../Src/Schemas/Setup");
module.exports = {
conf: {
name: "command-permission",
help: "komut-izin ekle/sil/liste [Komut] @Kullanıcı/Rol",
aliases: ["komutizin", "command-permission", "command-permissions", "komut-izin"],
owner: true,
category: "owner"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
if(!args[0]) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Lütfen bir işlem belirtin!\n\n`ekle`, `sil`, `liste`" }).sil(15)
}
if(args[0] == "ekle" || args[0] == "ayarla") {
const command = args[1]
const permissions = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.mentions.members.first() || message.guild.members.cache.get(args[2])
if(!command) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Lütfen bir komut ismi belirtin!" }).sil(15)
}
if(!permissions) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Lütfen bir rol veya üye belirtin!" }).sil(15)
}
const Data = await CommandPermissions.findOne({ guildID: settings.Moderation.guildID, Command: command })
if(Data && Data.Permissions.includes(permissions)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu komutun izini zaten ayarlanmış!" }).sil(15)
}
await CommandPermissions.updateOne({ guildID: settings.Moderation.guildID, Command: command }, { $push: { Permissions: permissions.id} }, { upsert: true })
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({content: `${message.guild.emojiGöster(emojis.yes)} ${message.member} Başarıyla **${command}** Komutunu Kullanabilmesi İçin ${permissions} Kişilerine İzin Verildi.`})
} else if(args[0] == "sil") {
const command = args[1]
const permissions = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.mentions.members.first() || message.guild.members.cache.get(args[2])
if(!command) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Lütfen bir komut ismi belirtin!" }).sil(15)
}
if(!permissions) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Lütfen bir rol veya üye belirtin!" }).sil(15)
}
const Data = await CommandPermissions.findOne({ guildID: settings.Moderation.guildID, Command: command })
if(!Data) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu komutun izini zaten ayarlanmamış!" }).sil(15)
}
if(!Data.Permissions.includes(permissions.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu komutun izini zaten ayarlanmamış!" }).sil(15)
}
await CommandPermissions.updateOne({ guildID: settings.Moderation.guildID, Command: command }, { $pull: { Permissions: permissions.id} }, { upsert: true })
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({content: `${message.guild.emojiGöster(emojis.yes)} ${message.member} Başarıyla **${command}** Komutu İçin **${permissions}** Kişilerin Kullanabilme İzinleri Kaldırıldı.`})
} else if(args[0] == "liste") {
const Data = await CommandPermissions.find({ guildID: settings.Moderation.guildID })
if(!Data) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Komut izinleri zaten ayarlanmamış!" }).sil(15)
}
const mapped = Data.map((x, index) => `\` ${index+1} \` **${settings.Moderation.prefix}${x.Command}** - ${x.Permissions.filter(x => message.guild.members.cache.get(x) || message.guild.roles.cache.get(x)).map(x => message.guild.members.cache.get(x) ? message.guild.members.cache.get(x) : message.guild.roles.cache.get(x)).join(", ")}`).join("\n")
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.warn)} **Merhaba**, ${message.author} **${message.guild.name}** *Sunucusunun Komut İzinleri Aşağıda Belirtilmiştir;*\n\n${mapped}`)]})
}
}
}