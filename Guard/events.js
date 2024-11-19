const Discord = require("discord.js");
const settings = require('../Src/Settings/Settings.json')
const CategoryChannels = require('../Src/Schemas/CategoryChannels')
const VoiceChannels = require('../Src/Schemas/VoiceChannels')
const PDB = require("../Src/Schemas/Panels")
let Bots = [global.mainShield, global.roleShield, global.channelShield, global.otherShield, global.otherShields, global.chatShield, global.selfShield]
class Guard {
static eventHandlers = {
[Discord.AuditLogEvent.EmojiCreate]: async (target, guild, changes, userID) => {
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.emojiShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "emoji") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "EmojiCreateLimites", target)
await client.SendToMessageChannel(userID, target.id, targetName, "Emoji Oluşturma", "Emoji Oluşturma", "wl", "emoji")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
if(target) target.delete({reason: "Guard Sunucu Koruma."}).catch(e => {})
await client.SendToMessageChannel(userID, target.id, targetName, "Emoji Oluşturma", "Emoji Oluşturma", "nowl", "emoji")
},
[Discord.AuditLogEvent.ChannelCreate]: async (target, guild, changes, userID) => {
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.channelShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "channel") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "ChannelCreateLimites", target)
await client.SendToMessageChannel(userID, target.id, targetName, "Kanal Oluşturma", "Kanal Oluşturma", "wl", "kanal")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
if(target) target.delete({reason: "Guard Sunucu Koruma."}).catch(e => {})
await client.SendToMessageChannel(userID, target.id, targetName, "Kanal Oluşturma", "Kanal Oluşturma", "nowl", "kanal")
},
[Discord.AuditLogEvent.RoleCreate]: async (target, guild, changes, userID) => {
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.roleShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "roles") || await client.WhitelistControl(userID, "full")) {
 await client.LimitiesControl(guild.id, userID, "RoleCreateLimites", target)
await client.SendToMessageChannel(userID, target.id, targetName, "Rol Oluşturma", "Rol Oluşturma", "wl", "rol")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
if(target) target.delete({reason: "Guard Sunucu Koruma."}).catch(e => {})
await client.SendToMessageChannel(userID, target.id, targetName, "Rol Oluşturma", "Rol Oluşturma", "nowl", "rol")
},
[Discord.AuditLogEvent.WebhookCreate]: async (target, guild, changes, userID) => {
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.guildShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "guild") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "WebhookCreateLimites", target)
await client.SendToMessageChannel(userID, target.id, targetName, "Webhook Oluşturma", "Webhook Oluşturma", "wl", "webhook")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.ytKapat()
if(target) target.delete({reason: "Guard Sunucu Koruma."}).catch(e => {})
await client.SendToMessageChannel(userID, target.id, targetName, "Webhook Oluşturma", "Webhook Oluşturma", "nowl", "webhook")
},
[Discord.AuditLogEvent.WebhookUpdate]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.guildShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "guild") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "WebhookUpdateLimites")
await client.SendToMessageChannel(userID, target.id, targetName, "Webhook Güncelleme", "Webhook Güncelleme", "wl", "webhook")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.ytKapat()
const WebookName = changes.find(x => x.key === "name");
if(WebookName) target.edit({name: WebookName.old}).catch(e => {})
const WebookAvatar = changes.find(x => x.key === "avatar_hash");
if(WebookAvatar) target.edit({avatar: WebookAvatar.old ? "https://cdn.discordapp.com/avatars/"+target.id+"/"+WebookAvatar.old+".png" : "https://cdn.discordapp.com/embed/avatars/0.png"}).catch(e => {})
await client.SendToMessageChannel(userID, target.id, targetName, "Webhook Güncelleme", "Webhook Güncelleme", "nowl", "webhook")
},
[Discord.AuditLogEvent.WebhookDelete]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.guildShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "guild") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "WebhookDeleteLimites")
await client.SendToMessageChannel(userID, target.id, targetName, "Webhook Silme", "Webhook Silme", "wl", "webhook")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
const ChannelChange = changes.find(x => x.key === "channel_id");
const NameChange = changes.find(x => x.key === "name");
const AvatarChange = changes.find(x => x.key === "avatar_hash");
const kanal = await client.KanalBul(ChannelChange.old);
if(!kanal) return
if(NameChange.old) {
if(AvatarChange.old) {
kanal.createWebhook(NameChange.old, {avatar: AvatarChange.old ? "https://cdn.discordapp.com/avatars/"+target.id+"/"+AvatarChange.old+".png" : "https://cdn.discordapp.com/embed/avatars/0.png"}).catch(e => {})
}
}
await client.SendToMessageChannel(userID, target.id, targetName, "Webhook Silme", "Webhook Silme", "nowl", "webhook")
},
[Discord.AuditLogEvent.RoleUpdate]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.roleShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "roles") || await client.WhitelistControl(userID, "full")) {
await client.SendToMessageChannel(userID, target.id, targetName, "Rol Güncelleme", "Rol Güncelleme", "wl", "rol")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
const RoleName = changes.find(x => x.key === "name");
if(RoleName && RoleName.old === RoleName.new) target.edit({name: RoleName.old}).catch(e => {})
const RoleColor = changes.find(x => x.key === "color");
if(RoleColor && RoleColor.old === RoleColor.new) target.edit({color: RoleColor.old}).catch(e => {})
if(RoleHoist && RoleHoist.old === RoleHoist.new) target.edit({hoist: RoleHoist.old}).catch(e => {})
const RolePosition = changes.find(x => x.key === "position");
if(RolePosition && RolePosition.old === RolePosition.new) target.edit({position: RolePosition.old}).catch(e => {})
const RolePermissions = changes.find(x => x.key === "permissions");
if(RolePermissions && RolePermissions.old === RolePermissions.new) target.edit({permissions: RolePermissions.old}).catch(e => {})
const RoleMentionable = changes.find(x => x.key === "mentionable");
if(RoleMentionable && RoleMentionable.old === RoleMentionable.new) target.edit({mentionable: RoleMentionable.old}).catch(e => {})
await client.SendToMessageChannel(userID, target.id, targetName, "Rol Güncelleme", "Rol Güncelleme", "nowl", "rol")
},
[Discord.AuditLogEvent.RoleDelete]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.roleShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "roles") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "RoleDeleteLimites")
await client.SendToMessageChannel(userID, target.id, targetName, "Rol Silme", "Rol Silme", "wl", "rol")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Rol Silme", "Rol Silme", "nowl", "rol")
await client.ytKapat()
const RoleName = changes.find(x => x.key === "name");
const RoleColor = changes.find(x => x.key === "color");
const RoleHoist = changes.find(x => x.key === "hoist");
const RolePermissions = changes.find(x => x.key === "permissions");
const Role = await guild.roles.create({
name: RoleName.old,
color: RoleColor.old,
hoist: RoleHoist.old,
mentionable: RoleMentionable.old,
reason: "Silinen Rol Geri Açıldı!"
}).catch(e => {})
if(RolePermissions && RolePermissions.old === RolePermissions.new) {
if(!isNaN(RolePermissions.old)) {
target.edit({permissions: Number(RolePermissions.old)}).catch(e => { console.error(e); })
}
}
const data = await Roles.findOne({ roleID: target.id });
if(data) {
await Role.setPosition(data.position).catch(e => {})
await Roles.updateOne({roleID: target.id}, {$set: {guildID: guild.id, roleID: data.id, name: Role.name, color: data.color, hoist: data.hoist, position: data.position, permissions: data.permissions, mentionable: data.mentionable, time: Date.now(), members: data.members, channelOverwrites: data.channelOverwrites}}, {upsert: true })
let length = data.members.length;
if (length <= 0) return;
let availableBots = Bots.filter(e => !e.Busy);
if (availableBots.length <= 0) availableBots = Bots.sort((x, y) => y.Uj - x.Uj).slice(0, Math.round(length / Bots.length));
let perAnyBotMembers = Math.floor(length / availableBots.length);
if (perAnyBotMembers < 1) perAnyBotMembers = 1;
for (let index = 0; index < availableBots.length; index++) {
const bot = availableBots[index];
let ids = data.members.slice(index * perAnyBotMembers, (index + 1) * perAnyBotMembers);
if (ids.length <= 0) { client.processBot(bot, false, -perAnyBotMembers); break; }
let guild = bot.guilds.cache.get(settings.Moderation.guildID);
ids.every(async id => {
if(!member) {
console.log(`Oto Silinen Rol Kurulumundan sonra ${bot.user.username} - ${id} adlı üyeyi sunucuda bulamadım.`);
return true;}
await member.addRoles(Role.id).then(e => {console.log(`Oto Silinen Rol kurulumundan sonra ${member.user.username} adlı üye ${Role.name} rolünü aldı.`);}).catch(e => {console.log(`[${Role.id}] Olayından sonra ${member.user.username} adlı üyeye rol veremedim.`);});});
client.processBot(bot, false, -perAnyBotMembers); }
}
},
[Discord.AuditLogEvent.ChannelDelete]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.channelShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "channel") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "ChannelDeleteLimites")
await client.SendToMessageChannel(userID, target.id, targetName, "Kanal Silme", "Kanal Silme", "wl", "kanal")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Kanal Silme", "Kanal Silme", "nowl", "kanal")
await client.ytKapat()
const ChannelName = changes.find(x => x.key === "name");
const ChannelType = changes.find(x => x.key === "type");
const ChannelNSFW = changes.find(x => x.key === "nsfw");
const ChannelBitrate = changes.find(x => x.key === "bitrate");
const ChannelUserLimit = changes.find(x => x.key === "user_limit");
if(ChannelType.old === 4) {
const Category = await guild.channels.create({name: ChannelName.old, type: Discord.ChannelType.GuildCategory, permissionOverwrites: ChannelPermission.old}).catch(e => {})
if(data) {
await Category.setPosition(data.position).catch(e => {})
await CategoryChannels.updateOne({ channelID: target.id }, { $set: {name: Category.name, channelID: Category.id, permissionOverwrites: ChannelPermission.old} }, { upsert: true })
}
setTimeout(async() => {
const TData = await TextChannels.find({ parentID: target.id });
const VData = await VoiceChannels.find({ parentID: target.id });
if(TData) {
TData.forEach(async c => {
const textChannel = guild.channels.cache.get(c.channelID);
if (textChannel) textChannel.setParent(Category, { lockPermissions: true });
if(textChannel) textChannel.permissionOverwrites.set(c.overwrites).catch(e => {})
if (textChannel) textChannel.setPosition(c.position).catch(e => {})
await TextChannels.updateOne({ channelID: textChannel.id },{$set: { channelID: textChannel.id, name: c.name, nsfw: c.nsfw, parentID: Category.id, position: c.position, rateLimit: c.rateLimitPerUser, overwrites: c.overwrites} }, { upsert: true });
});
}
if(VData) {
VData.forEach(async c => {
const textChannel = guild.channels.cache.get(c.channelID);
if (textChannel) textChannel.setParent(Category, { lockPermissions: true });
if(textChannel) textChannel.permissionOverwrites.set(c.overwrites).catch(e => {})
if (textChannel) textChannel.setPosition(c.position).catch(e => {})
await VoiceChannels.updateOne({ channelID: textChannel.id },{$set: { channelID: textChannel.id, name: c.name, bitrate: c.bitrate, userLimit: c.userLimit, parentID: Category.id, position: c.position, overwrites: c.overwrites} }, { upsert: true });
});
}
}, 5000)
}
if(ChannelType.old === 0 || ChannelType.old === 5) {
const Texts = await guild.channels.create({name: ChannelName.old, type: Discord.ChannelType.GuildText, permissionOverwrites: ChannelPermission.old, nsfw: ChannelNSFW.old}).catch(e => {})
const data = await TextChannels.findOne({ channelID: target.id });
if(data) {
await Texts.setPosition(data.position).catch(e => {})
await Texts.setParent(data.parentID).catch(e => {})
await Texts.permissionOverwrites.set(data.overwrites).catch(e => {})
await TextChannels.updateOne({ channelID: target.id }, { $set: { channelID: Texts.id } }, { upsert: true })
}
}
if(ChannelType.old === 2) {
const Voices = await guild.channels.create({name: ChannelName.old, type: Discord.ChannelType.GuildVoice, permissionOverwrites: ChannelPermission.old, bitrate: ChannelBitrate.old, userLimit: ChannelUserLimit.old}).catch(e => {})
const data = await VoiceChannels.findOne({ channelID: target.id });
if(data) {
await Voices.setPosition(data.position).catch(e => {})
await Voices.setParent(data.parentID).catch(e => {})
await Voices.setUserLimit(data.userLimit).catch(e => {})
await Voices.permissionOverwrites.set(data.overwrites).catch(e => {})
await VoiceChannels.updateOne({ channelID: target.id }, { $set: { channelID: Voices.id } }, { upsert: true })
}
}
},
[Discord.AuditLogEvent.StickerCreate]:  async (target, guild, changes, userID) => {
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.stickerShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "sticker") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "StickerCreateLimites", target)
await client.SendToMessageChannel(userID, target.id, targetName, "Sticker Oluşturma", "Sticker Oluşturma", "wl", "sticker")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
if(target) target.delete({reason: "Guard Sunucu Koruma."}).catch(e => {})
await client.SendToMessageChannel(userID, target.id, targetName, "Sticker Oluşturma", "Sticker Oluşturma", "nowl", "sticker")
},
[Discord.AuditLogEvent.StickerUpdate] : async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.stickerShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "sticker") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "StickerUpdateLimites")
await client.SendToMessageChannel(userID, target.id, targetName, "Sticker Güncelleme", "Sticker Güncelleme", "wl", "sticker")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
const StickerName = changes.find(x => x.key === "name");
await client.SendToMessageChannel(userID, target.id, targetName, "Sticker Güncelleme", "Sticker Güncelleme", "nowl", "sticker")
},
[Discord.AuditLogEvent.GuildUpdate]: async (target, guild, changes, userID) => {
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.guildShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "guild") || await client.WhitelistControl(userID, "full")) {
await client.SendToMessageChannel(userID, target.id, targetName, "Sunucu Ayarları", "Sunucu Güncelleme", "wl", "sunucu")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Sunucu Ayarları", "Sunucu Güncelleme", "nowl", "sunucu")
await client.ytKapat()
const GuildName = changes.find(x => x.key === "name");
if(GuildName) await guild.setName(GuildName.old).catch(e => {})
if(settings.Guard.serverURL != guild.vanityURLCode) {
await client.SetVanityURL(settings.Guard.serverURL).catch(e => {})
}
},
[Discord.AuditLogEvent.MemberRoleUpdate]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.roleShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.username;
if(await client.WhitelistControl(userID, "roles") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "MemberRoleUpdateLimites")
await client.SendToMessageChannel(userID, target.id, targetName, "Üye Rol Güncelleme", "Üye Rol Güncelleme", "wl", "üye")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Üye Rol Güncelleme", "Üye Rol Güncelleme", "nowl", "üye")
},
[Discord.AuditLogEvent.EmojiDelete]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.emojiShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "emoji") || await client.WhitelistControl(userID, "full")) {
await client.SendToMessageChannel(userID, target.id, targetName, "Emoji Silme", "Emoji Silme", "wl", "emoji")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Emoji Silme", "Emoji Silme", "nowl", "emoji")
},
[Discord.AuditLogEvent.StickerDelete]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.stickerShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "sticker") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "StickerDeleteLimites")
await client.SendToMessageChannel(userID, target.id, targetName, "Sticker Silme", "Sticker Silme", "wl", "sticker")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Sticker Silme", "Sticker Silme", "nowl", "sticker")
},
[Discord.AuditLogEvent.ChannelUpdate]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(Panels.channelShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.name;
if(await client.WhitelistControl(userID, "channel") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "ChannelUpdateLimites")
await client.SendToMessageChannel(userID, target.id, targetName, "Kanal Güncelleme", "Kanal Güncelleme", "wl", "kanal")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Kanal Güncelleme", "Kanal Güncelleme", "nowl", "kanal")
const ChannelName = changes.find(x => x.key === "name");
if(ChannelName) await target.edit({name: ChannelName.old}).catch(e => {})
const ChannelType = changes.find(x => x.key === "type");
if(ChannelType) {
if(ChannelType.old === 4) {
const data = await CategoryChannels.findOne({ channelID: target.id });
if(data) {
await target.setPosition(data.position).catch(e => {})
await target.permissionOverwrites.set(data.permissionOverwrites).catch(e => {})
await CategoryChannels.updateOne({ channelID: target.id }, { $set: { name: target.name, channelID: target.id, permissionOverwrites: data.permissionOverwrites } }, { upsert: true })
}
}
if(ChannelType === 0 || ChannelName === 5) {
if(data) {
await target.setPosition(data.position).catch(e => {})
await target.permissionOverwrites.set(data.overwrites).catch(e => {})
await target.setParent(data.parentID).catch(e => {})
await TextChannels.updateOne({ channelID: target.id }, { $set: { name: target.name, channelID: target.id, parentID: data.parentID, position: data.position, rateLimit: data.rateLimitPerUser, overwrites: data.overwrites } }, { upsert: true })
}
}
if(ChannelType === 2) {
const data = await VoiceChannels.findOne({ channelID: target.id });
if(data) {
await target.setPosition(data.position).catch(e => {})
await target.permissionOverwrites.set(data.overwrites).catch(e => {})
await target.setParent(data.parentID).catch(e => {})
await target.setUserLimit(data.userLimit).catch(e => {})
await target.setBitrate(data.bitrate).catch(e => {})
await VoiceChannels.updateOne({ channelID: target.id }, { $set: { name: target.name, channelID: target.id, parentID: data.parentID, position: data.position, bitrate: data.bitrate, userLimit: data.userLimit, overwrites: data.overwrites } }, { upsert: true })
}
}
}
},
[Discord.AuditLogEvent.BotAdd]: async (target, guild, changes, userID) => {
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.botShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.username;
if(await client.WhitelistControl(userID, "bot") || await client.WhitelistControl(userID, "full")) {
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
if(target && target.bannable) { await client.Punish(client, target.id, "ban") } else if(target && !target.bannable) { await client.SPunish(target.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Bot Ekleme", "Bot Ekleme", "nowl", "sunucu")
await client.ytKapat()
},
[Discord.AuditLogEvent.MemberKick]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.bankickShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.username;
if(await client.WhitelistControl(userID, "kick") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "MemberKickLimites")
await client.SendToMessageChannel(userID, target.id, targetName, "Üye Atma", "Üye Atma", "wl", "üye")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Üye Atma", "Üye Atma", "nowl", "üye")
},
[Discord.AuditLogEvent.MemberBanAdd]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.bankickShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
if(await client.WhitelistControl(userID, "ban") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "MemberBanLimites")
await client.SendToMessageChannel(userID, target.id, targetName, "Üye Yasaklama", "Üye Yasaklama", "wl", "üye")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
if(target) await guild.members.unban(target.id, {reason: "Guard Sunucu Koruma."}).catch(e => {})
await client.SendToMessageChannel(userID, target.id, targetName, "Üye Yasaklama", "Üye Yasaklama", "nowl", "üye")
},
[Discord.AuditLogEvent.MemberBanRemove]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.bankickShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.username;
if(await client.WhitelistControl(userID, "ban") || await client.WhitelistControl(userID, "full")) {
await client.LimitiesControl(guild.id, userID, "MemberUnbanLimites")
await client.SendToMessageChannel(userID, target.id, targetName, "Üye Ban Kaldırma", "Üye Ban Kaldırma", "wl", "üye")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
if(target) await guild.members.ban(target.id, {reason: "Guard Sunucu Koruma."}).catch(e => {})
await client.SendToMessageChannel(userID, target.id, targetName, "Üye Ban Kaldırma", "Üye Ban Kaldırma", "nowl", "üye")
},
[Discord.AuditLogEvent.MemberPrune]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(!Panels) Panels = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(Panels.bankickShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = target.username;
if(await client.WhitelistControl(userID, "kick") || await client.WhitelistControl(userID, "full")) {
await client.SendToMessageChannel(userID, target.id, targetName, "Üye Atma", "Üye Atma", "wl", "üye")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Üye Atma", "Üye Atma", "nowl", "üye")
await client.ytKapat()
},

[Discord.AuditLogEvent.IntegrationCreate]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(Panels.guildShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = changes.filter(x => x.key == "name").map(x => x.new);
if(await client.WhitelistControl(userID, "full")) {
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Entegrasyon Ekleme", "Entegrasyon Ekleme", "nowl", "sunucu")
await client.ytKapat()
},
[Discord.AuditLogEvent.IntegrationUpdate]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(Panels.guildShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = changes.filter(x => x.key == "name").map(x => x.new);
if(await client.WhitelistControl(userID, "full")) {
await client.SendToMessageChannel(userID, target.id, targetName, "Entegrasyon Güncelleme", "Entegrasyon Güncelleme", "wl", "sunucu")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Entegrasyon Güncelleme", "Entegrasyon Güncelleme", "nowl", "sunucu")
await client.ytKapat()
},
[Discord.AuditLogEvent.IntegrationDelete]: async (target, guild, changes, userID) => {
if(!target || !guild || !changes) return;
let Panels = await PDB.findOne({ guildID: guild.id });
if(Panels.guildShield == false) return;
if(await client.CheckBot(target.id)) {
return;}
const targetName = changes.filter(x => x.key == "name").map(x => x.new);
if(await client.WhitelistControl(userID, "full")) {
await client.SendToMessageChannel(userID, target.id, targetName, "Entegrasyon Silme", "Entegrasyon Silme", "wl", "sunucu")
return;}
const Users = guild.members.cache.get(userID);
if(Users && Users.bannable) { await client.Punish(client, Users.id, "ban") } else if(Users && !Users.bannable) { await client.SPunish(Users.id, "ban") }
await client.SendToMessageChannel(userID, target.id, targetName, "Entegrasyon Silme", "Entegrasyon Silme", "nowl", "sunucu")
await client.ytKapat()
},

}
static async handleEvent(event) {
const handler = Guard.eventHandlers[event];
if(handler) return handler;
}
}
module.exports = {Guard};