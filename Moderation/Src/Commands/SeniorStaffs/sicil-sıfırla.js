const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Penalties = require("../../../../Src/Schemas/Penalties")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
module.exports = {
conf: {
aliases: ["sicil-sıfırla", "sicilsıfırla", "sicilsifirla", "sicil-sifirla", "sicilsifirla"],
name: "sicil-sıfırla",
help: "sicil-sıfırla @Darkdays/ID",
category: "ustyetkili",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["sicil-sıfırla", "sicilsıfırla", "sicilsifirla", "sicil-sifirla", "sicilsifirla"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır." }).sil(15);
}
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bir Kullanıcı Belirtmelisin." }).sil(15);
}
if(member.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Kendi Verilerini Silemezsin!" }).sil(15);
}
if(member.id === client.user.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Botun Verilerini Silemezsin!" }).sil(15);
}
if(member.user.bot) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Botların Verilerini Silemezsin!" }).sil(15);
}
let data = await Penalties.find({ guildID: settings.Moderation.guildID, userID: member.user.id, }).sort({ active: -1, date: -1 })
if (data.length === 0) {
await message.reply({ content:"Bu Kullanıcının Ceza Bilgisi Bulunamadı!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const typeMapping = {
"CHAT-MUTE": "C-Mute",
"VOICE-MUTE": "V-Mute",
"JAIL": "Jail",
"BAN": "Ban",
"TEMP-JAIL": "T-Jail",
"WARN": "Uyarı",
};
let options = []
data.slice(0, 24).map((x, index) => {
const type = typeMapping[x.type] || x.type;
index = index + 1
options.push({label: type, description: `Yetkili: ${message.guild.members.cache.get(x.staff) ? message.guild.members.cache.get(x.staff).displayName : x.staff} | Sebep: ${x.reason}`, value: index.toString(), emoji: message.guild.emojiGöster(emojis.sagok).id})
})
options.push({label: "İptal", description: "İptal Et", value: "iptal", emoji: message.guild.emojiGöster(emojis.no).id})
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("sicil")
.setPlaceholder("Sıfırlancak Sicil Seçin")
.addOptions(options))
await message.react(message.guild.emojiGöster(emojis.yes))
const msg = await message.reply({embeds: [embed.setDescription(`${message.member}, ${member} Kullancısının Sıfırlamak İstediginiz Ceza Türünü Seçin.`)], components: [row]})
let filter = (i) => i.user.id === message.author.id
const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
collector.on('collect', async (i) => {
if(i.values[0] === "iptal") {
await msg.edit({embeds: [embed.setDescription(`${message.member}, ${member} Kullancısının Sıfırlanmasını İptal Ettiniz.`)], components: []}).sil(15)
return;
}
data.slice(0, 24).map(async(x, index) => {
index = index + 1
if(i.values[0] === index.toString()) {
const type = typeMapping[x.type] || x.type;
await Penalties.deleteOne({ guildID: settings.Moderation.guildID, userID: member.user.id, type: x.type, date: x.date })
await msg.edit({embeds: [embed.setDescription(`${message.member}, ${member} Kullancısının **${type}** Cezasını <t:${String(Date.now()).slice(0, 10)}> Tarihinde Sıfırlandın.`)], components: []}).sil(15)
}
})
})
collector.on('end', async (i) => {
await msg.edit({components: []})
})
}
}