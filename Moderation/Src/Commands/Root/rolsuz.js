const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require("discord.js");
module.exports = {
conf: {
aliases: ["rolsuz", "rolsuz", "rolsüz"],
name: "rolsuz",
help: "rolsuz ver",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
const ayars = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayars) return;
let dark = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== settings.Moderation.guildID).size == 0)
if(args[0] == "ver") {
if(dark.size == 0) return message.channel.send({ embeds: [embed.setDescription("Sunucuda rolü olmayan üye bulunmamaktadır!")] });
dark.forEach(async r => {
await r.addRoles(ayars.unregRoles).catch(e => {})
})
await message.channel.send({ embeds: [embed.setDescription("Sunucuda rolü olmayan \`"+ dark.size +"\` kişiye kayıtsız rolü verildi!")] });
} else if(!args[0]) {
await message.channel.send({ embeds: [embed.setDescription("Sunucumuzda rolü olmayan \`"+ dark.size +"\` kişi var. Bu kişilere kayıtsız rolü vermek için \`.rolsüz ver\` komutunu uygulayın!")] });
}
}
}