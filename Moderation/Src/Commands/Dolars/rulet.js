const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
const Discord = require("discord.js")
module.exports = {
conf: {
aliases: ["rulet"],
name: "rulet",
help: "rulet <Miktar>",
category: "kullanici",
cooldown: 15
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
let dolarData = await dolars.findOne({ guildID: settings.Moderation.guildID, userID: message.author.id });
if (!dolarData || dolarData && !dolarData.hesap.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Komutu kullanabilmek için Hesap oluşturmanız gerekmektedir.`}).sil(15)
}
if (!dolarData || dolarData && !dolarData.dolar) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Komutu kullanabilmek için **${ayar.GuildName}** dolarına ihtiyacın var.`}).sil(15)
}
let sec = args[0]
let regex = /^[0-9]+$/
if(!sec || !Number(sec) || Number(sec) < 0 || !regex.test(sec)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Kaç **${ayar.GuildName}** doları ile oynamak istiyorsun?`}).sil(15)
}
if(isNaN(Number(sec))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Geçerli bir sayı gir.`}).sil(15)
}
let res = await dolars.findOne({guildID: settings.Moderation.guildID, userID: message.author.id})
if(!res.dolar) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `Hiç **${ayar.GuildName}** doların yok!`})
}
if(res.dolar < sec) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Yeterli miktar da **${ayar.GuildName}** doları yok! **${ayar.GuildName}** Doların: (**${res.dolar}** **${ayar.GuildName}** Doları)`}).sil(15)
}
let winAmount = sec * 20
let winAmount2 = sec * 4
let winAmount3 = sec * 2

function isOdd(num) {
return num % 2 !== 0;
}

const One = new Discord.ButtonBuilder().setLabel("⚫️ Siyah").setCustomId("siyahsecim").setStyle(Discord.ButtonStyle.Secondary)
const Two = new Discord.ButtonBuilder().setLabel("🔴 Kırmızı").setCustomId("kirmizisecim").setStyle(Discord.ButtonStyle.Danger)
const Three = new Discord.ButtonBuilder().setLabel("🟢 Yeşil").setCustomId("yesilsecim").setStyle(Discord.ButtonStyle.Success)

const row = new Discord.ActionRowBuilder().addComponents([One, Two, Three])

let random = Math.floor(Math.random() * 37);

const Embedcik = new Discord.EmbedBuilder().setDescription(`
${message.guild.emojiGöster(emojis.info)} **${message.guild.name}** Rulet oyununa hoşgeldin ${message.author}!
Hangi renge oynamak istiyorsan aşağıdaki kısımdan seçmelisin! Unutma Oyun sonunda kazanabileceğin miktarlar aşağıda belirtilmiştir:
- ⚫️ Siyah: **2** katı
- 🔴 Kırmızı: **4** katı
- 🟢 Yeşil: **20** katı

Kazanmak için bir renk seçmelisin!`).setColor("Random")
const msg = await message.reply({ content: `${message.author}`, embeds: [Embedcik], components: [row] })
const collector = msg.createMessageComponentCollector({ filter: (i) => i.user.id === message.author.id, time: 60000 });
collector.on('collect', async (i) => {
await i.deferUpdate();
row.components.forEach((x) => { x.setDisabled(true) })
collector.stop();
if (i.customId === "siyahsecim") {
if (random === 0) {
await dolars.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: winAmount3 } })
await msg.edit({ embeds: [embed.setDescription(`Tebrikler! Siyah renge oynadın ve kazandın! **${winAmount3}** ${ayar.GuildName} Doları kazandın!`)], components: [row]})
} else if (isOdd(random) === true) {
await dolars.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: winAmount3 } })
await msg.edit({ embeds: [embed.setDescription(`Tebrikler! Siyah renge oynadın ve kazandın! **${winAmount3}** ${ayar.GuildName} Doları kazandın!`)], components: [row]})
} else {
await dolars.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: -sec } })
await msg.edit({ embeds: [embed.setDescription(`Üzgünüm! Siyah renge oynadın ve kaybettin! **${sec}** ${ayar.GuildName} Doları kaybettin!`)], components: [row]})
}
} else if (i.customId === "kirmizisecim") {
if (random === 0) {
await dolars.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: winAmount2 } })
await msg.edit({ embeds: [embed.setDescription(`Tebrikler! Kırmızı renge oynadın ve kazandın! **${winAmount2}** ${ayar.GuildName} Doları kazandın!`)], components: [row]})
} else if (isOdd(random) === false) {
await dolars.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: winAmount2 } })
await msg.edit({ embeds: [embed.setDescription(`Tebrikler! Kırmızı renge oynadın ve kazandın! **${winAmount2}** ${ayar.GuildName} Doları kazandın!`)], components: [row]})
} else {
await dolars.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: -sec } })
await msg.edit({ embeds: [embed.setDescription(`Üzgünüm! Kırmızı renge oynadın ve kaybettin! **${sec}** ${ayar.GuildName} Doları kaybettin!`)], components: [row]})
}
} else if (i.customId === "yesilsecim") {
if (random === 0) {
await dolars.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: winAmount } })
await msg.edit({ embeds: [embed.setDescription(`Tebrikler! Yeşil renge oynadın ve kazandın! **${winAmount}** ${ayar.GuildName} Doları kazandın!`)], components: [row]})
} else {
await dolars.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: -sec } })
await msg.edit({ embeds: [embed.setDescription(`Üzgünüm! Yeşil renge oynadın ve kaybettin! **${sec}** ${ayar.GuildName} Doları kaybettin!`)], components: [row]})
}
}
});
}
}