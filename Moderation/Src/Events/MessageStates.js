const { BotEvents } = require("../../events")
module.exports = async (message) => {
await BotEvents.EventsHandler.messageCreate(message, "stat")
await BotEvents.EventsHandler.messageCreate(message, "afk")
await BotEvents.EventsHandler.messageCreate(message, "private")
await BotEvents.EventsHandler.messageCreate(message, "other")
await BotEvents.EventsHandler.messageCreate(message, "chat")
}
module.exports.conf = {
name: "messageCreate",
};