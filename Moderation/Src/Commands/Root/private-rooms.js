const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const pGuild = require("../../../../Src/Schemas/PrivateRoomsGuild")
module.exports = {
conf: {
aliases: ["özel-oda", "private-room", "private-room", "private-room", "özel-oda", "özel-oda", "ozeloda", "ozel-oda", "özeloda"],
name: "private-rooms",
help: "özel-oda",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Sunucu ayarları veritabanında bulunamadı!"}).sil(15)
}
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("private-rooms")
.setPlaceholder("Özel Oda Menüsü")
.addOptions([
{
label: "Özel Oda Kurulum",
value: "create",
description: "Özel Oda Kurulum",
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: "Özel Oda Sıfırla",
value: "delete",
description: "Özel Oda Sıfırla",
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: "İptal",
value: "cancel",
description: "İptal",
emoji: message.guild.emojiGöster(emojis.no).id
}
]))
const msg = await message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} Yapmak istediğiniz işlemi seçiniz!`)], components: [row]})
let filter = (interaction) => interaction.user.id === message.author.id;
let collector = msg.createMessageComponentCollector({filter, time: 60000});
collector.on("collect", async (button) => {
if(button.customId === "private-rooms") {
if(button.values[0] === "create") {
await button.deferUpdate()
const data = await pGuild.findOne({guildID: settings.Moderation.guildID})
if(data && data.private_voices.mode === true) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} Özel oda zaten kurulmuş!`)], components: []})
}
await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} Özel oda kurulumu başlatılıyor!`)], components: []})
let categoryId = await message.guild.channels.create({
name: `Private Room's`,
type: Discord.ChannelType.GuildCategory,
permissionOverwrites: [
{
id: settings.Moderation.guildID,
allow: [Discord.PermissionsBitField.Flags.Connect],
deny: [Discord.PermissionsBitField.Flags.Speak, Discord.PermissionFlagsBits.ViewChannel]
}, {
id: ayar.unregRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]
}
]
})
let channelId = await message.guild.channels.create({
name: `Özel Oda Oluştur`,
type: Discord.ChannelType.GuildVoice,
parent: categoryId,
userLimit: 1,
permissionOverwrites: [
{
id: settings.Moderation.guildID,
allow: [Discord.PermissionsBitField.Flags.Connect],
deny: [Discord.PermissionsBitField.Flags.Speak, Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel]
}, {
id: ayar.unregRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]
}
]
})
await pGuild.updateOne({ guildId: settings.Moderation.guildID }, { $set: { 'private_voices.mode': true, 'private_voices.categoryId': categoryId.id, 'private_voices.channelId': channelId.id}}, { upsert: true })
await message.react(message.guild.emojiGöster(emojis.yes))
return await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Özel oda başarıyla kuruldu!`)], components: []})
} else if(button.values[0] === "delete") {
await button.deferUpdate()
const data = await pGuild.findOne({guildID: settings.Moderation.guildID})
if(data && data.private_voices.mode === false && !data.private_voices.categoryId && !data.private_voices.channelId) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} Özel oda zaten sıfırlanmış!`)], components: []})
}
await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} Özel oda sıfırlanıyor!`)], components: []})
let category = message.guild.channels.cache.get(data?.private_voices?.categoryId)
let channel = message.guild.channels.cache.get(data?.private_voices?.channelId)
if(category) await category.delete().catch(() => {})
if(channel) await channel.delete().catch(() => {})
await pGuild.updateOne({ guildId: settings.Moderation.guildID }, {$set: {'private_voices': {}}}, { upsert: true })
await message.react(message.guild.emojiGöster(emojis.yes))
return await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Özel oda sıfırlandı!`)], components: []})
} else if(button.values[0] === "cancel") {
await button.deferUpdate()
await message.react(message.guild.emojiGöster(emojis.yes))
return await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} İşlem iptal edildi!`)], components: []})
}
}
})
}
}