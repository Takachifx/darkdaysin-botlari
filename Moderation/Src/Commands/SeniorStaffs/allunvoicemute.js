const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
const setups = require("../../../../Src/Schemas/Setup")
module.exports = {
conf: {
aliases: ["allunmute"],
name: "allunmute",
help: "allunmute",
category: "ustyetkili",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
const Name = ["allunmute"]
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
await channel.members.filter((x) => !x.permissions.has(Discord.PermissionFlagsBits.Administrator)).forEach(async (x, index) => {
await client.wait(index * 1000);
await x.voice.setMute(false).catch(e => {});
});
let list = 1
let memberPromises = channel.members.map(async (x, index) => {
let member = message.guild.members.cache.get(x.id);
let username = member ? member.toString() : (await client.users.fetch(x)).username;
return `\` ${list++}. \` **${username}**`;
});
let memberStrings = await Promise.all(memberPromises);
let text = `${message.guild.emojiGöster(emojis.info)} ${channel} Kanalındaki Tüm Üyelerin Susturması Kaldırıldı!\n\n${message.guild.emojiGöster(emojis.face)} **Üyeler Aşağıda Belirtilmiştir: (${channel.members.size})**\n\n${memberStrings.join("\n")}`;
const chunk = await client.splitMessage(text, 4090)
for (msg of chunk) {
await message.channel.send({embeds: [embed.setDescription(msg)]})
}
},
};



