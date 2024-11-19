const settings = require("../../../../Src/Settings/Settings.json");
const Discord = require("discord.js");
const emojis = require("../../../../Src/Settings/emojiName.json");
const setups = require("../../../../Src/Schemas/Setup")
const DB = require("../../../../Src/Schemas/Snipes");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
aliases: ["snipe"],
name: "snipe",
help: "snipe",
category: "yetkili",
cooldown: 15
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({ guildID: message.guild.id });
if (!ayar) return;
const Name = ["snipe", "Snipe"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.staffRoles.some(x => message.member.roles.cache.has(x)) && !settings.Moderation.owners.includes(message.author.id) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no));
return await message.reply({ embeds: [embed.setDescription(`*Bu Komutu Kullanabilmek İçin Yeterli Yetkiye Sahip Değilsin!*`)] }).sil(15);
}
const data = await DB.find({guildID: message.guild.id, channelID: message.channel.id}).sort({deletedDate: -1}).limit(20)
if(data.length <= 0) return message.reply({ embeds: [embed.setDescription(`*Bu Kanalda Silinmiş Bir Mesaj Bulunamadı!*`)] }).sil(15);
async function generateOptions(data, client, message) {
const options = await Promise.all(data.slice(0, 20).map(async (x, index) => {
const user = client.users.cache.get(x.userID);
const cusername = user ? user.username : "Kullanıcı Bulunamadı.";
const username = message.guild.members.cache.get(x.userID) ? message.guild.members.cache.get(x.userID).user.username : cusername;
const messageContent = x.messageContent.length > 50 ? x.messageContent.slice(0, 50) + "..." : x.messageContent;
const label = `${username} | ${messageContent}`.slice(0, 25);
const value = `${index}`.slice(0, 100);
const timeData = await DB.findOne({ guildID: message.guild.id, channelID: message.channel.id, messageContent: x.messageContent });
if (timeData) {
const duration = moment.duration(Date.now() - timeData.deletedDate).format("D [gün], H [Saat], m [Dakika], s [saniye]");
const description = `Silinme Tarihi: ${duration} Önce`.slice(0, 50);
return { label, value, description };
} else {
const description = `Silinme Tarihi: Bilinmiyor`.slice(0, 50);
return { label, value, description };
}
}));
return options;
}
(async () => {
const options = await generateOptions(data, client, message);
const menu = new Discord.StringSelectMenuBuilder()
.setCustomId(`snipe`)
.setPlaceholder(`Silinen Mesajları Görüntüle`)
.addOptions(options);
const row = new Discord.ActionRowBuilder().addComponents(menu);
const msj = await message.reply({content: `*Silinmiş Mesajları Görüntülemek İçin Aşağıdaki Menüyü Kullanabilirsiniz!*`, components: [row]});
const filter = (interaction) => interaction.user.id === message.author.id;
const collector = msj.createMessageComponentCollector({ filter });
collector.on("collect", async (interaction) => {
await interaction.deferUpdate();
const index = interaction.values[0];
const snipeData = data[index];
const user = client.users.cache.get(snipeData.userID);
const cusername = user ? user.username : "Kullanıcı Bulunamadı."
await interaction.followUp({content: `Silinen Mesaj: **${snipeData.messageContent}**\nMesaj Sahibi: **${message.guild.members.cache.get(snipeData.userID) ? message.guild.members.cache.get(snipeData.userID) : cusername}**\nSilinme Tarihi: **<t:${Math.floor(snipeData.deletedDate / 1000)}:R>**`, ephemeral: true});
})
})();
}
};