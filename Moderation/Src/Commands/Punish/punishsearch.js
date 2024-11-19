const settings = require("../../../../Src/Settings/Settings.json");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup");
const Penalties = require("../../../../Src/Schemas/Penalties");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
name: "cezasorgu",
aliases: ["cezasorgu","sorgu"],
help: "cezasorgu CezaID",
category: "cezalandirma",
cooldown: 15,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["cezasorgu","sorgu"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.staffRoles.some(x => message.member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!"}).sil(15)
return }
if (isNaN(args[0])) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Ceza ID'si bir sayı olmalıdır!"}).sil(15)
return }
const data = await Penalties.findOne({ guildID: settings.Moderation.guildID, id: args[0] });
if (!data) {
await message.reply({ content:`${args[0]} ID'li bir ceza bulunamadı!`}).sil(15)
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
const user = await message.guild.members.cache.get(data.userID) || await client.users.fetch(data.userID);
const staff = await message.guild.members.cache.get(data.staff) || await client.users.fetch(data.staff);
const type = typeMapping[data.type] || data.type;
await message.reply({ embeds: [embed.setDescription(`\`${data.id}.\` \`${data.active == true ? "🟢 (Aktif)" : "🔴 (Deaktif)"}\` [**${type}**] **${message.guild.members.cache.get(data.userID) ? user.toString() : user.username}** üyesi <t:${Math.floor(data.date / 1000)}> tarihinde **${message.guild.members.cache.get(data.staff) ? staff.toString() : staff.globalName}** tarafından **${data.reason}** sebebiyle cezalandırıldı.`)] });
}
}