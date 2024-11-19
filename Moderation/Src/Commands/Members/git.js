const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Discord = require("discord.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = {
conf: {
aliases: ["git"],
name: "git",
help: "git @Darkdays/ID",
category: "kullanici",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `Bir Kullanıcı Belirtmelisin!`}).sil(15)
}
if(!message.member.voice.channel) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `Ses Kanalında Bulunmuyorsun!`}).sil(15)
}
if(!member.voice.channel) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `Belirtilen Kullanıcı Bir Ses Kanalında Bulunmuyor!`}).sil(15)
}
if(member.voice.channel.id === message.member.voice.channel.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `Belirtilen Kullanıcı Zaten Senle Aynı Kanalda!`}).sil(15)
}
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("git")
.setPlaceholder(`${member.displayName} Bir İşlem Seç`)
.addOptions(
{
label: "Kabul Et",
value: "onay",
description: "Kabul Et",
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: "Reddet",
value: "red",
description: "Reddet",
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: "İptal Et",
value: "iptal",
description: "İptal Et",
emoji: message.guild.emojiGöster(emojis.no).id
}));
const msg = await message.reply({content: `${member}, ${message.member} Senin Ses Kanalına Gelmek İstiyor!`, components: [row]})
let filter = (interaction) => interaction.member.id === member.id
let collector = msg.createMessageComponentCollector({filter, time: 30000})
collector.on("collect", async (button) => {
if(button.customId === "git") {
if(button.user.id != member.id) return await button.reply({content: `Bu İşlem Sadece ${member} Tarafından Yapılabilir!`, ephemeral: true})
if(button.values[0] === "onay") {
await button.deferUpdate()
await member.voice.setChannel(message.member.voice.channel.id).catch(() => {})
await message.react(message.guild.emojiGöster(emojis.yes))
await msg.edit({content: `${member} Kullanıcısı ${message.member} Kullanıcısını Bulunduğu Kanala Taşıdı!`, components: []})
} else if(button.values[0] === "red") {
await button.deferUpdate()
await message.react(message.guild.emojiGöster(emojis.no))
await msg.edit({content: `${member} Kullanıcısı ${message.member} Kullanıcısını Bulunduğu Kanala Taşıma İsteğini Reddetti!`, components: []})
} else if(button.values[0] === "iptal") {
await button.deferUpdate()
await message.react(message.guild.emojiGöster(emojis.no))
await msg.edit({content: `${member} Kullanıcısı ${message.member} Kullanıcısını Bulunduğu Kanala Taşıma İsteğini İptal Etti!`, components: []})
}
}
})
collector.on("end", async () => {
await msg.edit({components: []})
})
}
}