const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["dağıt","dagit"],
name: "dağıt",
help: "dağıt",
category: "ustyetkili",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["dağıt","dagit"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır.`}).sil(15)
return }
let voiceChannel = message.member.voice.channelId;
if (!voiceChannel) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bir Ses Kanalında Bulunmalısın.`}).sil(15)
return }
let publicRooms = message.guild.channels.cache.filter(c => ayar.publicParents.some(a => a == c.parentId) && c.type === Discord.ChannelType.GuildVoice);
message.member.voice.channel.members.array().forEach((m, index) => {
setTimeout(async() => {
if (m.voice.channelId !== voiceChannel) return;
await m.voice.setChannel(publicRooms.random()).catch(e => {});
}, index*1000);
});
await message.reply({content: `${message.guild.emojiGöster(emojis.yes)} **${message.member.voice.channel.name}** Adlı Ses Kanalındaki Üyeleri Rastgele Public Odalara Dağıtılmaya Başladım!`}).catch(e => {});
await message.react(message.guild.emojiGöster(emojis.yes))
}
}