const bannedCmd = require("../../../../Src/Schemas/BannedCommand")
const settings = require("../../../../Src/Settings/Settings.json")
const emojis = require("../../../../Src/Settings/emojiName.json");
module.exports = {
conf: {
aliases: ['command'],
name: "cmd",
help: "command banned @Darkdays/ID",
owner: true,
category: "owner"
},
Cyrstal: async (client, message, args, embed) => {
if(args[0] == "yasakla" || args[0] == "banned") {
let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
if(!member) return message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} Bir Kullanıcı Belirt.`)]}).sil(15)
var veri = await bannedCmd.findOne({guildID: settings.Moderation.guildID}) || {"kullanici": []};
if (!veri.kullanici.includes(member.id)) {
await bannedCmd.updateOne({ guildID: settings.Moderation.guildID }, { $push: { kullanici: member.id } }, { upsert: true });
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla ${member} kullanıcısı yasaklıya eklendi.`)]})
} else {
await message.react(message.guild.emojiGöster(emojis.no))
message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} ${member} kullanıcısı zaten yasaklıda.`)]})
}
} else if(args[0] == "liste" || args[0] == "list") {
var veri = await bannedCmd.findOne({guildID: settings.Moderation.guildID}) || {"kullanici": []};
let mapped = veri.kullanici.map((x, index) => `\` ${index+1} \` ${message.guild.members.cache.get(x) ? message.guild.members.cache.get(x) : client.users.cache.get(x).user.username}`).join("\n")
message.reply({embeds: [embed.setDescription(`
${message.guild.emojiGöster(emojis.warn)} **Merhaba**, ${message.author} *Yasaklı Kullanıcılar Aşağıda Belirtilmiştir;*

${mapped}`)]})
} else if(args[0] == "temizle" || args[0] == "clear") {
await bannedCmd.updateOne({ guildID: settings.Moderation.guildID }, { $set: { kullanici: [] } }, { upsert: true });
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla Yasaklı Kullanıcılar Temizlendi.`)]})
} else if(args[0] == "kaldir" || args[0] == "remove") {
let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
if(!member) return message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} Bir Kullanıcı Belirt.`)]}).sil(15)
var veri = await bannedCmd.findOne({guildID: settings.Moderation.guildID}) || {"kullanici": []};
if (veri.kullanici.includes(member.id)) {
await bannedCmd.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { kullanici: member.id } }, { upsert: true });
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla ${member} kullanıcısının yasağı kaldırıldı.`)]})
} else {
await message.react(message.guild.emojiGöster(emojis.no))
message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} ${member} kullanıcısı yasaklıda değil.`)]})
}
}
}
}