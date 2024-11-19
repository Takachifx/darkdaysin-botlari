const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
module.exports = {
conf: {
aliases: ["avatar", "pp", "av"],
name: "avatar",
help: "avatar @Darkdays/ID",
category: "kullanici"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const member = message.mentions.members.first() || await client.fetchUser(args[0]) || message.member || message.guild.members.cache.get(args[0])
const avatars = await client.avatarGet(member.id)
const avatar = message.guild.members.cache.get(member.id) ? message.guild.members.cache.get(member.id).displayAvatarURL({dynamic: true, size: 4096}) : avatars
let username = message.guild.members.cache.get(member.id) ? message.guild.members.cache.get(member.id).displayName : member.username
await message.reply({content: `[**${username}**] Adlı Kullanıcının Avatarı Aşağıda Belirtilmiştir.`, files: [avatar]})
}
}