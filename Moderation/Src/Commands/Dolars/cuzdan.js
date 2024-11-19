const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["cuzdan", "cash", "cüzdan", "dolarim", "dolarım"],
name: "cuzdan",
help: "cuzdan @Darkdays/ID",
category: "kullanici",
},
Cyrstal: async (client, message, args, embed, prefix) => {
if (!message.guild) return;
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
let kanallar = ["dolar", "dolar-chat"]
if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `${message.guild.emojiGöster(emojis.no)} dolar kanallarında kullanabilirsiniz.`}).sil(15)
return }
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
let dolarData = await dolars.findOne({ guildID: settings.Moderation.guildID, userID: member.id });
if (!dolarData || dolarData && !dolarData.hesap.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${member} Üyesinin Hesabı Bulunmamakta.`}).sil(15)
}
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content: `${member} kişisinin bakiyesi: \` ${dolarData ? Math.floor(parseInt(dolarData.dolar)) : 0} \` **${ayar.GuildName}** Doları.`})
}
}