const settings = require("../../../Src/Settings/Settings.json");
const setups = require("../../../Src/Schemas/Setup");
const Discord = require("discord.js")
const messageUser = require("../../../Src/Schemas/MessageUsers");
const voiceUser = require("../../../Src/Schemas/VoiceUsers");
const streamUser = require("../../../Src/Schemas/StreamUsers")
const messageGuild = require("../../../Src/Schemas/MessageGuilds");
const Invited = require("../../../Src/Schemas/İnvited");
const voiceGuild = require("../../../Src/Schemas/VoiceGuilds");
const cameraUser = require("../../../Src/Schemas/CameraUsers")
const leaveLimit = require('../../../Src/Schemas/LeaveLimits')
const RegisterStaffStats = require("../../../Src/Schemas/RegisterStaffStats");
const emojis = require("../../../Src/Settings/emojiName.json")
const setup = require("../../../Src/Schemas/UserSetups")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
const { CronJob } = require("cron");
const client = global.client;
module.exports = async () => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if(!ayar) return;
const guild = client.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
const daily = new CronJob("0 0 * * *", () => {
guild.members.cache.filter(member => !member.user.bot).forEach(async (member) => {
const channel = await client.kanalBul("günlük-sıfırlama-log")
await leaveLimit.deleteMany({guildID: settings.Moderation.guildID})
await messageGuild.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $set: { dailyStat: 0 } }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $set: { dailyStat: 0 } }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const MesajData = await messageUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Günlük Mesaj Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Günlük (${MesajData ? MesajData.dailyStat || 0 : 0}) Mesaj Statı Sıfırlandı.**`)]})
}
await messageUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const SesData = await voiceUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Günlük Ses Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Günlük (${SesData ? moment.duration(SesData.dailyStat).format("D [Gün], H [Saat], m [Dakika], s [Saniye]") || 0 : 0}) Ses Statı Sıfırlandı.**`)]})
}
await voiceUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const streamData = await streamUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Günlük Yayın Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Günlük (${streamData ? moment.duration(streamData.dailyStat).format("D [Gün], H [Saat], m [Dakika], s [Saniye]") || 0 : 0}) Yayın Statı Sıfırlandı.**`)]})
}
await streamUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const cameraData = await cameraUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Günlük Kamera Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Günlük (${cameraData ? moment.duration(cameraData.dailyStat).format("D [Gün], H [Saat], m [Dakika], s [Saniye]") || 0 : 0}) Kamera Statı Sıfırlandı.**`)]})
}
await cameraUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const DavetData = await Invited.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Günlük Davet Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Günlük (${DavetData ? DavetData.top1 || 0 : 0}) Davet Statı Sıfırlandı.**`)]})
}
await Invited.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { top1: 0, fake1: 0 } }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const KayitData = await RegisterStaffStats.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Günlük Kayıt Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Günlük (${KayitData ? KayitData.top1 || 0 : 0}) Kayıt Statı Sıfırlandı.**`)]})
}
await RegisterStaffStats.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { erkek1: 0, kadin1: 0, top1: 0 } }, { upsert: true });
});
}, null, true, "Europe/Istanbul");
daily.start();
const weekly = new CronJob("0 0 * * 0", () => {
guild.members.cache.filter(member => !member.user.bot).forEach(async (member) => {
const channel = await client.kanalBul("haftalık-sıfırlama-log")
await messageGuild.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $set: { weeklyStat: 0} }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $set: { weeklyStat: 0} }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const MesajData = await messageUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Haftalık Mesaj Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Haftalık (${MesajData ? MesajData.weeklyStat || 0 : 0}) Mesaj Statı Sıfırlandı.**`)]})
}
await messageUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { weeklyStat: 0} }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const SesData = await voiceUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Haftalık Ses Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Haftalık (${SesData ? moment.duration(SesData.weeklyStat).format("D [Gün], H [Saat], m [Dakika], s [Saniye]") || 0 : 0}) Ses Statı Sıfırlandı.**`)]})
}
await voiceUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { weeklyStat: 0} }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const streamData = await streamUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Haftalık Yayın Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Haftalık (${streamData ? moment.duration(streamData.weeklyStat).format("D [Gün], H [Saat], m [Dakika], s [Saniye]") || 0 : 0}) Yayın Statı Sıfırlandı.**`)]})
}
await streamUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { weeklyStat: 0} }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const cameraData = await cameraUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Haftalık Kamera Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Haftalık (${cameraData ? moment.duration(cameraData.weeklyStat).format("D [Gün], H [Saat], m [Dakika], s [Saniye]") || 0 : 0}) Kamera Statı Sıfırlandı.**`)]})
}
await cameraUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { weeklyStat: 0} }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const DavetData = await InvitedUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Haftalık Davet Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Haftalık (${DavetData ? DavetData.top7 || 0 : 0}) Davet Statı Sıfırlandı.**`)]})
}
await Invited.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { top7: 0, fake7: 0 } }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const RegisterData = await RegisterUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Haftalık Kayıt Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Haftalık (${RegisterData ? RegisterData.top7 || 0 : 0}) Kayıt Statı Sıfırlandı.**`)]})
}
await RegisterStaffStats.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { erkek7: 0, kadin7: 0, top7: 0 } }, { upsert: true });
});
}, null, true, "Europe/Istanbul");
weekly.start();
const weeklyTwo = new CronJob("0 0 */2 * *", () => {
guild.members.cache.filter(member => !member.user.bot).forEach(async (member) => {
await messageGuild.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
await messageUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
await voiceUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
await streamUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
await cameraUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
});
}, null, true, "Europe/Istanbul");
weeklyTwo.start();
const weeklyThree = new CronJob("0 0 */3 * *", () => {
guild.members.cache.filter(member => !member.user.bot).forEach(async (member) => {
await messageGuild.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
await messageUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
await voiceUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
await streamUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
await cameraUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
});
}, null, true, "Europe/Istanbul");
weeklyThree.start();
const month = new CronJob("0 0 1 * *", () => {
guild.members.cache.filter(member => !member.user.bot).forEach(async (member) => {
const channel = await client.kanalBul("aylık-sıfırlama-log")
await messageGuild.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $set: { monthStat: 0} }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $set: { monthStat: 0} }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const MesajData = await messageUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Aylık Mesaj Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Aylık (${MesajData ? MesajData.monthStat || 0 : 0}) Mesaj Statı Sıfırlandı.**`)]})
}
await messageUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { monthStat: 0} }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const SesData = await voiceUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Aylık Ses Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Aylık (${SesData ? moment.duration(SesData.monthStat).format("D [Gün], H [Saat], m [Dakika], s [Saniye]") || 0 : 0}) Ses Statı Sıfırlandı.**`)]})
}
await voiceUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { monthStat: 0} }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const streamData = await streamUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Aylık Yayın Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Aylık (${streamData ? moment.duration(streamData.monthStat).format("D [Gün], H [Saat], m [Dakika], s [Saniye]") || 0 : 0}) Yayın Statı Sıfırlandı.**`)]})
}
await streamUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { monthStat: 0} }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const cameraData = await cameraUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Aylık Kamera Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Aylık (${cameraData ? moment.duration(cameraData.monthStat).format("D [Gün], H [Saat], m [Dakika], s [Saniye]") || 0 : 0}) Kamera Statı Sıfırlandı.**`)]})
}
await cameraUser.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { monthStat: 0} }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const DavetData = await InvitedUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Aylık Davet Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Aylık (${DavetData ? DavetData.top30 || 0 : 0}) Davet Statı Sıfırlandı.**`)]})
}
await Invited.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { top30: 0, fake30: 0 } }, { upsert: true });
if(member.roles.highest.position >= guild.roles.cache.get(ayar.registerPerms).position) {
const RegisterData = await RegisterUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id })
if(channel) await channel.send({embeds: [new Discord.EmbedBuilder().setAuthor({name: member.user.displayName, iconURL: member.displayAvatarURL({dynamic: true})}).setFooter({text: `${member.user.username} Kullanıcısının Aylık Kayıt Statı Sıfırlandı.`, iconURL: member.displayAvatarURL({dynamic: true})}).setThumbnail(guild.iconURL({dynamic: true})).setDescription(`
${guild.emojiGöster(emojis.info)} **${member} Kullanıcısının Aylık (${RegisterData ? RegisterData.top30 || 0 : 0}) Kayıt Statı Sıfırlandı.**`)]})
}
await RegisterStaffStats.findOneAndUpdate({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { erkek30: 0, kadin30: 0, top30: 0 } }, { upsert: true });
});
}, null, true, "Europe/Istanbul");
month.start();
const weeklyr = new CronJob("0 0 * * *", () => {
guild.members.cache.filter(member => !member.user.bot && ayar.manRoles.some(role => member.roles.cache.has(role)) && ayar.womanRoles.some(role => member.roles.cache.has(role)) && member.roles.highest.position >= guild.roles.cache.get(ayar.unregRoles[0]).position).forEach(async (member) => {
const datas = await setup.findOne({guildID: settings.Moderation.guildID, userID: member.id})
if(!datas) new setup({guildID: settings.Moderation.guildID, userID: member.id, levelSystem: true, monthlySystem: true}).save();
if(datas && datas.monthlySystem == false) return;
const logKanal = await client.kanalBul("üye-log")
if(Date.now() - member.joinedAt > 1000 * 60 * 60 * 24 * 30 && !member.roles.cache.has(ayar.oneMonthRoles) && !member.roles.cache.has(ayar.threeMonthRoles) && !member.roles.cache.has(ayar.sixMonthRoles) && !member.roles.cache.has(ayar.nineMonthRoles) && !member.roles.cache.has(ayar.oneYearRoles)) {
await member.addRoles(ayar.oneMonthRoles)
await logKanal.send({content: `${member}`, embeds: [new Discord.EmbedBuilder().setDescription(`${member} Sunucuda Toplam **30** Gün Geçirerek ${guild.roles.cache.get(ayar.oneMonthRoles)} Rolünü Kazandınız!`).setColor("Random").setAuthor({name: member.user.username, iconURL: member.user.avatarURL({dynamic: true})}).setThumbnail(member.user.avatarURL({dynamic: true})).setFooter({text: guild.name, iconURL: guild.iconURL({dynamic: true})})]})
}
if(Date.now() - member.joinedAt > 1000 * 60 * 60 * 24 * 90 && !member.roles.cache.has(ayar.threeMonthRoles) && !member.roles.cache.has(ayar.sixMonthRoles) && !member.roles.cache.has(ayar.nineMonthRoles) && !member.roles.cache.has(ayar.oneYearRoles)) {
await member.removeRoles(ayar.oneMonthRoles)
await member.addRoles(ayar.threeMonthRoles)
await logKanal.send({content: `${member}`, embeds: [new Discord.EmbedBuilder().setDescription(`${member} Sunucuda Toplam **90** Gün Geçirerek ${guild.roles.cache.get(ayar.threeMonthRoles)} Rolünü Kazandınız!`).setColor("Random").setAuthor({name: member.user.username, iconURL: member.user.avatarURL({dynamic: true})}).setThumbnail(member.user.avatarURL({dynamic: true})).setFooter({text: guild.name, iconURL: guild.iconURL({dynamic: true})})]})
}
if(Date.now() - member.joinedAt > 1000 * 60 * 60 * 24 * 180 && !member.roles.cache.has(ayar.sixMonthRoles) && !member.roles.cache.has(ayar.nineMonthRoles) && !member.roles.cache.has(ayar.oneYearRoles)) {
await member.removeRoles(ayar.threeMonthRoles)
await member.addRoles(ayar.sixMonthRoles)
await logKanal.send({content: `${member}`, embeds: [new Discord.EmbedBuilder().setDescription(`${member} Sunucuda Toplam **180** Gün Geçirerek ${guild.roles.cache.get(ayar.sixMonthRoles)} Rolünü Kazandınız!`).setColor("Random").setAuthor({name: member.user.username, iconURL: member.user.avatarURL({dynamic: true})}).setThumbnail(member.user.avatarURL({dynamic: true})).setFooter({text: guild.name, iconURL: guild.iconURL({dynamic: true})})]})
}
if(Date.now() - member.joinedAt > 1000 * 60 * 60 * 24 * 270 && !member.roles.cache.has(ayar.nineMonthRoles) && !member.roles.cache.has(ayar.oneYearRoles)) {
await member.removeRoles(ayar.sixMonthRoles)
await member.addRoles(ayar.nineMonthRoles)
await logKanal.send({content: `${member}`, embeds: [new Discord.EmbedBuilder().setDescription(`${member} Sunucuda Toplam **270** Gün Geçirerek ${guild.roles.cache.get(ayar.nineMonthRoles)} Rolünü Kazandınız!`).setColor("Random").setAuthor({name: member.user.username, iconURL: member.user.avatarURL({dynamic: true})}).setThumbnail(member.user.avatarURL({dynamic: true})).setFooter({text: guild.name, iconURL: guild.iconURL({dynamic: true})})]})
}
if(Date.now() - member.joinedAt > 1000 * 60 * 60 * 24 * 365 && !member.roles.cache.has(ayar.oneYearRoles)) {
await member.removeRoles(ayar.nineMonthRoles)
await member.addRoles(ayar.oneYearRoles)
await logKanal.send({content: `${member}`, embeds: [new Discord.EmbedBuilder().setDescription(`${member} Sunucuda Toplam **365** Gün Geçirerek ${guild.roles.cache.get(ayar.oneYearRoles)} Rolünü Kazandınız!`).setColor("Random").setAuthor({name: member.user.username, iconURL: member.user.avatarURL({dynamic: true})}).setThumbnail(member.user.avatarURL({dynamic: true})).setFooter({text: guild.name, iconURL: guild.iconURL({dynamic: true})})]})
}
})
}, null, true, "Europe/Istanbul");
weeklyr.start();
}
module.exports.conf = {
name: "ready",
};