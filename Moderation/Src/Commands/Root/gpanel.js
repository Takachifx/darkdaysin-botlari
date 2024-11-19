const settings = require('../../../../Src/Settings/Settings.json');
const Discord = require("discord.js")
const koruma = require("../../../../Src/Schemas/Koruma")
const emojis = require("../../../../Src/Settings/emojiName.json");
const RoleModel = require("../../../../Src/Schemas/Roles");
const CategoryChannels = require("../../../../Src/Schemas/CategoryChannels");
const TextChannels = require("../../../../Src/Schemas/TextChannels");
const VoiceChannels = require("../../../../Src/Schemas/VoiceChannels");
module.exports = {
conf: {
name: "gpanel",
aliases: ["gpanel"],
help: "gpanel",
owner: true,
category: "owner"
},
Cyrstal: async (client, message, args, embed) => {
const buttons = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("allBackup")
.setLabel("Sunucuyu Yedekle")
.setEmoji(`1122566922647650414`)
.setStyle(Discord.ButtonStyle.Success),
new Discord.ButtonBuilder()
.setCustomId("channelBackup")
.setLabel("Kanalları Yedekle")
.setEmoji(`1122566921125118022`)
.setStyle(Discord.ButtonStyle.Success),
new Discord.ButtonBuilder()
.setCustomId("roleBackup")
.setLabel("Rolleri Yedekle")
.setEmoji(`1122566919753576498`)
.setStyle(Discord.ButtonStyle.Success),
);

const buttons2 = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("ytLock")
.setLabel("Yönetici Rolleri Kapat")
.setEmoji(`1122566923838820493`)
.setStyle(Discord.ButtonStyle.Danger),
new Discord.ButtonBuilder()
.setCustomId("ytUnlock")
.setLabel("Yönetici Rolleri Aç")
.setEmoji(`1122566923838820493`)
.setStyle(Discord.ButtonStyle.Danger),
new Discord.ButtonBuilder()
.setCustomId("restart")
.setLabel(`Botları Yeniden Başlat`)
.setEmoji(`1122567825043755069`)
.setStyle(Discord.ButtonStyle.Danger),
new Discord.ButtonBuilder()
.setCustomId("exit")
.setLabel("İşlem İptal")
.setEmoji(`1121810741226381332`)
.setStyle(Discord.ButtonStyle.Danger),
)
await message.react(message.guild.emojiGöster(emojis.yes))
var msj = await message.reply({ embeds: [embed
.setAuthor({ name: 'Sunucu Backup & Koruma Paneli', iconURL: message.guild.iconURL({dynamic: true})})
.setDescription(`${message.member} Sunucu ile ilgili işlem(leri) aşağıdaki panel ile seçiniz unutmayınız ki yaptığınız işlemler **geri alınamaz** ve **kurtarılamaz!**

\`  Tümünü Yedekle:          \` Tüm **Kanal & Rol & Kategori & Emoji** verilerini databaseye işler veri kurulum işleminde buradan veriyi çeker.

\`  Kanalları Yedekle:       \` Tüm **Kanal & Katagorileri** yedeklemeye başlar.

\`  Rolleri Yedekle:         \` Tüm **Rol & Üye** verilerini yedeklemeye başlar.

\`  Yönetici Rolleri Kapat:  \` Sunucudaki **Tüm Yönetici** rollerini kapatır.

\`  Yönetici Rolleri Aç:     \` Sunucuda kapatılan **Yönetici Rolleri** tekrar açar.

\`  Botları Yeniden Başlat:  \` Guard & Backup botlarını **yeniden başlatır!**
`)
.setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})})
.setThumbnail(message.guild.iconURL({dynamic:true}))], components: [buttons, buttons2] })
var filter = (menu) => menu.user.id === message.author.id;
const collector = msj.createMessageComponentCollector({ filter, time: 30000 })
collector.on("collect", async (interaction) => {
if(interaction.customId === "channelBackup") {
interaction.reply({ content: `> **Kanalların Yedekleri Alınıyor!**`, ephemeral: true }).then(x => {
client.ChannelBackup(interaction.guild, settings.Moderation.guildID)})
}
if(interaction.customId === "roleBackup") {
interaction.reply({ content: `> **Rollerin Yedekleri Alınıyor!**`, ephemeral: true }).then(x => {
client.RoleBackup(interaction.guild, settings.Moderation.guildID)})
}
if(interaction.customId === "ytLock") {
const perms = [Discord.PermissionFlagsBits.Administrator, Discord.PermissionFlagsBits.ManageRoles, Discord.PermissionFlagsBits.ManageWebhooks, Discord.PermissionFlagsBits.ManageChannels, Discord.PermissionFlagsBits.ManageGuild, Discord.PermissionFlagsBits.BanMembers, Discord.PermissionFlagsBits.KickMembers];
let roller = interaction.guild.roles.cache.filter(rol => rol.editable).filter(rol => perms.some(yetki => rol.permissions.has(yetki)))
roller.forEach(async (rol) => {
await koruma.updateOne({ Role: rol.id }, {$set: {"guildID": interaction.guild.id, "Permissions": rol.permissions.bitfield }}, {upsert: true})
await rol.setPermissions(0n)
})
interaction.reply({content: `> Başarılı! ${roller.map(x => x).join(", ")} **Rol(lerin) İzinleri Sıfırlandı!**`, ephemeral: true})
}
if(interaction.customId === "ytUnlock") {
let veri = await koruma.find({});
veri.filter(x => interaction.guild.roles.cache.get(x.Role)).forEach(async (data) => {
let rollers = interaction.guild.roles.cache.get(data.Role)
if(rollers) rollers.setPermissions(data.Permissions);
})
await koruma.deleteMany({ guildID: interaction.guild.id })
interaction.reply({content: `> Başarılı! ${veri.map((x, key) => interaction.guild.roles.cache.get(x.Role)).join(", ")} **Rollerin Yetkilerini Geri Açtınız!**`, ephemeral: true})
}
if(interaction.customId === "allBackup") {
interaction.reply({ content: `> **Rol Ve Kanalların Yedekleri Alınıyor!**`, ephemeral: true }).then(x => {
client.ChannelBackup(interaction.guild, settings.Moderation.guildID)
client.RoleBackup(interaction.guild, settings.Moderation.guildID)})
}

if(interaction.customId === "restart") {
interaction.reply({content: `> Başarılı! Bot(lar) **Yeniden Başlatılıyor!**`, ephemeral: true}).then(x => {
process.exit(0)
})
}

if(interaction.customId === "exit") {
interaction.reply({ content: `> **Panel Silindi!**`, ephemeral: true }).then(x => {
interaction.message.delete().catch(e => {})})
}
})
}
}

