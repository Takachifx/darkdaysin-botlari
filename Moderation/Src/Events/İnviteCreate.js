const { BotEvents } = require("../../events")
module.exports = async (invite) => {
await BotEvents.EventsHandler.inviteCreate(invite)
}
module.exports.conf = {
name: "inviteCreate",
};