const { BotEvents } = require("../../events")
module.exports = async (oldMessage, newMessage) => {
await BotEvents.EventsHandler.messageUpdate(oldMessage, newMessage)
}
module.exports.conf = {
name: "messageUpdate",
};