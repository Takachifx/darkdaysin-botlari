const settings = require('../../Src/Settings/Settings.json');
const otherShield = global.mainShield
const Discord = require('discord.js')
const PDB = require('../../Src/Schemas/Panels')
module.exports = async(sticker) => {
const guild = otherShield.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
let logs = await guild.fetchAuditLogs({ type: Discord.AuditLogEvent.StickerDelete });
let entry = logs.entries.first();
let panel = await PDB.findOne({ guildID: guild.id });
if(!panel) panel = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(panel.stickerShield == false) return;
if (!entry || !entry.executor) {
return;}
if(await otherShield.CheckBot(entry.executorId)) return;
if(await otherShield.WhitelistControl(entry.executorId, "sticker") || await otherShield.WhitelistControl(entry.executorId, "full")) return;
await guild.stickers.create({ file: sticker.url, name: sticker.name, tags: sticker.tags, description: sticker.description }).catch(e => {})
}
module.exports.conf = {
name: "stickerDelete",
};