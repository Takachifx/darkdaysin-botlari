const settings = require("../../../../Src/Settings/Settings.json")
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = {
conf: {
name: "server-config",
aliases: ["sunucuayar"],
help: "sunucu-ayar",
owner: true,
category: "owner"
},
Cyrstal: async (client, message, args) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId('select')
.setPlaceholder('Bir İşlem Türü Seçin')
.addOptions([
{
label: 'Tag Sistemi Aç/Kapat',
value: 'tag',
description: 'Sunucunuzda tag sistemi açıp kapatmak için kullanılır.',
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: 'Yaş Sistemi Aç/Kapat',
value: 'yas',
description: 'Sunucunuzda yaş sistemi açıp kapatmak için kullanılır.',
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: 'Oto Kayıt Sistemi Aç/Kapat',
value: 'otokayit',
description: 'Sunucunuzda oto kayıt sistemi açıp kapatmak için kullanılır.',
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: 'Oto Rol Sistemi Aç/Kapat',
value: 'otorol',
description: 'Sunucunuzda oto rol sistemi açıp kapatmak için kullanılır.',
emoji: message.guild.emojiGöster(emojis.sagok).id
}]))
const msj = await message.channel.send({content: `${message.guild.emojiGöster(emojis.face)} Merhaba ${message.author}, Sunucu Ayarlarını Düzenlemek İçin Aşağıdaki Menüden Bir İşlem Türü Seçebilirsiniz.`, components: [row]})
const filter = (interaction) => interaction.user.id === message.author.id;
const collector = msj.createMessageComponentCollector({filter, time: 60000});
collector.on('collect', async (button) => {
if(button.customId === "select") {
if(button.values[0] === "tag") {
ayar.tagSystem == true ? ayar.tagSystem = false : ayar.tagSystem = true;
ayar.save()
button.update({content: `${message.guild.emojiGöster(emojis.yes)} Tag Sistemi Başarıyla ${ayar.tagSystem == true ? "Açıldı" : "Kapatıldı"}`, components: []})
} else if(button.values[0] === "yas") {
ayar.ageSystem == true ? ayar.ageSystem = false : ayar.ageSystem = true;
ayar.save()
button.update({content: `${message.guild.emojiGöster(emojis.yes)} Yaş Sistemi Başarıyla ${ayar.ageSystem == true ? "Açıldı" : "Kapatıldı"}`, components: []})
} else if(button.values[0] === "otokayit") {
ayar.otoRegister == true ? ayar.otoRegister = false : ayar.otoRegister = true;
ayar.save()
button.update({content: `${message.guild.emojiGöster(emojis.yes)} Oto Kayıt Sistemi Başarıyla ${ayar.otoRegister == true ? "Açıldı" : "Kapatıldı"}`, components: []})
} else if(button.values[0] === "otorol") {
ayar.autoRole == true ? ayar.autoRole = false : ayar.autoRole = true;
ayar.save()
button.update({content: `${message.guild.emojiGöster(emojis.yes)} Oto Rol Sistemi Başarıyla ${ayar.autoRole == true ? "Açıldı" : "Kapatıldı"}`, components: []})
}
}
})
collector.on("end", async () => {
await msj.edit({components: []})
})
}
}