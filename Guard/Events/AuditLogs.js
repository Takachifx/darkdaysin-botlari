const settings = require('../../Src/Settings/Settings.json');
const { Guard } = require('../events')
const otherShield = global.mainShield
module.exports = async(audit) => {
if(!audit || !audit.executor || !audit.target) return;
if(!audit.executor && !audit.executorId) return;
if(await otherShield.CheckBot(audit.executorId)) {
return;}
const target = audit.target;
const changes = audit.changes;
const event = `${audit.action}`
const userID = audit.executorId;
const guild = otherShield.guilds.cache.get(settings.Moderation.guildID)
const handler = await Guard.handleEvent(event);
if (handler) {
await handler(target, guild, changes, userID);
}
};
module.exports.conf = {
name: "guildAuditLogEntryCreate",
};