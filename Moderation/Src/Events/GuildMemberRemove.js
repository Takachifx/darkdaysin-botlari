const { BotEvents } = require("../../events")
module.exports = async (member) => {
await BotEvents.EventsHandler.guildMemberRemove(member)
}
module.exports.conf = {
name: "guildMemberRemove",
};