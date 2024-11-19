const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Discord = require("discord.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = {
conf: {
aliases: ["zengin", "b", "booster", "boost"],
name: "booster",
help: "booster [İsim]",
category: "kullanici",
cooldown: 900
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
if(!message.member.roles.cache.has(ayar.boosterRoles)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Bu Komutu Kullanabilmek İçin Booster Rolüne Sahip Olmalısın!"}).sil(15)
return }
let uye = message.guild.members.cache.get(message.author.id);
let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
let yazilacakIsim;
if(!isim) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content:"Geçerli Bir İsim Belirtmelisin!"}).sil(15)
return }
const engel = ["!", "'", "?", "$", "#", "%", ",", ".", "*", "/", "-", "+", ":", ";", "<", ">", "(", ")", "&", "^", "£", "!", "{", "}", "[", "]", "=", "§", "��"];
if(engel.some(char => isim.toLowerCase().includes(char))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: 'İsmine Özel Karakter Koyamazsın.'}).sil(15)
return }
if(isim.length >= 18) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: 'İsmin 18 Karakterden Uzun Olamaz.'}).sil(15)
return }
yazilacakIsim = `${ayar.tagSystem == true ? uye.user.globalName && uye.user.globalName.includes(ayar.nameTag) ? ayar.nameTag : (ayar.defaultTag ? ayar.defaultTag : (ayar.nameTag || "")) : ''} ${isim}`;
await uye.setNickname(`${yazilacakIsim}`).catch(e => {});
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:`Başarıyla ismini **${yazilacakIsim}** olarak değiştirdim!`})
}
}