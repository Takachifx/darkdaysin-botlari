const { BotEvents } = require("../../events")
module.exports = async (message) => {
await BotEvents.EventsHandler.messageDelete(message)
}
module.exports.conf = {
name: "messageDelete",
};