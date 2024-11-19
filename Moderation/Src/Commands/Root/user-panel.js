const settings = require("../../../../Src/Settings/Settings.json")
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
module.exports = {
conf: {
name: "user-panel",
aliases: ["userpanel"],
help: "user-panel",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
const data = await setups.findOne({ guildID: settings.Moderation.guildID })
if(!data) return;
await message.delete().catch(e => {})
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("levelss")
.setEmoji(message.guild.emojiGöster(emojis.bir).id)
.setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder()
.setCustomId("aylikss")
.setEmoji(message.guild.emojiGöster(emojis.iki).id)
.setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder()
.setCustomId("boosters")
.setEmoji(message.guild.emojiGöster(emojis.uc).id)
.setStyle(Discord.ButtonStyle.Secondary)
);
const row2 = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("levels")
.setEmoji(message.guild.emojiGöster(emojis.dort).id)
.setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder()
.setCustomId("ayliks")
.setEmoji(message.guild.emojiGöster(emojis.bes).id)
.setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder()
.setCustomId("yardimss")
.setEmoji(message.guild.emojiGöster(emojis.alti).id)
.setStyle(Discord.ButtonStyle.Secondary),
);
const row3 = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("application-panel")
.setPlaceholder("Başvuru Yapmak İstediğiniz Paneli Seçin")
.addOptions([
{
label: "Streamer Başvuru Paneli",
value: "streamerapplication",
description: "Streamer Başvuru Panelini Açar",
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: "Yetkili Başvuru Paneli",
value: "staffapplication",
description: "Yetkili Başvuru Panelini Açar",
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: "Şikayet Paneli",
value: "complaintapplication",
description: "Şikayet Panelini Açar",
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: "Öneri Paneli",
value: "suggestionapplication",
description: "Öneri Panelini Açar",
emoji: message.guild.emojiGöster(emojis.sagok).id
},
{
label: "İstek Paneli",
value: "requestapplication",
description: "İstek Panelini Açar",
emoji: message.guild.emojiGöster(emojis.sagok).id
}]))
message.channel.send({content:`
${message.guild.emojiGöster(emojis.sagok)} **${message.guild.name} :reminder_ribbon:** Sunucu Kısayolları;

\` 1. \` Level Bilgilerini Görüntüle.
\` 2. \` Aylık Rol Bilgilerini Görüntüle.
\` 3. \` Sunucu İsmini Değiştir. (**Booster Özel**)
\` 4. \` Level Aç/Kapat.
\` 5. \` Aylık Üye Rollerini Aç/Kapat.
\` 6. \` Bot Yardım Komutlarını Gösterir.

${message.guild.emojiGöster(emojis.sagok)} **Level Sistemi Tanıtım;**
Sunucuda olan aktifliğinize göre çalışan bu sistem sizin mesaj , ses , yayın gibi faliyetlerinize göre rol vermeyi amaçlar sunucuda toplam **10** adet level rolü bulunmaktadır bu roller sırasıyla sizlere verilir birinci olanlara ise çeşitli ödüllendirilmeler yapılır. Eğer üstünüzde bu rollerin olmasını istermiyorsanız aşağıdaki \` 4. \` numaralı butondan kapatıp açabilirsiniz.

${message.guild.emojiGöster(emojis.sagok)} **Üyelik Süresi Tanıtım;**
Sunucumuza giriş tarihinizden itibaren hesaplanılan süre zarfında sizlere çeşitli **Aylık , Yıllık** rolleri verilir. Bu rolleri üzerinizde taşımak istermiyorsanız \` 5. \` numaralı butondan açıp kapatabilirsiniz.
`, components: [row, row2, row3]})
}
}