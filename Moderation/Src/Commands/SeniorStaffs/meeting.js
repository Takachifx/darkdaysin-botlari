const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require("discord.js");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
aliases: ["toplantı", "meeting", "toplanti", "meeting"],
name: "meeting",
help: "toplantı",
category: "ustyetkili",
cooldown: 10
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["toplantı", "meeting", "toplanti", "meeting"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.ownerRoles.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır." }).sil(15);
}
if(!message.member.voice.channel) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bir Ses Kanalında Olmanız Gerekmektedir." }).sil(15);
}
let enAltYetkiliRolü = message.guild.roles.cache.get(ayar.registerPerms);
let yetkililer = message.guild.members.cache.filter(uye => !uye.user.bot && uye.roles.highest.position >= enAltYetkiliRolü.position && !uye.voice.channel)
if (yetkililer.length == 0) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Seste Olmayan Yetkili Bulunmamaktadır." }).sil(15);
}

const row = new Discord.ActionRowBuilder()
.addComponents([
new Discord.ButtonBuilder()
.setCustomId("meeting")
.setStyle(Discord.ButtonStyle.Success)
.setLabel("Toplantı Başlat")
.setEmoji("📝"),
new Discord.ButtonBuilder()
.setCustomId("endmeeting")
.setStyle(Discord.ButtonStyle.Danger)
.setLabel("Toplantı Bitir")
.setEmoji("🔚"),
new Discord.ButtonBuilder()
.setCustomId("staffsend")
.setStyle(Discord.ButtonStyle.Primary)
.setLabel("Yetkilileri Bilgilendir")
.setEmoji("📩"
)]);
var msg = await message.reply({embeds: [embed.setDescription(`${message.member} Toplantıyı Başlatmak Ve Bitirmek İçin Butonları Kullanınız.`)], components: [row]})
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })
collector.on("collect", async (button) => {
if(button.customId === "meeting") {
await button.deferUpdate();
row.components[0].setDisabled(true)
row.components[1].setDisabled(true)
row.components[2].setDisabled(true)
await msg.edit({components: [row]}).catch(e => {});
let voiceuser = message.guild.members.cache.filter(member => !member.roles.cache.has(ayar.mazeretPerms) && member.roles.highest.position >= enAltYetkiliRolü.position && member.voice.channel && !member.user.bot)
let nvoiceuser = message.guild.members.cache.filter(member => !member.roles.cache.has(ayar.mazeretPerms) && member.roles.highest.position >= enAltYetkiliRolü.position && !member.voice.channel && !member.user.bot)
let mazeret = message.guild.roles.cache.get(ayar.mazeretPerms).members.size;
await msg.edit({ embeds: [embed.setDescription(`**Katıldı Rolü Verilecek Kişi Sayısı: ${await client.rakam(voiceuser.size)}**\n**Katıldı Rolü Alınacak Kişi Sayısı: ${await client.rakam(nvoiceuser.size)}**\n**Mazeretli Kişi Sayısı: ${await client.rakam(mazeret)}**\n\n**Toplantıda Olmayan ${await client.rakam(nvoiceuser.size)} Kişiye ${message.guild.roles.cache.get(ayar.katilmadiPerms) ? message.guild.roles.cache.get(ayar.katilmadiPerms).toString() : "Ayarlanmamış."} Rolü Veriliyor**\n**Toplantıda Olan ${await client.rakam(voiceuser.size)} Kişiye ${message.guild.roles.cache.get(ayar.katildiPerms) ? message.guild.roles.cache.get(ayar.katildiPerms).toString() : "Ayarlanmamış."} Rolü Veriliyor.**`)] })
await voiceuser.array().forEach((dark, index) => {
setTimeout(async () => {
await dark.addRoles(ayar.katildiPerms).catch(e => {})
if(dark.roles.cache.has(ayar.katilmadiPerms)) await dark.removeRoles(ayar.katilmadiPerms).catch(e => {})
if(dark.roles.cache.has(ayar.mazeretPerms)) await dark.removeRoles(ayar.mazeretPerms).catch(e => {})
}, 2 * 1000)
})
await nvoiceuser.array().forEach((dark, index) => {
setTimeout(async () => {
await dark.addRoles(ayar.katilmadiPerms).catch(e => {})
if(dark.roles.cache.has(ayar.katildiPerms)) await dark.removeRoles(ayar.katildiPerms).catch(e => {})
}, 2 * 1000)
})
} else if(button.customId === "endmeeting") {
await button.deferUpdate();
row.components[0].setDisabled(true)
row.components[1].setDisabled(true)
row.components[2].setDisabled(true)
await msg.edit({components: [row]}).catch(e => {});
let publicRooms = message.guild.channels.cache.filter(c => ayar.publicParents.some(a => a == c.parentId) && c.type === Discord.ChannelType.GuildVoice);
await message.member.voice.channel.members.array().forEach((m, index) => {
setTimeout(async() => {
if (m.voice.channelId !== message.member.voice.channelId) return;
await m.voice.setChannel(publicRooms.random()).catch(e => {});
}, index*1000);
});
await msg.edit({ embeds: [embed.setDescription(`**Toplantı Bitirildi. Odadaki Üyeler Public Odalara Taşınıyor.**`)]})
} else if(button.customId === "staffsend") {
await button.deferUpdate();
row.components[0].setDisabled(true)
row.components[1].setDisabled(true)
row.components[2].setDisabled(true)
await msg.edit({components: [row]}).catch(e => {});
let nnvoiceuser = message.guild.members.cache.filter(member => !member.roles.cache.has(ayar.mazeretPerms) && member.roles.highest.position >= enAltYetkiliRolü.position && !member.voice.channel && !member.user.bot)
if(nnvoiceuser.length == 0) return button.reply({ embeds: [embed.setDescription(`**Sunucudaki Tüm Yetkililer Seste Bulunuyor!**`)] }).sil(15);
let mesaj = await message.channel.send({ embeds: [embed.setDescription(`**Seste Olmayan ${await client.rakam(nnvoiceuser.size)} Kişiye DM Üzerinden Duyuru Geçiliyor!** *Lütfen Biraz Bekleyiniz.*`)] });
nnvoiceuser.forEach((yetkili, index) => {
setTimeout(() => {
yetkili.send({content: message.guild.name+' Sunucusunda toplantı başladı. Yetkili olduğun halde toplantıda değilsin. Eğer toplantıya girmezsen yetkilerin alınacaktır.'}).then(x => mesaj.edit({embeds: [embed.setDescription(`${yetkili} yetkilisine özelden mesaj atıldı!`)]})).catch(err => message.channel.send(`${yetkili}, Sunucusunda toplantı başladı. Yetkili olduğun halde toplantıda değilsin. Eğer toplantıya girmezsen yetkilerin alınacaktır.`).then(x => mesaj.edit({embeds: [embed.setDescription(`${yetkili} yetkilisine özelden mesaj atılamadığı için kanalda etiketlendi!`)]})));
}, 2*1000);
});
}
})
}
}