const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const MessageUser = require("../../../../Src/Schemas/MessageUsers")
const VoiceUser = require("../../../../Src/Schemas/VoiceUsers")
const İnviter = require("../../../../Src/Schemas/İnviteMembers")
const RegisterStaffStats = require("../../../../Src/Schemas/RegisterStaffStats")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["denetim","ydenetim"],
name: "denetim",
help: "denetim @Rol/ID",
category: "ustyetkili",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["denetim","ydenetim"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır.`}).sil(15)
return }
let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
if (!role) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bir rol belirtmelisin!`}).sil(15)
return }
const member = role.members.filter(member => message.guild.members.cache.get(member.id) && !member.user.bot)
const like = message.guild.emojiGöster(emojis.like)
const dislike = message.guild.emojiGöster(emojis.dislike)
let list = await Promise.all(member.map(async (e) => {
const MData = await MessageUser.findOne({ guildID: message.guild.id, userID: e.id });
const VData = await VoiceUser.findOne({ guildID: message.guild.id, userID: e.id });
const udb = await İnviter.find({ guildID: settings.Moderation.guildID, inviter: e.id })
const weeklyInvites = udb.filter(x => {
const member = message.guild.members.cache.get(x.userID);
return member && Date.now() - member.joinedAt < 1000 * 60 * 60 * 24 * 7;
}).length;
const RData = await RegisterStaffStats.findOne({ guildID: message.guild.id, userID: e.id });
let text = `${e}:
${MData && MData.weeklyStat >= "2000" ? `${like} Chat kanallarında aktifliğinin devamını diliyorum.` : `${dislike} Chat kanallarında daha çok aktif olmalısın.`}
${VData && VData.weeklyStat >= "180000000" ? `${like} Ses kanallarında aktifliğinin devamını diliyorum.` : `${dislike} Ses kanallarında daha çok aktif olmalısın.`}
${weeklyInvites && weeklyInvites >= "20" ? `${like} Davetlerin devamını diliyorum.` : `${dislike} Davet kısmında daha çok aktif olmalısın.`}
${RData && RData.top7 >= "70" ? `${like} Kayıt kanallarında aktifliğinin devamını diliyorum.` : `${dislike} Kayıt kanallarında daha çok aktif olmalısın.`}`
return text
}));
let chunk = await client.splitMessage(String(list.join("\n")), 2000)
for (list of chunk) {
await message.channel.send({content: `${list}`})
}
}
}
