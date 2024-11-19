const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
module.exports = {
conf: {
aliases: ["şüpheli", "supheli", "spanel"],
name: "şüpheli-button",
help: "şüpheli-button",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
await message.delete().catch(e => {})
const row = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setCustomId("suphekontrol").setLabel("Kontrol").setStyle(Discord.ButtonStyle.Danger),);
message.channel.send({content: `${message.guild.emojiGöster(emojis.sagok)} *Merhaba ${message.guild.name} üyeleri;\n\nSunucumuz 7 gün içinde kurulan hesapları hiçbir şekilde kabul etmemektedir. Lütfen "Cezalıdan çıkarır mısın?" ya da "Şüpheli hesap kaldırır mısın?" yazmayın.\n\nEğer hesabının kurulma süresinden en az 7 gün geçtiğini düşünüyorsan ve hala buradaysan sunucudan çıkıp tekrardan girmeyi veya aşağıdaki butona tıklayarak tekrar kayıt olabilirsin, iyi günler.*`, components: [row]});
}
}