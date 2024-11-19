const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const setups = require("../../../../Src/Schemas/Setup")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["rolbilgi","roleinfo", "rol-info", "role-info", "rol-bilgi"],
name: "roles-info",
help: "rolbilgi @Rol/ID",
category: "ustyetkili",
cooldown: 10
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: message.guild.id})
if(!ayar) return
const Name = ["rolbilgi","roleinfo", "rol-info", "role-info", "rol-bilgi"];
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
let offlinemembers = role.members.filter(x => !x.presence)
let sestemembers = role.members.filter(x => (x.presence && x.presence !== "offline") && x.voice.channel)
let sesteolmayanaktif = role.members.filter(x => (x.presence && x.presence !== "offline") && !x.voice.channel)
let offlineamaseste = role.members.filter(x => !x.presence && x.voice.channel)
let text = `
─────────────────────
Rol Adı: ${role.name} (${role.id})
Rol Rengi: ${role.hexColor} (${role.color})
Rol Pozisyon: ${role.rawPosition}
Rol Üye Sayısı:  ${role.members.size}
─────────────────────
Üyeler (Çevrim-Dışı) (${offlinemembers.size} üye)
─────────────────────
${offlinemembers.size > 0 ? offlinemembers.map(x => {
return `${x} (${x.id})`
}).join("\n") : `Çevrim-dışı üye bulunamadı.`}
─────────────────────
Üyeler (Aktif - Seste Olmayan) (${sesteolmayanaktif.size} üye)
─────────────────────
${sesteolmayanaktif.size > 0 ? sesteolmayanaktif.map(x => {
return `${x} (${x.id})`
}).join("\n") : `Seste olmayan aktif bir üye bulunamadı.`}
─────────────────────
Üyeler (Seste Olanlar) (${sestemembers.size} üye)
─────────────────────
${sestemembers.size > 0 ? sestemembers.map(x => {
return `${x} (${x.voice.channel})`
}).join("\n") : `Seste olan üye bulunamadı.`}
─────────────────────
Üyeler (Çevrim-Dışı - Seste Olanlar) (${offlineamaseste.size} üye)
─────────────────────
${offlineamaseste.size > 0 ? offlineamaseste.map(x => {
return `${x} (${x.voice.channel})`
}).join("\n") : `Çevrim-dışı ama seste bulunan üye bulunamadı.`}
─────────────────────`
let chunk = await client.splitMessage(text, 4060)
for (text of chunk) {
await message.channel.send({embeds: [embed.setDescription(`\` ••❯ \` Aşağıda <t:${String(Date.now()).slice(0, 10)}> Tarihinde İstenen ${role} İsimli Rol Bilgisi Ve Rol Denetimi Belirtilmiştir.\n\n${text}`)]})
}
}
}