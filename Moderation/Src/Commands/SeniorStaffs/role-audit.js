const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const setups = require("../../../../Src/Schemas/Setup")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["roldenetim","roleaudit", "rol-denetime", "rol-denetim", "roldenetim", "roldenetle"],
name: "role-audit",
help: "roldenetim @Rol/ID",
category: "ustyetkili",
cooldown: 10
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: message.guild.id})
if(!ayar) return;
const Name = ["roldenetim","roleaudit", "rol-denetime", "rol-denetim", "roldenetim", "roldenetle"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır.`}).sil(15)
return }
let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
if (!role) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bir rol belirtmelisin!`}).sil(15)
return }
let unVoice = role.members.filter(member => !member.voice.channel);
let list = 1
let text = role.members.size > 0 ? role.members.filter(member => message.guild.members.cache.get(member.id)).map((e) => `\` ${list++}. \` **${e} (${e.user.id}) - ${e.voice.channel ? "Seste" : "Seste Değil"}**`).join("\n") : "Veri Bulunamadı."
let chunk = await client.splitMessage(text, 4060)
for (text of chunk) {
await message.channel.send({embeds: [embed.setDescription(`\` ••❯ \` Aşağıda <t:${String(Date.now()).slice(0, 10)}> Tarinde İstenen ${role} İsimli Rol Denetimi Belirtilmiştir.\n\n${Discord.Formatters.codeBlock("fix", "Rol: " + role.name + " (" + role.id + ") | " + role.members.size + " Toplam Üye | " + unVoice.size + " Seste Olmayan Üye")}\n\n${text}`)]})
}
}
}