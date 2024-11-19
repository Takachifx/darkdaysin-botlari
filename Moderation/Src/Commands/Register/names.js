const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Names = require("../../../../Src/Schemas/Names");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
aliases: ["isimler", "names", "isimleri", "nicknames"],
name: "isimler",
help: "isimler @Darkdays/ID",
category: "kayit",
cooldown: 0
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID });
if(!ayar) return;
const Name = ["isimler", "names", "isimleri", "nicknames"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.registerRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.staffRoles.some(oku => message.member.roles.cache.has(oku))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Yetkin bulunmamakta. Yetkili olmak istersen başvuru yapabilirsin.`)]}).sil(15)
}
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bir üye belirtmelisin!`)]}).sil(15)
}
const data = await Names.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if(!data) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Belirttiğin üyenin isim verileri bulunamadı!`)]}).sil(15)
}
await message.react(message.guild.emojiGöster(emojis.yes))
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
let page = 1;
let isim = data.names.sort((a, b) => b.Date - a.Date)
let liste = isim.map((x, index) => `\` ${index+1}. \` **İsim: ${x.name && x.name.length > 0 ? `${x.name}` : "Bulunamadı."}${x.age && x.age.length > 0 ? ` | Yaş: ${x.age}` : ""}**${x.executor && x.executor.length > 0 ? ` | **Yetkili: ${message.guild.members.cache.get(x.executor) ? message.guild.members.cache.get(x.executor) : "Bulunamadı"}**` : ""} | <t:${Math.floor(x.Date / 1000)}:R>`)
const dark = embed
.setAuthor({ name: `${message.guild.name}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member} Kullanıcısının Toplamda **${isim.length}** İsim Verisi Bulundu.\n\n${liste.slice(0, 10).join("\n\n")}`)
.setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({ dynamic: true })})
var msg = await message.reply({ embeds: [dark], components: [row]});
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
collector.on("collect", async (button) => {
if(button.customId === "sonra") {
await button.deferUpdate();
if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return button.followUp({ content: "Bu sayfada veri bulunmamakta.", ephemeral: true });
page += 1;
let isimVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n\n");
msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} ${member} Kullanıcısının Toplamda **${isim.length}** İsim Verisi Bulundu.\n\n${isimVeri}`).setTimestamp().setAuthor({ name: `${message.guild.name}`, iconURL: member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({ dynamic: true })})]});
}
if(button.customId === "önce") {
await button.deferUpdate();
if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return button.followUp({ content: "Bu sayfada veri bulunmamakta.", ephemeral: true });
page -= 1;
let isimVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n\n");
msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} ${member} Kullanıcısının Toplamda **${isim.length}** İsim Verisi Bulundu.\n\n${isimVeri}`).setTimestamp().setAuthor({ name: `${message.guild.name}`, iconURL: member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({ dynamic: true })})]});
}
if(button.customId === "kapat") {
await button.deferUpdate();
msg.delete().catch(e => {});
}
})
collector.on("end", async () => {
if(msg) await msg.edit({ components: [] });
})
}
}