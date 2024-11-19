const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const emojis = require("../../../../Src/Settings/emojiName.json");
const RankSystem = require("../../../../Src/Schemas/RankSystem");
const Puans = require("../../../../Src/Schemas/Puans");
const Tasks = require("../../../../Src/Schemas/Tasks");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const taskTypes = {
"chat": { type: "mesaj", count: getRandomInt(300, 400), message: "kanalında {count} mesaj at!" },
"voice": { type: "ses", count: getRandomInt(60, 300), message: "Ses kanallarında {count} vakit geçir!" },
"inv": { type: "invite", count: getRandomInt(5, 10), message: "{count} adet invite yap!" },
"tags": { type: "tagli", count: getRandomInt(1, 5), message: "{count} adet taglı üye çek!" },
"reg": { type: "kayit", count: getRandomInt(5, 20), message: "{count} adet kayıt yap!" },
"yt": { type: "yetkili", count: getRandomInt(1, 3), message: "{count} adet yetkili üye çek!" },
"yayins": { type: "yayin", count: getRandomInt(60, 300), message: "Ses kanallarında {count} yayın aç!" },
"cameras": { type: "camera", count: getRandomInt(60, 300), message: "Ses kanallarında {count} kamera aç!" }
};
module.exports = {
conf: {
aliases: ["görev", "görev-al", "göreval", "görevseç", "görevsec", "task"],
name: "task",
help: "görev-al",
category: "yetkili",
cooldown: 28800
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID });
if(!ayar) return;
const rdata = await RankSystem.findOne({ guildID: message.guild.id });
if(!rdata) return;
if(rdata.RankSystem == false) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Rank sistemi aktif değil!`)]}).sil(15)
}
const ranks = JSON.parse(await client.ranks(message.guild.id));
if(!ranks.map(x => x.roleID).some(x => message.member.roles.cache.has(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)]}).sil(15)
}
const msj = await message.reply({embeds: [embed.setDescription(`Görevler yükleniyor. Lütfen bekleyin!`)]})
const data = await Tasks.find({ guildID: settings.Moderation.guildID });
const data2 = await Tasks.findOne({ guildID: settings.Moderation.guildID, userID: message.author.id });
if(data2?.limit == 1) {
await message.react(message.guild.emojiGöster(emojis.no))
return msj.edit({embeds: [embed.setDescription(`Zaten 1 adet aktif göreviniz bulunmakta!`)]}).sil(15)
}
const rows = new Discord.StringSelectMenuBuilder()
.setCustomId(`görevs`)
.setPlaceholder(`${message.guild.name} Yetkili Görev Seçeneği.`)
.setMinValues(0)
.setMaxValues(1)
.addOptions(
{
label: `Mesaj Görevi`,
value: `chat`,
description: `${ayar.chatChannel ? `${message.guild.channels.cache.get(ayar.chatChannel).name} Kanalında Mesaj Yazma Görevi.` : 'Bulunamadı.'}`,
emoji: `💭`
},
{
label: `Ses Görevi`,
value: `voice`,
description: 'Sunucu Sesli Kanallarında Bulunma / Vakit Geçirme Görevi.',
emoji: `🔉`
},
{
label: `Davet Görev`,
value: `inv`,
description: 'Sunucumuza Yeni Üyeler Davet(Invite) Etme Görevi.',
emoji: `📩`
},
{
label: `Taglı Görevi`,
value: `tags`,
description: 'Üyelere / Kullanıcılara Tag Aldırma Görevi.',
emoji: `👤`
},
{
label: `Kayıt Görevi`,
value: `reg`,
description: 'Sunucumuza Yeni Gelen Üyeleri Karşılama / Kayıt Etme Görevi.',
emoji: `📍`
},
{
label: `Yetkili Görevi`,
value: `yt`,
description: 'Üyelere / Kullanıcılara Yetki Aldırma Görevi.',
emoji: `🎈`
},
{
label: `Yayın Görevi`,
value: `yayins`,
description: 'Streamer Kanallarında Yayın Açma Görevi.',
emoji: `🖥`
},
{
label: `Kamera Görevi`,
value: `cameras`,
description: "Kamera Kanallarında Kamera Açma Görevi.",
emoji: `📷`
},
{
label: `İptal`,
value: `iptal`,
emoji: `${"1207317729258770432"}`
})
const row = new Discord.ActionRowBuilder()
.addComponents(rows)
await msj.edit({ components: [row], embeds: [embed.setDescription(`
${message.member} Görev Seçme Paneline Hoşgeldin;

:tada: _Seçtiğiniz Tipe Göre Rastgele Adetli Görev Verilecek!_

