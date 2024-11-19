const mainShield = global.mainShield;
const roleShield = global.roleShield;
const channelShield = global.channelShield;
const chatShield = global.chatShield;
const otherShield = global.otherShield;
const otherShields = global.otherShields;
const selfShield = global.selfShield;
const Botlar = global.Botlar;
const GuardLimities = require("../../Src/Schemas/GuardLimities");
const Korumalar = require("../../Src/Schemas/Koruma");
const setups = require("../../Src/Schemas/Setup")
const whitelist = require(`../../Src/Schemas/Whitelist`)
const RoleModel = require("../../Src/Schemas/Roles");
const CategoryChannels = require("../../Src/Schemas/CategoryChannels");
const TextChannels = require("../../Src/Schemas/TextChannels");
const VoiceChannels = require("../../Src/Schemas/VoiceChannels");
const request = require('request');
const Discord = require("discord.js");
const settings = require("../../Src/Settings/Settings.json");
const fs = require('fs');
module.exports = function(client) {
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

client.CheckBot = async function(id) {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
if (settings.Moderation.owners.some(x => x == id)) {
return true;
}
if (ayar.SafeBots.some(w => w == id)) {
return true;
}
if (id == chatShield.user.id || id == selfShield.user.id || id == mainShield.user.id || id == otherShields.user.id || id == roleShield.user.id || id == otherShield.user.id || id == channelShield.user.id) {
return true;
}
return false;
}

client.WhitelistControl = async function(id, type) {
let member = client.guilds.cache.get(settings.Moderation.guildID).members.cache.get(id);
if(!member) return;
let res = await whitelist.findOne({guildID: settings.Moderation.guildID});
if (!res) {
res = {"full": [], "guild": [], "roles": [], "channel": [], "ban": [], "kick": [], "emoji": [], "bot": [], "sticker": [],  "swear": [], "advert": [], "capslock": [], "spam": [], "web": [], "offline": []};
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, {upsert: true, setDefaultsOnInsert: true}).exec()
} else {
if(type == "full") {
if (member && res.full.some(id => member.id == id) || res.full.some(id => member.roles.cache.has(id))) return true;
} else if(type == "guild") {
if (member && res.guild.some(id => member.id == id) || res.guild.some(id => member.roles.cache.has(id))) return true;
} else if(type == "roles") {
if (member && res.roles.some(id => member.id == id) || res.roles.some(id => member.roles.cache.has(id))) return true;
} else if(type == "channel") {
if (member && res.channel.some(id => member.id == id) || res.channel.some(id => member.roles.cache.has(id))) return true;
} else if(type == "kick") {
if (member && res.kick.some(id => member.id == id) || res.kick.some(id => member.roles.cache.has(id))) return true;
} if(type == "ban") {
if (member && res.ban.some(id => member.id == id) || res.ban.some(id => member.roles.cache.has(id))) return true;
} else if(type == "emoji") {
if (member && res.emoji.some(id => member.id == id) || res.emoji.some(id => member.roles.cache.has(id))) return true;
} else if(type == "bot") {
if (member && res.bot.some(id => member.id == id) || res.bot.some(id => member.roles.cache.has(id))) return true;
} else if(type == "sticker") {
if (member && res.sticker.some(id => member.id == id) || res.sticker.some(id => member.roles.cache.has(id))) return true;
} else if(type == "swear") {
if (member && res.swear.some(id => member.id == id) || res.swear.some(id => member.roles.cache.has(id))) return true;
} else if(type == "advert") {
if (member && res.advert.some(id => member.id == id) || res.advert.some(id => member.roles.cache.has(id))) return true;
} else if(type == "capslock") {
if (member && res.capslock.some(id => member.id == id) || res.capslock.some(id => member.roles.cache.has(id))) return true;
} else if(type == "spam") {
if (member && res.spam.some(id => member.id == id) || res.spam.some(id => member.roles.cache.has(id))) return true;
} else if(type == "web") {
if (member && res.web.some(id => member.id == id) || res.web.some(id => member.roles.cache.has(id))) return true;
} else if(type == "offline") {
if (member && res.offline.some(id => member.id == id) || res.offline.some(id => member.roles.cache.has(id))) return true;
}
} return false;
}

client.Send = async function(mesaj, etiket, client) {
const embed = new Discord.EmbedBuilder().setColor("Random")
const guild = await client.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
const kanal = guild.channels.cache.find((x) => x.name == 'guard_log' || x.name == "guard-log")
if(!kanal) console.error("Hata Kanal Bulunamadı.")
switch (etiket) {
case 'var':
kanal.send({content: `@everyone`, embeds: [embed.setDescription(mesaj)]}).catch(() => {})
break;
case "yok":
kanal.send({embeds: [embed.setDescription(mesaj)]}).catch(() => {})
break;
}
}

