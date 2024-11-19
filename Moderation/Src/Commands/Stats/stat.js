const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const MessageUser = require("../../../../Src/Schemas/MessageUsers")
const VoiceUser = require("../../../../Src/Schemas/VoiceUsers")
const MessageUserParents = require("../../../../Src/Schemas/MessageUserParents")
const VoiceUserParents = require("../../../../Src/Schemas/VoiceUserParents")
const MessageUserChannel = require("../../../../Src/Schemas/MessageUserChannels")
const VoiceUserChannel = require("../../../../Src/Schemas/VoiceUserChannels")
const İnviter = require("../../../../Src/Schemas/İnviteMembers")
const MemberSetup = require("../../../../Src/Schemas/UserSetups")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
const ChatFriends = require("../../../../Src/Schemas/ChatFriends")
const VoiceFriends = require("../../../../Src/Schemas/VoiceFriends")
module.exports = {
conf: {
aliases: ["me","stat"],
name: "stat",
help: "stat @Darkdays/ID",
category: "kullanici"
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
const mesaj = await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member} Kişisinin Verileri Yükleniyor...`)]});
const sesData = await VoiceUser.findOne({ guildID: settings.Moderation.guildID, userID: member.id });
const mesajData = await MessageUser.findOne({ guildID: settings.Moderation.guildID, userID: member.id });
const TopChannels = await MessageUserChannel.aggregate([{ $match: { userID: member.id } }, { $sort: { channelData: -1 } }, { $limit: 5 }]);
const TopVoices = await VoiceUserChannel.aggregate([{ $match: { userID: member.id } }, { $sort: { channelData: -1 } }, { $limit: 5 }]);
const TopVoiceCategory = await VoiceUserParents.aggregate([{ $match: { userID: member.id } }, { $sort: { parentData: -1 } }, { $limit: 5 }]);
const TopMessageCategory = await MessageUserParents.aggregate([{ $match: { userID: member.id } }, { $sort: { parentData: -1 } }, { $limit: 5 }]);
const udb = await İnviter.find({ guildID: settings.Moderation.guildID, inviter: member.user.id })
let MemberData = await MemberSetup.findOne({ guildID: settings.Moderation.guildID, userID: member.id })
if(!MemberData) MemberData = new MemberSetup({ guildID: settings.Moderation.guildID, userID: member.id, levelSystem: true, monthlySystem: true })
const dailyInvites = udb.filter(x => {
const member = message.guild.members.cache.get(x.userID);
return member && Date.now() - member.joinedAt < 1000 * 60 * 60 * 24;
}).length;

const weeklyInvites = udb.filter(x => {
const member = message.guild.members.cache.get(x.userID);
return member && Date.now() - member.joinedAt < 1000 * 60 * 60 * 24 * 7;
}).length;

const monthlyInvites = udb.filter(x => {
const member = message.guild.members.cache.get(x.userID);
return member && Date.now() - member.joinedAt < 1000 * 60 * 60 * 24 * 30;
}).length;
const getChannelName = (channelID) => {
const channel = client.channels.cache.get(channelID);
return channel ? channel: "#Silinmiş-Kanal";
}
const document = await VoiceFriends.findOne({guildID: settings.Moderation.guildID, userID: member.id });
const topFriends = document && document.voiceFriends ? Object.keys(document.voiceFriends).map(c => ({ id: c, total: document.voiceFriends[c] })).sort((a, b) => b.total - a.total).slice(0, 1) : 'Bulunmuyor.'
const theTopFriend = client.users.cache.get(topFriends[0]?.id)
var chatFriend = await ChatFriends.find({ userID: member.id }).sort({ replyLength: -1 });
chatFriend = chatFriend.length > 0 ? await client.users.fetch(chatFriend[0]?.repliedUserID) : undefined;
await message.react(message.guild.emojiGöster(emojis.yes))
await mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member} Kişisinin <t:${Math.floor(Date.now() / 1000)}> Tarihinde Verilen ${await getTimed(settings.Moderation.guildID, member.id)}

${message.guild.emojiGöster(emojis.stat)} **Periyodik Ses Toplamları**
${message.guild.emojiGöster(emojis.nokta)} Toplam: \` ${moment.duration(sesData?.topStat || 0).format("H [saat], m [dakika], s [saniye]") || 0} \`
${message.guild.emojiGöster(emojis.nokta)} Günlük: \` ${moment.duration(sesData?.dailyStat || 0).format("H [saat], m [dakika], s [saniye]") || 0} \`
${message.guild.emojiGöster(emojis.nokta)} Haftalık: \` ${moment.duration(sesData?.weeklyStat || 0).format("H [saat], m [dakika], s [saniye]") || 0} \`
${message.guild.emojiGöster(emojis.nokta)} Aylık: \` ${moment.duration(sesData?.monthStat || 0).format("H [saat], m [dakika], s [saniye]") || 0} \`
${MemberData.levelSystem == true ? `${message.guild.emojiGöster(emojis.nokta)} Seviye: \` ${sesData?.voiceLevel || 0} Sv. \` \` %${Math.floor((sesData?.voiceXP ? sesData?.voiceXP?.toFixed(1) : 0)/((sesData?.voiceLevel + 1) * 7200000)*100) || 0} \` ${await client.progressBar(sesData?.voiceXP ? sesData?.voiceXP?.toFixed(1) : 0, (sesData?.voiceLevel + 1) * 7200000, 5, sesData?.voiceXP ? sesData?.voiceXP?.toFixed(1) : 0)}` : ""}

