const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
const PrivateCommands = require("../../../../Src/Schemas/PrivateCommands")
const setups = require("../../../../Src/Schemas/Setup")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["özel-komut", "özelkomut", "private-command", "komut"],
name: "özel-komut",
help: "komut ekle/sil/liste/bilgi",
category: "ustyetkili"
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["özel-komut", "özelkomut", "private-command", "komut"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır.`}).sil(15)
return }
if (!args[0]) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir İşlem Belirtin. \`ekle/sil/liste/bilgi\``}).sil(15)
return }
if (args[0] === "oluştur" || args[0] === "ekle") {
let komutAd = args[1];
if (!komutAd) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir Komut Adı Belirtin.`}).sil(15)
return }
let talents = await PrivateCommands.findOne({ guildID: message.guild.id, komutAd: komutAd });
if (talents) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bu İsimde Bir Komut Zaten Bulunmakta.`}).sil(15)
return }
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.RoleSelectMenuBuilder().setCustomId("permRoleSelectMenu").setMinValues(1).setMaxValues(20))
const msg = await message.reply({content: 'Komutu kullanma izni verilcek rolleri aşağıda ki menüden seçiniz.', components: [row]})
let filter1 = (i) => i.user.id === message.member.id
let collector = await msg.createMessageComponentCollector({ filter: filter1, errors: ["time"], time: 35000 })
collector.on("collect", async (interaction) => {
await interaction.deferUpdate()
if (interaction.customId == "permRoleSelectMenu") {
var role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index];
if (message.member.roles.highest.position <= message.guild.roles.cache.get(ids).position) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg.edit({ content: `Kendinle Aynı Yetki Ya da Daha Üst Yetkiyi Seçemezsin.`, components: []}).sil(15);
}
role.push(ids);
}
await msg.delete().catch(e => {})
const row2 = new Discord.ActionRowBuilder().addComponents(
new Discord.RoleSelectMenuBuilder().setCustomId("permRolesSelectMenu").setMinValues(1).setMaxValues(20))
const msg2 = await message.reply({ content: `Verilecek rolü seçiniz.`, components: [row2] })
let filter2 = (i) => i.user.id == message.member.id
const collector2 = msg2.createMessageComponentCollector({ filter: filter2, errors: ["time"], time: 35000 })
collector2.on("collect", async i => {
await i.deferUpdate()
if (i.customId == "permRolesSelectMenu") {
var role2 = []
for (let index = 0; index < i.values.length; index++) {
let ids = i.values[index]
if (message.member.roles.highest.position <= message.guild.roles.cache.get(ids).position) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg2.edit({ content: `Kendinle Aynı Yetki Ya da Daha Üst Yetkiyi Seçemezsin.`, components: []}).sil(15);
}
role2.push(ids)
}
await msg2.delete().catch(e => {})
await new PrivateCommands({ guildID: message.guild.id, komutAd: komutAd, YetkiliRol: role.map(x => x), VerilecekRol: role2.map(x => x), createdAt: Date.now()}).save();
await message.react(message.guild.emojiGöster(emojis.yes))
return await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} Başarıyla **${komutAd}** Komutunu Oluşturdun.

**Komut Adı: ${settings.Moderation.prefix}${komutAd}
Yetkili Rol: ${role.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x).join(", ")}
Verilecek Rol: ${role2.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x)}
Oluşturulma Tarihi:** <t:${String(Date.now()).slice(0, 10)}>`)]})
}
})
}
})
} else if (args[0] === "liste" || args[0] === "list" || args[0] === "incele") {
let data = await PrivateCommands.find({});
if (!data) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Herhangi Bir Komut Bulunamadı.`}).sil(15)
return }
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} **${message.guild.name}** Sunucusundaki (**${data.length}**) Özel Komut Aşağıda Belirtilmiştir.

