const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
module.exports = {
conf: {
aliases: ["sunucu-banner", "sunucubanner"],
name: "guild-banner",
help: "sunucu-banner",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({content: `[**${message.guild.name}**] Sunucusunun Banneri Aşağıda Belirtilmiştir.`, files: [message.guild.bannerURL({dynamic: true, size: 4096}) || "https://i.imgur.com/poYt5sN.png"]})
}
}