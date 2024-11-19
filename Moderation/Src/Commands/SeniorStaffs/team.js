const settings = require("../../../../Src/Settings/Settings.json")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Discord = require("discord.js")
const setups = require("../../../../Src/Schemas/Setup")
const teamDB = require("../../../../Src/Schemas/teamDB")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
let table = require("string-table");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["team", "ekip"],
name: "team",
help: "ekip [ekle/sil/kontrol/bilgi/liste]",
category: "ustyetkili"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["team", "ekip"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır.`}).sil(15)
return }
if(!args[0]) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Lütfen Bir Değer Belirtin!\n\n`ekle`, `sil`, `liste`, `kontrol`, `bilgi`"}).sil(15)
}
const Team = await teamDB.findOne({ guildID: message.guild.id });
if (!Team) {
await new teamDB({ guildID: message.guild.id }).save();
}
if (args[0] === "ekle") {
let Tag = args[1];
let SayıTag = args[2];
let TeamOwner = message.mentions.members.first() || message.guild.members.cache.get(args[3]);
if (!Tag) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ embeds: [embed.setDescription(`Lütfen Bir Değer Belirtin!\n\n\`ekle\`, \`sil\`, \`liste\`, \`kontrol\`, \`bilgi\`,\nÖrnek: ${settings.Moderation.prefix}ekip ekle .vd 2018 @Darkdays/ID`)] }).sil(15)
return
}
if (!SayıTag || isNaN(SayıTag)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ embeds: [embed.setDescription(`Lütfen Bir Değer Belirtin!\n\n\`ekle\`, \`sil\`, \`liste\`, \`kontrol\`, \`bilgi\`,\nÖrnek: ${settings.Moderation.prefix}ekip ekle .vd 2018 @Darkdays/ID `)] }).sil(15)
return
}
if (!TeamOwner) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ embeds: [embed.setDescription(`Lütfen Bir Değer Belirtin!\n\n\`ekle\`, \`sil\`, \`liste\`, \`kontrol\`, \`bilgi\`,\nÖrnek: ${settings.Moderation.prefix}ekip ekle .vd 2018 @Darkdays/ID`)] }).sil(15)
return
}
if (Team.Teams) {
const teamExists = Team.Teams.some(x => x.TeamNameTag === Tag || x.TeamNumberTag === SayıTag);
if (teamExists) {
await message.react(message.guild.emojiGöster(emojis.no));
await message.reply({ embeds: [embed.setDescription("Bu Ekip Zaten Bulunuyor!")] }).sil(15);
return;
}
}
message.guild.roles.create({
name: `${Tag} #${SayıTag}`,
color: "Random",
mentionable: false,
reason: `${message.member.user.username} Tarafından Ekip İçin Oluşturuldu.`
}).then(async (role) => {
await teamDB.updateOne({ guildID: message.guild.id }, { $push: { Teams: { TeamNameTag: Tag, TeamNumberTag: SayıTag || "Yok", TeamOwner: TeamOwner.id, Date: Date.now(), TeamRole: role.id } } }, { upsert: true });
await message.react(message.guild.emojiGöster(emojis.yes))
const TaggesMemberSize = message.guild.members.cache.filter(user => user.user.username.includes(Tag) || user.user.globalName && user.user.globalName.includes(Tag)).size + message.guild.members.cache.filter(user => user.user.username.includes(SayıTag) || user.user.globalName && user.user.globalName.includes(SayıTag)).size
const TaggesMemberVoiceSize = message.guild.members.cache.filter(user => user.voice.channel && user.user.username.includes(Tag) || user.user.globalName && user.user.globalName.includes(Tag)).size + message.guild.members.cache.filter(user => user.voice.channel && user.user.username.includes(SayıTag) || user.user.globalName && user.user.globalName.includes(SayıTag)).size
await message.reply({
embeds: [embed.setDescription(`
${message.guild.emojiGöster(emojis.yes)} **Ekip Başarıyla Oluşturuldu! (${Tag} | #${SayıTag} | ${TeamOwner}.)**

${message.guild.emojiGöster(emojis.sagok)} ${Tag} (\`%${Math.floor(TaggesMemberSize / message.guild.memberCount * 100)}\`)
${message.guild.emojiGöster(emojis.member)} Üye Sayısı: **${TaggesMemberSize}**
${message.guild.emojiGöster(emojis.stat)} Sesteki Üye Sayısı: **${TaggesMemberVoiceSize}**`)]
})
message.guild.members.cache.forEach(user => {
if (user.user.username.includes(Tag) || user.user.globalName && user.user.globalName.includes(Tag)) {
user.addRoles(role.id).catch(err => {})
}
if (user.user.username.includes(SayıTag) || user.user.globalName && user.user.globalName.includes(SayıTag)) {
user.addRoles(role.id).catch(err => {})
}
})
})
}
if (args[0] === "liste") {
if (!Team) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ embeds: [embed.setDescription(`Bu Sunucuda Ekip Bulunmamaktadır!`)] }).sil(15)
}
let Tablo = [{}]
for (let i = 0; i < Team.Teams.length; i++) {
Tablo[i] = {
"Ekip": Team.Teams[i].TeamNameTag + ` (%${Math.floor(message.guild.members.cache.filter(b => b.roles.cache.has(Team.Teams[i].TeamRole)).size / message.guild.memberCount * 100)})`,
"Üye Sayısı": message.guild.members.cache.filter(b => b.roles.cache.has(Team.Teams[i].TeamRole)).size,
"Ses Sayısı": message.guild.members.cache.filter(s => !s.user.bot && s.user.globalName && s.user.globalName.includes(Team.Teams[i].TeamNameTag) || s.user.username.includes(Team.Teams[i].TeamNameTag)).filter(s => s.voice.channel).size + message.guild.members.cache.filter(s => !s.user.bot && s.user.globalName && s.user.globalName.includes(Team.Teams[i].TeamNumberTag) || s.user.username.includes(Team.Teams[i].TeamNumberTag)).filter(s => s.voice.channel).size
}
}
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ embeds: [embed.setFooter({text: `Sunucuda ${Team.Teams.length} Adet Ekip Bulunmaktadır.`, iconURL: message.author.avatarURL({ dynamic: true })})
.setAuthor({ name: `${message.guild.name}`, iconURL: message.author.avatarURL({ dynamic: true })})
.setDescription(`
${message.guild.emojiGöster(emojis.info)} ${message.member} **${message.guild.name}** Sunucusunun Ekip Listesi Aşagıda Belirtilmiştir.

\`\`\`js
${table.create(Tablo)}
\`\`\``)] })
}
if (args[0] === "bilgi") {
let Tag = args[1];
if (!Tag) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ embeds: [embed.setDescription("Sunucumuz da olan ekibin tagını belirtmelisin")] }).sil(15)
return
}
const ekipler = Team.Teams.filter(a => a.TeamNameTag == Tag || a.TeamNumberTag == Tag).map(a => `
İsim Tag: ${a.TeamNameTag}
Sayı Tagı: ${a.TeamNumberTag}
Yönetici: ${message.guild.members.cache.get(a.TeamOwner) ? message.guild.members.cache.get(a.TeamOwner).user.username : "Yok"}
Tarih: ${moment(a.TeamDate).format("LLL")}
Rol: ${message.guild.roles.cache.get(a.TeamRole) ? message.guild.roles.cache.get(a.TeamRole).name : "Yok"}`).join('');
if (!ekipler) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ embeds: [embed.setDescription("Sunucuda olan ekibin bilgileri bulunmamaktadır.")] }).sil(15)
return
}
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ embeds: [embed.setDescription(`
${message.guild.emojiGöster(emojis.info)} ${message.member} **${Tag}** Ekibinin Bilgileri Aşagıda Belirtilmiştir.

\`\`\`js
${ekipler}
\`\`\``)] })
}
if (args[0] === "kontrol") {
let Tag = args[1];
if (!Tag) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ embeds: [embed.setDescription("Bir Tag Belirtmelisin.")] }).sil(15)
return
}
const ekipler = Team.Teams.filter(a => a.TeamNameTag == Tag || a.TeamNumberTag == Tag).map(a => `

Yönetici: ${message.guild.members.cache.get(a.TeamOwner) ? message.guild.members.cache.get(a.TeamOwner).user.username : "Yok"}
Yönetici Ses Durumu: ${message.guild.members.cache.get(a.TeamOwner).voice.channelId ? "Seste" : "Seste Değil"}
Ses Aktifliği: ${message.guild.members.cache.filter(s => !s.user.bot && s.user.globalName && s.user.globalName.includes(a.TeamNameTag) || s.user.username.includes(a.TeamNameTag)).filter(s => s.voice.channel).size + message.guild.members.cache.filter(s => !s.user.bot && s.user.globalName && s.user.globalName.includes(a.TeamNumberTag) || s.user.username.includes(a.TeamNumberTag)).filter(s => s.voice.channel).size}`).join('')
if (!ekipler) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ embeds: [embed.setDescription("Sunucuda olan ekibin bilgileri bulunmamaktadır.")] }).sil(15)
return
}
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ embeds: [embed.setDescription(`
${message.guild.emojiGöster(emojis.info)} ${message.member} Aşağıda **${Tag}** Ekibinin Anlık Ses Aktiflikleri Ve Taglarındaki Üye Bilgileri Belirtilmiştir.

\`\`\`js
${ekipler}
\`\`\``)] })
}

