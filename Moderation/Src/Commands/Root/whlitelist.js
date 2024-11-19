const settings = require('../../../../Src/Settings/Settings.json');
const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json");
const whitelist = require("../../../../Src/Schemas/Whitelist");
module.exports = {
conf: {
name: "whlitelist",
aliases: ["wl"],
help: "whlitelist @Darkdays/ID",
owner: true,
category: "owner"
},
Cyrstal: async (client, message, args, embed) => {
var veri = await whitelist.findOne({guildID: message.guild.id}) || {
"full": [],
"guild": [],
"roles": [],
"channel": [],
"ban": [],
"kick": [],
"emoji": [],
"bot": [],
"sticker": [],
"swear": [],
"advert": [],
"capslock": [],
"spam": [],
"web": [],
"offline": []
};
if(!args[0]) {
const categories = ['full', 'guild', 'roles', 'channel', 'ban', 'kick', 'emoji', 'bot', 'sticker', 'swear', 'advert', 'capslock', 'spam', "web", "offline"];
let AllVeri = [];
categories.forEach(category => {
veri[category].forEach(item => {
let capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1)
AllVeri.push({id: item, category: capitalizedCategory.replace("Roles", "Rol").replace("Channel", "Kanal").replace("Ban", "Ban").replace("Kick", "Kick").replace("Emoji", "Emoji").replace("Bot", "Bot").replace("Sticker", "Sticker").replace("Swear", "Küfür").replace("Advert", "Link").replace("Guild", "Sunucu").replace("Full", "Full").replace("Capslock", "Capslock").replace("Spam", "Spam").replace("Web", "Tarayıcı").replace("Offline", "Çevrimdışı")});
});
});
const ownerName = settings.Moderation.owners.map(x => message.guild.members.cache.get(x) ? "" : client.users.fetch(x).username)
const owners = settings.Moderation.owners.map(x => message.guild.members.cache.get(x) ? message.guild.members.cache.get(x).toString() : ownerName)
const text = `
Aşağı da  ${message.guild.name}  Sunucusunun Beyaz Listede ki Üyeleri Ve Rolleri Listelenmektedir.
Bu Listeyi Sadece Taç Sahibi ${message.guild.members.cache.get(message.guild.ownerId) ? message.guild.members.cache.get(message.guild.ownerId).toString() : ""} Ve **${owners}** Kişiler Güncelleyebilir.
\`\`\`fix
White Liste (Güvenli ID)
\`\`\`

${AllVeri.length > 0 ? AllVeri.map((x, index) => `\`${index + 1}.\` ${message.guild.members.cache.get(x.id) ? message.guild.members.cache.get(x.id) : message.guild.roles.cache.get(x.id) ? message.guild.roles.cache.get(x.id) : ""} (\`${x.id}\`) - (**${x.category}**)`).join("\n") : ""}`
await message.reply({embeds: [embed.setDescription(`${message.member}, Merhaba Güvenli Listedeki Üyeler Aşağıda Sıralanmıştır.\n\n${text}`).setAuthor({ name: 'Sunucu Whitelist Paneli', iconURL: message.guild.iconURL({dynamic: true})}).setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})})]})
return; }
let safe;
let uye = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(uye) safe = uye
if(!uye) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Lütfen bir rol veya uye belirtiniz."}).sil(15)
}
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("Whitelist Kategori Bilgilendirme")
.setPlaceholder('Whitelist kategorilerini görüntülemek için tıkla!')
.setMinValues(0)
.setMaxValues(1)
.addOptions([
{
label: "Full",
value: 'full',
emoji: '1157606786627543070',
},
{
label: "Guild",
value: 'guild',
emoji: '1157606786627543070',
},
{
label: "Rol",
value: 'rol',
emoji: '1157606786627543070',
},
{
label: "Kanal",
value: 'kanal',
emoji: '1157606786627543070',
},
{
label: "Ban",
value: 'ban',
emoji: '1157606786627543070',
},
{
label: "Kick",
value: 'kick',
emoji: '1157606786627543070',
},
{
label: "Emoji",
value: 'emoji',
emoji: '1157606786627543070',
},
{
label: "Bot",
value: 'bot',
emoji: '1157606786627543070',
},
{
label: "Sticker",
value: 'sticker',
emoji: '1157606786627543070',
},
{
label: "Küfür",
value: 'swear',
emoji: '1157606786627543070',
},
{
label: "Link",
value: 'advert',
emoji: '1157606786627543070',
},
{
label: "Capslock",
value: 'capslock',
emoji: '1157606786627543070',
},
{
label: "Spam",
value: 'spam',
emoji: '1157606786627543070',
},
{
label: "Tarayıcı",
value: 'web',
emoji: '1157606786627543070',
},
{
label: "Çevrimdışı",
value: 'offline',
emoji: '1157606786627543070',
},
{
label: "İptal",
value: 'exit',
emoji: '1207317729258770432',
},
]),
);
await message.react(message.guild.emojiGöster(emojis.yes))
var msj = await message.reply({embeds: [embed
.setAuthor({ name: 'Sunucu Whitelist Paneli', iconURL: message.guild.iconURL({dynamic: true})})
.setThumbnail(message.guild.iconURL({dynamic: true}))
.setDescription(`
\`\`\`fix

❯ Sunucu Koruma Bilgilendirmesi

\`\`\`

*Güvenlik sistemi \`${message.guild.name}\` isimli sunucunun tüm ayarlarının korumasını sağlar, bu panelden bu işlemleri yaparken limite tabi tutulması gereken kişiler bu komut yardımıyla listeye eklenir ve güvenlik sistemi belli limit karşılığı işlem yapmalarına izin verir fakat bu limit aşıldığında cezalandırma işlemini yapmaktadır.*

\`\`\`fix

❯ Güvenli Listeye Kullanıcı Nasıl Eklenir & Kaldırılır?

\`\`\`

*!wl/güvenli @KullanıcıID/RoleID komutu kullanınız daha sonra aşağıdaki menüden güvenlik derecesini seçiniz ve ekleme işlemini bitiriniz.Kaldırmak için ise aynı komutu kullanıp güvenlik durumunu seçmeniz yeterli olucakdır.*

\` Not: Eğer kişi veya rolü güvenli listeye eklerseniz botun o kişi veya role karşı seçtiğiniz koruma da işlem yapmaz. \``)
.setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})})], components: [row]})
var filter = (menu) => menu.user.id === message.author.id;
const collector = msj.createMessageComponentCollector({ filter, time: 30000 })
collector.on("collect", async (interaction) => {
if(interaction.values[0] === "full") {
interaction.deferUpdate()
collector.stop();
if (veri.full.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { full:safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Full** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { full: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Full** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "guild") {
interaction.deferUpdate()
collector.stop();
if (veri.guild.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { guild: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Guild** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { guild: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Guild** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "rol") {
interaction.deferUpdate()
collector.stop();
if (veri.roles.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { roles: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Rol** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { roles: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Rol** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "kanal") {
interaction.deferUpdate()
collector.stop();
if (veri.channel.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { channel: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Kanal** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { channel: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Kanal** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "ban") {
interaction.deferUpdate()
collector.stop();
if (veri.ban.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { ban: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Ban** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { ban: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Ban** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "kick") {
interaction.deferUpdate()
collector.stop();
if (veri.kick.includes(asafe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { kick: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Kick** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { kick: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Kick** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "emoji") {
interaction.deferUpdate()
collector.stop();
if (veri.emoji.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { emoji: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Emoji** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { emoji: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Emoji** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "bot") {
interaction.deferUpdate()
collector.stop();
if (veri.bot.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { bot: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Bot** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { bot: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Bot** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "sticker") {
interaction.deferUpdate()
collector.stop();
if (veri.sticker.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { sticker: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Sticker** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { sticker: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Sticker** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "swear") {
interaction.deferUpdate()
collector.stop();
if (veri.swear.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { swear: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Küfür** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { swear: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Küfür** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "advert") {
interaction.deferUpdate()
collector.stop();
if (veri.advert.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { advert: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Link** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { advert: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Link** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "capslock") {
interaction.deferUpdate()
collector.stop();
if (veri.capslock.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { capslock: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Capslock** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { capslock: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Capslock** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "spam") {
interaction.deferUpdate()
collector.stop();
if (veri.spam.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { spam: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Spam** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { spam: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Spam** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "web") {
interaction.deferUpdate()
collector.stop();
if (veri.web.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { web: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Web** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { web: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Web** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "offline") {
interaction.deferUpdate()
collector.stop();
if (veri.offline.includes(safe.id)) {
await whitelist.updateOne({ guildID: message.guild.id }, { $pull: { offline: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Offline** Kategorisinden Kaldırıldı.`)], components: [row]})
} else {
await whitelist.updateOne({ guildID: message.guild.id }, { $push: { offline: safe.id } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Offline** Kategorisine Eklendi.`)], components: [row]})
}
}
if(interaction.values[0] === "exit") {
interaction.message.delete().catch(e => {})
}
})
}
}