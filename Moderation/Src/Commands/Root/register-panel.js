const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
module.exports = {
conf: {
aliases: ["register-panel", "registerpanel"],
name: "register-panel",
help: "register-panel",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
await message.delete().catch(e => {})
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("register-panel")
.setLabel("Kayıt Yetkilisi Çağır.")
.setStyle(Discord.ButtonStyle.Primary)
.setEmoji("1087380479189196870"))
await message.channel.send({content: `${message.guild.emojiGöster(emojis.face)} Merhabalar Değerli **${message.guild.name}** Üyeleri, Aşağı Tarafta Bulunan Butondan Kayıt Yetkilisi Arkadaşlara Ulaşabilirsiniz.`, components: [row]})
}
}