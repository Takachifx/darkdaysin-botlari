const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const emojis = require("../../../../Src/Settings/emojiName.json");
const registerStats = require("../../../../Src/Schemas/RegisterStaffStats");
const Discord = require("discord.js");
module.exports = {
conf: {
aliases: ["teyitler", "kayitlarim", "kayıtlarım", "kayıtları", "kayitlari", "teyitlerim"],
name: "teyitler",
help: "kayıtları @Darkdays/ID",
category: "kayit",
cooldown: 0
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
if(!ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.registerRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.staffRoles.some(oku => message.member.roles.cache.has(oku))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Yetkin bulunmamakta. Yetkili olmak istersen başvuru yapabilirsin.`)]}).sil(15)
}
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
const data = await registerStats.findOne({ guildID: settings.Moderation.guildID, userID: member.id });
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member} Kullanıcısının Kayıt Bilgileri Aşağıda Belirtilmiştir.

${message.guild.emojiGöster(emojis.nokta)} Toplam Kayıt: **${data ? data.top : 0}**
${message.guild.emojiGöster(emojis.nokta)} Toplam Erkek Kayıt: **${data ? data.erkek : 0}**
${message.guild.emojiGöster(emojis.nokta)} Toplam Kız Kayıt: **${data ? data.kadin : 0}**

${message.guild.emojiGöster(emojis.nokta)} Günlük Erkek Kayıt: **${data ? data.erkek1 : 0}**
${message.guild.emojiGöster(emojis.nokta)} Haftalık Erkek Kayıt: **${data ? data.erkek7 : 0}**
${message.guild.emojiGöster(emojis.nokta)} Aylık Erkek Kayıt: **${data ? data.erkek30 : 0}**

${message.guild.emojiGöster(emojis.nokta)} Günluk Kız Kayıt: **${data ? data.kadin1 : 0}**
${message.guild.emojiGöster(emojis.nokta)} Haftalık Kız Kayıt: **${data ? data.kadin7 : 0}**
${message.guild.emojiGöster(emojis.nokta)} Aylık Kız Kayıt: **${data ? data.kadin30 : 0}**`)] });
  },
};