\` 💭 Mesaj Görevi \`
\` 🔉 Ses Görevi \`
\` 📩 Davet Görevi\`
\` 👤 Taglı Görevi \`
\` 📍 Kayıt Görevi \`
\` 🎈 Yetkili Görevi \`
\` 🖥 Yayın Görevi \`
\` 📷 Kamera Görevi \`

__Aşağıdaki Menüden Kendinize Ait Bir Görev Seçebilirsiniz Seçerken Görev Açıklamasına Bakınız.__

__Görev Seçtikten Sonra Tamamladığınız Takdirde Daha Hızlı Yetki Atlarsınız.__

__Görev Durumunu/Süresini/Puan Katkısını__ \` .ystat \` __Komutu İle Öğrenebilirsiniz.__`).setThumbnail(message.author.displayAvatarURL({ dynamic: true }))]}).then(async (mesaj) => {
const filter = (xd) => xd.user.id == message.author.id;
const collector = mesaj.createMessageComponentCollector({filter})
collector.on("collect", async (interaction) => {
if (interaction.customId === "görevs") {
const value = interaction.values[0];
if (value == "chat") {
await interaction.deferUpdate();
collector.stop();
await handleTask(value, interaction, collector, mesaj, embed);
}
if (value == "voice") {
await interaction.deferUpdate();
collector.stop();
await handleTask(value, interaction, collector, mesaj, embed);
}
if (value == "inv") {
await interaction.deferUpdate();
collector.stop();
await handleTask(value, interaction, collector, mesaj, embed);
}
if (value == "tags") {
await interaction.deferUpdate();
if(ayar.tagSystem == false) return;
collector.stop();
await handleTask(value, interaction, collector, mesaj, embed);
}
if (value == "reg") {
await interaction.deferUpdate();
collector.stop();
await handleTask(value, interaction, collector, mesaj, embed);
}
if (value == "yt") {
await interaction.deferUpdate();
collector.stop();
await handleTask(value, interaction, collector, mesaj, embed);
}
if (value == "yayins") {
await interaction.deferUpdate();
collector.stop();
await handleTask(value, interaction, collector, mesaj, embed);
}
if (value == "cameras") {
await interaction.deferUpdate();
collector.stop();
await handleTask(value, interaction, collector, mesaj, embed);
}
}
})
collector.on("end", async () => {
await msj.edit({ components: []})
})
})
}
}

function getRandomInt(min, max) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function handleTask(value, interaction, collector, mesaj, embed) {
if (!taskTypes[value]) return;
let task = taskTypes[value];
if (["ses", "yayis", "camera"].includes(task.type)) {
task.count = 1000 * 60 * task.count
}
console.log(task.count)
const messages = {
"voice": `Ses Kanallarında  ${moment.duration(task.count).format("D [Gün], H [Saat], m [Dakika]")} Vakit Geçirme Görevi`,
"yayins": `Ses Kanallarında ${moment.duration(task.count).format("D [Gün], H [Saat], m [Dakika]")} Yayın Açma Görevi`,
"cameras": `Ses Kanallarında ${moment.duration(task.count).format("D [Gün], H [Saat], m [Dakika]")} Kamera Açma Görevi`,
"inv": `${task.count} Davet Görevi`,
"tags": `${task.count} Taglı Üye Çekme Görevi`,
"reg": `${task.count} Kayıt Görevi`,
"yt": `${task.count} Yetkili Üye Çekme Görevi`,
"chat": `${task.count} Mesaj Gönderme Görevi`,
"default": ``
};
let message = messages[value] || messages["default"];
const id = await Tasks.find({ guildID: settings.Moderation.guildID });
await new Tasks({
guildID: settings.Moderation.guildID,
userID: interaction.member.id,
id: id ? id.length + 1 : 1,
type: task.type,
count: task.count,
prizeCount: getRandomInt(1, 130),
active: true,
finishDate: moment().add(6, 'hours'),
date: Date.now(),
channels: null,
message: message,
limit: 1
}).save();
await mesaj.edit({
components: [],
embeds: [new Discord.EmbedBuilder().setDescription(`**${interaction.member} Bugün \` ${value ==  "voice" ? `${moment.duration(task.count).format("D [Gün], H [Saat], m [Dakika]")} Boyunca` : value == "yayins" ? `${moment.duration(task.count).format("D [Gün], H [Saat], m [Dakika]")} Boyunca` : value == "cameras" ? `${moment.duration(task.count).format("D [Gün], H [Saat], m [Dakika]")} Boyunca` : `${task.count} Adet`} \` ${task.type.charAt(0).toLocaleUpperCase() + task.type.slice(1)} Görevini Başarıyla Aldın!**`).setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) }).setThumbnail(interaction.member.user.displayAvatarURL({ dynamic: true })).setFooter({ text: `${moment(Date.now()).format("LLL")}`, iconURL: interaction.guild.iconURL({ dynamic: true })})]
});
}