const settings = require('../../../../Src/Settings/Settings.json');
const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const panels = require("../../../../Src/Schemas/Panels")
const emojis = require("../../../../Src/Settings/emojiName.json");
module.exports = {
conf: {
name: "gsetup",
aliases: ["gsetup"],
help: "gsetup",
owner: true,
category: "owner"
},
Cyrstal: async (client, message, args, embed) => {
let data = await panels.findOne({ guildID: settings.Moderation.guildID })
if(!data) data = new panels({guildID: settings.Moderation.guildID, urlShield: true, guildShield: true, roleShield: true, channelShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: true, offlineShield: true, webShield: false, offlineShield: false}).save();
const rows = new StringSelectMenuBuilder()
.setCustomId(`guardsetups`)
.setPlaceholder(`${message.guild.name} Guard Yönetim Paneli.`)
.addOptions(
{
label: `Url Guard`,
value: `url`,
emoji: `${data.urlShield == true ? `1207317746891759637`: `1207317729258770432`}`
},
{
label: `Guild Guard`,
value: `guild`,
emoji: `${data.guildShield == true ? `1207317746891759637`: `1207317729258770432`}`
},

{
label: `Bot Guard`,
value: `bot`,
emoji: `${data.botShield == true ? `1207317746891759637`: `1207317729258770432`}`
},

{
label: `Rol Guard`,
value: `role`,
emoji: `${data.roleShield == true ? `1207317746891759637`: `1207317729258770432`}`
},

{
label: `Channel Guard`,
value: `channel`,
emoji: `${data.channelShield == true ? `1207317746891759637`: `1207317729258770432`}`
},
{
label: `Emoji Guard`,
value: `emoji`,
emoji: `${data.emojiShield == true ? `1207317746891759637`: `1207317729258770432`}`
},
{
label: `Sticker Guard`,
value: `sticker`,
emoji: `${data.stickerShield == true ? `1207317746891759637`: `1207317729258770432`}`
},
{
label: `Ban & Kick Guard`,
value: `bankick`,
emoji: `${data.bankickShield == true ? `1207317746891759637`: `1207317729258770432`}`
},
{
label: `Küfür Guard`,
value: `swear`,
emoji: `${data.swearShield == true ? `1207317746891759637`: `1207317729258770432`}`
},
{
label: `Link Guard`,
value: `advert`,
emoji: `${data.advertShield == true ? `1207317746891759637`: `1207317729258770432`}`
},
{
label: `Capslock Guard`,
value: `capslock`,
emoji: `${data.capslockShield == true ? `1207317746891759637`: `1207317729258770432`}`
},
{
label: `Spam Guard`,
value: `spam`,
emoji: `${data.spamShield == true ? `1207317746891759637`: `1207317729258770432`}`
},
{
label: `Tarayıcı Guard`,
value: `web`,
emoji: `${data.webShield == true ? `1207317746891759637`: `1207317729258770432`}`
},
{
label: `Çevrimdışı Guard`,
value: `offline`,
emoji: `${data.offlineShield == true ? `1207317746891759637`: `1207317729258770432`}`
},
{
label: `İptal`,
value: `exit`,
emoji: `1207317729258770432`
})
await message.react(message.guild.emojiGöster(emojis.yes))
const row = new ActionRowBuilder()
.addComponents(rows)
var msj = await message.reply({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
const filter = (xd) => xd.user.id == message.author.id;
const collector = msj.createMessageComponentCollector({filter})
collector.on("collect", async (interaction) => {
if (interaction.customId === "guardsetups") {
if(interaction.values[0] === "url") {
interaction.deferUpdate()
if(data.urlShield == false) {
data.urlShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    \` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.urlShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "guild") {
interaction.deferUpdate()
if(data.guildShield == false) {
data.guildShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.guildShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "bot") {
interaction.deferUpdate()
if(data.botShield == false) {
data.botShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.botShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "role") {
interaction.deferUpdate()
if(data.roleShield == false) {
data.roleShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.roleShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "channel") {
interaction.deferUpdate()
if(data.channelShield == false) {
data.channelShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.channelShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "emoji") {
interaction.deferUpdate()
if(data.emojiShield == false) {
data.emojiShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.emojiShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "sticker") {
interaction.deferUpdate()
if(data.stickerShield == false) {
data.stickerShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.stickerShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "bankick") {
interaction.deferUpdate()
if(data.bankickShield == false) {
data.bankickShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.bankickShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "swear") {
interaction.deferUpdate()
if(data.swearShield == false) {
data.swearShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.swearShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "advert") {
interaction.deferUpdate()
if(data.advertShield == false) {
data.advertShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.advertShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "capslock") {
interaction.deferUpdate()
if(data.capslockShield == false) {
data.capslockShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları çıkarabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.capslockShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları çıkarabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "web") {
interaction.deferUpdate()
if(data.webShield == false) {
data.webShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.webShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "offline") {
interaction.deferUpdate()
if(data.offlineShield == false) {
data.offlineShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.offlineShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "auto") {
interaction.deferUpdate()
if(data.autoBackup == false) {
data.autoBackup = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
} else {
data.autoBackup = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
\` • \`    ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` • \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` • \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` • \`    *Self korulamarı yönetebilirsin.*
\` • \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

Url Guard:           ${data.urlShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sunucu Guard:        ${data.guildShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Bot Guard:           ${data.botShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Rol Guard:           ${data.roleShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Kanal Guard:         ${data.channelShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Emoji Guard:         ${data.emojiShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Sticker Guard:       ${data.stickerShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Ban & Kick Guard:    ${data.bankickShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Küfür Guard:         ${data.swearShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Link Guard:          ${data.advertShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Capslock Guard:      ${data.capslockShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Spam Guard:          ${data.spamShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Tarayıcı Guard:      ${data.webShield ? `♾️ Aktif`: "⚠️ Deaktif"}
Çevrimdışı Guard:    ${data.offlineShield ? `♾️ Aktif`: "⚠️ Deaktif"}
\`\`\``)], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "exit") {
msj.delete().catch(e => {})
}
}
})
}
}