const settings = require("../../../../Src/Settings/Settings.json")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Discord = require("discord.js")
const Menu = require("../../../../Src/Schemas/Menüs")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const setups = require("../../../../Src/Schemas/Setup")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["menü"],
name: "menü",
help: "menü",
category: "ustyetkili"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["menü"];
const Datas = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Datas?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.ownerRoles.some(role => message.member.roles.cache.has(role)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır." }).sil(15);
}
let Data = await Menu.find({})
let comp;
let defa = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder()
.setCustomId("ekle")
.setLabel("Ekleme & Düzenleme")
.setStyle(Discord.ButtonStyle.Success))
if(Data && Data.length >= 1) {
let listele = []
Data.forEach(async (x) => {listele.push({label: x.İsim, description: `${moment(Date.now()).format("LLL")} ${message.guild.members.cache.get(x.Oluşturan) ? `- ${message.guild.members.cache.get(x.Oluşturan).user.username}` : ""}`, value: x.İsim})
})
comp = [defa, new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("sil")
.setPlaceholder("Aşağıdan silmek istediğiniz menüyü seçin!")
.addOptions(listele),),new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("kur")
.setPlaceholder("Aşağıdan oluşturmak istediğiniz menüyü seçin!")
.addOptions(listele) )]} else {comp = [defa]}
message.channel.send({embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.kalp)} **Merhaba!** ${message.member.user.tag} (${message.member}),
${message.guild.name} sunucusuna ait olan rol seçim menüsü listesi aşağıda mevcut ekleme, düzenleme ve kaldırma işlemini buradan yapabilirsiniz.
**Kullanım Koşulları!**
\` ❯ \` Sunucuda bir rol seçim menüsü oluşturmak istiyorsan aşağıda ki düğme yardımıyla ekleyebilirsin.
\` ❯ \` Ekleme işlemleri bittikten sonra anlık olarak kurulum işlemini tekrar bu panel üzerinden yapabilirsin.
\` ❯ \` Düzenleme işlemi yaparken tekrardan aşağıda ki düğmeye basarak, düzenlenmesini istediğiniz rol seçim menüsü ismini girerek tekrardan ayarlarını güncelleyebilirsiniz.`)], components: comp}).then(async (msg) => {
const filter = i => i.user.id == message.member.id
const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 120000 })
collector.on("collect", async (i) => {
if(i.customId == "sil") {
await Menu.deleteOne({İsim: i.values})
i.reply({content: `Başarıyla **${i.values}** isimli rol seçim menüsü silindi.`, ephemeral: true})
msg.delete().catch(err => {})
}
if(i.customId == "kur") {
let kurulcak = await Menu.findOne({İsim: i.values})
if(kurulcak) {
let Opt = [];
kurulcak.Roller.forEach((r, i) => {
const role = message.guild.roles.cache.get(r);
if (role) {
Opt.push({
label: role.name,
value: role.id,
description: `${role.name} Rolünü Almak İçin Tıkla.`,
emoji: "1238493890714013717",
});
} else {
Opt.push({
label: `null${i+1}`,
value: `null${i+1}`,
});
}
});
Opt.push({
label: "Rol İstemiyorum",
value: "rolsil",
emoji: "1194083968803414107"
});
let listMenu = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId(kurulcak.Secret)
.setPlaceholder(kurulcak.İsim)
.addOptions(Opt),)
message.channel.send({content: `${kurulcak.Yazı}`, components: [listMenu]}).then(async (oluşturuldu) => {
var filter = i => i.customId == kurulcak.Secret
let collector = oluşturuldu.createMessageComponentCollector({filter: filter})
collector.on('collect', async (i) => {
const member = await client.guilds.cache.get(settings.Moderation.guildID).members.fetch(i.user.id)
if (!member) return;
let Data = await Menu.findOne({Secret: kurulcak.Secret})
let customMap = new Map()
if(!Data) return;
if(Data && !Data.Roller) return;
Data.Roller.forEach(r => customMap.set(r, r))
let roles = Data.Roller
var role = []
for (let index = 0; index < i.values.length; index++) {
let ids = i.values[index]
let den = customMap.get(ids)
role.push(den)
}
if (i.values[0] === "rolsil") {
await member.removeRoles(roles).catch(err => {})
i.reply({ content: `${message.guild.emojiGöster(emojis.kalp)} Başarıyla **${message.guild.roles.cache.get(roles[0]) ? message.guild.roles.cache.get(roles[0]).name : "Rol"}** Rolü Alındı.`, ephemeral: true})
} else {
if (!i.values.length) {
await member.removeRoles(roles).catch(err => {})
i.reply({ content: `${message.guild.emojiGöster(emojis.kalp)} Başarıyla **${message.guild.roles.cache.get(roles[0]) ? message.guild.roles.cache.get(roles[0]).name : "Rol"}** Rolü Alındı.`, ephemeral: true})
} else {
await member.removeRoles(roles).catch(err => {})
await member.addRoles(role).catch(err => {})
i.reply({ content: `${message.guild.emojiGöster(emojis.kalp)} Başarıyla **${message.guild.roles.cache.get(role[0]) ? message.guild.roles.cache.get(role[0]).name : "Rol"}** Rolü Verildi.`, ephemeral: true})
}
}
})
})
i.reply({content: `${message.guild.emojiGöster(emojis.kalp)} Başarıyla **${kurulcak.İsim}** İsimli Rol Seçim Menüsü Kuruldu.`, ephemeral: true})
msg.delete().catch(err => {})
}
}
if(i.customId == "ekle") {
msg.delete().catch(err => {})
message.channel.send({content: `${message.guild.emojiGöster(emojis.kalp)} **${message.guild.name}**
Yeni bir rol seçim menüsü oluşturuluyor...`, embeds: [new Discord.EmbedBuilder().setDescription(`
Rol Seçim Menüsü: \` Ayarlanmadı! \`
Açıklama: \` Ayarlanmadı! \`
Roller: \` Ayarlanmadı! \`
Yeni oluşturulmakta olan rol seçim menünüze bir isim belirleyin.`)]}).then(async (x) => {
let rolSeçim = {
İsim: String,
Roller: Array,
Yazı: String,
Date: Date.now(),
Secret: oluştur(10),
Oluşturan: message.member.id,
}
var filt = m => m.author.id == message.member.id
let collector = x.channel.createMessageCollector({filter: filt, time: 60000, max: 1, errors: ["time"]})
collector.on("collect", async (m) => {
let mesaj = m.content
if(mesaj == "iptal" || mesaj == "ıptal") {
return x.edit({content: null, embeds: [new Discord.EmbedBuilder().setDescription(`Başarıyla rol seçim menü oluşturma aracı iptal edildi.`)]}).sil(15)
}
rolSeçim.İsim = mesaj
message.channel.send({content: `${message.guild.emojiGöster(emojis.kalp)} **${message.guild.name}**
Yeni bir rol seçim menüsü oluşturuluyor...`, embeds: [new Discord.EmbedBuilder().setDescription(`
Rol Seçim Menüsü: \`${rolSeçim.İsim}\`
Açıklama: \` Ayarlanmadı! \`
Roller: \` Ayarlanmadı! \`
Yeni oluşturulmakta olan rol seçim menünüze bir açıklama belirtin. Örn: \`Aşağıda ki rollerden istediğiniz rolü alabilirsiniz!\``)]})
.then(async (c) => {
var filt = m => m.author.id == message.member.id
let collector = c.channel.createMessageCollector({filter: filt, time: 60000, max: 1, errors: ["time"]})
collector.on("collect", async (m) => {
let mesaj = m.content
if(mesaj == "iptal" || mesaj == "ıptal") {
return c.edit({content: null, embeds: [new Discord.EmbedBuilder().setDescription(`Başarıyla rol seçim menü oluşturma aracı iptal edildi.`)]}).sil(15)
}
rolSeçim.Yazı = m.content
c.delete().catch(err => {})
message.channel.send({content: `${message.guild.emojiGöster(emojis.kalp)} **${message.guild.name}**
Yeni bir rol seçim menüsü oluşturuluyor...`, embeds: [new Discord.EmbedBuilder().setDescription(`
Rol Seçim Menüsü: \`${rolSeçim.İsim}\`
Açıklama: \`${rolSeçim.Yazı}\`
Roller: \` Ayarlanmadı! \`
Yeni oluşturulmakta olan rol seçim menünüzde listelenecek rolleri belirtin.`).setFooter({ text:`En az 3 tane, en fazla 25 tane rol ekleyebilirsiniz.`})]}).then(async (v) => {
var filt = m => m.author.id == message.member.id
let collector = msg.channel.createMessageCollector({filter: filt, time: 60000, max: 1, errors: ["time"]})
collector.on("collect", async (m) => {
let mesaj = m.content
if(mesaj == "iptal" || mesaj == "ıptal") {
return v.edit({content: null, embeds: [new Discord.EmbedBuilder().setDescription(`Başarıyla rol seçim menü oluşturma aracı iptal edildi.`)]}).sil(16)
}
v.delete().catch(err => {})
let rolPushing = []
if(m.mentions.roles.size >= 1) {
rolPushing = m.mentions.roles.map(role => role.id)
} else {
let argss = m.content.split(" ");
argss = argss.splice(0)
let rolVerAbime = argss.filter(role => message.guild.roles.cache.some(role2 => role == role2.id))
rolPushing.push(...rolVerAbime)
}
rolSeçim.Roller = rolPushing
message.channel.send({embeds: [new Discord.EmbedBuilder().setDescription(`
Rol Seçim Menüsü: \`${rolSeçim.İsim}\`
Açıklama: \`${rolSeçim.Yazı}\`
Roller: ${rolSeçim.Roller.map(x => message.guild.roles.cache.get(x)).join(", ")}

${message.guild.emojiGöster(emojis.kalp)} Başarıyla **${rolSeçim.İsim}** isimli rol seçim menüsü <t:${Math.floor(Date.now() / 1000)}> tarihinde oluşturuldu.`)]}).then(async (oluşturuldu) => {
let secretKodu = oluştur(10)
await Menu.updateOne({İsim: rolSeçim.İsim}, { $set: { "Yazı": rolSeçim.Yazı, "Roller": rolSeçim.Roller, "Date": Date.now(), Secret: secretKodu, "Oluşturan": message.member.id,  }}, {upsert: true})
})})})})})
x.delete().catch(err => {})
})})}})})
}
}
function oluştur(length) {
var result           = '';
var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var charactersLength = characters.length;
for ( var i = 0; i < length; i++ ) {
result += characters.charAt(Math.floor(Math.random() * charactersLength));
}
return result;
}
