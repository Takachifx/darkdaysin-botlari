const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Discord = require('discord.js');
const invited = require("../../../../Src/Schemas/İnvited")
const İnviter = require("../../../../Src/Schemas/İnviteMembers")
module.exports = {
conf: {
name: "invite",
aliases: ["invite", "davet", "davetlerim", "invites"],
help: "invite @Darkdays/ID",
category: "kullanici",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
const inviterData = await invited.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
const udb = await İnviter.find({ guildID: settings.Moderation.guildID, inviter: member.user.id })
const userNames = udb.length > 0 ? udb.map((x) => {
let user = message.guild.members.cache.get(x.userID);
if (user) {
user = user.user;
} else {
user = client.fetchUser(x.userID).catch(() => null);
}
if (!user) {
return 'Bilinmeyen Kullanıcı';
}
return user.username + (message.guild.members.cache.has(x.userID) ? '' : ' (Sunucudan Ayrıldı)');
}).join("\n") : "Bulunmamaktadır."
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
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcının Toplam **${inviterData ? inviterData.total : 0}** Daveti Bulunmaktadır.

${message.guild.emojiGöster(emojis.nokta)} **Gerçek Davet Sayısı:** ${inviterData ? inviterData.regular : 0}
${message.guild.emojiGöster(emojis.nokta)} **Bonus Davet Sayısı:** ${inviterData ? inviterData.bonus : 0}
${message.guild.emojiGöster(emojis.nokta)} **Ayrılan Davet Sayısı:** ${inviterData ? inviterData.leave : 0}
${message.guild.emojiGöster(emojis.nokta)} **Fake Davet Sayısı:** ${inviterData ? inviterData.fake : 0}
${message.guild.emojiGöster(emojis.nokta)} **Günlük Davet Sayısı:** ${dailyInvites}
${message.guild.emojiGöster(emojis.nokta)} **Haftalık Davet Sayısı:** ${weeklyInvites}
${message.guild.emojiGöster(emojis.nokta)} **Aylık Davet Sayısı:** ${monthlyInvites}

Davet Ettiği Üyeler; **(${udb.length})**
\`\`\`yml
${userNames}
\`\`\``)]})
}
}