const settings = require('../Src/Settings/Settings.json');
const { Connect } = require('../Connects')
const { Bots } = require('../Clients')
const Discord = require('discord.js')
const fs = require('fs');
const client = global.client = new Bots();
require("./Src/Functions/function")(client)
client.Komutlar = new Discord.Collection();
client.Aliases = new Discord.Collection();
client.Invites = new Discord.Collection();
Connect.BotLogin(client, settings.Moderation.token)
Connect.MongoLogin(settings.Moderation.mongoURL)
Connect.VoiceJoin(client)

fs.readdir('./Src/Commands/', (err, files) => {
if (err) console.error(err);
files.forEach(f => {
fs.readdir("./Src/Commands/" + f, (err2, files2) => {
files2.forEach(file => {
let props = require(`./Src/Commands/${f}/` + file);
console.log(`[MODERATİON - KOMUT] ${props.conf.name} Komutu Yüklendi!`);
client.Komutlar.set(props.conf.name, props);
props.conf.aliases.forEach(alias => {
client.Aliases.set(alias, props.conf.name);
});
})
})
});
});

fs.readdir("./Src/Events", (err, files) => {
if (err) return console.error(err);
files
.filter((file) => file.endsWith(".js"))
.forEach((file) => {
let prop = require(`./Src/Events/${file}`);
if (!prop.conf) return;
client.on(prop.conf.name, prop);
console.log(`[MODERATİON - EVENT] ${prop.conf.name} Eventi Yüklendi!`);
});
});