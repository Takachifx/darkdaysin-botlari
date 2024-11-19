const Discord = require("discord.js");
const settings = require("../../../../Src/Settings/Settings.json")
const emojis = require("../../../../Src/Settings/emojiName.json")
const setups = require("../../../../Src/Schemas/Setup")
const messageGuild = require("../../../../Src/Schemas/MessageGuilds")
const voiceGuild = require("../../../../Src/Schemas/VoiceGuilds")
const messageUser = require("../../../../Src/Schemas/MessageUsers")
const voiceUser = require("../../../../Src/Schemas/VoiceUsers")
const streamUser = require("../../../../Src/Schemas/StreamUsers")
const cameraUser = require("../../../../Src/Schemas/CameraUsers")
const inviterSchema = require("../../../../Src/Schemas/İnvited")
const messageUserChannel = require("../../../../Src/Schemas/MessageUserChannels")
const voiceUserChannel = require("../../../../Src/Schemas/VoiceUserChannels")
const voiceUserParent = require("../../../../Src/Schemas/VoiceUserParents")
const regstats = require("../../../../Src/Schemas/RegisterStaffStats")
module.exports = {
conf: {
aliases: ["statsıfırla", "stat-sifirla", "statsifirla"],
name: "stat-sıfırla",
help: "stat-sıfırla all/aylık/haftalık/günlük",
category: "owner"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!args[0]) return message.reply({content: `${message.member}, Doğru kullanım; ${settings.Moderation.prefix}stat-sıfırla all/aylık/haftalık/günlük`})
if (args[0] === 'günlük') {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onay")
.setLabel("Onayla")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1207317746891759637"),
new Discord.ButtonBuilder()
.setCustomId("red")
.setLabel("İptal")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1207317729258770432"),);
const mesaj = await message.reply({embeds: [embed.setDescription(`${message.member}, Merhaba **${message.guild.name}** Sunucusunun Günlük Stat Verilerini Sıfırlamak İstediğine Emin Misin.?`).setFooter({text: 'Not: Aşağıdaki Button Yardımıyla İşlemi Seçiniz'})], components: [row]})
var filter = (button) => button.user.id === message.member.id;
let collector = await mesaj.createMessageComponentCollector({ filter })
collector.on("collect", async (button) => {
if (button.customId == "onay") {
await button.deferUpdate();
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
message.guild.members.cache.forEach(async (member) => {
await messageGuild.updateOne({ guildID: settings.Moderation.guildID }, { $set: { dailyStat: 0 } }, { upsert: true });
await voiceGuild.updateOne({ guildID: settings.Moderation.guildID }, { $set: { dailyStat: 0 } }, { upsert: true });
await messageUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
await voiceUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
await streamUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
await cameraUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
})
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla Sunucunun Tüm Stat Verileri Sıfırlandı.`)], components: [row]})
}
if (button.customId == "red") {
await button.deferUpdate();
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla İşlem İptal Edildi.`)], components: [row]})
}
})
return; } else if(args[0] === 'haftalık') {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onays")
.setLabel("Onayla")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1207317746891759637"),
new Discord.ButtonBuilder()
.setCustomId("reds")
.setLabel("İptal")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1207317729258770432"),);
const mesaj = await message.reply({embeds: [embed.setDescription(`${message.member}, Merhaba **${message.guild.name}** Sunucusunun Haftalık Stat Verilerini Sıfırlamak İstediğine Emin Misin.?`).setFooter({text: 'Not: Aşağıdaki Button Yardımıyla İşlemi Seçiniz'})], components: [row]})
var filter = (button) => button.user.id === message.member.id;
let collector = await mesaj.createMessageComponentCollector({ filter })
collector.on("collect", async (button) => {
if (button.customId == "onays") {
await button.deferUpdate();
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
message.guild.members.cache.forEach(async (member) => {
await messageGuild.updateOne({ guildID: settings.Moderation.guildID }, { $set: { weeklyStat: 0 } }, { upsert: true });
await voiceGuild.updateOne({ guildID: settings.Moderation.guildID }, { $set: { weeklyStat: 0 } }, { upsert: true });
await messageUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
await voiceUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
await streamUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
await cameraUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
})
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla Sunucunun Tüm Stat Verileri Sıfırlandı.`)], components: [row]})
}
if (button.customId == "reds") {
await button.deferUpdate();
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla İşlem İptal Edildi.`)], components: [row]})
}
})
return; } else if(args[0] === 'aylık') {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onayt")
.setLabel("Onayla")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1207317746891759637"),
new Discord.ButtonBuilder()
.setCustomId("redt")
.setLabel("İptal")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1207317729258770432"),);
const mesaj = await message.reply({embeds: [embed.setDescription(`${message.member}, Merhaba **${message.guild.name}** Sunucusunun Aylık Stat Verilerini Sıfırlamak İstediğine Emin Misin.?`).setFooter({text: 'Not: Aşağıdaki Button Yardımıyla İşlemi Seçiniz'})], components: [row]})
var filter = (button) => button.user.id === message.member.id;
let collector = await mesaj.createMessageComponentCollector({ filter })
collector.on("collect", async (button) => {
if (button.customId == "onayt") {
await button.deferUpdate();
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
message.guild.members.cache.forEach(async (member) => {
await messageGuild.updateOne({ guildID: settings.Moderation.guildID }, { $set: { monthStat: 0 } }, { upsert: true });
await voiceGuild.updateOne({ guildID: settings.Moderation.guildID }, { $set: { monthStat: 0 } }, { upsert: true });
await messageUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { monthStat: 0 } }, { upsert: true });
await voiceUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { monthStat: 0 } }, { upsert: true });
await streamUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { monthStat: 0 } }, { upsert: true });
await cameraUser.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { monthStat: 0 } }, { upsert: true });
})
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla Sunucunun Tüm Stat Verileri Sıfırlandı.`)], components: [row]})
}
if (button.customId == "redt") {
await button.deferUpdate();
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla İşlem İptal Edildi.`)], components: [row]})
}
})
return; } else if(args[0] === 'all') {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onayt")
.setLabel("Onayla")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1207317746891759637"),
new Discord.ButtonBuilder()
.setCustomId("redt")
.setLabel("İptal")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1207317729258770432"),);
const mesaj = await message.reply({embeds: [embed.setDescription(`${message.member}, Merhaba **${message.guild.name}** Sunucusunun Toplam Stat Verilerini Sıfırlamak İstediğine Emin Misin.?`).setFooter({text: 'Not: Aşağıdaki Button Yardımıyla İşlemi Seçiniz'})], components: [row]})
var filter = (button) => button.user.id === message.member.id;
let collector = await mesaj.createMessageComponentCollector({ filter })
collector.on("collect", async (button) => {
if (button.customId == "onayt") {
await button.deferUpdate();
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
await messageGuild.deleteMany({ guildID: settings.Moderation.guildID }, { upsert: true });
await voiceGuild.deleteMany({ guildID: settings.Moderation.guildID }, { upsert: true });
await messageUser.deleteMany({ guildID: settings.Moderation.guildID }, { upsert: true });
await voiceUser.deleteMany({ guildID: settings.Moderation.guildID }, { upsert: true });
await streamUser.deleteMany({ guildID: settings.Moderation.guildID }, { upsert: true });
await cameraUser.deleteMany({ guildID: settings.Moderation.guildID }, { upsert: true });
await inviterSchema.deleteMany({ guildID: settings.Moderation.guildID }, { upsert: true });
await messageUserChannel.deleteMany({ guildID: settings.Moderation.guildID }, { upsert: true });
await voiceUserChannel.deleteMany({ guildID: settings.Moderation.guildID }, { upsert: true });
await voiceUserParent.deleteMany({ guildID: settings.Moderation.guildID }, { upsert: true });
await regstats.deleteMany({ guildID: settings.Moderation.guildID }, { upsert: true });
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla Sunucunun Tüm Stat Verileri Sıfırlandı.`)], components: [row]})
}
if (button.customId == "redt") {
await button.deferUpdate();
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla İşlem İptal Edildi.`)], components: [row]})
}
})
return;}
}
}