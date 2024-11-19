const { BotEvents } = require("../../events")
module.exports = async (oldMember, newMember) => {
await BotEvents.EventsHandler.userUpdate(oldMember, newMember, "tag")
await BotEvents.EventsHandler.userUpdate(oldMember, newMember, "bannedtag")
}
module.exports.conf = {
name: "userUpdate",
};