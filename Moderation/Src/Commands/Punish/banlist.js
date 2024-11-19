const settings = require("../../../../Src/Settings/Settings.json");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
name: "banlist",
aliases: ["banliste", "banlist"],
help: "banliste",
category: "cezalandirma",
cooldown: 15,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["banliste", "banlist"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.BanMembers) &&  !ayar.banHammer.some(x => message.member.roles.cache.has(x))) {
await message.reply({ content:"Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const ban = await message.guild.bans.fetch();
if (!ban) {
await message.channel.send({ content: "Sunucuda banlanmış üye bulunmamaktadır!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
message.guild.bans.fetch().then(async banned => {
let list = 1
let veri = `${message.guild.emojiGöster(emojis.info)} Aşağıda **${moment(Date.now()).format("LLL")}** Tarihinden İtibaren İstenen ${message.guild.name} Sunucusunun Ban Listesi Belirtilmiştir!\n\n${banned.map(user => `\` ${list++} ••❯ Kullanıcı Adı: ${user.user.username} | ID: ${user.user.id} | Ban Sebebi: ${user.reason ? user.reason : "Belirtilmedi!"} \``).join('\n')}`
const chunk = await client.splitMessage(veri, 4090)
for (msg of chunk) {
await message.channel.send({embeds: [embed.setDescription(msg)]})
}
})
}
};