client.RoleBackup = async function(guild, guildID) {
guild.roles.cache.forEach(async role => {
let roleChannelOverwrites = [];
await guild.channels.cache.filter(c => c.permissionOverwrites && c.permissionOverwrites.cache.has(role.id)).forEach(c => {
let channelPerm = c.permissionOverwrites.cache.get(role.id);
let izinler = {id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray()};
roleChannelOverwrites.push(izinler);
});
await RoleModel.updateOne({roleID: role.id}, {$set: {guildID: guild.id, roleID: role.id, name: role.name, color: role.hexColor, hoist: role.hoist, position: role.rawPosition, permissions: role.permissions.bitfield, mentionable: role.mentionable, time: Date.now(), members: role.members.map(m => m.id), channelOverwrites: roleChannelOverwrites}}, {upsert: true
});
});
console.log("Rollerin Verileri Başarıyla Yedeklendi!")
};

client.ChannelBackup = async function(guild, guildID) {
await TextChannels.deleteMany({});
await VoiceChannels.deleteMany({});
await CategoryChannels.deleteMany({});
if (guild) {
const channels = [...guild.channels.cache.values()];
for (let index = 0; index < channels.length; index++) {
const channel = channels[index];
let ChannelPermissions = [];
if (channel.permissionOverwrites) {
channel.permissionOverwrites.cache.forEach(perm => {
ChannelPermissions.push({ id: perm.id, type: perm.type, allow: perm.allow.toArray(), deny: perm.deny.toArray() });
});
}
if (channel.type == 4) {
await CategoryChannels.updateOne({ channelID: channel.id },{$set: {channelID: channel.id, name: channel.name, position: channel.position, overwrites: ChannelPermissions} },{ upsert: true });
}
if ((channel.type == 0) || (channel.type == 5)) {
await TextChannels.updateOne({ channelID: channel.id },{$set: { channelID: channel.id, name: channel.name, nsfw: channel.nsfw, parentID: channel.parentId, position: channel.position, rateLimit: channel.rateLimitPerUser, overwrites: ChannelPermissions} },{ upsert: true });
}
if (channel.type == 2) {
await VoiceChannels.updateOne({ channelID: channel.id },{$set: { channelID: channel.id, name: channel.name, bitrate: channel.bitrate, userLimit: channel.userLimit, parentID: channel.parentId, position: channel.position,  overwrites: ChannelPermissions} },{ upsert: true });
}
}
console.log("Kanal Verileri Başarıyla Yedeklendi!");
}
}