const settings = require("../../../../Src/Settings/Settings.json")
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
module.exports = {
conf: {
name: "takepart",
aliases: ["rolalma"],
help: "rolalma",
owner: true,
category: "owner"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
await message.delete().catch(e => {})
const EtkinlikRow = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("etkinlikrol")
.setPlaceholder("Etkinlik Rolleri")
.setMaxValues(2)
.setMinValues(1)
.addOptions([
{
label: "Çekiliş Katılımcısı",
description: "Çekiliş Katılımcısı Rolünü Al.",
value: "cekiliskatilimcisi",
emoji: "1238499775418990755",
},
{
label: "Etkinlik Katılımcısı",
description: "Etkinlik Katılımcısı Rolünü Al.",
value: "etkinlikkatilimcisi",
emoji: "1238499809002782852",
},
{
label: "Temizle",
description: "Üzerinizdeki Etkinlik Rolleri Temizlenir.",
value: "temizle",
emoji: "1194083968803414107",
},
]))
await message.channel.send({ content: `${message.guild.emojiGöster(emojis.face)} Merhaba **${message.guild.name}** Üyeleri,
${message.guild.emojiGöster(emojis.sagok)} Sunucuda Sizleri Rahatsız Etmemek İçin \` @everyone \`  veya  \` @here \` Atmayacağız. Sadece İsteğiniz Doğrultusunda Aşağıda Bulunan Seçimlere Tıklarsanız Çekilişler,Etkinlikler V/K Ve D/C'den Haberdar Olacaksınız.

${message.guild.emojiGöster(emojis.sagok)} Eğer \` @Çekiliş Katılımcısı \` Rolünü Alırsanız Sunucumuzda Sıkça Vereceğimiz **Nitro**, **Exxen**, **Netflix**, **Spotify**, **Youtube** Ve Daha Nice Ödüllerin Bulunduğu Çekilişlerden Haberdar Olabilirsiniz.

${message.guild.emojiGöster(emojis.sagok)} Eğer \` @Etkinlik Katılımcısı \` Rolünü Alırsanız Sunucumuzda Düzenlenecek Olan Etkinlikler, Konserler Ve Oyun Etkinlikleri Gibi Etkinliklerden Haberdar Olabilirsiniz.

${message.guild.emojiGöster(emojis.info)} __Aşağıda'ki Menülere Basarak Siz'de Bu Ödülleri Kazanmaya Hemen Başlayabilirsiniz!__` , components: [EtkinlikRow] });
const RenkRow = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("renkrol")
.setPlaceholder("Renk Rolleri")
.setMaxValues(1)
.setMinValues(1)
.addOptions([
{
label: "Siyah",
value: "siyah",
description: "Siyah Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Mavi",
value: "mavi",
description: "Mavi Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Beyaz",
value: "beyaz",
description: "Beyaz Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Kırmızı",
value: "kirmizi",
description: "Kırmızı Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Sarı",
value: "sari",
description: "Sarı Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Pembe",
value: "pembe",
description: "Pembe Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Mor",
value: "mor",
description: "Mor Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Turuncu",
value: "turuncu",
description: "Turuncu Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Yeşil",
value: "yesil",
description: "Yeşil Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Kahverengi",
value: "kahverengi",
description: "Kahverengi Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Bordo",
value: "bordo",
description: "Bordo Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Turkuaz",
value: "turkuaz",
description: "Turkuaz Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Bej",
value: "bej",
description: "Bej Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Lacivert",
value: "lacivert",
description: "Lacivert Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Açık Mavi",
value: "mavitwo",
description: "Açık Mavi Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Fıstık Yeşili",
value: "yesiltwo",
description: "Fıstık Yeşili Renk Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Temizle",
description: "Üzerinizdeki Renk Rolleri Temizlenir.",
value: "temizle",
emoji: "1194083968803414107",
},
]))
const BurcROW = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("burcrol")
.setPlaceholder("Burç Rolleri")
.setMaxValues(1)
.setMinValues(1)
.addOptions([
{
label: "Koç",
value: "koç",
description: "Koç Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Boğa",
value: "boğa",
description: "Boğa Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "İkizler",
value: "ikizler",
description: "İkizler Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Yengeç",
value: "yengeç",
description: "Yengeç Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Aslan",
value: "aslan",
description: "Aslan Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Başak",
value: "başak",
description: "Başak Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Terazi",
value: "terazi",
description: "Terazi Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Akrep",
value: "akrep",
description: "Akrep Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Yay",
value: "yay",
description: "Yay Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Oğlak",
value: "oğlak",
description: "Oğlak Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Kova",
value: "kova",
description: "Kova Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Balık",
value: "balık",
description: "Balık Burcu Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Temizle",
description: "Üzerinizdeki Burç Rolleri Temizlenir.",
value: "temizle",
emoji: "1194083968803414107",
},
]))
const TakimRow = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("takimrol")
.setPlaceholder("Takım Rolleri")
.setMaxValues(1)
.setMinValues(1)
.addOptions([
{
label: "Fenerbahçe",
value: "fb",
description: "Fenerbahçe Takım Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Galatasaray",
value: "gs",
description: "Galatasaray Takım Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Beşiktaş",
value: "bjk",
description: "Beşiktaş Takım Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Trabzonspor",
value: "ts",
description: "Trabzonspor Takım Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Temizle",
description: "Üzerinizdeki Takım Rolleri Temizlenir.",
value: "temizle",
emoji: "1194083968803414107",
},
]))
const İliskiRow = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("iliskirol")
.setPlaceholder("İlişki Rolleri")
.setMaxValues(1)
.setMinValues(1)
.addOptions([
{
label: "Sevgilim Var",
value: "couple",
description: "Sevgilim Var Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Sevgilim Yok",
value: "alone",
description: "Sevgilim Yok Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Sevgili Yapmıyorum",
value: "sy",
description: "Sevgili Yapmıyorum Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Temizle",
description: "Üzerinizdeki İlişki Rolleri Temizlenir.",
value: "temizle",
emoji: "1194083968803414107",
},
]))
const OyunRow = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("oyunrol")
.setPlaceholder("Oyun Rolleri")
.setMaxValues(3)
.setMinValues(1)
.addOptions([
{
label: "CS:GO",
value: "csgo",
description: "CS:GO Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "League Of Legends",
value: "lol",
description: "League Of Legends Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Valorant",
value: "valorant",
description: "Valorant Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Gta V",
value: "gta5",
description: "Gta V Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "PUBG",
value: "pubg",
description: "PUBG Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Fortnite",
value: "fortnite",
description: "Fortnite Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Among Us",
value: "amongus",
description: "Among Us Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Mobile Legends",
value: "mobilelegends",
description: "Mobile Legends Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Minecraft",
value: "minecraft",
description: "Minecraft Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Metin 2",
value: "metin2",
description: "Metin 2 Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Fivem",
value: "fivem",
description: "Fivem Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Zula",
value: "zula",
description: "Zula Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Mta San Andreas",
value: "mta",
description: "Mta San Andreas Oyun Rolünü Al.",
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: "Temizle",
description: "Üzerinizdeki Oyun Rolleri Temizlenir.",
value: "temizle",
emoji: "1194083968803414107",
},
]))
await message.channel.send({components: [RenkRow, BurcROW, TakimRow, İliskiRow, OyunRow]})

}
};