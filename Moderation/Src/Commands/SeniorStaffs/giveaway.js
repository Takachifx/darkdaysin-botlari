const { ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const giveaway = require('../../../../Src/Schemas/Giveaways')
const moment = require("moment");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require('../../../../Src/Schemas/Setup')
const settings = require("../../../../Src/Settings/Settings.json")
const ms = require("ms")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["giveaway", "gstart", "çekiliş", "cekilis"],
name: "gcreate",
help: "çekiliş 10m 1 Nitro",
category: "ustyetkili"
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayars = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayars) return;
const Name = ["giveaway", "gstart", "çekiliş", "cekilis"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayars.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayars.ownerRoles.some(x => message.member.roles.cache.has(x)) && !ayars.roleAddRoles.some(s => message.member.roles.cache.has(s))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır." }).sil(15);
}
let zaman = args[0]
let kazanan = args[1]
let oduls = args.slice(2).join(" ");
let arr = [];
if (!zaman) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `Lütfen komutu doğru kullan! ${prefix}çekiliş 10m 1 Nitro`}).sil(15)
}
if (!kazanan) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `Lütfen komutu doğru kullan! ${prefix}çekiliş 10m 1 Nitro`}).sil(15)
}
if (isNaN(kazanan)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `Lütfen komutu doğru kullan! ${prefix}çekiliş 10m 1 Nitro` }).sil(15)
}
if (!oduls) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `komutu doğru kullan! ${prefix}.çekiliş 10m 1 Nitro` }).sil(15)
}
let sure = ms(zaman)
let kalan = Date.now() + sure
if (message) message.delete().catch(e => {})
let gcreate = new ButtonBuilder()
.setCustomId("katil")
.setStyle(ButtonStyle.Secondary)
.setEmoji("1141806054611619861")
const row = new ActionRowBuilder()
.addComponents([gcreate]);
let msg = await message.channel.send({ embeds: [new EmbedBuilder().setTitle(`🎉 ${oduls} 🎉`).setFooter({ text : `Kazanacak kişi sayısı: ${kazanan} | Bitiş Süresi: ${moment(kalan).format("LLL")}` }).setDescription(`Katılmak için 🎉 tıklayın!\nSüre: <t:${Math.floor(kalan / 1000)}:R> (<t:${Math.floor(kalan / 1000)}:f>)\nBaşlatan: ${message.author}`)], components: [row]})
await giveaway.updateOne({ messageID: msg.id }, { $set: { odul: oduls } }, { upsert: true })
setTimeout(() => {
if (arr.length <= kazanan) {
if (msg) msg.edit({embeds: [new EmbedBuilder().setTitle(`🎉 ${oduls} 🎉`).setDescription(`🎉 Çekilişe katılım olmadığından çekiliş iptal edildi!`)], components: []})
return; }
let kazananSayisi = Math.min(kazanan, arr.length);
let kazananlar = [];
for(let i = 0; i < kazananSayisi; i++) {
let index = Math.floor(Math.random() * arr.length);
kazananlar.push(arr[index]);
arr.splice(index, 1);
}
kazananlar.forEach(kazanan => {
message.channel.send({ content: `🎉 ${message.guild.members.cache.get(kazanan) ? message.guild.members.cache.get(kazanan) : client.users.cache.get(kazanan).username} tebrikler! **${oduls}** kazandın.` });
});
if (msg) msg.edit({embeds: [new EmbedBuilder().setTitle(`🎉 ${oduls} 🎉`).setFooter({ text : `Katılımcı Sayısı: ${arr.length + kazananlar.length}` }).setDescription(`🎉 Çekiliş Sonuçlandı!\nÇekilişi Başlatan: ${message.author}\n\nKazanan Katılımcılar: ${kazananlar.map(k => `${message.guild.members.cache.get(k) ? message.guild.members.cache.get(k) : client.users.cache.get(k).username}`).join(", ")}`)], components: []})
}, sure)
let collector = await msg.createMessageComponentCollector({})
collector.on("collect", async (button) => {
button.deferUpdate(true)
if (button.customId == "katil") {
let tikdata = await giveaway.findOne({ messageID: button.message.id })
if (tikdata?.katilan.includes(button.member.id)) return button.reply({ content: `Zaten Çekilişe Katıldın!`, ephemeral: true })
await giveaway.updateOne({ messageID: msg.id }, { $push: { katilan: button.member.id } }, { upsert: true })
arr.push(button.member.id)
let kuran = tikdata?.katilan.length + 1 || 1
gcreate.setLabel(`${kuran}`)
if (msg) msg.edit({embeds: [new EmbedBuilder().setTitle(`🎉 ${oduls} 🎉`).setFooter({ text : `Kazanacak kişi sayısı: ${kazanan} | Bitiş Süresi: ${moment(kalan).format("LLL")}` }).setDescription(`Katılmak için 🎉 tıklayın!\nSüre: <t:${Math.floor(kalan / 1000)}:R> (<t:${Math.floor(kalan / 1000)}:f>)\nBaşlatan: ${message.author}\n\nKatılımcı Sayısı: ${kuran}\nSon Katılan Üye: ${button.member}`)], components: [row]})
}
})
}
}