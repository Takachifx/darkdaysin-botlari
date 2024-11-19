const mongoose = require('mongoose')
const settings = require("./Src/Settings/Settings.json");
const setups = require("./Src/Schemas/Setup");
const Discord = require('discord.js')
class Connect {
static MongoLogin(mongoURL) {
mongoose.set('strictQuery', true);
mongoose.connect(mongoURL,  { useUnifiedTopology: true, useNewUrlParser: true})
mongoose.connection.on("connected", () => {
console.log("[BAŞARILI] Database bağlandı!");
});
mongoose.connection.on("error", () => {
console.error("[HATA] Database bağlanamadı!");
});
mongoose.connection.on('disconnected', () => {
console.warn('[UYARI] Mongoose bağlanamıyor');
})
}
static BotLogin(client, token) {
client.login(token).then(() => console.log("[BOT] "+client.user.tag+" Adlı Bot Başarıyla Bağlandı!")).catch(() => console.error("[HATA] Bot Bağlanamadı!"));
client.on(Discord.Events.ClientReady, async() => {
const guild = client.guilds.cache.get(settings.Moderation.guildID);
if(!guild) return;
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar?.SafeBots?.includes(client.user.id)) {
ayar?.SafeBots?.push(client.user.id)
await ayar.save()
}
if(guild.premiumSubscriptionCount > 14 && guild.premiumTier > 2) {
ayar.serverURL = guild.vanityURLCode
await ayar.save()
}
await guild.members.fetch();
setInterval(() => {
const oynuyor = settings.Moderation.botDurum
const index = Math.floor(Math.random() * (oynuyor.length));
client.user.setPresence({
activities: [{
name: `${oynuyor[index]}`,
type: Discord.ActivityType.Playing
}],
status: 'idle'
});
}, 10000);
})
}
static SelfLogin(client, token) {
client.login(token).then(() => console.log("[Self BOT] "+client.user.tag+" Adlı Self Bot Başarıyla Bağlandı!")).catch(() => console.error("[HATA] Self Bot Bağlanamadı!"));
}
static VoiceJoin(clients) {
setInterval(() => { sesKontrol(); }, 5000);
async function sesKontrol() {
const { joinVoiceChannel, getVoiceConnection} = require("@discordjs/voice");
const connection = getVoiceConnection(settings.Moderation.guildID);
if (connection) return;
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const VoiceChannel = clients.channels.cache.get(ayar.voiceChannel);
if (VoiceChannel) { joinVoiceChannel({
channelId: VoiceChannel.id,
guildId: VoiceChannel.guild.id,
adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
selfDeaf: true,
group: clients.user.id
})
}
}
}
}
module.exports = { Connect };