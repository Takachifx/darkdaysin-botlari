const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Discord = require("discord.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = {
conf: {
aliases: ["banner"],
name: "banner",
help: "banner @Darkdays/ID",
category: "kullanici"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const member = message.mentions.members.first() || await client.fetchUser(args[0]) || message.member;
const avatar = await client.avatarGet(member.id)
const banner = await client.bannerGet(member.id)
let username = message.guild.members.cache.get(member.id) ? message.guild.members.cache.get(member.id).displayName : member.username
await message.reply({content: `[**${username}**] Adlı Kullanıcının Banneri Aşağıda Belirtilmiştir.`, files: [banner]})
}
}