client.Punish = async function(client, member, type) {
const guild = await client.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
let user = await guild.members.cache.get(member);
if(!user) return guild.members.ban(member, { reason: "Guard Sunucu Koruma" }).catch(() => {});
switch (type) {
case 'ban':
if(!user.bannable) {
console.log(`[HATA] ${user && user.user.username} Kullanıcısına [BAN] İşlemi Uygulanamadı!`)
}
await user.ban({reason: "Guard Sunucu Koruma"}).then(() => {
console.log(`[CEZA] ${user && user.user.username} Kullanıcısına [BAN] İşlemi Uygulandı!`)
}).catch(() => {})
break;
}
}
client.SPunish = async function(member, type) {
const guild = selfShield.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
let user = guild.members.cache.get(member);
if(!user) return guild.members.ban(member, { reason: "Taç Guard Sunucu Koruma" }).catch(() => {});
switch (type) {
case 'ban':
if(!user.bannable) {
console.log(`[HATA] ${user && user.user.username} Kullanıcısına [BAN] İşlemi Uygulanamadı!`)
}
await user.ban({reason: "Taç Guard Sunucu Koruma"}).then(() => {
console.log(`[CEZA] ${user && user.user.username} Kullanıcısına [BAN] İşlemi Uygulandı!`)
}).catch(e => {})
break;
}
}

client.RoleBackup = async function(guild, guildID) {
guild.roles.cache.forEach(async role => {
let roleChannelOverwrites = [];
await guild.channels.cache.filter(c => c.permissionOverwrites && c.permissionOverwrites.cache.has(role.id)).forEach(c => {
let channelPerm = c.permissionOverwrites.cache.get(role.id);
let izinler = {id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray()};
roleChannelOverwrites.push(izinler);
});
await RoleModel.updateOne({roleID: role.id}, {$set: {guildID: guild.id, roleID: role.id, name: role.name, color: role.hexColor, hoist: role.hoist, position: role.rawPosition, permissions: role.permissions.bitfield, mentionable: role.mentionable, time: Date.now(), members: role.members.map(m => m.id), channelOverwrites: roleChannelOverwrites}}, {upsert: true
});
});
console.log("Rollerin Verileri Başarıyla Yedeklendi!")
};

client.ChannelBackup = async function(guild, guildID) {
await TextChannels.deleteMany({});
await VoiceChannels.deleteMany({});
await CategoryChannels.deleteMany({});
if (guild) {
const channels = [...guild.channels.cache.values()];
for (let index = 0; index < channels.length; index++) {
const channel = channels[index];
let ChannelPermissions = [];
if (channel.permissionOverwrites) {
channel.permissionOverwrites.cache.forEach(perm => {
ChannelPermissions.push({ id: perm.id, type: perm.type, allow: perm.allow.toArray(), deny: perm.deny.toArray() });
});
}
if (channel.type == 4) {
await CategoryChannels.updateOne({ channelID: channel.id },{$set: {channelID: channel.id, name: channel.name, position: channel.position, overwrites: ChannelPermissions} },{ upsert: true });
}
if ((channel.type == 0) || (channel.type == 5)) {
await TextChannels.updateOne({ channelID: channel.id },{$set: { channelID: channel.id, name: channel.name, nsfw: channel.nsfw, parentID: channel.parentId, position: channel.position, rateLimit: channel.rateLimitPerUser, overwrites: ChannelPermissions} },{ upsert: true });
}
if (channel.type == 2) {
await VoiceChannels.updateOne({ channelID: channel.id },{$set: { channelID: channel.id, name: channel.name, bitrate: channel.bitrate, userLimit: channel.userLimit, parentID: channel.parentId, position: channel.position,  overwrites: ChannelPermissions} },{ upsert: true });
}
}
console.log("Kanal Verileri Başarıyla Yedeklendi!");
}
}

Promise.prototype.sil = function (time) {
if (this) this.then(s => {
if (s.deletable) {
setTimeout(async () => {
s.delete().catch(e => { });
}, time * 1000)
}
});
};

