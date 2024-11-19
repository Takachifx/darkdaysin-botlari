const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["kilit", "lock", "kanalkilit", "channellock", "kilitle", "kanalkilitle", "kanal-kilitle", "kanal-kilit"],
name: "channel-lock",
help: "kanal-kilit",
category: "ustyetkili",
cooldown: 60
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["kilit", "lock", "kanalkilit", "channellock", "kilitle", "kanalkilitle", "kanal-kilitle", "kanal-kilit"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır.`}).sil(15)
return }
let kilits = new Discord.ButtonBuilder()
.setCustomId("kilit")
.setStyle(Discord.ButtonStyle.Success)
.setEmoji("🔒")
let unkilits = new Discord.ButtonBuilder()
.setCustomId("unkilit")
.setStyle(Discord.ButtonStyle.Success)
.setEmoji("🔓")
const row = new Discord.ActionRowBuilder()
.addComponents([ kilits, unkilits]);
var msg = await message.reply({embeds: [embed.setDescription(`${message.member} Kanal Kilidini Aktifleştirmek Ve Deaktifleştirmek İçin Butonları Kullanınız.`)], components: [row]})
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })
collector.on("collect", async (button) => {
if(button.customId === "kilit") {
await button.deferUpdate();
await message.channel.permissionOverwrites.edit(button.guild.id, {SendMessages: false}).then(async() => {}).catch(e => {});
await ayar.manRoles.forEach(async(role) => {await message.channel.permissionOverwrites.edit(role, {SendMessages: false}).then(async() => {}).catch(e => {})})
await ayar.womanRoles.forEach(async(role) => {await message.channel.permissionOverwrites.edit(role, {SendMessages: false}).then(async() => {}).catch(e => {})})
row.components[0].setDisabled(true)
await msg.edit({components: [row]}).catch(e => {});
}
if(button.customId === "unkilit") {
await button.deferUpdate();
await message.channel.permissionOverwrites.edit(button.guild.id, {SendMessages: true}).then(async() => {}).catch(e => {});
await ayar.manRoles.forEach(async(role) => {await message.channel.permissionOverwrites.edit(role, {SendMessages: null}).then(async() => {}).catch(e => {})})
await ayar.womanRoles.forEach(async(role) => {await message.channel.permissionOverwrites.edit(role, {SendMessages: null}).then(async() => {}).catch(e => {})})
row.components[1].setDisabled(true)
await msg.edit({components: [row]}).catch(e => {});
}
})
collector.on("end", async () => {
row.components[0].setDisabled(true)
row.components[1].setDisabled(true)
await msg.edit({components: [row]})
})
}
}