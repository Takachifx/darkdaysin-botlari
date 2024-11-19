const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const MessageUser = require("../../../../Src/Schemas/MessageUsers")
const VoiceUser = require("../../../../Src/Schemas/VoiceUsers")
const MessageUserChannels = require("../../../../Src/Schemas/MessageUserChannels")
const VoiceUserChannels = require("../../../../Src/Schemas/VoiceUserChannels")
const VoiceUserParents = require("../../../../Src/Schemas/VoiceUserParents")
const StreamUsers = require("../../../../Src/Schemas/StreamUsers")
const CameraUsers = require("../../../../Src/Schemas/CameraUsers")
const Invited = require("../../../../Src/Schemas/İnvited")
const RegisterStaffStats = require("../../../../Src/Schemas/RegisterStaffStats")
const Penalties = require("../../../../Src/Schemas/Penalties")
const PenaltiesPoints = require("../../../../Src/Schemas/PenaltyPoints");
const Names = require("../../../../Src/Schemas/Names")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["veri-sil", "clear-data", "verisil", "sifirla", "reset", "sıfırla"],
name: "clear-data",
help: "veri-sil @Darkdays/ID <isim/ceza/cezapuan/invite/voice/message/camera/stream/register/all>",
category: "ustyetkili",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["veri-sil", "clear-data", "verisil", "sifirla", "reset", "sıfırla"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır." }).sil(15);
}
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bir Kullanıcı Belirtmelisin." }).sil(15);
}
if(member.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Kendi Verilerini Silemezsin!" }).sil(15);
}
if(member.id === client.user.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Botun Verilerini Silemezsin!" }).sil(15);
}
if(member.user.bot) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Botların Verilerini Silemezsin!" }).sil(15);
}
const type = args[1];
if(!type) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bir Veri Türü Belirtmelisin.\n\n**Veri Türleri:**\n\n**isim** - İsim Verilerini Siler.\n**ceza** - Ceza Verilerini Siler.\n**cezapuan** - Ceza Puan Verilerini Siler.\n**invite** - Davet Verilerini Siler.\n**voice** - Ses Verilerini Siler.\n**message** - Mesaj Verilerini Siler.\n**camera** - Kamera Verilerini Siler.\n**stream** - Stream Verilerini Siler.\n**register** - Kayıt Verilerini Siler.\n**all** - Tüm Verileri Siler." }).sil(15);
}
if(ayar.SafeBots.includes(member.user.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Botlara İşlem Yapamazsın"}).sil(15)
}
if(message.member.roles.highest.position <= member.roles.highest.position) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendinden Üstteki Kullanıcıya İşlem Yapamazsın"}).sil(15)
}
if(type === "isim") {
await Names.deleteMany({ guildID: message.guild.id, userID: member.id });
await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcının İsim Verileri Başarıyla Silindi!` }).sil(15);
} else if(type === "ceza") {
await Penalties.deleteMany({ guildID: message.guild.id, userID: member.id });
await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcının Ceza Verileri Başarıyla Silindi!` }).sil(15);
} else if(type === "invite") {
await Invited.deleteMany({ guildID: message.guild.id, userID: member.id });
await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcının Davet Verileri Başarıyla Silindi!` }).sil(15);
} else if(type === "voice") {
await VoiceUser.deleteMany({ guildID: message.guild.id, userID: member.id });
await VoiceUserParents.deleteMany({ guildID: message.guild.id, userID: member.id });
await VoiceUserChannels.deleteMany({ guildID: message.guild.id, userID: member.id });
await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcının Ses Verileri Başarıyla Silindi!` }).sil(15);
} else if(type === "message") {
await MessageUser.deleteMany({ guildID: message.guild.id, userID: member.id });
await MessageUserChannels.deleteMany({ guildID: message.guild.id, userID: member.id });
await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcının Mesaj Verileri Başarıyla Silindi!` }).sil(15);
} else if(type === "camera") {
await CameraUsers.deleteMany({ guildID: message.guild.id, userID: member.id });
await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcının Kamera Verileri Başarıyla Silindi!` }).sil(15);
} else if(type === "stream") {
await StreamUsers.deleteMany({ guildID: message.guild.id, userID: member.id });
await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcının Stream Verileri Başarıyla Silindi!` }).sil(15);
} else if(type === "register") {
await RegisterStaffStats.deleteMany({ guildID: message.guild.id, userID: member.id });
await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcının Kayıt Verileri Başarıyla Silindi!` }).sil(15);
} else if(type === "cezapuan") {
await PenaltiesPoints.deleteMany({ guildID: message.guild.id, userID: member.id });
await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcının Ceza Puan Verileri Başarıyla Silindi!` }).sil(15);
} else if(type === "all") {
await Names.deleteMany({ guildID: message.guild.id, userID: member.id });
await Penalties.deleteMany({ guildID: message.guild.id, userID: member.id });
await PenaltiesPoints.deleteMany({ guildID: message.guild.id, userID: member.id });
await Invited.deleteMany({ guildID: message.guild.id, userID: member.id });
await VoiceUser.deleteMany({ guildID: message.guild.id, userID: member.id });
await VoiceUserParents.deleteMany({ guildID: message.guild.id, userID: member.id });
await VoiceUserChannels.deleteMany({ guildID: message.guild.id, userID: member.id });
await MessageUser.deleteMany({ guildID: message.guild.id, userID: member.id });
await MessageUserChannels.deleteMany({ guildID: message.guild.id, userID: member.id });
await CameraUsers.deleteMany({ guildID: message.guild.id, userID: member.id });
await StreamUsers.deleteMany({ guildID: message.guild.id, userID: member.id });
await RegisterStaffStats.deleteMany({ guildID: message.guild.id, userID: member.id });
await message.reply({ content: `${message.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcının Tüm Verileri Başarıyla Silindi!` }).sil(15);
} else if(type !== "isim" || type !== "ceza" || type !== "invite" || type !== "voice" || type !== "message" || type !== "camera" || type !== "stream" || type !== "register" || type !== "cezapuan" || type !== "all") {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Geçerli Bir Veri Türü Belirtmelisin.\n\n**Veri Türleri:**\n\n**isim** - İsim Verilerini Siler.\n**ceza** - Ceza Verilerini Siler.\n**cezapuan** - Ceza Puan Verilerini Siler.\n**invite** - Davet Verilerini Siler.\n**voice** - Ses Verilerini Siler.\n**message** - Mesaj Verilerini Siler.\n**camera** - Kamera Verilerini Siler.\n**stream** - Stream Verilerini Siler.\n**register** - Kayıt Verilerini Siler.\n**all** - Tüm Verileri Siler." }).sil(15);
}
}
}