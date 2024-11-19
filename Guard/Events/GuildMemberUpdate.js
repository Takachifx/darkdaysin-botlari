const settings = require('../../Src/Settings/Settings.json');
const otherShield = global.mainShield
const Discord = require('discord.js')
const PDB = require('../../Src/Schemas/Panels')
module.exports = async(oldMember, newMember) => {
const guild = otherShield.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
let logs = await guild.fetchAuditLogs({ type: Discord.AuditLogEvent.MemberRoleUpdate });
let entry = logs.entries.first();
let panel = await PDB.findOne({ guildID: guild.id });
if(!panel) panel = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(panel.roleShield == false) return;
if(await otherShield.CheckBot(entry?.executorId)) return;
if(await otherShield.WhitelistControl(entry?.executorId, "roles") || await otherShield.WhitelistControl(entry?.executorId, "full")) return;
await newMember.roles.set(oldMember.roles.cache.map(r => r.id)).catch(e => {})
await oldMember.roles.set(oldMember.roles.cache.map(r => r.id)).catch(e => {})
}
module.exports.conf = {
name: "guildMemberUpdate",
};