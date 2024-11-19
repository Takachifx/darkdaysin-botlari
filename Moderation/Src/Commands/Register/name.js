const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Names = require("../../../../Src/Schemas/Names");
const BoosterName = require("../../../../Src/Schemas/Booster");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["isim", "i", "nick"],
name: "isim",
help: "isim @Darkdays/ID [İsim] [Yaş]",
category: "kayit",
cooldown: 0
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID });
if(!ayar) return;
const Name = ["isim", "i", "nick"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.registerRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.staffRoles.some(oku => message.member.roles.cache.has(oku))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Yetkin bulunmamakta. Yetkili olmak istersen başvuru yapabilirsin.`)]}).sil(15)
}
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bir üye belirtmelisin!`)]}).sil(15)
}
if(member.user.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendin Üzerinde İşlem Yapamazsın"}).sil(15)
}
if(ayar.SafeBots.includes(member.user.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Botlara İşlem Yapamazsın"}).sil(15)
}
if(message.member.roles.highest.position <= member.roles.highest.position) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendinden Üstteki Kullanıcıya İşlem Yapamazsın"}).sil(15)
}
args = args.filter(a => a !== "" && a !== " ").splice(1);
let setName;
let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
let age = args.filter(arg => !isNaN(arg))[0] || "";
if(!name & !age) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`\`${prefix}isim <@Darkdays/ID> <İsim> <Yaş>\``)]}).sil(15)
}
if(!age) {
if(ayar.ageSystem == true && !age) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`\`${prefix}kayıt <@Darkdays/ID> <İsim> <Yaş>\``)]}).sil(15)
}
setName = `${ayar.tagSystem == true ? (member.user.globalName && member.user.globalName.includes(ayar.nameTag) ? ayar.nameTag : (ayar.defaultTag ? ayar.defaultTag : (ayar.nameTag || ""))) : ''} ${name}`;
} else if(ayar.ageSystem == false && age) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`\`${prefix}kayıt <@Darkdays/ID> <İsim>\``)]}).sil(15)
} else {
if(ayar.ageSystem == true) {
if(ayar.minRegisterAge > age) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Belirttiğin Yaş Minimum Yaş Sınırının Altında.`)]}).sil(15)
}
setName = `${ayar.tagSystem == true ? (member.user.globalName && member.user.globalName.includes(ayar.nameTag) ? ayar.nameTag : (ayar.defaultTag ? ayar.defaultTag : (ayar.nameTag || ""))) : ''} ${name} | ${age}`;
}
}
await member.setNickname(setName).catch(e => { });
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.face)} ${member} Kullanıcısının İsmi Başarıyla \` ${setName} \` Olarak Değiştirildi!\n\n${message.guild.emojiGöster(emojis.info)} __**Geçmiş İsimleri İçin ${prefix}isimler @Darkdays/ID**__`)]})
await Names.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $push: { names: { name: name, age: age, executor: message.author.id, Date: Date.now() } } }, { upsert: true });
await BoosterName.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { names: member.displayName } }, { upsert: true });
}
}