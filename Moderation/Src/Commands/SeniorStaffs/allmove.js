const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["toplutaşı","allmove", "toplutasi", "all-move", "toplutası", "toplutaşi"],
name: "toplutaşı",
help: "toplutaşı [Taşıyacağınız Kanal]",
category: "ustyetkili",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
const Name = ["toplutaşı","allmove", "toplutasi", "all-move", "toplutası", "toplutaşi"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.MoveMembers)) {
await message.reply({ content:"Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
let channel = message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
if (!channel) {
await message.reply({ content:"Bir kanal ID girmeli ya da bir sesli kanalda bulunmalısın!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
if(channel.type != Discord.ChannelType.GuildVoice) {
await message.reply({ content: "Sadece Sesli Kanallarda Kullanabilirsiniz."}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const row = new Discord.ActionRowBuilder().addComponents(new Discord.ChannelSelectMenuBuilder().setCustomId("allmove_select").addChannelTypes(Discord.ChannelType.GuildVoice).setMinValues(1).setMaxValues(1));
const msj = await message.reply({ content: `**${channel.name}** Adlı Kanaldaki **${channel.members.size}** Adet Üyeyi Taşımak İstediğiniz Kanalı Seçiniz.`, components: [row] });
var filter = (interaction) => message.author.id;
const collector = msj.createMessageComponentCollector({filter, time: 120000});
collector.on("collect", async (interaction) => {
await interaction.deferUpdate();
if(interaction.customId === "allmove_select") {
row.components[0].setDisabled(true);
let channels = interaction.guild.channels.cache.get(interaction.values[0]);
if(channel.members.size == 0) {
await msj.edit({content: `${message.guild.emojiGöster(emojis.no)} Kanalda Kimse Bulunmamaktadır!`, components: [row]})
return }
await channel.members.forEach(async (member) => {
await member.voice.setChannel(channels).catch(e => {});
})
await msj.edit({content: `${message.guild.emojiGöster(emojis.yes)} Başarıyla **${channel.members.size}** Adet Üyeyi **${channels.name}** Kanalına Taşıdınız.`, components: [row]})
}
})
collector.on("end", () => {
row.components[0].setDisabled(true);
msj.edit({ components: [row] });
})
}
}