client.SetVanityURL = async function(url) {
const guild = selfShield.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID });
if (!ayar) return;
if(guild.vanityURLCode === url) return;
if(guild.premiumSubscriptionCount < 14) return;
if(guild.premiumTier < 3) return;
const headers = {"authorization": selfShield.token, "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"};
const payload = { "code": url };
request.patch({url: `https://discord.com/api/v10/guilds/${settings.Moderation.guildID}/vanity-url`, headers: headers, json: payload }, (error, response, body) => {
if (response.statusCode == 200) {
let obj = {
vanityURL: url,
guildID: settings.Moderation.guildID
}
selfShield.emit("VanitySuccess", obj)
} else {
let obj = {
error:response.body.message
}
selfShield.emit("VanityError", obj)
}
});
}

client.WhitelistRemove = async function(memberID) {
var veri = await whitelist.findOne({guildID: settings.Moderation.guildID})
if(!veri) return;
if (veri.full.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { full: memberID} }, { upsert: true });
}
if (veri.guild.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { guild: memberID } }, { upsert: true });
}
if (veri.roles.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { roles: memberID } }, { upsert: true });
}
if (veri.channel.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { channel: memberID } }, { upsert: true });
}
if (veri.ban.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { ban: memberID } }, { upsert: true });
}
if (veri.kick.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { kick: memberID } }, { upsert: true });
}
if (veri.emoji.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { emoji: memberID } }, { upsert: true });
}
if (veri.bot.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { bot: memberID } }, { upsert: true });
}
if (veri.sticker.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { sticker: memberID } }, { upsert: true });
}
if (veri.swear.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { swear: memberID } }, { upsert: true });
}
if (veri.advert.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { advert: memberID } }, { upsert: true });
}
if (veri.capslock.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { capslock: memberID } }, { upsert: true });
}
if (veri.spam.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { spam: memberID } }, { upsert: true });
}
if(veri.web.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { web: memberID } }, { upsert: true });
}
if(veri.offline.includes(memberID)) {
await whitelist.updateOne({ guildID: settings.Moderation.guildID }, { $pull: { offline: memberID } }, { upsert: true });
}
}
client.giveBot = async (length) => {
if (length > Botlar.length) length = Botlar.length;
let availableBots = Botlar.filter(e => !e.Busy);
if (availableBots.length <= 0) availableBots = Botlar.sort((x, y) => x.Uj - y.Uj).slice(0, length);
return availableBots;
};
client.processBot = async (bot, busy, job, equal = false) => {
bot.Busy = busy;
if (equal) bot.Uj = job;
else bot.Uj += job;
let index = Botlar.findIndex(e => e.user.id == bot.user.id);
Botlar[index] = bot;
};

client.getClients = async (count) => {
return Botlar.slice(0, count);
};

client.sleep = async (ms) => {
return new Promise(resolve => setTimeout(resolve, ms));
};

client.ytKapat = async () => {
let sunucu = selfShield.guilds.cache.get(settings.Moderation.guildID);
if(!sunucu) return;
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const perms = [Discord.PermissionFlagsBits.Administrator, Discord.PermissionFlagsBits.ManageRoles, Discord.PermissionFlagsBits.ManageWebhooks, Discord.PermissionFlagsBits.ManageChannels, Discord.PermissionFlagsBits.ManageGuild, Discord.PermissionFlagsBits.BanMembers, Discord.PermissionFlagsBits.KickMembers];
let roller = sunucu.roles.cache.filter(rol => rol.editable && ayar.botRoles.some(x => x != rol.id)).filter(rol => perms.some(yetki => rol.permissions.has(yetki)));
roller.forEach(async (rol) => {
await Korumalar.updateOne({ Role: rol.id }, {$set: {"guildID": sunucu.id, "Permissions": rol.permissions.bitfield }}, {upsert: true})
await rol.setPermissions(0n).catch(e => {})
});
}
client.SendToMessageChannel = async function(userID, targetID, targetName, type, text, whitelist, types, msg) {
const guild = client.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
const user = guild.members.cache.get(userID) || client.users.cache.get(userID);
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true, size: 2048 }) })
const kanal =
types == "sunucu" ? guild.channels.cache.find(x => x.name == "sunucu-koruma-log") :
types == "sticker" ? guild.channels.cache.find(x => x.name == "sticker-koruma-log") :
types == "emoji" ? guild.channels.cache.find(x => x.name == "emoji-koruma-log") :
types == "rol" ? guild.channels.cache.find(x => x.name == "rol-koruma-log") :
types == "kanal" ? guild.channels.cache.find(x => x.name == "kanal-koruma-log") :
types == "üye" ? guild.channels.cache.find(x => x.name == "üye-koruma-log") :
types == "web" ? guild.channels.cache.find(x => x.name == "web-koruma-log") :
types == "offline" ? guild.channels.cache.find(x => x.name == "offline-koruma-log") :
guild.channels.cache.find(x => x.name == "guard-log");
if(!kanal) return console.log("Log kanalı bulunamadı.");
if(whitelist && whitelist == "wl") {
await kanal.send({embeds: [embed.setDescription(`
${user} (\` ${user.id} \`) Kullanıcısı ${text} İşlemi Uyguladı, Kullanıcı Güvenli Listesinde Olduğu İçin İşlem Uygulanmadı!

Kullanıcı: ${user ? user : "Bulunamadı."} (\` ${user.id} \`)
İşlem Uygulanan: ${targetName} (\` ${targetID} \`)
İşlem Türü: **${type}**
Tarih: <t:${Math.floor(Date.now() / 1000)}>`)]}).catch(() => {})
} else if(whitelist && whitelist == "nowl") {
await kanal.send({content: `@everyone`, embeds: [embed.setDescription(`
${user} (\` ${user.id} \`) Kullanıcısı ${text} İşlemi Uyguladı!

Kullanıcı: ${user ? user : "Bulunamadı."} (\` ${user.id} \`)
İşlem Uygulanan: ${targetName} (\` ${targetID} \`)
İşlem Türü: **${type}**
Tarih: <t:${Math.floor(Date.now() / 1000)}>`)]}).catch(() => {})
}
}

