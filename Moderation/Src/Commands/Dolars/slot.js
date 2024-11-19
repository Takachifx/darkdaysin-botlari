const dolars = require("../../../../Src/Schemas/Dolars");
const emojis = require('../../../../Src/Settings/emojiName.json')
const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["s", "slot", "Slot"],
name: "slot",
help: "slot <Miktar>",
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
const slot = [`❤️`, `🍒`, `🍆`];
let slotgif = "🎰"
let oran = Math.random();
let slot1, slot2, slot3;
function spinSlots() {
for (let i = 0; i < 100; i++) {
slot1 = slot[Math.floor(Math.random() * slot.length)];
slot2 = slot[Math.floor(Math.random() * slot.length)];
slot3 = slot[Math.floor(Math.random() * slot.length)];
if (oran <= 0.5 && slot1 === slot2 && slot1 === slot3) {
return { result: "win", slots: [slot1, slot2, slot3] };
}
if (oran >= 0.5 && slot1 !== slot2 && slot1 !== slot3) {
return { result: "lose", slots: [slot1, slot2, slot3] };
}
}
return { result: "error" };
}
let spinResult = spinSlots();
if(!dolarData.dolar) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: `Hiç **${ayar.GuildName}** doların yok!`})
}
if(dolarData.dolar < sec) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Yeterli miktar da **${ayar.GuildName}** doları yok! **${ayar.GuildName}** dolarınız: (**${dolarData.dolar}** **${ayar.GuildName}** Doları)`}).sil(15)
}
await message.react(message.guild.emojiGöster(emojis.yes))
let slotMessage = await message.reply({content: `
\`|   SLOT   |\`
   ${slotgif} ${slotgif} ${slotgif}
**\`|          |\`**
**\`|          |\`**`})
if (spinResult.result === "win") {
let carpma = sec * 2
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: +carpma } }, { upsert: true });
setTimeout(() => {
slotMessage.edit({ content: `
\`|   SLOT   |\`
   ${slot1} ${slot2} ${slot3}
\`|          |\`
\`|          |\`

:tada: **Kazandın!**
Kazanılan Ödül: \` ${carpma} \` **${ayar.GuildName}** Doları`})
}, 2500)
} else if (spinResult.result === "lose") {
await dolars.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { dolar: -sec } }, { upsert: true });
setTimeout(() => {
slotMessage.edit({ content:`
\`|   SLOT   |\`
   ${slot1} ${slot2} ${slot3}
**\`|          |\`**
**\`|          |\`**

${message.guild.emojiGöster(emojis.no)} **Kaybettin!**
Kaybedilen Miktar: \` ${sec} \` **${ayar.GuildName}** Doları`})
}, 2500)
} else {
slotMessage.edit({ content:`Slotlar dönme işlemi başarısız oldu. Lütfen tekrar deneyin.`});
}
}
}