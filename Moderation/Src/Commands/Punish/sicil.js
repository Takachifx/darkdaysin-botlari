const settings = require("../../../../Src/Settings/Settings.json");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup");
const Penalties = require("../../../../Src/Schemas/Penalties");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
module.exports = {
conf: {
name: "sicil",
aliases: ["sc"],
help: "sicil @Darkdays/ID",
category: "cezalandirma",
cooldown: 15,
},
Cyrstal: async(client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
let data = await Penalties.find({ guildID: settings.Moderation.guildID, userID: member.user.id, }).sort({ active: -1, date: -1 })
if (data.length === 0) {
await message.reply({ content:"Bu Kullanıcının Ceza Bilgisi Bulunamadı!"}).sil(15)
await message.react(message.guild.emojiGöster(emojis.no))
return }
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("önce")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1239196409027367023"),
new Discord.ButtonBuilder()
.setCustomId("kapat")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji(message.guild.emojiGöster(emojis.no).id),
new Discord.ButtonBuilder()
.setCustomId("sonra")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1239196354299953184"),
);
const typeMapping = {
"CHAT-MUTE": "C-Mute",
"VOICE-MUTE": "V-Mute",
"JAIL": "Jail",
"BAN": "Ban",
"TEMP-JAIL": "T-Jail",
"WARN": "Uyarı",
};
data = data.map((x, index) => {
const type = typeMapping[x.type] || x.type;
return `\`${index+1}.\` \`${x.active == true ? "🟢 (Aktif)" : "🔴 (Deaktif)"}\` [**${type}**] <t:${Math.floor(x.date / 1000)}> tarihinde **${message.guild.members.cache.get(x.staff) ? message.guild.members.cache.get(x.staff).toString() : client.users.cache.get(x.staff).globalName}** tarafından **${x.reason}** sebebiyle cezalandırıldı.`;
});
let page = 1;
let liste = data
const dark = embed
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Adlı Kullanıcının **(${data.length})** Ceza Bilgileri Aşağıda Belirtilmiştir.\n\n${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}`)
.setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({ dynamic: true }))
.setAuthor({ name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
var msg = await message.reply({ embeds: [dark], components: [row]});
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
collector.on("collect", async (button) => {
if (liste.length > 10) {
if(button.customId === "sonra") {
await button.deferUpdate();
if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
page += 1;
let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
msg.edit({ embeds: [dark.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Adlı Kullanıcının **(${data.length})** Ceza Bilgileri Aşağıda Belirtilmiştir.\n\n${rollogVeri}`).setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({dynamic: true})})]});
}
if(button.customId === "önce") {
await button.deferUpdate();
if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
page -= 1;
let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
msg.edit({ embeds: [dark.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member.toString()} Adlı Kullanıcının **(${data.length})** Ceza Bilgileri Aşağıda Belirtilmiştir.\n\n${rollogVeri}`).setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({dynamic: true})})]});
}
if(button.customId === "kapat") {
await button.deferUpdate();
row.components[0].setDisabled(true)
row.components[1].setDisabled(true)
row.components[2].setDisabled(true)
msg.edit({ components: [row] });
}
}
})
}
};