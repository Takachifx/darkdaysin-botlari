const { BotEvents } = require("../../events")
module.exports = async (oldState, newState) => {
await BotEvents.EventsHandler.voiceStateUpdate(oldState, newState, "stat")
await BotEvents.EventsHandler.voiceStateUpdate(oldState, newState, "privateroom")
await BotEvents.EventsHandler.voiceStateUpdate(oldState, newState, "other")
await BotEvents.EventsHandler.voiceStateUpdate(oldState, newState, "friends")
await BotEvents.EventsHandler.voiceStateUpdate(oldState, newState, "log")
await BotEvents.EventsHandler.voiceStateUpdate(oldState, newState, "afkpublic")
await BotEvents.EventsHandler.voiceStateUpdate(oldState, newState, "afkstreamer")
}
module.exports.conf = {
name: "voiceStateUpdate",
};