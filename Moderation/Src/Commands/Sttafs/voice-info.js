const Discord = require("discord.js")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const VoiceDB = require("../../../../Src/Schemas/Voiceİnfo")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["n", "nerede", "ses-bilgi", "sesbilgi", "voice-info", "voiceinfo"],
name: "voice-info",
help: "nerede @Darkdays/ID",
category: "yetkili"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({ guildID: message.guild.id });
if (!ayar) return;
const Name = ["n", "nerede", "ses-bilgi", "sesbilgi", "voice-info", "voiceinfo"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.staffRoles.some(x => message.member.roles.cache.has(x)) && !settings.Moderation.owners.some(x => x === message.author.id) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no));
return await message.reply({ embeds: [embed.setDescription(`*Bu Komutu Kullanabilmek İçin Yeterli Yetkiye Sahip Değilsin!*`)] }).sil(15);
}
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content: "Bir üye belirtmelisin."}).sil(15)
return }
if(!member.voice.channel) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: "Belirtilen üye herhangi bir ses kanalında bulunmamakta."}).sil(15)
return }
const data = await VoiceDB.findOne({ userID: member.user.id });
await message.react(message.guild.emojiGöster(emojis.yes))
let voiceChannel = member.voice.channel
let microphoneState;
let deafState;
if ((member.voice.selfMute) || (member.voice.serverMute)) microphoneState = true;
else microphoneState = false;
if ((member.voice.selfDeaf) || (member.voice.serverDeaf)) deafState = true;
else deafState = false;
voiceChannel.createInvite().then(invite =>
message.reply({ embeds: [new Discord.EmbedBuilder().setThumbnail(member.user.displayAvatarURL({dynamic: true})).setDescription(`${message.member} Merhabalar, bakmış olduğunuz ${member} adlı üyenin ses bilgileri aşağıda olduğu gibidir. [Buraya Tıklayarak Gidebilirsin](https://discord.gg/${invite.code})
\`\`\`diff
• Kullanıcı ${voiceChannel.name} adlı kanalda yer alıyor!

${microphoneState === true ? "-" : "+"} Mikrofon Durumu: ${microphoneState === true ? "Kapalı" : "Açık"}
> Sunucu Susturması: ${member.voice.serverMute ? "Susturulmuş" : "Susturulmamış"}
> Kişisel Susturma: ${member.voice.selfMute ? "Susturmuş" : "Susturmamış"}
> Ses Bilgisi: ${data ? moment.duration(Date.now() - data.date).format("D [gün], D [Gün], H [Saat], m [Dakika], s [saniye]") : "Bulunamadı!"}

${deafState === true ? "-" : "+"} Kulaklık Durumu: ${deafState === true ? "Kapalı" : "Açık"}
> Sunucu Sağırlaştırması: ${member.voice.serverDeaf ? "Sağırlaştırılmış" : "Sağırlaştırılmamış"}
> Kişisel Sağırlaştırma: ${member.voice.selfDeaf ? "Sağırlaştırmış" : "Sağırlaştırmamış"}

> Odanın Limiti: ${voiceChannel.userLimit}
> Odadaki Üye Sayısı: ${voiceChannel.members.size}\`\`\`

\`\`\`xl
# Odadaki Bazı Kişiler;

${voiceChannel.members.map(Member => `${Member.displayName} - ${Member.user.id} [${Member.user.bot ? "BOT" : "USER"}]`).slice(0, 5).join("\n")}\`\`\``).setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) }).setFooter({ text: `${moment(Date.now()).format("LLL")}`, iconURL: message.guild.iconURL({ dynamic: true })})]}));
},
};
