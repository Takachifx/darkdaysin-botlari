const settings = require("../../../../Src/Settings/Settings.json")
const emojiName = require("../../../../Src/Settings/emojiName.json")
const Discord = require('discord.js');
module.exports = {
conf: {
name: "link",
aliases: ["link"],
help: "link",
category: "kullanici",
cooldown: 15
},
Cyrstal: async (client, message, args) => {
if(!message.guild.vanityURLCode) return message.reply({ content:">>> Sunucuda bir özel url yok."}).sil(15)
const url = await message.guild.fetchVanityData();
if(!url) return message.reply({ content:">>> Sunucuda bir özel url yok."}).sil(15)
message.reply({ content: `>>> https://discord.gg/${message.guild.vanityURLCode}\n\nToplam kullanım: **${url.uses}**`})
}
};