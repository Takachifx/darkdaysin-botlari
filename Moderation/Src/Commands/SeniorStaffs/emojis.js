const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["emoji","addemoji"],
name: "emojiekle",
help: "emojiekle [Emoji]",
category: "ustyetkili",
cooldown: 60
},
Cyrstal: async (client, message, args, embed) => {
const ayars = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayars) return;
const Name = ["emojiekle", "emoji", "addemoji"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayars.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayars.ownerRoles.some(x => message.member.roles.cache.has(x)) && !ayars.roleAddRoles.some(s => message.member.roles.cache.has(s))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır." }).sil(15);
}
if(!args.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bir Emoji Belirtmelisin." }).sil(15);
}
if(args.length > 20) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "En Fazla Tek Seferde **20** Emoji Ekleyebilirsin." }).sil(15);
}
for(let raw of args){
let parsed = parseEmoji(raw);
if(parsed.id){
let ext = parsed.animated ? ".gif" : ".png";
let url = `https://cdn.discordapp.com/emojis/${parsed.id}${ext}`;
const emojisayisi = message.guild.emojis.cache.size
const name = `dark_${emojisayisi+1}`
var emoji = await message.guild.emojis.create({name: name, attachment:url}).catch(async err => {
await message.reply({content:`**Bir Hata Oluştu!** ${err}`})
return; })
if(args.length == 1) {
await message.reply({content: `${emoji} Emoji Sunucuya Eklendi!`})
}
if(args.length > 1) {
await message.channel.send({content: `${emoji} Emoji Sunucuya Eklendi!`})
}
}
}
}
}
function parseEmoji(text) {
if (text.includes('%')) text = decodeURIComponent(text);
if (!text.includes(':')) return { animated: false, name: text, id: undefined };
const match = text.match(/<?(?:(a):)?(\w{1,32}):(\d{17,19})?>?/);
return match && { animated: Boolean(match[1]), name: match[2], id: match[3] };
}
