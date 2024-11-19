const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const settings = require("../../../../Src/Settings/Settings.json")
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup")
const PrivateCommands = require("../../../../Src/Schemas/PrivateCommands")
const emojis = require("../../../../Src/Settings/emojiName.json")

module.exports = {
conf: {
name: "yardım",
aliases: ["help", "y", "yardim"],
help: "yardım"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID });
if (!ayar) return;
let data = await PrivateCommands.find({ guildID: message.guild.id });
if (!data) data = await new PrivateCommands({ guildID: message.guild.id }).save();
let res = await PrivateCommands.find({});
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId('helpss')
.setPlaceholder('Bot komutlarını görüntülemek için tıklayınız!')
.addOptions([
{
label: "Kullanıcı",
description: 'Kullanıcı komutlarını görüntülemek için tıklayınız.',
value: 'kullanicik',
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Özel Komutlar',
description: 'Özel Komutları görüntülemek için tıklayınız.',
value: 'ozelkk',
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Cezalandırma',
description: 'Cezalandırma komutlarını görüntülemek için tıklayınız.',
value: 'cezalandirmak',
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Kayıt',
description: 'Kayıt komutlarını görüntülemek için tıklayınız.',
value: 'kayitcommand',
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Yetkili',
description: 'Yetkiki komutlarını görüntülemek için tıklayınız.',
value: 'yetkilik',
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Üst Yetkili',
description: 'Üst Yetkili komutlarını görüntülemek için tıklayınız.',
value: 'ustyetkilik',
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Owner',
description: 'Owner komutlarını görüntülemek için tıklayınız.',
value: 'ownerk',
emoji: message.guild.emojiGöster(emojis.sagok).id,
},
]),
);
const msg = await message.reply({ content: `**Merhaba!** Yardım almak ister misin?\nAşağıda bulunan menüden yardım almak istediğiniz kategoriyi seçin. 🎉`, components: [row], ephemeral: true}).catch((e) => {})
const filter = (i) => i.user.id === message.author.id
const collector = msg.createMessageComponentCollector({ filter })
collector.on("collect", async (interaction) => {
if(interaction.customId === "helpss") {
if(interaction.values[0] === "kullanicik") {
interaction.reply({content: `\`\`\`yml\n${client.Komutlar.filter((x) => x.conf.help && x.conf.category == "kullanici").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.Moderation.prefix}${x.conf.help}`).splice(0, 300).join("\n")}\`\`\``, ephemeral: true}).catch(e => {})
}
if(interaction.values[0] === "ozelkk") {
let res = await PrivateCommands.find({})
interaction.reply({content: `\`\`\`yml\n${res.length > 0 ? res.map(x => `${settings.Moderation.prefix}${x.komutAd} @Darkdays/ID`).join("\n") : "Özel Komut Bulunmamakta."}\`\`\``, ephemeral: true}).catch(e => {})
}
if(interaction.values[0] === "cezalandirmak") {
interaction.reply({content: `\`\`\`yml\n${client.Komutlar.filter((x) => x.conf.help && x.conf.category == "cezalandirma").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.Moderation.prefix}${x.conf.help}`).splice(0, 300).join("\n")}\`\`\``, ephemeral: true}).catch(e => {})
}
if(interaction.values[0] === "kayitcommand") {
interaction.reply({content: `\`\`\`yml\n${client.Komutlar.filter((x) => x.conf.help && x.conf.category == "kayit").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.Moderation.prefix}${x.conf.help}`).splice(0, 300).join("\n")}\`\`\``, ephemeral: true}).catch(e => {})
}
if(interaction.values[0] === "yetkilik") {
interaction.reply({content: `\`\`\`yml\n${client.Komutlar.filter((x) => x.conf.help && x.conf.category == "yetkili").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.Moderation.prefix}${x.conf.help}`).splice(0, 300).join("\n")}\`\`\``, ephemeral: true}).catch(e => {})
}
if(interaction.values[0] === "ustyetkilik") {
interaction.reply({content: `\`\`\`yml\n${client.Komutlar.filter((x) => x.conf.help && x.conf.category == "ustyetkili").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.Moderation.prefix}${x.conf.help}`).splice(0, 300).join("\n")}\`\`\``, ephemeral: true}).catch(e => {})
}
if(interaction.values[0] === "ownerk") {
interaction.reply({content: `\`\`\`yml\n${client.Komutlar.filter((x) => x.conf.help && x.conf.category == "owner").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.Moderation.prefix}${x.conf.help}`).splice(0, 300).join("\n")}\`\`\``, ephemeral: true}).catch(e => {})
}
}
})
}
}