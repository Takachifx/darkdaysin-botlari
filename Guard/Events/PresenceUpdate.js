const settings = require('../../Src/Settings/Settings.json');
const otherShield = global.otherShield
const Discord = require('discord.js')
const PDB = require('../../Src/Schemas/Panels')
const Offline = require('../../Src/Schemas/UserOffline')
const Web = require('../../Src/Schemas/UserWeb')
module.exports = async(oldPresence, newPresence) => {
const guild = otherShield.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
const member = guild.members.cache.get(newPresence.member.user.id)
if(!member) return;
const Permissions = [
Discord.PermissionFlagsBits.Administrator,
Discord.PermissionFlagsBits.ManageRoles,
Discord.PermissionFlagsBits.ManageChannels,
Discord.PermissionFlagsBits.ManageGuild,
Discord.PermissionFlagsBits.ManageWebhooks
];
let Dedection =  Object.keys(newPresence.member.presence.clientStatus);
let CheckWeb = Dedection.find(x => x == "web");
if(member && member.presence && member.presence.status == "offline" && Permissions.some(x => member.permissions.has(x))) {
let panel = await PDB.findOne({ guildID: guild.id });
if(!panel) panel = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(panel.offlineShield == false) return;
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true, size: 2048 })}).setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true })}).setThumbnail(member.user.avatarURL({ dynamic: true }))
const kanal = guild.channels.cache.find(x => x.name == "offline-koruma-log") || guild.channels.cache.find(x => x.name == "guard-log");
if(!kanal) return console.log("Log kanalı bulunamadı.");
if(await otherShield.CheckBot(member.user.id)) return;
if(await otherShield.WhitelistControl(member.user.id, "offline") || await otherShield.WhitelistControl(member.user.id, "full")) return;
let arr = []
let Roller =  member.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && Permissions.some((a) => e.permissions.has(a)));
if(Roller) Roller.forEach(rol => {
arr.push(rol.id)
})
await Offline.updateOne({ guildID: guild.id, userID: member.user.id }, { $set: { roller: arr, Date: Date.now() } }, { upsert: true })
await member.removeRoles(arr).catch(e => { })
await kanal.send({embeds: [embed
.setDescription(`${member} (\`${member.id}\`) İsimli Yönetici Çevrim-Dışı Oldu.
\`\`\`fix
Üzerinden Alınan Roller; (${arr.length})
${arr.length >= 1 ? `${arr.filter(x => member.guild.roles.cache.get(x)).map(x => member.guild.roles.cache.get(x).name).join(", ")}` : `Üzerinden herhangi bir rol alınmadı.`}
\`\`\``)
.setFooter({ text: "Aktif olduğunda yetkisi tekrardan verilecektir."})
.setTitle("Sunucuda Bir Yönetici Çevrim-Dışı Oldu!")]}).catch(() => {})
return } else if(member && member.presence && member.presence.status != "offline") {
let panel = await PDB.findOne({ guildID: guild.id });
if(!panel) panel = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(panel.offlineShield == false) return;
let Data = await Offline.findOne({ guildID: guild.id, userID: member.id })
if(!Data) return;
if(Data.roller.length > 0) {
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true, size: 2048 })}).setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true })}).setThumbnail(member.user.avatarURL({ dynamic: true }))
const kanal = guild.channels.cache.find(x => x.name == "offline-koruma-log") || guild.channels.cache.find(x => x.name == "guard-log");
if(kanal) await kanal.send({embeds: [embed
.setDescription(`${member} (\`${member.id}\`) İsimli Yönetici Çevrim-İçi Oldu Ve Yetkileri Tekrardan Verildi.
\`\`\`fix
Üzerine Verilen Roller; (${Data.roller.length})
${Data.roller.length >= 1 ? `${Data.roller.map(x => guild.roles.cache.get(x).name).join(", ")}` : `Verilen roller bulunamadı.`}
\`\`\``)
.setTitle("Sunucuda Bir Yönetici Çevrim-İçi Oldu!")]}).catch(() => {})
if(Data.roller) await member.addRoles(Data.roller, `Aktif Olduğundan Dolayı Çekilen Yetkileri Tekrardan Verildi.`).catch(err => {})
await Offline.updateOne({ guildID: guild.id, userID: member.id }, { $set: { roller: [], endDate: Date.now() } }, { upsert: true })
}
return }
if(CheckWeb && Permissions.some(x => member.permissions.has(x))) {
let panel = await PDB.findOne({ guildID: guild.id });
if(!panel) panel = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(panel.webShield == false) return;
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true, size: 2048 })}).setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true })}).setThumbnail(member.user.avatarURL({ dynamic: true }))
const kanal = guild.channels.cache.find(x => x.name == "web-koruma-log") || guild.channels.cache.find(x => x.name == "guard-log");
if(!kanal) return console.log("Log kanalı bulunamadı.");
if(await otherShield.CheckBot(member.user.id)) return;
if(await otherShield.WhitelistControl(member.user.id, "web") || await otherShield.WhitelistControl(member.user.id, "full")) return;
let arr = []
let Roller =  member.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && Permissions.some((a) => e.permissions.has(a)));
if(Roller) Roller.forEach(rol => {
arr.push(rol.id)
})
let Row = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder()
.setCustomId('ver')
.setEmoji("1157606786627543070")
.setLabel('Rolleri Geri Ver!')
.setStyle(Discord.ButtonStyle.Secondary),
)
await Web.updateOne({ guildID: guild.id, userID: member.user.id }, { $set: { roller: arr, Date: Date.now() } }, { upsert: true })
await member.removeRoles(arr).catch(e => { })
const msg = await kanal.send({embeds: [embed
.setTitle("Bir Yönetici Sunucuya Webden Giriş Sağladı!")
.setDescription(`${member} (\`${member.id}\`) İsimli Yönetici Web Tarayıcısından **Sunucu** Ekranına Giriş Yaptığı İçin Yetkisi Çekildi.
\`\`\`fix
Üzerinden Alınan Roller; (${arr.length})
${arr.length >= 1 ? `${arr.filter(x => member.guild.roles.cache.get(x)).map(x => member.guild.roles.cache.get(x).name).join(", ")}` : `Üzerinden herhangi bir rol alınmadı.`}
\`\`\``)], components: [Row]}).catch(() => {})
const tacsahip = await guild.fetchOwner();
const filter = (i) =>  i.customId == "ver" && (settings.Moderation.owners.includes(i.user.id) || i.user.id === tacsahip.id)
const collector = msg.createMessageComponentCollector({ filter, max: 1 })
collector.on('collect', async i => {
if(i.customId == "ver") {
if(!Data) return;
if(Data.roller.length > 0) {
await i.reply({content: `${member} Üyesinin Çekilen Rolleri Başarıyla Geri Verildi.`, ephemeral: true})
if(Data.roller) await member.addRoles(Data.roller, `${i.user.username} Tarafından Tekrardan Verildi.`).catch(err => {})
} else {
await i.reply({content: `${member} Üyesinin Rolleri Veritabanında Bulunamadığından İşlem Sonlandırıldı.`, ephemeral: true})
}
}
})
collector.on('end', c => {
msg.edit({embeds: [embed], components: []}).catch(err => {})
})
return }
}
module.exports.conf = {
name: "presenceUpdate",
};