client.KanalBul = async function(channels) {
if (!channels) return;
const guild = client.guilds.cache.get(settings.Moderation.guildID);
if (!guild) return;
const kanal = guild.channels.cache.get(channels) || guild.channels.cache.find(x => x.name === channels) || guild.channels.cache.find(x => x.id === channels) || guild.channels.cache.find(x => x.name.includes(channels));
return kanal;
}

client.LimitiesControl = async function (guildID, userID, type, value) {
const guild = client.guilds.cache.get(guildID);
if (!guild) return console.log("Hata: Sunucu bulunamadı.");
const user = guild.members.cache.get(userID);
if (!user) return console.log("Hata: Kullanıcı bulunamadı.");
if(await client.WhitelistControl(userID, "full")) {
return;
}
const ayar = await setups.findOne({ guildID: guildID });
if (!ayar) return console.log("Hata: Ayarlar bulunamadı.");
const Data = await GuardLimities.findOne({ guildID: guildID, userID: userID });
if (!Data) {
return await new GuardLimities({ guildID: guildID, userID: userID, type: { [type]: 1 } }).save();
}
if (Data.type[type] > ayar[type]) {
if (user && user.bannable) {
await client.Punish(client, user.id, "ban");
} else if (user && !user.bannable) {
await client.SPunish(user.id, "ban");
}
if (value) await value.delete().catch(e => {});
Data.type[type] = 0;
return await GuardLimities.updateOne({ guildID: guildID, userID: userID }, { $set: { type: Data.type } }, { upsert: true });
}
if(Data.type[type]) {
Data.type[type] += 1
} else {
Data.type[type] = 1
}
await GuardLimities.updateOne({ guildID: guildID, userID: userID }, { $set: { type: Data.type } }, { upsert: true });
setTimeout(() => {
Data.type[type] = 0;
GuardLimities.updateOne({ guildID: guildID, userID: userID }, { $set: { type: Data.type } }, { upsert: true });
}, 3600000);
}
Discord.Guild.prototype.emojiGöster = function(content) {
let emoji = mainShield.emojis.cache.find(e => e.name === content) || mainShield.emojis.cache.find(e => e.id === content) || mainShield.emojis.cache.find(e => e.id === content) || mainShield.emojis.cache.find(e => e.name === content)
if(!emoji) return;
return emoji;
}

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
client.URLSpammer = async function() {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID });
if (!ayar) return;
const iconquered = {
url: `https://discord.com/api/v10/guilds/${settings.Moderation.guildID}/vanity-url`,
body: { code: `${ayar.serverURL}` },
json: true,
method: 'PATCH',
headers: { "Authorization": `${client.token}`, "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36", 'Accept-Encoding': 'gzip', 'Content-Type': 'application/json', 'X-RateLimit-Precision': 'millisecond', 'X-RateLimit-Reset-After': '2021-11-18T12:00:00.000Z', 'X-RateLimit-Limit': '1', 'X-RateLimit-Remaining': '0', 'X-RateLimit-Global': 'true', 'X-RateLimit-Used': '0' },
};

request(iconquered, async (err, res, body) => {
if (err) {
console.error('URL Spam Hata:', err);
return;
}
});
};
}