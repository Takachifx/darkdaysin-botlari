const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const RoleLogs = require("../../../../Src/Schemas/RoleLogs")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["rol", "role", "roles", "r"],
name: "rol",
help: "rol ver/al @Darkdays/ID",
category: "ustyetkili"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({ guildID: message.guild.id });
if (!ayar) return;
const Permission = [Discord.PermissionFlagsBits.Administrator, Discord.PermissionFlagsBits.ManageRoles, Discord.PermissionFlagsBits.ManageWebhooks, Discord.PermissionFlagsBits.ManageChannels, Discord.PermissionFlagsBits.ManageGuild, Discord.PermissionFlagsBits.BanMembers, Discord.PermissionFlagsBits.KickMembers];
const Name = ["rol", "role", "roles", "r"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.roleAddRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!"}).sil(15)
return }
if (!args[0]) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:`Kullanımı: ${settings.Moderation.prefix}rol ver/al @Darkdays/ID`}).sil(15)
return }
if (args[0] != "al" && args[0] != "ver") {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:`Kullanımı: ${settings.Moderation.prefix}rol ver/al @Darkdays/ID`}).sil(15)
return }
const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
if (!member) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bir üye etiketle ve tekrardan dene!"}).sil(15)
return }
if (member.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Kendine rol veremezsin!"}).sil(15)
return }
if (member.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Belirttiğin üye senden üst/aynı pozisyonda!"}).sil(15)
return }
if(member.id === message.guild.ownerId) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Sunucu sahibine rol veremezsin!"}).sil(15)
return }
if(args[0] == "ver") {
let Roller = message.guild.roles.cache.map(role => role.name !== '@everyone' && role.managed == false && message.guild.roles.cache.get(ayar.unregRoles[0]) && message.guild.roles.cache.get(ayar.unregRoles[0]).rawPosition < role.rawPosition && message.member.roles.highest.rawPosition >= role.rawPosition && !Permission.some(x => role.permissions.has(x)) && !ayar.ownerRoles.some(x => role.id == x)).filter(Boolean).slice(0, 1);
Roller = Roller.filter(role => role !== undefined && role !== null);
const row = new Discord.ActionRowBuilder().addComponents(new Discord.RoleSelectMenuBuilder().setCustomId("role_select").setPlaceholder("Rol Seç!").addDefaultRoles(Roller));
const msj = await message.reply({ content:`${member} Kullanıcısına Vermek İstediğiniz Rolü Seçiniz.`, components: [row] });
var filter = (interaction) => message.author.id;
const collector = msj.createMessageComponentCollector({filter, time: 120000});
collector.on("collect", async (interaction) => {
await interaction.deferUpdate();
if(interaction.customId === "role_select") {
row.components[0].setDisabled(true);
let role = interaction.values[0];
let rol = message.guild.roles.cache.get(role);
if (!rol) return;
if(rol.rawPosition >= message.member.roles.highest.rawPosition) {
await message.react(message.guild.emojiGöster(emojis.no))
await msj.edit({ content:`${message.guild.emojiGöster(emojis.no)} Belirttiğiniz Rol Sizin Üstünüzde Veya Aynı Pozisyonda!`, components: []})
return }
if(member.roles.cache.has(rol.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
await msj.edit({ content:`${member} Kullanıcısında Zaten **${rol.name}** Rolü Bulunmakta!`, components: []})
return }
await member.addRoles(rol.id).catch(e => {});
await message.react(message.guild.emojiGöster(emojis.yes))
await msj.edit({content: "", embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.sagok)} ${member} Kullanıcısına **${rol}** Rolü Başarıyla Verildi!`)], components: []})
const channel = await client.kanalBul("rol-log")
await RoleLogs.updateOne({user: member.id}, { $push: { roller: { rol: role.id, mod: message.member.id, tarih: Date.now(), state: "Ekleme" } } }, { upsert: true})
await channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.sagok)} ${member} Kullanıcısına **${rol}** Rolü ${message.author} Tarafından <t:${String(Date.now()).slice(0, 10)}> Tarihinde Verildi!`)]})
}
})
collector.on("end", async () => {
await msj.edit({ components: [] });
})
} else if (args[0] == "al") {
let Roller = member.roles.cache.map(role => role.name !== '@everyone' && role.managed == false && message.member.roles.highest.rawPosition >= role.rawPosition && !Permission.some(x => role.permissions.has(x)) && !ayar.ownerRoles.some(x => role.id == x)).filter(Boolean).slice(0, 1);
const row = new Discord.ActionRowBuilder().addComponents(new Discord.RoleSelectMenuBuilder().setCustomId("role_select").setPlaceholder("Rol Seç!").addDefaultRoles(Roller));
const msj = await message.reply({ content:`${member} Kullanıcısından Almak İstediğiniz Rolü Seçiniz.`, components: [row] });
var filter = (interaction) => message.author.id;
const collector = msj.createMessageComponentCollector({filter, time: 120000});
collector.on("collect", async (interaction) => {
await interaction.deferUpdate();
if(interaction.customId === "role_select") {
row.components[0].setDisabled(true);
let role = interaction.values[0];
let rol = message.guild.roles.cache.get(role);
if (!rol) return;
if(rol.rawPosition >= message.member.roles.highest.rawPosition) {
await message.react(message.guild.emojiGöster(emojis.no))
await msj.edit({ content:`${message.guild.emojiGöster(emojis.no)} Belirttiğiniz Rol Sizin Üstünüzde Veya Aynı Pozisyonda!`, components: []})
return }
if(!member.roles.cache.has(rol.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
await msj.edit({ content:`${member} Kullanıcısında **${rol.name}** Rolü Bulunmamakta!`, components: []})
return }
await member.removeRoles(rol.id).catch(e => {});
await message.react(message.guild.emojiGöster(emojis.yes))
await msj.edit({content: "", embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.sagok)} ${member} Kullanıcısından **${rol}** Rolü Başarıyla Alındı!`)], components: []})
const channel = await client.kanalBul("rol-log")
await RoleLogs.updateOne({user: member.id}, { $push: { roller: {rol: role.id, mod: message.member.id, tarih: Date.now(), state: "Kaldırma" } } }, { upsert: true})
await channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.sagok)} ${member} Kullanıcısından **${rol}** Rolü ${message.author} Tarafından <t:${String(Date.now()).slice(0, 10)}> Tarihinde Alındı!`)]})
}
})
collector.on("end", async () => {
await msj.edit({ components: [] });
})
}
}
};