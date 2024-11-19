const settings = require("../../../../Src/Settings/Settings.json")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Discord = require('discord.js');
const UserVoice = require("../../../../Src/Schemas/UserVoice")
const setups = require("../../../../Src/Schemas/Setup")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
name: "voice-log",
aliases: ["voicelog", "voice-log"],
help: "voice-log"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID });
if (!ayar) return;
const Name = ["voicelog", "voice-log"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.staffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !settings.Moderation.owners.includes(message.author.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content: "Bu komutu kullanmak için yeterli yetkiniz bulunmamakta."}).sil(15)
return }
const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("önce")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1239196409027367023"),
new Discord.ButtonBuilder()
.setCustomId("kapat")
.setStyle(Discord.ButtonStyle.Danger)
.setEmoji(message.guild.emojiGöster(emojis.no).id),
new Discord.ButtonBuilder()
.setCustomId("sonra")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1239196354299953184"),
);
const row2 = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel("Detaylı Görüntüle")
.setCustomId("detaylı")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji(message.guild.emojiGöster(emojis.sagok).id))
const Veri = await UserVoice.findOne({ guildID: settings.Moderation.guildID, userID: Member.id });
if(!Veri) {
await message.react(message.guild.emojiGöster(emojis.no))
await new UserVoice({ guildID: settings.Moderation.guildID, userID: Member.id }).save();
return message.reply({embeds: [embed.setDescription(`Belirttiğin kişiye ait veri bulunamadı.`)]}).sil(15)
}
const dataArray = Object.values(Veri.Data).flat();
const sortedData = dataArray.sort((a, b) => b.Date - a.Date);
let liste = []
let liste2 = []
let index = 0;
let voiceLength = 0
let page = 1;
for (const item of sortedData) {
index++;
voiceLength++;
const formattedString = `\` ${index}. \` ${message.guild.channels.cache.get(item.Channel) ? message.guild.channels.cache.get(item.Channel) : "Bulunamadı"} | <t:${Math.floor(item.Date / 1000)}:R> | **[${item.Type}]** | **(${item.VoiceMembers.length})** Kullanıcı İle Sesteydi.`;
liste.push(formattedString);
const formattedString2 = `${index}. ${message.guild.channels.cache.get(item.Channel) ? message.guild.channels.cache.get(item.Channel).name : "Bulunamadı"} | ${moment(item.Date).format("LLL")} | ${item.Type == "YAYIN KAPATMA" ? item.Type == "KAMERA KAPATMA" ? `[${item.Type}] | (${item.Time})` : `[${item.Type}] | (${item.Time})` : `[${item.Type}]`} | (${item.VoiceMembers.length}) Kullanıcı İle Sesteydi.\n${item.VoiceMembers.map(x => message.guild.members.cache.get(x) ? message.guild.members.cache.get(x).displayName : "Bulunamadı").join("\n")}`;
liste2.push(formattedString2);
}
var msg = await message.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} ${Member} Kullanıcısının Toplamda **${voiceLength}** Ses Verisi Bulundu.\n\n${liste.slice(0, 10).join("\n\n")}`).setTimestamp().setAuthor({ name: `${Member.user.displayName}`, iconURL: Member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({dynamic: true})}).setThumbnail(Member.user.avatarURL({ dynamic: true }))], components: [row, row2] });
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 1200000 })
collector.on("collect", async (button) => {
if(button.customId === "sonra") {
await button.deferUpdate();
if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return button.followUp({ content: "Bu sayfada veri bulunmamakta.", ephemeral: true });
page += 1;
let VoiceVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n\n");
msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} ${Member} Kullanıcısının Toplamda **${voiceLength}** Ses Verisi Bulundu.\n\n${VoiceVeri}`).setTimestamp().setAuthor({ name: `${Member.user.displayName}`, iconURL: Member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({dynamic: true})}).setThumbnail(Member.user.avatarURL({ dynamic: true }))]});
}
if(button.customId === "önce") {
await button.deferUpdate();
if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return button.followUp({ content: "Bu sayfada veri bulunmamakta.", ephemeral: true });
page -= 1;
let VoiceVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n\n");
msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} ${Member} Kullanıcısının Toplamda **${voiceLength}** Ses Verisi Bulundu.\n\n${VoiceVeri}`).setTimestamp().setAuthor({ name: `${Member.user.displayName}`, iconURL: Member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({dynamic: true})}).setThumbnail(Member.user.avatarURL({ dynamic: true }))]});
}
if(button.customId === "detaylı") {
let text = liste2.join("\n\n");
if(text.length <= 0) return button.reply({ content: "Bu sayfada veri bulunmamakta.", ephemeral: true });
await button.reply({files: [{attachment: Buffer.from(text, "utf-8"), name: "voice-log.txt"}], ephemeral: true});
}
if(button.customId === "kapat") {
await button.deferUpdate();
await msg.delete().catch(e => {});
}
})
collector.on("end", async () => {
await msg.edit({ components: [] });
})
}
}