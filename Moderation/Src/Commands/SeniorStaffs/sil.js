const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["sil","temizle"],
name: "sil",
help: "sil [Miktar] @Darkdays/ID",
category: "ustyetkili",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["sil","temizle"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content:`${message.guild.emojiGöster(emojis.no)} Bu komutu kullanabilmek için yetkin yok!`}).sil(15)
}
if (!args[0]) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content:`${message.guild.emojiGöster(emojis.no)} Bir miktar belirtmelisin!`}).sil(15)
}
if (isNaN(args[0])){
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content:`${message.guild.emojiGöster(emojis.no)} Belirttiğin miktar bir sayı olmalı!`}).sil(15)
}
if(args[0] > 100) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content:`${message.guild.emojiGöster(emojis.no)} Belirttiğin miktar 100'den fazla olamaz!`}).sil(15)
}
const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
if(!member) {
await message.delete().catch(e => {})
await message.channel.bulkDelete(args[0]).catch(e => {});
message.channel.send({ content:`${message.guild.emojiGöster(emojis.yes)} ${args[0]} adet mesaj silindi!`}).sil(15)
} else {
let mesajlar = await message.channel.messages.fetch({ limit: args[0] });
mesajlar = mesajlar.array();
mesajlar = mesajlar.filter((e) => e.author.id === member.id);
if (mesajlar.length > args[1]) {
mesajlar.length = parseInt(args[1], 10);
}
mesajlar = mesajlar.filter((e) => !e.pinned);
args[1]++;
message.channel.bulkDelete(mesajlar, true);
message.channel.send({ content: `${message.guild.emojiGöster(emojis.yes)} ${message.member} Başarıyla ${message.channel} (\` ${message.channel.id} \`) Adlı Kanal'da ${member} (\`${member.id}\`) Kişisine Ait (**${mesajlar.length}**) Adet Mesaj Silindi!` }).sil(15);
}
},
};



