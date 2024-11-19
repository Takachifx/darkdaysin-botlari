const settings = require('../../../../Src/Settings/Settings.json');
const Discord = require('discord.js');
const emojis = require('../../../../Src/Settings/emojiName.json');
const RoleLogs = require('../../../../Src/Schemas/RoleLogs');
const setups = require('../../../../Src/Schemas/Setup');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');
const CommandPermissions = require('../../../../Src/Schemas/CommandPermissions');
module.exports = {
conf: {
name: 'rol-log',
aliases: ['rol-log', 'rollog'],
help: 'rol-log @Darkdays/ID',
category: 'Yetkili'
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({ guildID: message.guild.id });
if (!ayar) return;
const Name = ["rollog", "rol-log", "Rol-Log", "Rollog"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.staffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !settings.Moderation.owners.includes(message.author.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content: "Bu komutu kullanmak için yeterli yetkiniz bulunmamakta."}).sil(15)
return }
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
const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
const Veri = await RoleLogs.findOne({ user: Member.id }).sort({ tarih: -1 });
if (!Veri) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Belirttiğiniz kişinin rol verileri bulunamadı.`)]}).sil(15)
}
let page = 1;
let rol = Veri.roller.sort((a, b) => b.tarih - a.tarih)
await message.react(message.guild.emojiGöster(emojis.yes))
let liste = rol.map((x, index) => `\` ${index+1}. \` ${x.state == "Ekleme" ? `\`( ✅ )\`` : `\`( ❌ )\`` } **Yetkili: ${message.guild.members.cache.get(x.mod) ? message.guild.members.cache.get(x.mod) : client.users.cache.get(x.mod).username} Rol: ${message.guild.roles.cache.get(x.rol) ? message.guild.roles.cache.get(x.rol) : "Bulunamadı"} Tarih: <t:${Math.floor(x.tarih / 1000)}:R>**`)
var msg = await message.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} ${Member} Kullanıcısının Toplamda **${rol.length}** Rol Verisi Bulundu.\n\n${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n\n')}`).setTimestamp().setAuthor({ name: `${Member.user.displayName}`, iconURL: Member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({dynamic: true})}).setThumbnail(Member.user.avatarURL({ dynamic: true }))], components: [row]});
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
collector.on("collect", async (button) => {
await button.deferUpdate();
if(button.customId === "sonra") {
if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return button.followUp({ content: "Bu sayfada veri bulunmamakta.", ephemeral: true });
page += 1;
let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n\n");
msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} ${Member} Kullanıcısının Toplamda **${rol.length}** Rol Verisi Bulundu.\n\n${rollogVeri}`).setTimestamp().setAuthor({ name: `${Member.user.displayName}`, iconURL: Member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({dynamic: true})}).setThumbnail(Member.user.avatarURL({ dynamic: true }))]});
}
if(button.customId === "önce") {
if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return button.followUp({ content: "Bu sayfada veri bulunmamakta.", ephemeral: true });
page -= 1;
let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n\n");
msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} ${Member} Kullanıcısının Toplamda **${rol.length}** Rol Verisi Bulundu.\n\n${rollogVeri}`).setTimestamp().setAuthor({ name: `${Member.user.displayName}`, iconURL: Member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`, iconURL: message.guild.iconURL({dynamic: true})}).setThumbnail(Member.user.avatarURL({ dynamic: true }))]});
}
if(button.customId === "kapat") {
await msg.delete().catch(e => {});
}
})
collector.on("end", async () => {
await msg.edit({ components: [] });
})
}
}