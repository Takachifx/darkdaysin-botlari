const { BotEvents } = require("../../events")
module.exports = async (interaction) => {
await BotEvents.EventsHandler.interactionCreate(interaction, "privateroom")
await BotEvents.EventsHandler.interactionCreate(interaction, "role")
await BotEvents.EventsHandler.interactionCreate(interaction, "application")
}
module.exports.conf = {
name: "interactionCreate",
};