${data.map((x, i) => `
\` ${i+1}. \` **Komut Adı: ${settings.Moderation.prefix}${x.komutAd}
Yetkili Rol: ${x.YetkiliRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x).join(", ")}
Verilecek Rol: ${x.VerilecekRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x)}
Oluşturulma Tarihi:** <t:${String(x.createdAt).slice(0, 10)}>`).join("\n\n") || "```yml\nVeri Bulunamadı.\n```"}`)]})
} else if (args[0] === "sil" || args[0] === "kaldır") {
let data = await PrivateCommands.findOne({ guildID: message.guild.id, komutAd: args[1] })
if (!data) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Böyle Bir Komut Bulunamadı.`}).sil(15)
return }
await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} Başarıyla \`${args[1]}\` Adlı Komut Silindi.

**Komut Adı: ${settings.Moderation.prefix}${data.komutAd}
Yetkili Rol: ${data.YetkiliRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x).join(", ")}
Verilecek Rol: ${data.VerilecekRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x)}
Oluşturulma Tarihi:** <t:${String(data.createdAt).slice(0, 10)}>`)]})
await PrivateCommands.deleteOne({ guildID: message.guild.id, komutAd: args[1] })
} else if(args[0] === "bilgi" || args[0] === "info") {
let komutAd = args[1];
if (!komutAd) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir Komut Adı Belirtin.`}).sil(15)
return }
let data = await PrivateCommands.findOne({ guildID: message.guild.id, komutAd: komutAd });
if (!data) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({content: `Böyle Bir Komut Bulunamadı.`}).sil(15)
}
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.RoleSelectMenuBuilder().setCustomId("permRolesSelectMenu").setPlaceholder("Yetkili Rol Ekle").setMinValues(1).setMaxValues(20))
const row2 = new Discord.ActionRowBuilder().addComponents(
new Discord.RoleSelectMenuBuilder().setCustomId("permRolesSelectMenu2").setPlaceholder("Yetkili Rol Kaldır").setMinValues(1).setMaxValues(20))
const row3 = new Discord.ActionRowBuilder().addComponents(
new Discord.RoleSelectMenuBuilder().setCustomId("permRolesSelectMenu3").setPlaceholder("Verilecek Rol Ekle").setMinValues(1).setMaxValues(20))
const row4 = new Discord.ActionRowBuilder().addComponents(
new Discord.RoleSelectMenuBuilder().setCustomId("permRolesSelectMenu4").setPlaceholder("Verilecek Rol Kaldır").setMinValues(1).setMaxValues(20))
if(data.VerilecekRol.length === 1) {
row4.components[0].setDisabled(true)
}
if(data.YetkiliRol.length === 1) {
row2.components[0].setDisabled(true)
}
const msg = await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} **${komutAd}** Komutunun Bilgileri Aşağıda Belirtilmiştir.

**Komut Adı: ${settings.Moderation.prefix}${komutAd}
Yetkili Rol: ${data.YetkiliRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x).join(", ")}
Verilecek Rol: ${data.VerilecekRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x)}
Oluşturulma Tarihi:** <t:${String(data.createdAt).slice(0, 10)}>`)], components: [row, row2, row3, row4]})
let filter = (i) => i.user.id === message.author.id
const collector = msg.createMessageComponentCollector({ filter, time: 60000 })
collector.on("collect", async (interaction) => {
if(interaction.customId === "permRolesSelectMenu") {
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index];
if (message.member.roles.highest.position <= message.guild.roles.cache.get(ids).position) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg.edit({ content: `Kendinle Aynı Yetki Ya da Daha Üst Yetkiyi Seçemezsin.`, components: []}).sil(15);
}
if(data.YetkiliRol.includes(ids)) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg.edit({embeds: [embed.setDescription(`${message.member} ${message.guild.roles.cache.get(ids)} Rolü Zaten Yetkili Rol Listesinde Bulunmaktadır.`)], components: []}).sil(15);
}
await PrivateCommands.updateOne({ guildID: message.guild.id, komutAd: komutAd }, { $push: { YetkiliRol: ids}, }, { upsert: true })
}
await interaction.reply({ content: `Başarıyla Yetkili Rol Eklendi.`, ephemeral: true })
const newData = await PrivateCommands.findOne({ guildID: message.guild.id, komutAd: komutAd });
if(newData.YetkiliRol.length >= 1) {
row2.components[0].setDisabled(false)
}
await msg.edit({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} **${komutAd}** Komutunun Bilgileri Aşağıda Belirtilmiştir.

**Komut Adı: ${settings.Moderation.prefix}${komutAd}
Yetkili Rol: ${newData.YetkiliRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x).join(", ")}
Verilecek Rol: ${newData.VerilecekRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x)}
Oluşturulma Tarihi:** <t:${String(newData.createdAt).slice(0, 10)}>`)], components: [row, row2, row3, row4]})
}
if(interaction.customId === "permRolesSelectMenu2") {
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index];
if (message.member.roles.highest.position <= message.guild.roles.cache.get(ids).position) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg.edit({ content: `Kendinle Aynı Yetki Ya da Daha Üst Yetkiyi Seçemezsin.`, components: []}).sil(15);
}
if(!data.YetkiliRol.includes(ids)) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg.edit({embeds: [embed.setDescription(`${message.member} ${message.guild.roles.cache.get(ids)} Rolü Zaten Yetkili Rol Listesinde Bulunmamaktadır.`)], components: []}).sil(15);
}
await PrivateCommands.updateOne({ guildID: message.guild.id, komutAd: komutAd }, { $pull: { YetkiliRol: ids}, }, { upsert: true })
}
await interaction.reply({ content: `Başarıyla Yetkili Rol Kaldırıldı.`, ephemeral: true })
const newData = await PrivateCommands.findOne({ guildID: message.guild.id, komutAd: komutAd });
if(newData.YetkiliRol.length === 1) {
row2.components[0].setDisabled(true);
}
await msg.edit({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} **${komutAd}** Komutunun Bilgileri Aşağıda Belirtilmiştir.

**Komut Adı: ${settings.Moderation.prefix}${komutAd}
Yetkili Rol: ${newData.YetkiliRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x).join(", ")}
Verilecek Rol: ${newData.VerilecekRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x)}
Oluşturulma Tarihi:** <t:${String(newData.createdAt).slice(0, 10)}>`)], components: [row, row2, row3, row4]})
}
if(interaction.customId === "permRolesSelectMenu3") {
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index];
if (message.member.roles.highest.position <= message.guild.roles.cache.get(ids).position) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg.edit({ content: `Kendinle Aynı Yetki Ya da Daha Üst Yetkiyi Seçemezsin.`, components: []}).sil(15);
}
if(data.VerilecekRol.includes(ids)) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg.edit({embeds: [embed.setDescription(`${message.member} ${message.guild.roles.cache.get(ids)} Rolü Zaten Verilecek Rol Listesinde Bulunmaktadır.`)], components: []}).sil(15);
}
await PrivateCommands.updateOne({ guildID: message.guild.id, komutAd: komutAd }, { $push: { VerilecekRol: ids}, }, { upsert: true })
}
await interaction.reply({ content: `Başarıyla Verilecek Rol Eklendi.`, ephemeral: true })
const newData = await PrivateCommands.findOne({ guildID: message.guild.id, komutAd: komutAd });
if(newData.VerilecekRol.length >= 1) {
row4.components[0].setDisabled(false);
}
await msg.edit({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} **${komutAd}** Komutunun Bilgileri Aşağıda Belirtilmiştir.

**Komut Adı: ${settings.Moderation.prefix}${komutAd}
Yetkili Rol: ${newData.YetkiliRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x).join(", ")}
Verilecek Rol: ${newData.VerilecekRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x)}
Oluşturulma Tarihi:** <t:${String(newData.createdAt).slice(0, 10)}>`)], components: [row, row2, row3, row4]})
}
if(interaction.customId === "permRolesSelectMenu4") {
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index];
if (message.member.roles.highest.position <= message.guild.roles.cache.get(ids).position) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg.edit({ content: `Kendinle Aynı Yetki Ya da Daha Üst Yetkiyi Seçemezsin.`, components: []}).sil(15);
}
if(!data.VerilecekRol.includes(ids)) {
await message.react(message.guild.emojiGöster(emojis.no))
return await msg.edit({embeds: [embed.setDescription(`${message.member} ${message.guild.roles.cache.get(ids)} Rolü Zaten Verilecek Rol Listesinde Bulunmamaktadır.`)], components: []}).sil(15);
}
await PrivateCommands.updateOne({ guildID: message.guild.id, komutAd: komutAd }, { $pull: { VerilecekRol: ids}, }, { upsert: true })
}
await interaction.reply({ content: `Başarıyla Verilecek Rol Kaldırıldı.`, ephemeral: true })
const newData = await PrivateCommands.findOne({ guildID: message.guild.id, komutAd: komutAd });
if(newData.VerilecekRol.length === 1) {
row4.components[0].setDisabled(true);
}
await msg.edit({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} **${komutAd}** Komutunun Bilgileri Aşağıda Belirtilmiştir.

**Komut Adı: ${settings.Moderation.prefix}${komutAd}
Yetkili Rol: ${newData.YetkiliRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x).join(", ")}
Verilecek Rol: ${newData.VerilecekRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x)}
Oluşturulma Tarihi:** <t:${String(newData.createdAt).slice(0, 10)}>`)], components: [row, row2, row3, row4]})
}
})
}
}
}