const { BotEvents } = require("../../events")
module.exports = async (oldMember, newMember) => {
await BotEvents.EventsHandler.guildMemberUpdate(oldMember, newMember, "log")
await BotEvents.EventsHandler.guildMemberUpdate(oldMember, newMember, "booster")
}
module.exports.conf = {
name: "guildMemberUpdate",
};