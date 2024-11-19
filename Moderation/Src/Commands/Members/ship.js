const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Ship = require("../../../../Src/Plugins/Ship")
const evlilik = require("../../../../Src/Schemas/Marriage")
const Discord = require("discord.js")
module.exports = {
conf: {
name: "ship",
aliases: ["ship"],
help: "ship @Darkdays/ID",
category: "kullanici",
cooldown: 15
},
Cyrstal: async (client, message, args) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
let kanallar = ["ship", "ship-chat"]
if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) {
await message.react(message.guild.emojiGöster(emojis.no))
let kanalListesi = [...new Set(kanallar.map(x => message.guild.channels.cache.find(chan => chan.name.toLowerCase().includes(x))))];
return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${kanalListesi.map(kanal => kanal.toString()).join(', ')} Kanallarında Kullanabilirsin.`}).sil(15)
}
if(ayar.manRoles.some(r => message.member.roles.cache.has(r)) || message.member.roles.cache.has(ayar.manRoles[0])) {
const member = message.mentions.members.first() || message.guild.members.cache.filter(uye => !uye.user.bot && ayar.womanRoles.some(role => uye.roles.cache.has(role)) || uye.roles.cache.has(ayar.womanRoles[0])).random();
if(!member) return;
const sayı = Math.floor(Math.random() * 101);
const ship = await new Ship()
.setAvatars(message.member.displayAvatarURL({ dynamic: true, extension: "png" }) || message.author.avatarURL({ dynamic: true, extension: "png" }), member.displayAvatarURL({ dynamic: true, extension: "png" }) || member.avatarURL({ dynamic: true, extension: "png" }))
.setBackground("image", `https://4kwallpapers.com/images/wallpapers/mountain-range-3840x2160-18000.jpg`)
.setBorder(randomColor())
.setOverlayOpacity(0.5)
.miktar(sayı)
.build();
let spotify = [
'https://open.spotify.com/track/2SGltWNsdjCjyf6eh3iM0g?si=c49bb2c15ac343f5',
'https://open.spotify.com/track/0ywlnV6QEZneCbbqLev6qL?si=a94d3ae7328b476c',
'https://open.spotify.com/track/0JkZUrGmvzpX4yP8CoqItc?si=c5b35b77a6804b43',
'https://open.spotify.com/track/0yrqfgfaQs222WGcZMvIFA?si=3219a4f749884702',
'https://open.spotify.com/track/2911GW6Gdfuc3CQ2HrLDn6?si=a590bce4552f40a0',
'https://open.spotify.com/track/3ZGUpGjkL9D5wjMWd7wFB5?si=ed9b59544f6a4eab',
'https://open.spotify.com/track/38j60DwttFNYk2GmCTIUod?si=2ab67840f1a84dd0',
'https://open.spotify.com/track/6KmThLltgcLO058vNzxvMV?si=2a89388eeb42414c',
'https://open.spotify.com/track/26EzdCBOvRJljcc2zYOEVP?si=e4c5cd109369406e',
'https://open.spotify.com/track/7hrjh79DQVNwGTL3EgrBi4?si=c4e24bf978ea457c',
'https://open.spotify.com/track/11AkXmBdjwu4upt22GjJrG?si=76fe1e69c3224af3',
'https://open.spotify.com/track/6ZvKnJSendvbZGiVMmgIdp?si=c3fb586f7c0142b2',
'https://open.spotify.com/track/0kjy0Qk3anB4t1dNIL7No3?si=8f9cea3da1e146e3',
'https://open.spotify.com/track/3jDcUArWhSonfHpK3QXJug?si=2b4db33b15784b89',
'https://open.spotify.com/track/4uoXb2toU8zWD27TpJS7Yk?si=1a6217915dd5422f',
'https://open.spotify.com/track/4UohOvkgmCt3p0PYOPnHjN?si=8f0199b91b164724',
'https://open.spotify.com/track/04RR90pc7GMGHfELXfuX2Z?si=56154d8544164a7b',
'https://open.spotify.com/track/6CcJMwBtXByIz4zQLzFkKc?si=a76b6157d1c6480b',
'https://open.spotify.com/track/1GvNBnLOlRKZYS93fdEN9h?si=9e3a97956b3d4046',
'https://open.spotify.com/track/0wr0JTOlgZVYccny0GlL4T?si=432cd351bee74708',
'https://open.spotify.com/track/3bKMzeLEDmPHzDMWplhdtP?si=4d28a63f8a3a4a67',
'https://open.spotify.com/track/5SFBaOi2ELB2P5tFzmcD73?si=713b86f5e0d64a62',
'https://open.spotify.com/track/2pPJA6IEl9iyXtVyrE06cT?si=05e234d20ad645b7',
'https://open.spotify.com/track/6nhJ2KSi1rKGX75frHpkXK?si=7bd37d56f85f4148',
'https://open.spotify.com/track/5XMAeSjjinBwKjdANxHbeZ?si=87ec32afe2994536',
'https://open.spotify.com/track/0slHapEcgmGP0kwfqQLLmP?si=4bf5c78418ef4136',
'https://open.spotify.com/intl-tr/track/4ySBa6Ho1KxSGgxT8MIPEf?si=8b964949d79247b9',
'https://open.spotify.com/intl-tr/track/4WzEt032hy8gLMSJVOB90O?si=8a4548794bb64490',
'https://open.spotify.com/intl-tr/track/01zrETrdU6ywRoqXZXBfbV?si=bf12521701804d68',
'https://open.spotify.com/intl-tr/track/56wAzOBkIYK8YXSGu2Wldg?si=9f59ddb60bf14c87',
'https://open.spotify.com/intl-tr/track/5nld3fSkdB34dvCeyhw8zW?si=dabbc434bf024e2d',
'https://open.spotify.com/intl-tr/track/1Ji7vJOJIYAuZLeLWS9Xrg?si=6a9f5759ab6240d2',
'https://open.spotify.com/intl-tr/track/7Ikg74SQrxu5DMpEEbestg?si=75e2b68aa1144bf1',
'https://open.spotify.com/intl-tr/track/3730z7N28rvWW4PpSXR7PY?si=01d2784858ba47c4',
'https://open.spotify.com/intl-tr/track/4hv9mEWi4911k1uhU4fPEH?si=9132c8ea589943b8',
'https://open.spotify.com/intl-tr/track/0yxxBfo9KWMPnAjuaKhfdi?si=c140f0a378544a3d',
]
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("tanis")
.setLabel("Tanış")
.setStyle(Discord.ButtonStyle.Primary)
.setEmoji("1235161929752903772"),
new Discord.ButtonBuilder()
.setCustomId("evlen")
.setLabel("Evlen")
.setStyle(Discord.ButtonStyle.Danger)
.setEmoji("1235161713402187836"),
new Discord.ButtonBuilder()
.setCustomId("spotify")
.setLabel("Şarkınız")
.setStyle(Discord.ButtonStyle.Success)
.setEmoji("1258058530464993381"),
new Discord.ButtonBuilder()
.setCustomId("delete")
.setLabel("Mesajı Sil")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1194083968803414107")
)
const msj = await message.reply({ content: `>>> **[ ${message.member.displayName} ] İle [ ${member.displayName} ] Arasındaki İlişki.**`, files: [{attachment: ship,name: `ship.png`}], components: [row] });
const filter = (button) => button.user.id === message.author.id;
const collector = msj.createMessageComponentCollector({ filter });
collector.on("collect", async (i) => {
if (i.customId === "tanis") {
row.components[0].setDisabled(true)
if(sayı < 55) {
await msj.edit({components: [row]});
return await i.reply({ content: `Bu Kullanıcı İle Tanışamazsın.`, ephemeral: true});
}
await i.reply({ content: `${member} *İle İnşallah Mutlu Birlikteliğiniz Olur.*`, ephemeral: true});
await msj.edit({ components: [row] })
}
if (i.customId === "evlen") {
row.components[1].setDisabled(true)
if(sayı < 55) {
await msj.edit({components: [row]});
return await i.reply({ content: `Bu Kullanıcı İle Evlenemezsin.`, ephemeral: true});
}
const data = await evlilik.findOne({guildID: settings.Moderation.guildID, userID: message.author.id});
if(data && data.friendsID) return i.reply({ content: `Zaten ${data && data.friendsID && message.guild.members.cache.get(data.friendsID) ? message.guild.members.cache.get(data.friendsID) : "Bulunamadı."} İle Evlenmişsiniz.`, ephemeral: true});
const data2 = await evlilik.findOne({guildID: settings.Moderation.guildID, userID: member.id});
if(data2 && data2.friendsID) return i.reply({ content: `${member} Zaten ${data2 && data2.friendsID && message.guild.members.cache.get(data2.friendsID) ? message.guild.members.cache.get(data2.friendsID) : "Bulunamadı."} İle Evlenmiş.`, ephemeral: true});
let yüzük = ["Tek Taş Yüzük", "Elmas Yüzük", "Altın Yüzük", "Gümüş Yüzük", "Bronz Yüzük"];
let yüzükler = yüzük[Math.floor(Math.random() * yüzük.length)];
const yüzüks = yüzükler;
const rows = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Success).setEmoji("1207317746891759637").setLabel("Kabul Et").setCustomId("evet"),
new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Danger).setEmoji("1207317729258770432").setLabel("Reddet").setCustomId("hayir")
);
const msg = await i.reply({ content: `${member}, ${message.member} Kullanıcısı Seninle Evlenmek İstiyor Kabul Ediyor Musunuz?`, components: [rows], files: [] });
let filters = (interactions) => interactions.member.id === member.id
const collectors = msj.createMessageComponentCollector({ filters: filters, time: 30000  });
collectors.on("collect", async (interaction) => {
await interaction.deferUpdate();
if (interaction.customId === "evet") {
await evlilik.updateOne({guildID: settings.Moderation.guildID, userID: message.author.id}, {$set: {friendsID: member.id, yüzük: yüzüks, Date: Date.now()}, }, {upsert: true});
await evlilik.updateOne({guildID: settings.Moderation.guildID, userID: member.id}, {$set: {friendsID: message.author.id, yüzük: yüzüks, Date: Date.now()}, }, {upsert: true});
await msg.edit({ content: `${message.guild.emojiGöster(emojis.kalp)} ${message.member}, Başarıyla ${member} Kullanıcısı İle Evlendiniz.`, components: [] });
}
if (interaction.customId === "hayir") {
await msg.edit({ content: `${message.guild.emojiGöster(emojis.kalp)} ${message.member}, ${member} Kullanıcısı Evlilik Teklifini Reddetti.`, components: [] });
}
})
collectors.on("end", async (i) => {
await msg.edit({components: []})
})
}
if (i.customId === "spotify") {
row.components[2].setDisabled(true)
if(sayı < 55) {
await msj.edit({components: [row]});
return await i.reply({ content: `Bu Kullanıcı İle Spotify'da Bir Randevu Alamazsın.`, ephemeral: true});
}
const random = Math.floor(Math.random() * (spotify.length));
await i.reply({ content: `Spotify'da ${member} ile ${spotify[random]}`, ephemeral: true});
await msj.edit({ components: [row] })
}
if (i.customId === "delete") {
await message.delete().catch(() => {});
await msj.delete().catch(() => {});
}
})
} else if(ayar.womanRoles.some(role => message.member.roles.cache.has(role)) || message.member.roles.cache.has(ayar.womanRoles[0])) {
const member = message.mentions.members.first() || message.guild.members.cache.filter(uye => !uye.user.bot && ayar.manRoles.some(role => uye.roles.cache.has(role)) || uye.roles.cache.has(ayar.manRoles[0])).random();
if(!member) return;
const sayı = Math.floor(Math.random() * 101);
const ship = await new Ship()
.setAvatars(message.member.displayAvatarURL({ dynamic: true, extension: "png" }) || message.author.avatarURL({ dynamic: true, extension: "png" }), member.displayAvatarURL({ dynamic: true, extension: "png" }) || member.avatarURL({ dynamic: true, extension: "png" }))
.setBackground("image", `https://4kwallpapers.com/images/wallpapers/couple-romantic-lovers-cave-sci-fi-aesthetic-3840x2160-1454.jpg`)
.setBorder(randomColor())
.setOverlayOpacity(0.5)
.miktar(sayı)
.build();
let spotify = [
'https://open.spotify.com/track/2SGltWNsdjCjyf6eh3iM0g?si=c49bb2c15ac343f5',
'https://open.spotify.com/track/0ywlnV6QEZneCbbqLev6qL?si=a94d3ae7328b476c',
'https://open.spotify.com/track/0JkZUrGmvzpX4yP8CoqItc?si=c5b35b77a6804b43',
'https://open.spotify.com/track/0yrqfgfaQs222WGcZMvIFA?si=3219a4f749884702',
'https://open.spotify.com/track/2911GW6Gdfuc3CQ2HrLDn6?si=a590bce4552f40a0',
'https://open.spotify.com/track/3ZGUpGjkL9D5wjMWd7wFB5?si=ed9b59544f6a4eab',
'https://open.spotify.com/track/38j60DwttFNYk2GmCTIUod?si=2ab67840f1a84dd0',
'https://open.spotify.com/track/6KmThLltgcLO058vNzxvMV?si=2a89388eeb42414c',
'https://open.spotify.com/track/26EzdCBOvRJljcc2zYOEVP?si=e4c5cd109369406e',
'https://open.spotify.com/track/7hrjh79DQVNwGTL3EgrBi4?si=c4e24bf978ea457c',
'https://open.spotify.com/track/11AkXmBdjwu4upt22GjJrG?si=76fe1e69c3224af3',
'https://open.spotify.com/track/6ZvKnJSendvbZGiVMmgIdp?si=c3fb586f7c0142b2',
'https://open.spotify.com/track/0kjy0Qk3anB4t1dNIL7No3?si=8f9cea3da1e146e3',
'https://open.spotify.com/track/3jDcUArWhSonfHpK3QXJug?si=2b4db33b15784b89',
'https://open.spotify.com/track/4uoXb2toU8zWD27TpJS7Yk?si=1a6217915dd5422f',
'https://open.spotify.com/track/4UohOvkgmCt3p0PYOPnHjN?si=8f0199b91b164724',
'https://open.spotify.com/track/04RR90pc7GMGHfELXfuX2Z?si=56154d8544164a7b',
'https://open.spotify.com/track/6CcJMwBtXByIz4zQLzFkKc?si=a76b6157d1c6480b',
'https://open.spotify.com/track/1GvNBnLOlRKZYS93fdEN9h?si=9e3a97956b3d4046',
'https://open.spotify.com/track/0wr0JTOlgZVYccny0GlL4T?si=432cd351bee74708',
'https://open.spotify.com/track/3bKMzeLEDmPHzDMWplhdtP?si=4d28a63f8a3a4a67',
'https://open.spotify.com/track/5SFBaOi2ELB2P5tFzmcD73?si=713b86f5e0d64a62',
'https://open.spotify.com/track/2pPJA6IEl9iyXtVyrE06cT?si=05e234d20ad645b7',
'https://open.spotify.com/track/6nhJ2KSi1rKGX75frHpkXK?si=7bd37d56f85f4148',
'https://open.spotify.com/track/5XMAeSjjinBwKjdANxHbeZ?si=87ec32afe2994536',
'https://open.spotify.com/track/0slHapEcgmGP0kwfqQLLmP?si=4bf5c78418ef4136',
'https://open.spotify.com/intl-tr/track/4ySBa6Ho1KxSGgxT8MIPEf?si=8b964949d79247b9',
'https://open.spotify.com/intl-tr/track/4WzEt032hy8gLMSJVOB90O?si=8a4548794bb64490',
'https://open.spotify.com/intl-tr/track/01zrETrdU6ywRoqXZXBfbV?si=bf12521701804d68',
'https://open.spotify.com/intl-tr/track/56wAzOBkIYK8YXSGu2Wldg?si=9f59ddb60bf14c87',
'https://open.spotify.com/intl-tr/track/5nld3fSkdB34dvCeyhw8zW?si=dabbc434bf024e2d',
'https://open.spotify.com/intl-tr/track/1Ji7vJOJIYAuZLeLWS9Xrg?si=6a9f5759ab6240d2',
'https://open.spotify.com/intl-tr/track/7Ikg74SQrxu5DMpEEbestg?si=75e2b68aa1144bf1',
'https://open.spotify.com/intl-tr/track/3730z7N28rvWW4PpSXR7PY?si=01d2784858ba47c4',
'https://open.spotify.com/intl-tr/track/4hv9mEWi4911k1uhU4fPEH?si=9132c8ea589943b8',
'https://open.spotify.com/intl-tr/track/0yxxBfo9KWMPnAjuaKhfdi?si=c140f0a378544a3d',
]
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("tanis")
.setLabel("Tanış")
.setStyle(Discord.ButtonStyle.Primary)
.setEmoji("1235161929752903772"),
new Discord.ButtonBuilder()
.setCustomId("evlen")
.setLabel("Evlen")
.setStyle(Discord.ButtonStyle.Danger)
.setEmoji("1235161713402187836"),
new Discord.ButtonBuilder()
.setCustomId("spotify")
.setLabel("Şarkınız")
.setStyle(Discord.ButtonStyle.Success)
.setEmoji("1258058530464993381"),
new Discord.ButtonBuilder()
.setCustomId("delete")
.setLabel("Mesajı Sil")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1194083968803414107")
)
const msj = await message.reply({ content: `>>> **[ ${message.member.displayName} ] İle [ ${member.displayName} ] Arasındaki İlişki.**`, files: [{attachment: ship,name: `ship.png`}], components: [row] });
const filter = (button) => button.user.id === message.author.id;
const collector = msj.createMessageComponentCollector({ filter, time: 30000 });
collector.on("collect", async (i) => {
if (i.customId === "tanis") {
row.components[0].setDisabled(true)
if(sayı < 55) {
await msj.edit({components: [row]});
return await i.reply({ content: `Bu Kullanıcı İle Tanışamazsın.`, ephemeral: true});
}
await i.reply({ content: `${member} *İle İnşallah Mutlu Birlikteliğiniz Olur.*`, ephemeral: true});
await msj.edit({ components: [row] })
}
if (i.customId === "evlen") {
row.components[1].setDisabled(true)
if(sayı < 55) {
await msj.edit({components: [row]});
return await i.reply({ content: `Bu Kullanıcı İle Evlenemezsin.`, ephemeral: true});
}
const data = await evlilik.findOne({guildID: settings.Moderation.guildID, userID: message.author.id});
if(data && data.friendsID) return i.reply({ content: `Zaten ${data && data.friendsID && message.guild.members.cache.get(data.friendsID) ? message.guild.members.cache.get(data.friendsID) : "Bulunamadı."} İle Evlenmişsiniz.`, ephemeral: true});
const data2 = await evlilik.findOne({guildID: settings.Moderation.guildID, userID: member.id});
if(data2 && data2.friendsID) return i.reply({ content: `${member} Zaten ${data2 && data2.friendsID && message.guild.members.cache.get(data2.friendsID) ? message.guild.members.cache.get(data2.friendsID) : "Bulunamadı."} İle Evlenmiş.`, ephemeral: true});
let yüzük = ["Tek Taş Yüzük", "Elmas Yüzük", "Altın Yüzük", "Gümüş Yüzük", "Bronz Yüzük"];
let yüzükler = yüzük[Math.floor(Math.random() * yüzük.length)];
const yüzüks = yüzükler;
const rows = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Success).setEmoji("1207317746891759637").setLabel("Kabul Et").setCustomId("evet"),
new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Danger).setEmoji("1207317729258770432").setLabel("Reddet").setCustomId("hayir")
);
const msg = await i.reply({ content: `${member}, ${message.member} Kullanıcısı Seninle Evlenmek İstiyor Kabul Ediyor Musunuz?`, components: [rows], files: [] });
let filters = (interactions) => interactions.member.id === member.id
const collectors = msj.createMessageComponentCollector({ filters: filters, time: 30000 });
collectors.on("collect", async (interaction) => {
await interaction.deferUpdate();
if (interaction.customId === "evet") {
await evlilik.updateOne({guildID: settings.Moderation.guildID, userID: message.author.id}, {$set: {friendsID: member.id, yüzük: yüzüks}, }, {upsert: true});
await evlilik.updateOne({guildID: settings.Moderation.guildID, userID: member.id}, {$set: {friendsID: message.author.id, yüzük: yüzüks}, }, {upsert: true});
await msg.edit({ content: `${message.guild.emojiGöster(emojis.kalp)} ${message.member}, Başarıyla ${member} Kullanıcısı İle Evlendiniz.`, components: [] });
}
if (interaction.customId === "hayir") {
await msg.edit({ content: `${message.guild.emojiGöster(emojis.kalp)} ${message.member}, ${member} Kullanıcısı Evlilik Teklifini Reddetti.`, components: [] });
}
})
collectors.on("end", async (i) => {
await msg.edit({components: []})
})
}
if (i.customId === "spotify") {
row.components[2].setDisabled(true)
if(sayı < 55) {
await msj.edit({components: [row]});
return await i.reply({ content: `Bu Kullanıcı İle Spotify'da Bir Randevu Alamazsın.`, ephemeral: true});
}
const random = Math.floor(Math.random() * (spotify.length));
await i.reply({ content: `Spotify'da ${member} ile ${spotify[random]}`, ephemeral: true});
await msj.edit({ components: [row] })
}
if (i.customId === "delete") {
await message.delete().catch(() => {});
await msj.delete().catch(() => {});
}
})
}
}
};

function randomColor() {
const letters = '0123456789ABCDEF';
let color = '#';
for (let i = 0; i < 6; i++) {
color += letters[Math.floor(Math.random() * 16)];
}
return color;
}
