const { BotEvents } = require("../../events")
module.exports = async (member) => {
await BotEvents.EventsHandler.guildMemberAdd(member, "other")
await BotEvents.EventsHandler.guildMemberAdd(member, "add")
}
module.exports.conf = {
name: "guildMemberAdd",
};