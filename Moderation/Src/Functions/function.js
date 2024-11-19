const tasks = require("../../../Src/Schemas/Tasks")
const Puans = require("../../../Src/Schemas/Puans")
const emojis = require("../../../Src/Settings/emojiName.json")
const penals = require("../../../Src/Schemas/Penalties");
const axios = require('axios');
const settings = require("../../../Src/Settings/Settings.json")
const ranks = require("../../../Src/Schemas/RankSystem")
const Discord = require('discord.js')
module.exports = function (client) {
Discord.Collection.prototype.array = function () {
return [...this.values()]
}
Array.prototype.random = function () {
return this[(Math.floor(Math.random() * this.length))];
};
Discord.Guild.prototype.emojiGöster = function (content) {
const guild = client.guilds.cache.get(settings.Moderation.guildID);
let emoji = guild.emojis.cache.find((x) => x.name === content) || guild.emojis.cache.get(content) || guild.emojis.cache.find((x) => x.id === content) || guild.emojis.cache.find((x) => x.name.includes(content)) || guild.emojis.cache.get(content.replace(/[^0-9]/g, "")) || guild.emojis.cache.find((x) => x.name.includes(content.replace(/[^0-9]/g, "")))
if (!emoji) return;
return emoji;
}

client.ranks = async function (guildID) {
let data = await ranks.findOne({ guildID: guildID });
return data ? JSON.stringify(data.ranks.map(role => ({ roleID: role.roleID, puan: role.puan, hammer: role.hammer }))) : "[]";
}
client.progressBar = async function (value, maxValue, size) {
const guild = client.guilds.cache.get(settings.Moderation.guildID)
const fill = `${guild.emojiGöster(emojis.fill)}`;
const fillStart = `${guild.emojiGöster(emojis.fillStart)}`;
const fillEnd = `${guild.emojiGöster(emojis.fillEnd)}`;
const empty = `${guild.emojiGöster(emojis.empty)}`;
const emptyEnd = `${guild.emojiGöster(emojis.emptyEnd)}`;
const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
const emptyProgress = size - progress > 0 ? size - progress : 0;
const progressText = fill.repeat(progress);
const emptyProgressText = empty.repeat(emptyProgress);
return emptyProgress > 0 ? fillStart + progressText + emptyProgressText + emptyEnd : fillStart + progressText + emptyProgressText + fillEnd;
};
client.kanalBul = async function (content) {
const guild = client.guilds.cache.get(settings.Moderation.guildID);
if (!guild) return;
const isChannelName = guild.channels.cache.some(channel => channel.name === content);
let kanal;
if (isChannelName) {
kanal = guild.channels.cache.find(e => e.name === content);
} else {
kanal = guild.channels.cache.get(content);
}
return kanal;
}
client.rakam = async function (sayi) {
const guild = client.guilds.cache.get(settings.Moderation.guildID)
var basamakbir = sayi.toString().replace(/ /g, "     ");
var basamakiki = basamakbir.match(/([0-9])/g);
basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
if (basamakiki) {
basamakbir = basamakbir.replace(/([0-9])/g, d => {
return {
'0': `${guild.emojiGöster(emojis.sifir)}`,
'1': `${guild.emojiGöster(emojis.bir)}`,
'2': `${guild.emojiGöster(emojis.iki)}`,
'3': `${guild.emojiGöster(emojis.uc)}`,
'4': `${guild.emojiGöster(emojis.dort)}`,
'5': `${guild.emojiGöster(emojis.bes)}`,
'6': `${guild.emojiGöster(emojis.alti)}`,
'7': `${guild.emojiGöster(emojis.yedi)}`,
'8': `${guild.emojiGöster(emojis.sekiz)}`,
'9': `${guild.emojiGöster(emojis.dokuz)}`
}
[d];
})
}
return basamakbir;
}
client.bannerGet = async function (user) {
const response = await axios.get(`https://discord.com/api/v10/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
if (!response.data.banner) return `https://i.imgur.com/poYt5sN.png`
if (response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=4096`
else return (`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=4096`)
}
client.avatarGet = async function (user) {
const response = await axios.get(`https://discord.com/api/v10/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
if (!response.data.avatar) return `https://cdn.discordapp.com/embed/avatars/0.png`
if (response.data.avatar.startsWith('a_')) return `https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}.gif?size=4096`
else return (`https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}.png?size=4096`)
}
client.splitMessage = function (message, size) {
if (!message) return;
if (!size) return;
const messageParts = message.split('\n');
const chunks = [];
let currentChunk = "";
for (const part of messageParts) {
if (currentChunk.length + part.length > size) {
chunks.push(currentChunk);
currentChunk = "";
}
currentChunk += part + '\n';
}
if (currentChunk.length > 0) {
chunks.push(currentChunk);
}
return chunks;
}
Discord.TextChannel.prototype.WebhookSend = async function (message) {
const hooks = await this.fetchWebhooks();
let webhook = hooks.find(a => a.name === client.user.username && a.owner.id === client.user.id);
if (webhook) return webhook.send(message);
webhook = await this.createWebhook({ name: client.user.username, avatar: client.user.avatarURL() });
return webhook.send(message);
};
Array.prototype.last = function () {
return this[this.length - 1];
};
Promise.prototype.sil = function (time) {
if (this) this.then(s => {
if (s.deletable) {
setTimeout(async () => {
s.delete().catch(e => { });
}, time * 1000)
}
});
};
client.Punished = async (guildID, userID, type, active = true, staff, reason, temp = false, finishDate = undefined, roles = []) => {
let id = await penals.countDocuments({ guildID });
id = id ? id + 1 : 1;
return await new penals({ id, userID, guildID, type, active, staff, reason, temp, finishDate, roles }).save();
};
Discord.GuildMember.prototype.görevGüncelle = async function (guildID, type, data, channel = null) {
const guild = client.guilds.cache.get(guildID)
if (!guild) return;
const taskData = await tasks.find({ guildID, userID: this.user.id, type, active: true });
taskData.forEach(async (x) => {
if (channel && x.channels && x.channels.some((x) => x !== channel.id)) return; x.completedCount += data;
if (x.completedCount >= x.count) {
x.active = false;
x.completed = true;
x.limit = 0;
await Puans.updateOne({ guildID, userID: this.user.id }, { $inc: { puan: x.prizeCount } }, { upsert: true })
const embed = new Discord.EmbedBuilder().setAuthor({ name: this.user.username, iconURL: this.user.avatarURL({ dynamic: true }) }).setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
const channel = await client.kanalBul('gorev-log')
channel.send({
content: `${this.toString()}`, embeds: [embed.setDescription(`
**${this.toString()} Tebrikler ${type.charAt(0).toLocaleUpperCase() + type.slice(1)} Görevini Bitirdin!**

__**GÖREV DETAYLARI**__
**Görev Tipi:** \` ${type.charAt(0).toLocaleUpperCase() + type.slice(1)} \`
**Görev Detayları:** \` ${x.message} \`
**Görev Ödülü:** \` ${x.prizeCount} Puan \``)]
})
}
await x.save();
});
};
Discord.GuildMember.prototype.hasRole = function (role, every = true) {
return (Array.isArray(role) && (every && role.every((x) => this.roles.cache.has(x)) || !every && role.some((x) => this.roles.cache.has(x))) || !Array.isArray(role) && this.roles.cache.has(role))
};
function getRandomInt(min, max) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
}
client.fetchUser = async (userID) => {
try {
return await client.users.fetch(userID);
} catch (err) {
return undefined;
}
};
client.fetchBan = async (guild, userID) => {
try {
return await guild.bans.fetch(userID);
} catch (err) {
return undefined;
}
};
client.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
Discord.GuildMember.prototype.setRoles = async function (roles) {
const newRoles = this.roles.cache.filter(x => roles.includes(x.id)).map(x => x.id).concat(roles);
for (let role of roles) {
if (!newRoles.includes(role)) {
newRoles.push(role);
}
}
return this.roles.set(newRoles).catch(() => { });
};
Discord.GuildMember.prototype.addRoles = async function (roles) {
const newRoles = this.roles.cache.filter(x => roles.includes(x.id)).map(x => x.id).concat(roles);
for (let role of roles) {
if (!newRoles.includes(role)) {
newRoles.push(role);
}
}
return this.roles.add(newRoles).catch(() => { });
};
Discord.GuildMember.prototype.removeRoles = async function (roles) {
const guild = this.guild;
if(!guild) return;
const newRoles = this.roles.cache.filter(x => roles.includes(x.id)).map(x => x.id).concat(roles);
for (let role of roles) {
if (!newRoles.includes(role)) {
newRoles.push(role);
}
}
return this.roles.remove(newRoles).catch(() => { });
};
client.Biography = async (userID, token) => {
const document = await axios({
method: 'GET',
url: 'https://discord.com/api/v10/applications/@me',
headers: {
Authorization: `Bot ${token}`,
'Content-Type': 'application/json'
},
})
return document.data.description
}

client.SetupsGet = async (guildID) => {
const data = await axios ({
method: "GET",
url: `http://50.114.185.133:3162/api/${guildID}`,
headers: {
"Content-Type": "application/json"
}
})
return data.data
}
Array.prototype.shuffle = function () {
 let i = this.length;
 while (i) {
   let j = Math.floor(Math.random() * i);
   let t = this[--i];
   this[i] = this[j];
   this[j] = t;
 }
 return this;
};
}