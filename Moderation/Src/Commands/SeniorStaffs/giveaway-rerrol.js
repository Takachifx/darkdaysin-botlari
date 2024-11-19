const { ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const giveaway = require('../../../../Src/Schemas/Giveaways')
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require('../../../../Src/Schemas/Setup')
const settings = require("../../../../Src/Settings/Settings.json")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["reroll", "greroll"],
name: "greroll",
help: "greroll [Mesaj ID]",
category: "ustyetkili"
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayars = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayars) return;
const Name = ["reroll", "greroll"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayars.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayars.ownerRoles.some(x => message.member.roles.cache.has(x)) && !ayars.roleAddRoles.some(s => message.member.roles.cache.has(s))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır." }).sil(15);
}
let mesaj = args[0]
if (isNaN(mesaj)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `Lütfen komutu doğru kullan! ${prefix}.greroll [Mesaj-ID]`}).sil(15)
}
if(!message.channel.messages.fetch(mesaj)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `Mesaj ID'sinde bir mesaj bulunamadı.` }).sil(15)
}
let data = await giveaway.findOne({ messageID: mesaj });
if (!data) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `Mesaj ID'sinde datada veri bulunamadı.` }).sil(15)
}
let arr = data.katilan;
let random = arr[Math.floor(Math.random() * arr.length)]
if(data.katilan.length <= 1) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `Çekilişe katılan kişi sayısı 1'den az olduğu için yeniden çekiliş yapamam.` }).sil(15)
}
message.channel.send({ content: `🎉 ${message.guild.members.cache.get(random) ? message.guild.members.cache.get(random) : client.users.cache.get(random).username} tebrikler **${data.odul ? data.odul : "Bulunamadı."}** kazandın!` })
message.channel.send({embeds: [new EmbedBuilder().setTitle(`🎉 Kazanan Tekrar Seçildi 🎉`).setFooter({ text : `Katılımcı Sayısı: ${arr.length}` }).setDescription(`🎉 Çekiliş kazananı yeniden seçildi!\nÇekilişi Tekrarlatan: ${message.author}\n\nKazanan Katılımcı: ${message.guild.members.cache.get(random) ? message.guild.members.cache.get(random) : client.users.cache.get(random).username}`)], components: []})
}
}