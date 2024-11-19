const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
module.exports = {
conf: {
aliases: ["sunucu-pp", "sunucupp"],
name: "guild-pp",
help: "sunucu-pp",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({content: `[**${message.guild.name}**] Sunucusunun Avatarı Aşağıda Belirtilmiştir.`, files: [message.guild.iconURL({dynamic: true, size: 4096}) || "https://cdn.discordapp.com/embed/avatars/0.png"]})
}
}