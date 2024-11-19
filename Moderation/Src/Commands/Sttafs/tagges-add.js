const settings = require("../../../../Src/Settings/Settings.json");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Users = require("../../../../Src/Schemas/UsersDB");
const setups = require("../../../../Src/Schemas/Setup");
const RankSystem = require("../../../../Src/Schemas/RankSystem");
const Puans = require("../../../../Src/Schemas/Puans");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
module.exports = {
conf: {
aliases: ["taglı", "tagli", "tag-aldır", "tag-aldir", "tagaldır", "tagaldir", "tagges"],
name: "tagges-add",
help: "taglı @Darkdays/ID",
category: "yetkili",
cooldown: 60,
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({ guildID: message.guild.id });
if(!ayar) return;
const rdata = await RankSystem.findOne({guildID: message.guild.id})
if(!rdata) return;
if(rdata.RankSystem == false) return await message.react(message.guild.emojiGöster(emojis.no))
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
const ranks = JSON.parse(await client.ranks(message.guild.id));
if(!ranks.map(x => x.roleID).some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin!`)]}).sil(15)
}
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bir uye belirtmelisin!`)]}).sil(15)
}
if(member.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Kendine yetki veremezsin." }).sil(15);
}
if(member.id === client.user.id) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Bana yetki veremezsin." }).sil(15);
}
if(member.id === message.guild.ownerId) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Sunucu sahibine yetki veremezsin." }).sil(15);
}
if(member.roles.highest.position >= message.member.roles.highest.position) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Belirttiğin üye senden üst/aynı pozisyonda." }).sil(15);
}
if(member.user.bot) {
await message.react(message.guild.emojiGöster(emojis.no)).catch(e => {})
return message.reply({ content: "Botlara yetki veremezsin." }).sil(15);
}
if(!ayar.serverTag.some(s => member.user.globalName && member.user.globalName.includes(s) || member.user.username.includes(s))) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({embeds: [embed.setDescription(`${member.toString()} isimli üyenin kullanıcı adında tagımız (\`${ayar.serverTag.join(", ")}\`) olmadığı için tag aldıramazsınız.`)]}).sil(15)
return }
var kontrol = await Users.findOne({_id: member.id})
if(kontrol && kontrol.Tagged == true) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `${member} isimli üye zaten bir başkası tarafından taglı olarak belirlenmiş.`}).sil(15)
return }
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onay")
.setLabel("Kabul Et")
.setStyle(Discord.ButtonStyle.Success)
.setEmoji("1207317746891759637"),
new Discord.ButtonBuilder()
.setCustomId("red")
.setLabel("Reddet")
.setStyle(Discord.ButtonStyle.Danger)
.setEmoji("1207317729258770432"),
);
const row2 = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onayy")
.setLabel("İşlem Başarılı")
.setStyle(Discord.ButtonStyle.Success)
.setDisabled(true),
);
const row3 = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("redd")
.setLabel("İşlem Başarısız")
.setStyle(Discord.ButtonStyle.Danger)
.setDisabled(true),
);
embed.setFooter({ text: `60 saniye içerisinde butonlara basılmazsa işlem iptal edilecektir.`, iconURL: message.author.avatarURL({ dynamic: true })})
embed.setDescription(`${member.toString()}, ${message.member.toString()} üyesi sana tag aldırmak istiyor. Kabul ediyor musun?`)
const msg = await message.reply({ content: `${member.toString()}`, embeds: [embed], components: [row]});
var filter = button => button.user.id === member.user.id;
var collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
collector.on("collect", async (button) => {
if(button.customId === "onay") {
await button.deferUpdate();
const Embed = new Discord.EmbedBuilder()
Embed.setTimestamp()
Embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla ${member.toString()} Üyesi ${message.author} Tarafından <t:${String(Date.now()).slice(0, 10)}:R> Taglı Olarak Belirlendi!`)
await Puans.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { puan: rdata.tagCoin } }, { upsert: true });
message.member.görevGüncelle(settings.Moderation.guildID, "tagli", 1, message.channel);
await Users.updateOne({ _id: member.id }, { $set: { "Tagged": true, "TaggedGiveAdmin": message.author.id } }, { upsert: true }).exec();
await Users.updateOne({ _id: message.author.id }, { $push: { "Taggeds": { id: member.id, Date: Date.now() } } }, { upsert: true }).exec();
const channel = await client.kanalBul("taglı-log")
if(channel) await channel.send({ embeds: [Embed.setDescription(`${member.toString()} Üyesi ${message.author} Tarafından <t:${String(Date.now()).slice(0, 10)}:R> Taglı Olarak Belirlendi!`)] })
msg.edit({embeds: [Embed], components : [row2]})
}
if(button.customId === "red") {
await button.deferUpdate();
const Embeds = new Discord.EmbedBuilder()
Embeds.setTimestamp()
Embeds.setDescription(`${message.guild.emojiGöster(emojis.no)} ${message.author} ${member} Adlı Kullanıcı Taglı İsteğini Reddetti!`)
msg.edit({ embeds: [Embeds], components : [row3]})
}
});
}
}