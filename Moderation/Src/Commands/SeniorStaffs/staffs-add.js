const emojis = require("../../../../Src/Settings/emojiName.json");
const Users = require("../../../../Src/Schemas/UsersDB");
const setups = require("../../../../Src/Schemas/Setup");
const RankSystem = require("../../../../Src/Schemas/RankSystem");
const Puans = require("../../../../Src/Schemas/Puans");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["staff-add", "staffekle", "staff-ekle", "yetkiver", "yetki-ver", "ytver", "yt-ver", "yt"],
name: "staffs-add",
help: "yetkiver @Darkdays/ID",
category: "ustyetkili",
cooldown: 60,
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({ guildID: message.guild.id });
if(!ayar) return;
const Name = ["staff-add", "staffekle", "staff-ekle", "yetkiver", "yetki-ver", "ytver", "yt-ver", "yt"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.roleAddRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `Bu komutu kullanabilmek için yeterli yetkiye sahip olmalısın!` }).sil(15);
}
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Bir üye belirtmelisin." }).sil(15);
}
if(member.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Kendine yetki veremezsin." }).sil(15);
}
if(member.id === client.user.id) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Bana yetki veremezsin." }).sil(15);
}
if(member.id === message.guild.ownerId) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Sunucu sahibine yetki veremezsin." }).sil(15);
}
if(member.roles.highest.position >= message.member.roles.highest.position) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Belirttiğin üye senden üst/aynı pozisyonda." }).sil(15);
}
if(member.user.bot) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Botlara yetki veremezsin." }).sil(15);
}
if(ayar.staffRoles.some(role => member.roles.cache.has(role))) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Belirttiğin üye zaten yetkili." }).sil(15);
}
const data = await Users.findOne({_id: member.id});
if(data && data.Staff == true) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Belirttiğin üye zaten yetkili." }).sil(15);
}
const ranks = JSON.parse(await client.ranks(message.guild.id));
let Roller;
if(ranks) {
Roller = ranks.slice(0, 25).map(x => {
return { label: message.guild.roles.cache.get(x.roleID) ? message.guild.roles.cache.get(x.roleID).name : 'null', value: x.roleID ? x.roleID : 'null', emoji: '1176116618733043764'};
})
} else {
Roller = ayar.staffRoles.slice(0, 25).map(x => {
return { label: message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x).name : 'null', value: x ? x : 'null', emoji: '1176116618733043764'};
})
}
const selectMenu = new Discord.StringSelectMenuBuilder()
.setCustomId('staffadd')
.setPlaceholder(`${member.user.username} Kullanıcısına Vermek İstediğin Rolü Seç.`)
.addOptions(Roller);
const row = new Discord.ActionRowBuilder().addComponents(selectMenu);
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {})
const msj = await message.reply({ embeds: [embed.setDescription(`${message.member}, ${member} Kullanıcısına Vermek İstediğiniz Rolü Aşağıdan Seçiniz.`)], components: [row] });
const filter = (xd) => xd.user.id == message.author.id;
const collector = msj.createMessageComponentCollector({ filter });
collector.on("collect", async (button) => {
if(ranks) {
if(button.customId == 'staffadd') {
await button.deferUpdate();
collector.stop();
if(button.values[0] == 'null') return;
const control = ranks.find(x => x.roleID === button.values[0]);
if(!control) return msj.edit({ embeds: [embed.setDescription("Belirtilen rol veritabanında bulunamadı.")], components: [] }).sil(15);
if(message.member.roles.highest.position <= message.guild.roles.cache.get(control.roleID).position) {
return msj.edit({ embeds: [embed.setDescription("Kendinle aynı yetkide ya da daha üst rol veremezsin.")], components: [] }).sil(15);
} else {
if(member.roles.cache.has(control.roleID)) {
await member.removeRoles(control.roleID).catch(e => {})
await member.removeRoles(control.hammer).catch(e => {})
await msj.edit({ embeds: [embed.setDescription(`${member} Kullanıcısında ${message.guild.roles.cache.get(control.roleID) ? message.guild.roles.cache.get(control.roleID) : 'Bulunamadı.'} Rolü Olduğu için Kaldırıldı.`)], components: [] });
let kontrol = await Users.findOne({_id: member.id});
if(kontrol && kontrol.Staff == true) return await Users.updateOne({_id: member.id}, { $set: { Staff: false } }, { upsert: true }).exec();
const channel = await client.kanalBul("yetki-çek-log")
channel.send({embeds: [embed.setDescription(`${member.toString()} Üyesinin Yetkisi ${message.author} Tarafından <t:${String(Date.now()).slice(0, 10)}:R> Alındı!`)]})
} else if(!member.roles.cache.has(control.roleID)) {
await member.addRoles(control.roleID).catch(e => {})
await member.addRoles(control.hammer ? control.hammer : "").catch(e => {})
const rdb = await RankSystem.findOne({ guildID: message.guild.id });
if(!rdb) return;
await Users.updateOne({ _id: member.id }, { $set: { Staff: true, StaffGiveAdmin: message.author.id, Date: Date.now() } }, { upsert: true }).exec();
await Users.updateOne({ _id: message.author.id }, { $push: { Staffs: { id: member.id, Date: Date.now() } } }, { upsert: true }).exec();
if(rdb.RankSystem === true) {
await Puans.updateOne({ guildID: message.guild.id, userID: member.id }, { $set: { puan: control.puan } }, { upsert: true }).exec();
await Puans.updateOne({ guildID: message.guild.id, userID: member.id }, { $inc: { puan: 1 } }, { upsert: true }).exec();
await msj.edit({ embeds: [embed.setDescription(`${member} Kullanıcısında ${message.guild.roles.cache.get(control.roleID) ? message.guild.roles.cache.get(control.roleID) : 'Bulunamadı.'} Rolü Olmadığı için Verildi.`)], components: [] });
const channel = await client.kanalBul("yetki-log")
channel.send({embeds: [embed.setDescription(`${member.toString()} Üyesi ${message.author} Tarafından <t:${String(Date.now()).slice(0, 10)}:R> Yetkili Olarak Belirlendi!`)]})
}
}
}
}
} else {
await button.deferUpdate();
collector.stop();
if(button.values[0] == 'null') return;
const control = ayar.staffRoles.find(x => x === button.values[0]);
if(!control) return msj.edit({ embeds: [embed.setDescription("Belirtilen rol veritabanında bulunamadı.")], components: [] }).sil(15);
if(message.member.roles.highest.position <= message.guild.roles.cache.get(control).position) {
return msj.edit({ embeds: [embed.setDescription("Kendinle aynı yetkide ya da daha üst rol veremezsin.")], components: [] }).sil(15);
} else {
if(member.roles.cache.has(control)) {
await member.removeRoles(control).catch(e => {})
await msj.edit({ embeds: [embed.setDescription(`${member} Kullanıcısında ${message.guild.roles.cache.get(control) ? message.guild.roles.cache.get(control) : 'Bulunamadı.'} Rolü Olduğu için Kaldırıldı.`)], components: [] });
let kontrol = await Users.findOne({_id: member.id});
if(kontrol && kontrol.Staff == true) return await Users.updateOne({_id: member.id}, { $set: { Staff: false } }, { upsert: true }).exec();
const channel = await client.kanalBul("yetki-çek-log")
channel.send({embeds: [embed.setDescription(`${member.toString()} Üyesinin Yetkisi ${message.author} Tarafından <t:${String(Date.now()).slice(0, 10)}:R> Alındı!`)]})
} else if(!member.roles.cache.has(control)) {
await member.addRoles(control).catch(e => {})
await msj.edit({ embeds: [embed.setDescription(`${member} Kullanıcısında ${message.guild.roles.cache.get(control) ? message.guild.roles.cache.get(control) : 'Bulunamadı.'} Rolü Olmadığı için Verildi.`)], components: [] });
const channel = await client.kanalBul("yetki-log")
channel.send({embeds: [embed.setDescription(`${member.toString()} Üyesi ${message.author} Tarafından <t:${String(Date.now()).slice(0, 10)}:R> Yetkili Olarak Belirlendi!`)]})
await Users.updateOne({ _id: member.id }, { $set: { Staff: true, StaffGiveAdmin: message.author.id, Date: Date.now() } }, { upsert: true }).exec();
await Users.updateOne({ _id: message.author.id }, { $push: { Staffs: { id: member.id, Date: Date.now() } } }, { upsert: true }).exec();
}
}
}
})
collector.on("end", async () => {
await msj.edit({ components: [] });
})
}
}