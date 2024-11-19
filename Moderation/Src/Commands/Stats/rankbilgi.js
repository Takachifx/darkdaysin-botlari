const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Users = require("../../../../Src/Schemas/UsersDB")
const RankSystem = require("../../../../Src/Schemas/RankSystem");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
const regstats = require("../../../../Src/Schemas/RegisterStaffStats");
const messageUser = require("../../../../Src/Schemas/MessageUsers");
const voiceUser = require("../../../../Src/Schemas/VoiceUsers");
const cameraUser = require("../../../../Src/Schemas/CameraUsers");
const streamUser = require("../../../../Src/Schemas/StreamUsers");
const inviterSchema = require("../../../../Src/Schemas/İnvited");
module.exports = {
conf: {
aliases: ["rankbilgi", "puanbilgi"],
name: "rankbilgi",
help: "rankbilgi",
category: "yetkili"
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
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
return message.reply({embeds: [embed.setDescription(`Bir üye belirtmelisin!`)]}).sil(15)
}
if(!ranks.map(x => x.roleID).some(x => member.roles.cache.has(x)) && !member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Belirttiğin üye yetkili değil!`)]}).sil(15)
}
const messageData = await messageUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
const voiceData = await voiceUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
const streamData = await streamUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
const cameraData = await cameraUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
const inviterData = await inviterSchema.findOne({ guildID: settings.Moderation.guildIDd, userID: member.user.id });
const registerData = await regstats.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });

const mesaj = rdata.messageCoin * (messageData ? messageData.topStat : 0) / rdata.messageCount
const ses = rdata.voiceCoin * (await voiceMS(voiceData ? voiceData.topStat : 0)) / rdata.voiceCount
const yayin = rdata.streamCoin * (await voiceMS(streamData ? streamData.topStat : 0)) / rdata.streamCount
const kamera = rdata.cameraCoin * (await voiceMS(cameraData ? cameraData.topStat : 0)) / rdata.cameraCount
const kayit = rdata.registerCoin * (registerData ? registerData.top : 0) / 1
const davet = rdata.inviteCoin * (inviterData ? inviterData.total : 0) / 1
const tagli = rdata.tagCoin * (await TaggedsDB(member.id)) / 1
const yetkili = rdata.staffCoin * (await StaffsDB(member.id)) / 1

var puanbilgilendirme = new Discord.EmbedBuilder()
.setDescription(`${message.guild.emojiGöster(emojis.info)} Sayın yetkililerimiz sizlere özel olarak tasarlanmıs olan **puan sistemi** hakkında bu panelden bilgi alabilirsiniz Mesaj, Ses , Kamera , Yayın gibi aktivitelerinizin size kaç puan ve coin ekleyeceğini buradan görebilirsiniz.

\`\`\`fix
🪙                Puan Sistemi
\`\`\`
${message.guild.emojiGöster(emojis.nokta)} \`  Mesaj Puanı:  \` **${mesaj.toFixed()} Puan** (**${messageData ? messageData.topStat : 0} Mesaj.**)
${message.guild.emojiGöster(emojis.nokta)} \`  Ses Puanı:  \` **${ses.toFixed()} Puan** (**${moment.duration(voiceData ? voiceData.topStat : 0).format("D [Gün], H [Saat], m [Dakika]")}**)
${message.guild.emojiGöster(emojis.nokta)} \`  Yayın Puanı:  \` **${yayin.toFixed()} Puan** (**${moment.duration(streamData ? streamData.topStat : 0).format("D [Gün], H [Saat], m [Dakika]")}**)
${message.guild.emojiGöster(emojis.nokta)} \`  Kamera Puanı:  \` **${kamera.toFixed()} Puan** (**${moment.duration(cameraData ? cameraData.topStat : 0).format("D [Gün], H [Saat], m [Dakika]")}**)
${message.guild.emojiGöster(emojis.nokta)} \`  Kayıt Puanı:  \` **${kayit.toFixed()} Puan** (**${registerData ? registerData.top : 0} Kayıt.**)
${message.guild.emojiGöster(emojis.nokta)} \`  Davet Puanı:  \` **${davet.toFixed()} Puan** (**${inviterData ? inviterData.total : 0} Davet.**)
${message.guild.emojiGöster(emojis.nokta)} \`  Taglı Puanı:  \` **${tagli.toFixed()} Puan** (**${(await TaggedsDB(member.user.id)) || 0} Taglı.**)
${message.guild.emojiGöster(emojis.nokta)} \`  Yetkili Puanı:  \` **${yetkili.toFixed()} Puan** (**${(await StaffsDB(member.user.id)) || 0} Yetkili.**)

\`\`\`fix
⚙              Puan Ayarları
\`\`\`
${message.guild.emojiGöster(emojis.nokta)} \`  Mesaj Puan Ayarı: \` Mesaj sayınız **${rdata.messageCoin}** ile çarpılıp **${rdata.messageCount}**'e bölünür bunun sonucunda **mesaj** puanınız **${mesaj.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Ses Puan Ayarı: \` Ses süreniz **${rdata.voiceCoin}** ile çarpılıp **${rdata.voiceCount}**' e bölünür bunun sonucunda **ses** puanınız **${ses.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Yayın Puan Ayarı: \` Yayın süreniz **${rdata.streamCoin}** ile çarpılıp **${rdata.streamCount}**' e bölünür bunun sonucunda **yayın** puanınız **${yayin.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Kamera Puan Ayarı: \` Kamera açma süreniz **${rdata.cameraCoin}** ile çarpılıp **${rdata.cameraCount}**' e bölünür bunun sonucunda **kamera** puanınız **${kamera.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Kayıt Puan Ayarı: \` Kayıt sayınız **${rdata.registerCoin}** ile çarpılıp **${rdata.registerCount}** e bölünür bunun sonucunda **kayıt** puanınız **${kayit.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Davet Puan Ayarı: \` Davet ettiğiniz kişi sayısınız **${rdata.inviteCoin}** ile çarpılıp **${rdata.inviteCount}**' e bölünür bunun sonucunda **davet** puanınız **${davet.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Taglı Puan Ayarı: \` Taglı kişi sayınız **${rdata.tagCoin}** ile çarpılıp **${rdata.tagCount}**' e bölünür bunun sonucunda **taglı** puanınız **${tagli.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Yetkili Puan Ayarı: \` Yetkili çektiğiniz kişi sayısı **${rdata.staffCoin}** ile çarpılıp **${rdata.staffCount}** e bölünür bunun sonucunda **yetkili** puanınız **${yetkili.toFixed()}**.`)
.setImage(member.user.bannerURL({ dynamic: true, size: 2048 }))
.setFooter({ text: `Çarpılan ve bölünen puan sayılarınız sunucu sahibi tarafından ayarlanmıştır.`, iconURL: message.guild.iconURL({ dynamic: true, size: 1024 }) })
.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
.setTimestamp();
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ embeds: [puanbilgilendirme] })
}
}
async function voiceMS(type) {
const dakika = type / (1000 * 60);
return dakika;
}
async function TaggedsDB(user) {
 try {
     const res = await Users.findOne({ _id: user });
     if (!res) {
         return 0;
     } else {
         return res.Taggeds && res.Taggeds.length > 0 ? res.Taggeds.length : 0;
     }
 } catch (err) {
     throw err;
 }
}


async function StaffsDB(user) {
 try {
     const res = await Users.findOne({ _id: user });
     if (!res) {
         return 0;
     } else {
         return res.Staffs && res.Staffs.length > 0 ? res.Staffs.length : 0;
     }
 } catch (err) {
     throw err;
 }
}
