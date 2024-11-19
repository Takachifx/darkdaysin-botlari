const settings = require('../../Src/Settings/Settings.json');
const otherShield = global.mainShield
const Discord = require('discord.js')
const PDB = require('../../Src/Schemas/Panels')
module.exports = async(oldGuild, newGuild) => {
const guild = otherShield.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
let logs = await guild.fetchAuditLogs({ type: Discord.AuditLogEvent.GuildUpdate });
let entry = logs.entries.first();
let panel = await PDB.findOne({ guildID: guild.id });
if(!panel) panel = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(panel.guildShield == false) return;
if (!entry || !entry.executor) {
return;}
if(await otherShield.CheckBot(entry.executorId)) return;
if(await otherShield.WhitelistControl(entry.executorId, "guild") || await otherShield.WhitelistControl(entry.executorId, "full")) return;
await client.ytKapat()
await newGuild.setIcon(oldGuild.iconURL({ dynamic: true })).catch(e => {})
await newGuild.setBanner(oldGuild.bannerURL({ size: 2048, dynamic: true })).catch(e => {})
await newGuild.setName(oldGuild.name).catch(e => {})
await newGuild.setSplash(oldGuild.splash).catch(e => {})
}
module.exports.conf = {
name: "guildUpdate",
};