const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require("discord.js");
module.exports = {
conf: {
aliases: ["taglı-alım", "taglıalım", "taglı-alım", "taglıalım", "taglı-alım", "taglıalım", "taglialim", "taglialım"],
name: "tagges",
help: "taglı-alım",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("tagges")
.setPlaceholder("Taglı Alım Paneli")
.addOptions([
{
label: "Taglı Alım Aç",
value: "taggesopen",
description: "Taglı Alımı Açar",
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: "Taglı Alım Kapat",
value: "taggesclose",
description: "Taglı Alımı Kapatır",
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: "İptal",
value: "cancel",
description: "İşlemi İptal Eder",
emoji: message.guild.emojiGöster(emojis.sagok).id
}]))
const msg = await message.reply({content: `${message.guild.emojiGöster(emojis.yes)} **${message.guild.name}** Sunucusunda Taglı Alım Panelini Açmak İçin Aşağıdaki Menüden İşlem Yapabilirsiniz.`, components: [row]});
let filter = (interaction) => interaction.user.id == message.author.id;
let collector = msg.createMessageComponentCollector({filter, time: 60000});
collector.on("collect", async (button) => {
if(button.customId === "tagges") {
if(button.values[0] == "taggesopen") {
await button.deferUpdate();
if(ayar.taggesMode == true) return button.message.edit({content: `${message.guild.emojiGöster(emojis.no)} **${message.guild.name}** Sunucusunda Taglı Alım Zaten Açık!`, components: []})
await setups.updateOne({guildID: settings.Moderation.guildID}, { $set: { taggesMode: true } }, { upsert: true });
await button.message.edit({content: `${message.guild.emojiGöster(emojis.yes)} **${message.guild.name}** Sunucusunda Taglı Alım Başarıyla Açıldı!`, components: []})
} else if(button.values[0] == "taggesclose") {
await button.deferUpdate();
if(ayar.taggesMode == false) return button.message.edit({content: `${message.guild.emojiGöster(emojis.no)} **${message.guild.name}** Sunucusunda Taglı Alım Zaten Kapalı!`, components: []})
await setups.updateOne({guildID: settings.Moderation.guildID}, { $set: { taggesMode: false } }, { upsert: true });
await button.message.edit({content: `${message.guild.emojiGöster(emojis.yes)} **${message.guild.name}** Sunucusunda Taglı Alım Başarıyla Kapatıldı!`, components: []})
} else if(button.values[0] == "cancel") {
await button.deferUpdate();
await button.message.edit({content: `${message.guild.emojiGöster(emojis.no)} **${message.guild.name}** Sunucusunda Taglı Alım Paneli İptal Edildi!`, components: []})
}
}
})
}
}