${message.guild.emojiGöster(emojis.stat)} **Periyodik Mesaj Toplamları**
${message.guild.emojiGöster(emojis.nokta)} Toplam: \` ${mesajData?.topStat || 0} mesaj \`
${message.guild.emojiGöster(emojis.nokta)} Günlük: \` ${mesajData?.dailyStat || 0} mesaj \`
${message.guild.emojiGöster(emojis.nokta)} Haftalık: \` ${mesajData?.weeklyStat || 0} mesaj \`
${message.guild.emojiGöster(emojis.nokta)} Aylık: \` ${mesajData?.monthStat || 0} mesaj \`
${MemberData.levelSystem == true ? `${message.guild.emojiGöster(emojis.nokta)} Seviye: \` ${mesajData?.messageLevel || 0} Sv. \` \` %${Math.floor((mesajData?.messageXP ? mesajData?.messageXP?.toFixed(1) : 0)/((mesajData?.messageLevel + 1) * 450)*100) || 0} \` ${await client.progressBar(mesajData?.messageXP ? mesajData?.messageXP?.toFixed(1) : 0, (mesajData?.messageLevel + 1) * 450, 5, mesajData?.messageXP ? mesajData?.messageXP?.toFixed(1) : 0)}` : ""}

${message.guild.emojiGöster(emojis.stat)} **Periyodik Davet Toplamları**
${message.guild.emojiGöster(emojis.nokta)} Toplam: \` ${udb?.length || 0} davet \`
${message.guild.emojiGöster(emojis.nokta)} Günlük: \` ${dailyInvites || 0} davet \`
${message.guild.emojiGöster(emojis.nokta)} Haftalık: \` ${weeklyInvites || 0} davet \`
${message.guild.emojiGöster(emojis.nokta)} Aylık: \` ${monthlyInvites || 0} davet \`

${message.guild.emojiGöster(emojis.stat)} **En İyi 5 Ses Kanalları**
${TopVoices.length > 0 ? `${TopVoices.filter((x) => message.guild.channels.cache.get(x.channelID)).map((x) => `${message.guild.emojiGöster(emojis.nokta)} ${getChannelName(x.channelID)} \` ${moment.duration(x.channelData).format("D [gün], H [saat], m [dakika]")} \``).slice(0, 5).join("\n")}` : "Veri Bulunamadı."}

${message.guild.emojiGöster(emojis.stat)} **En İyi 5 Mesaj Kanalları**
${TopChannels.length > 0 ? `${TopChannels.filter((x) => message.guild.channels.cache.get(x.channelID)).map((x) => `${message.guild.emojiGöster(emojis.nokta)} ${getChannelName(x.channelID)} \` ${x.channelData} mesaj \``).slice(0, 5).join("\n")}` : "Veri Bulunamadı."}

${message.guild.emojiGöster(emojis.stat)} **Kategorilendirilmiş Genel Ses Listesi**
${TopVoiceCategory.length > 0 ? `${TopVoiceCategory.filter((x) => message.guild.channels.cache.get(x.parentID)).map((x) => `${message.guild.emojiGöster(emojis.nokta)} ${getChannelName(x.parentID)} \` ${moment.duration(x.parentData).format("D [gün], H [saat], m [dakika]")} \``).slice(0, 5).join("\n")}` : "Veri Bulunamadı."}
${message.guild.emojiGöster(emojis.stat)} **Kategorilendirilmiş Genel Mesaj Listesi**
${TopMessageCategory.length > 0 ? `${TopMessageCategory.filter((x) => message.guild.channels.cache.get(x.parentID)).map((x) => `${message.guild.emojiGöster(emojis.nokta)} ${getChannelName(x.parentID)} \` ${x.parentData} mesaj \``).slice(0, 5).join("\n")}` : "Veri Bulunamadı."}

${message.guild.emojiGöster(emojis.stat)} **En Çok Konuştuğu Arkadaşları**
${message.guild.emojiGöster(emojis.nokta)} Chat Arkadaşı: ${chatFriend ? chatFriend.toString() : "Veri Bulunamadı."}
${message.guild.emojiGöster(emojis.nokta)} Ses Arkadaşı: ${theTopFriend ? theTopFriend.toString() : "Veri Bulunamadı."}`)
.setThumbnail(await client.avatarGet(member.user.id))
]});
}
}
async function getTimed(guildID, userID) {
if (!userID) {
throw new Error("Kullanıcı ID'si belirtilmedi.");
}
const guild = client.guilds.cache.get(guildID);
const user = await guild.members.cache.get(userID);
try {
const firstDate = user.joinedAt;
const today = new Date();
const timeDifferenceMs = today - firstDate;
const monthDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24 * 30));
const weeklyDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24 * 7));
const daysDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
const hoursDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
const minutesDifference = Math.floor(timeDifferenceMs / (1000 * 60));
const secondsDifference = Math.floor(timeDifferenceMs / 1000);
if (monthDifference > 0) {
return `**${monthDifference} Aylık** Verileri`;
}
if (weeklyDifference > 0) {
return `**${weeklyDifference} Haftalık** Verileri`;
}
if (daysDifference > 0) {
return `**${daysDifference} Günlük** Verileri`;
}
if (hoursDifference > 0) {
return `**${hoursDifference} Saatlik** Verileri`;
}
if (minutesDifference > 0) {
return `**${minutesDifference} Dakikalık** Verileri`;
}
if (secondsDifference > 0) {
return `**${secondsDifference} Saniyelik** Verileri`;
}
return "Bulunamadı.";
} catch (error) {
throw new Error("Veritabanı işlemi hatası: " + error.message);
}
}

