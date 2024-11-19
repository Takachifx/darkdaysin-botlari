const { BotEvents } = require("../../events")
module.exports = async (invite) => {
await BotEvents.EventsHandler.inviteDelete(invite)
}
module.exports.conf = {
name: "inviteDelete",
};