if (args[0] === "sil") {
let Tag = args[1]
if (!Tag) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ embeds: [embed.setDescription("Sunucumuz da olan ekibin tagını belirtmelisin")] }).sil(15)
return
}
const ekipler = Team.Teams.filter(a => a.TeamNameTag == Tag).map(e => e.TeamNameTag)
const admin = Team.Teams.filter(a => a.TeamNameTag == Tag).map(e => e.TeamOwner)
const Admin = message.guild.members.cache.get(admin[0])
const role = Team.Teams.filter(a => a.TeamNameTag == Tag).map(e => e.TeamRole)
if (!ekipler) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ embeds: [embed.setDescription("Sunucuda olan ekibin bilgileri bulunmamaktadır.")] }).sil(15)
return
}
await message.react(message.guild.emojiGöster(emojis.yes))
await Admin.send({content: `${Admin}`, embeds: [embed.setThumbnail(message.guild.iconURL({ dynamic: true })).setDescription(`Kurucusu Olduğunuz (**${ekipler}**) Tagındaki Ekip **${message.guild.name}** Sunucudan Çıkartıldı. Emekleriniz İçin Teşekkürler.`)] }).catch(e => { })
await message.reply({ embeds: [embed.setDescription(`**${ekipler}** Ekibi Sistemden Çıkartıldı.`)] })
await message.guild.roles.cache.get(role[0]).delete({ reason: "Ekip Olarak Sunucudan Çıkarıldı" }).catch(e => { })
setTimeout(async () => { await teamDB.updateOne({ guildID: message.guild.id }, { $pull: { Teams: { TeamNameTag: Tag } } }) }, 4000);
}
}
}