const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const Discord = require("discord.js");
const emojis = require("../../../../Src/Settings/emojiName.json");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
aliases: ["staffs-info2", "staffsinfo2", "staff-info2", "staffinfo2", "ysay2", "yetkilisay2"],
name: "staffs-info2",
help: "yetkilisay2",
category: "ustyetkili",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["staffs-info2", "staffsinfo2", "staff-info2", "staffinfo2", "ysay2", "yetkilisay2"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.ownerRoles.some(x => message.member.roles.cache.has(x)) && !ayar.roleAddRoles.some(s => message.member.roles.cache.has(s))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır." }).sil(15);
}
await message.guild.members.fetch();
const StaffsSize = message.guild.members.cache.filter(x => !x.user.bot && ayar.staffRoles.some(t => x.roles.cache.has(t))).size;
if(!StaffsSize) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Sunucuda Yetkili Bulunmamakta!" }).sil(15);
}
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder().setEmoji("1157606786627543070").setCustomId('sesolmayan').setLabel("Seste Olmayanlar").setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder().setEmoji("1157606786627543070").setCustomId('sesteolmayandm').setLabel("Duyuru").setStyle(Discord.ButtonStyle.Secondary)
)
const SesteOlanYetkili = message.guild.members.cache.filter(x => !x.user.bot && ayar.staffRoles.some(t => x.roles.cache.has(t))).filter(x => x.voice.channel).size;
const SesteOlmayanYetkili = message.guild.members.cache.filter(x => !x.user.bot && ayar.staffRoles.some(t => x.roles.cache.has(t))).filter(x => !x.voice.channel);
const SesCagir = message.guild.members.cache.filter(x => !x.user.bot && ayar.staffRoles.some(t => x.roles.cache.has(t))).filter(x => !x.voice.channel);
const Yetkililer = message.guild.members.cache.filter(x => !x.user.bot && ayar.staffRoles.some(t => x.roles.cache.has(t)));

let Text = `${message.guild.emojiGöster(emojis.face)} Sunucumuzda Toplam **${StaffsSize}** Yetkili Bulunmakta!\n\n${message.guild.emojiGöster(emojis.sagok)} Seste Olan Yetkili Sayısı: **${SesteOlanYetkili}**\n${message.guild.emojiGöster(emojis.sagok)} Seste Olmayan Yetkili Sayısı: **${SesteOlmayanYetkili.size}**\n\n${message.guild.emojiGöster(emojis.sagok)} Sunucudaki Yetkililer;\n${Yetkililer.map(x => `${x} - **${x.roles.highest.name}**`).join("\n")}\n\n${message.guild.emojiGöster(emojis.sagok)} Seste Olmayan Yetkililer;\n${SesCagir.map(x => `${x}`).join("\n")}`;

const chunks = client.splitMessage(Text, 4060);

for (const chunk of chunks) {
const embed = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
.setDescription(chunk)
.setThumbnail(message.guild.iconURL({ dynamic: true }))
.setFooter({ text: `${message.author.tag} Tarafından İstendi!`, iconURL: message.author.avatarURL({ dynamic: true }) })
.setTimestamp();

const msg = await message.channel.send({ embeds: [embed], components: [row] });

const filter = (button) => button.user.id === message.author.id;
const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

collector.on('collect', async (button) => {
if (button.customId === "sesolmayan") {
await button.deferUpdate();
let textss = SesteOlmayanYetkili.map(yetkili => `${yetkili}`).join("\n");
const chunks = client.splitMessage(textss, 4060);
for (const chunk of chunks) {
await message.channel.send({ content: `Seste olmayan yetkililer aşağıda sıralanmıştır.\n${chunk}` });
}
}
if (button.customId === "sesteolmayandm") {
await button.deferUpdate();
message.guild.members.cache
.filter(yetkili => ayar.staffRoles.some(t => yetkili.roles.cache.has(t)))
.filter(yetkilises => !yetkilises.user.bot && !yetkilises.voice.channel)
.forEach(user => {
user.send({
content: `${user} Merhabalar. **${message.guild.name}** sunucusunda ses aktifliğinizi artırmak ve yetkinizi yükseltmek için seslere giriniz. Müsait değilsen **Sleep Room** kanalına afk bırakabilirsin.`
}).catch(err => {
message.channel.send({
content: `${user} isimli yetkiliye özel mesajları kapalı olduğu için mesaj atamıyorum. Lütfen seslere geçebilir misin? Müsait değilsen **Sleep Room** kanalına geçebilirsin.`
});
});
});
}
});
}
}
}