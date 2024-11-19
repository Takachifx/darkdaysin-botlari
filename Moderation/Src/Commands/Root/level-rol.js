const settings = require('../../../../Src/Settings/Settings.json');
const Discord = require('discord.js');
const emojis = require('../../../../Src/Settings/emojiName.json');
const levelSystem = require('../../../../Src/Schemas/LevelSystem');
const setups = require('../../../../Src/Schemas/Setup');
module.exports = {
conf: {
aliases: ["levelrol", "levelrol-ayarla"],
name: "level-rol",
help: "level-rol ekle/sil/liste Mesaj [10] [@Rol/ID]",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: message.guild.id})
if (!ayar) return;
if(!args[0]) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir Tür Belirtin.\n\n\`ekle\`, \`sil\`, \`liste\``}).sil(15)
return
}
if(args[0] == "ekle" || args[0] == "ayarla") {
const type = args[1]
const level = args[2]
if(!type || Number(type)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir Tür Belirtin.`}).sil(15)
return
}
const Types = ["Mesaj", "mesaj", "Message", "message", "Ses", "ses", "Voice", "voice"]
if(!Types.some(x => x == type)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir Tür Belirtin.`}).sil(15)
return
}
if(!level || !Number(level)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir Seviye Belirtin.`}).sil(15)
return
}
if(!args[3]) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir Rol Belirtin.`}).sil(15)
return
}
let roller = args[3].split(",").map(rol => message.guild.roles.cache.get(rol.replace("<@&", "").replace(">", "")) || message.guild.roles.cache.get(rol.replace("@", "").replace("", "")) || message.guild.roles.cache.get(rol) || message.guild.roles.cache.find(x => x.name === rol) || rol);
if(!roller[0]) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir Rol Belirtin.`}).sil(15)
return
}
if(roller.length < 1) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir Rol Belirtin.`}).sil(15)
return
}
const Data = await levelSystem.findOne({guildID: message.guild.id, Type: type, Level: level})
if(Data) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bu Seviye Zaten Ayarlanmış.`}).sil(15)
return
} else {
await levelSystem.updateOne({guildID: message.guild.id, Type: type, Level: level}, {$set: {Roles: roller.map(x => x.id)} }, {upsert: true})
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({content: `${message.guild.emojiGöster(emojis.yes)} Başarıyla **${level}** Seviyesine Ulaşınca Verilecek Rol ${roller.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x).name : x).join(", ")} Olarak Ayarlandı.`})
}
} else if(args[0] == "sil") {
const type = args[1]
const level = args[2]
if(!level || !Number(level)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir Seviye Belirtin.`}).sil(15)
return
}
if(!type) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Lütfen Bir Tür Belirtin.`}).sil(15)
return
}
const Data = await levelSystem.findOne({guildID: message.guild.id, Type: type, Level: level})
if(!Data) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Veri Bulunamadı.`}).sil(15)
return
} else {
await levelSystem.deleteOne({guildID: message.guild.id, Type: type, Level: level})
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({content: `${message.guild.emojiGöster(emojis.yes)} **${level}** Seviyesine Ulaşınca Verilecek Rol Silindi.`})
}
} else if(args[0] == "liste") {
const Data = await levelSystem.find({guildID: message.guild.id})
if(!Data) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Veri Bulunamadı.`}).sil(15)
return
}
if(Data.length < 1) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Veri Bulunamadı.`}).sil(15)
return
}
await message.react(message.guild.emojiGöster(emojis.yes))
const embed = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
.setFooter({ text: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
.setThumbnail(message.guild.iconURL({ dynamic: true }))
.setDescription(`${message.guild.emojiGöster(emojis.info)} **${message.guild.name}** Sunucusunun Level Ayarları Aşağıda Belirtilmiştir;\n\n__**Mesaj Seviye Bilgileri Aşağıda Belirtilmiştir;**__\n${Data.filter(x => x.Type == "mesaj" || x.Type == "Mesaj" || x.Type == "message" || x.Type == "Message").map((x, index) => `\` ${index+1} \` [**${x.Type == "mesaj" ? "Mesaj" : "Mesaj"}**] \` Level: \` (**${x.Level}**) \` Rol: \` ${x.Roles.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x).join(", ")}`).join("\n")}\n\n__**Ses Seviye Bilgileri Aşağıda Belirtilmiştir;**__\n${Data.filter(x => x.Type == "ses" || x.Type == "Ses" || x.Type == "voice" || x.Type == "Voice").map((x, index) => `\` ${index+1} \` [**${x.Type == "ses" ? "Ses" : "Ses"}**] \` Level: \` (**${x.Level}**) \` Rol: \` ${x.Roles.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x).join(", ")}`).join("\n")}`)
await message.reply({embeds: [embed]})
}
}
}