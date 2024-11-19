const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
module.exports = {
conf: {
aliases: ["punish-panel", "phpanel"],
name: "punish-panel",
help: "punish-panel",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
await message.delete().catch(e => {})
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("cezapuans")
.setLabel("Ceza Puanım")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1271899744901398559"),
new Discord.ButtonBuilder()
.setCustomId("punishs")
.setLabel("Cezalarım")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1271899743320018996"),
new Discord.ButtonBuilder()
.setCustomId("punishtime")
.setLabel("Kalan Zamanım")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1271899746214219963"))
await message.channel.send({content: `${message.guild.emojiGöster(emojis.sagok)} Merhaba! **${message.guild.name}**
Aşağıda ki düğmelerden cezalarınız hakkında detaylı bilgi alabilirsiniz.`, components: [row]})
}
}