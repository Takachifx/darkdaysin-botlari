const { BotEvents } = require("../../events")
module.exports = async (error) => {
await BotEvents.EventsHandler.error(error)
}
module.exports.conf = {
name: "error",
};