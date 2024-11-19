const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["sticker","addsticker", "stickerekle", "sticker-ekle"],
name: "sticker",
help: "sticker [Sticker]",
category: "ustyetkili",
cooldown: 60
},
Cyrstal: async (client, message, args, embed) => {
const ayars = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayars) return;
const Name = ["sticker","addsticker", "stickerekle", "sticker-ekle"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayars.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayars.ownerRoles.some(x => message.member.roles.cache.has(x)) && !ayars.roleAddRoles.some(s => message.member.roles.cache.has(s))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır." }).sil(15);
}
const msj = await message.reply({embeds: [embed.setDescription(`**Sticker Eklemek İçin Bir Sticker Gönderin 2 Dakika İçinde.**`)]})
const filter = m => m.author.id === message.author.id;
const collector = message.channel.createMessageCollector({ filter, time: 120000 });
collector.on('collect', async (msg) => {
if(msg.stickers.size > 0) {
const sticker = msg.stickers.first();
const url = sticker.url;
const stickersayisi = message.guild.stickers.cache.size
const stickername = `sticker_${stickersayisi+1}`
const stickers = await message.guild.stickers.create({name: stickername, description: sticker.description, tags: sticker.tags, file: url, reason: `Sticker Eklendi ${message.member.user.username} Tarafından!`}).catch(err => {return message.reply({content:`**Bir Hata Oluştu!** ${err}`})})
await msj.delete().catch(e => {})
await message.reply({embeds: [embed.setThumbnail(stickers.url).setDescription(`${message.guild.emojiGöster(emojis.yes)} **${stickername}** *Adlı Sticker Sunucuya Eklendi!*`)]})
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {})
collector.stop();
} else {
await msj.delete().catch(e => {})
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
await message.reply({embeds: [embed.setDescription(`**Lütfen Bir Sticker Gönderin.**`)]})
collector.stop();
}
})
collector.on('end', async (collected, reason) => {
if(reason === "time") {
await msj.delete().catch(e => {})
await message.reply({embeds: [embed.setDescription(`**Belirtilen Süre İçinde Sticker Gönderilmedi.**`)]})
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
}
})
}
}