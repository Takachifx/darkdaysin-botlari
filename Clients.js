const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const Discord = require('discord.js')
class Bots extends Client {
constructor(options) {
super({
options,
rest: { rejectOnRateLimit: false },
fetchAllMembers: true,
intents: Object.values(GatewayIntentBits),
partials: Object.values(Partials),
});
this.on("rateLimit", (rate) => { console.log("Client Rate Limit'e Uğradı; " + rate) });
this.on(Events.Warn, (warn) => { console.log(warn) });
this.on(Events.Error, (error) => { console.log(error) });
process.on('unhandledRejection', (reason, promise) => {console.error('Unhandled Rejection at:', promise, 'reason:', reason);});
process.on("warning", (warn) => { console.log(warn) });
}
}

module.exports = { Bots };
