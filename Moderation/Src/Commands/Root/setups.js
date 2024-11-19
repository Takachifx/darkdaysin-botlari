const setups = require("../../../../Src/Schemas/Setup")
const settings = require("../../../../Src/Settings/Settings.json")
const emojis = require("../../../../Src/Settings/emojiName.json");
const Discord = require("discord.js")
module.exports = {
conf: {
aliases: ["kur"],
name: "setup",
help: "setup yardım/sıfırla",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
const data = await setups.findOne({guildID: settings.Moderation.guildID})
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder()
.setCustomId("allSetup")
.setLabel("Tüm Ayarları Görüntüle")
.setEmoji("❄️")
.setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder()
.setCustomId("generalSetup")
.setLabel("Genel Sunucu Ayarları")
.setEmoji("👑")
.setStyle(Discord.ButtonStyle.Primary),
new Discord.ButtonBuilder()
.setCustomId("roleSetup")
.setLabel("Rol Ayarları")
.setEmoji("🌟")
.setStyle(Discord.ButtonStyle.Primary),
new Discord.ButtonBuilder()
.setCustomId("channelSetup")
.setLabel("Kanal Ayarları")
.setEmoji("1070396798058909817")
.setStyle(Discord.ButtonStyle.Primary),
new Discord.ButtonBuilder()
.setCustomId("punishmentSetup")
.setLabel("Cezalandırma Ayarları")
.setEmoji("1235161749410545664")
.setStyle(Discord.ButtonStyle.Danger))
const row2 = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder()
.setCustomId("serverSetup")
.setLabel("Sunucu Ayarlarını Kur")
.setEmoji("🛠️")
.setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder()
.setCustomId("güncelle")
.setLabel("Verileri Güncelle")
.setEmoji("🔃")
.setStyle(Discord.ButtonStyle.Primary),
new Discord.ButtonBuilder()
.setCustomId("iptal")
.setLabel("Kapat")
.setEmoji("1260921828487204944")
.setStyle(Discord.ButtonStyle.Danger)
)

if(!args[0]) return await message.reply({embeds: [embed.setDescription(`${message.member} Aşağıda ki ayarlar kategorisinden hangi yapılan ayar listesini görüntülemek istediğini seçerek görüntüleyebilirsiniz.`)], components: [row, row2]}).then(async msj => {
var filter = (button) => button.user.id === message.author.id;
let collector = await msj.createMessageComponentCollector({ filter, time: 60000 })
collector.on("collect", async (interaction) => {
if(interaction.customId == "serverSetup") {
await interaction.update({embeds: [embed.setDescription(`Sunucu Ayarları Kurulumu Başlatıldı.`)], components: []})
setTimeout(async () => {
await ServerSetups("rol", message)
await ServerSetups("channel", message)
await ServerSetups("emoji", message)
}, 10000)
} else if(interaction.customId == "allSetup") {
await msj.delete().catch(e => {})
let msg = await SetupsMessage(message, data)
const chunk = await client.splitMessage(msg, 4060)
for (msg of chunk) {
await interaction.channel.send({embeds: [embed.setDescription(msg)]})
}
} else if(interaction.customId == "generalSetup") {
const data = await setups.findOne({ guildID: settings.Moderation.guildID });
if(!data) return;
let msg = `
**${message.guild.name} Sunucu Ayarları;**

Sunucu Tagı: ${data.serverTag.length > 0 ? data.serverTag : `\` ❌ \``}
İsim Tagı: ${data.nameTag.length > 0 ? data.nameTag : `\` ❌ \``}
Tagsız İsim Tagı: ${data.defaultTag.length > 0 ? data.defaultTag : `\` ❌ \``}
Kayıtsız İsmi: ${data.unregName.length > 0 ? `${data.defaultTag ? data.defaultTag : "•"} ${data.unregName}` : `\` ❌ \``}
Bot Texti: ${data.botFooter.length > 0 ? data.botFooter : `\` ❌ \``}
Bot Rolü: ${data.botRoles.length > 0 ? data.botRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Bot Ses Kanalı: ${data.voiceChannel.length > 0 ? message.guild.channels.cache.get(data.voiceChannel) : `\` ❌ \``}
Sunucu URL: ${data.serverURL.length > 0 ? data.serverURL : `\` ❌ \``}
Minimum Kayıt Yaşı: **${data.minRegisterAge}**
Saatlik Mute Limit: **${data.muteLimites}**
Saatlik Jail Limit: **${data.jailLimites}**
Saatlik Ban Limit: **${data.banLimites}**
Saatlik Timeout Limit: **${data.timeoutLimites}**
Mute Ceza Puan: **${data.mutePenaltiesPoint}**
Jail Ceza Puan: **${data.jailPenaltiesPoint}**
Ban Ceza Puan: **${data.banPenaltiesPoint}**
Toplam Ceza Puan Limit: **${data.totalPenaltiesPoint}** (\` Ceza Puanı Bu Miktara Ulaşınca Jaile Düşer. \`)
Rol Oluşturma Limit: **${data.RoleCreateLimites}**
Rol Güncelleme Limit: **${data.RoleUpdateLimites}**
Rol Silme Limit: **${data.RoleDeleteLimites}**
Kanal Oluşturma Limit: **${data.ChannelCreateLimites}**
Kanal Güncelleme Limit: **${data.ChannelUpdateLimites}**
Kanal Silme Limit: **${data.ChannelDeleteLimites}**
Emoji Oluşturma Limit: **${data.EmojiCreateLimites}**
Emoji Güncelleme Limit: **${data.EmojiUpdateLimites}**
Emoji Silme Limit: **${data.EmojiDeleteLimites}**
Sticker Oluşturma Limit: **${data.StickerCreateLimites}**
Sticker Güncelleme Limit: **${data.StickerUpdateLimites}**
Sticker Silme Limit: **${data.StickerDeleteLimites}**
Üye Rol Güncelleme Limit: **${data.MemberRoleUpdateLimites}**
Webhook Oluşturma Limit: **${data.WebhookCreateLimites}**
Webhook güncelleme Limit: **${data.WebhookUpdateLimites}**
Webhook Silme Limit: **${data.WebhookDeleteLimites}**
Üye Ban Limit: **${data.MemberBanLimites}**
Üye Kick Limit: **${data.MemberKickLimites}**
Üye Unban Limit: **${data.MemberUnbanLimites}**`
await interaction.update({embeds: [embed.setDescription(msg)], components: []})
} else if(interaction.customId == "roleSetup") {
const data = await setups.findOne({ guildID: settings.Moderation.guildID });
if(!data) return;
let msg = `
**${message.guild.name} Rol Ayarları;**

Erkek Rolleri: ${data.manRoles.length > 0 ? data.manRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Kadın Rolleri: ${data.womanRoles.length > 0 ? data.womanRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Kayıtsız Rolleri: ${data.unregRoles.length > 0 ? data.unregRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Yetkili Rolleri: ${data.staffRoles.length > 0 ? data.staffRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Üst Yetkili Rolleri: ${data.seniorStaffRoles.length > 0 ? data.seniorStaffRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Yetki Başlangıç Rolleri: ${data.staffStartRoles.length > 0 ? data.staffStartRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Kayıt Yetkili Rolleri: ${data.registerRoles.length > 0 ? data.registerRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Kayıt Yetki Permleri: ${data.registerPerms.length > 0 ? message.guild.roles.cache.get(data.registerPerms) : `\` ❌ \``}
Booster Rolleri: ${data.boosterRoles.length > 0 ? message.guild.roles.cache.get(data.boosterRoles) : `\` ❌ \``}
Katıldı Permleri: ${data.katildiPerms.length > 0 ? message.guild.roles.cache.get(data.katildiPerms) : `\` ❌ \``}
Katılmadı Permleri: ${data.katilmadiPerms.length > 0 ? message.guild.roles.cache.get(data.katilmadiPerms) : `\` ❌ \``}
Mazeret Permleri: ${data.mazeretPerms.length > 0 ? message.guild.roles.cache.get(data.mazeretPerms) : `\` ❌ \``}
Taglı Rolü: ${data.tagRoles.length > 0 ? message.guild.roles.cache.get(data.tagRoles) : `\` ❌ \``}
Owner Rolleri: ${data.ownerRoles.length > 0 ? data.ownerRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Ban Yetkili Rolleri: ${data.banHammer.length > 0 ? data.banHammer.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Jail Yetkili Rolleri: ${data.jailHammer.length > 0 ? data.jailHammer.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Mute Yetkili Rolleri: ${data.muteHammer.length > 0 ?data.muteHammer.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Karantina Rolleri: ${data.jailRoles.length > 0 ? data.jailRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Reklam Rolleri: ${data.reklamRoles.length > 0 ? data.reklamRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Chat Mute Rolleri: ${data.muteRoles.length > 0 ? data.muteRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Ses Mute Rolleri: ${data.vmuteRoles.length > 0 ? data.vmuteRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Yasaklı Tag Rolleri: ${data.bannedTagRoles.length > 0 ? data.bannedTagRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Yeni Hesap Rolleri: ${data.fakeAccRoles.length > 0 ? data.fakeAccRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Rol Ekleyen Yetkili Rolleri: ${data.roleAddRoles.length > 0 ? data.roleAddRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Vip Rolleri: ${data.vipRoles.length > 0 ? message.guild.roles.cache.get(data.vipRoles) : `\` ❌ \``}
Sorun Çözme Rolleri: ${data.scRoles.length > 0 ? data.scRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}

**${message.guild.name} Sunucu Rol Alma & Level Rolleri;**

1 Aylık Üye Rolleri: ${data.oneMonthRoles.length > 0 ? message.guild.roles.cache.get(data.oneMonthRoles) : `\` ❌ \``}
3 Aylık Üye Rolleri: ${data.threeMonthRoles.length > 0 ? message.guild.roles.cache.get(data.threeMonthRoles) : `\` ❌ \``}
6 Aylık Üye Rolleri: ${data.sixMonthRoles.length > 0 ? message.guild.roles.cache.get(data.sixMonthRoles) : `\` ❌ \``}
9 Aylık Üye Rolleri: ${data.nineMonthRoles.length > 0 ? message.guild.roles.cache.get(data.nineMonthRoles) : `\` ❌ \``}
1 Yıllık Üye Rolleri: ${data.oneYearRoles.length > 0 ? message.guild.roles.cache.get(data.oneYearRoles) : `\` ❌ \``}
Siyah Rolleri: ${data.blackRoles.length > 0 ? message.guild.roles.cache.get(data.blackRoles) : `\` ❌ \``}
Mavi Rolleri: ${data.blueRoles.length > 0 ? message.guild.roles.cache.get(data.blueRoles) : `\` ❌ \``}
Beyaz Rolleri: ${data.whiteRoles.length > 0 ? message.guild.roles.cache.get(data.whiteRoles) : `\` ❌ \``}
Kırmızı Rolleri: ${data.redRoles.length > 0 ? message.guild.roles.cache.get(data.redRoles) : `\` ❌ \``}
Sarı Rolleri: ${data.yellowRoles.length > 0 ? message.guild.roles.cache.get(data.yellowRoles) : `\` ❌ \``}
Pembe Rolleri: ${data.pinkRoles.length > 0 ? message.guild.roles.cache.get(data.pinkRoles) : `\` ❌ \``}
Mor Rolleri: ${data.purpleRoles.length > 0 ? message.guild.roles.cache.get(data.purpleRoles) : `\` ❌ \``}
Turuncu Rolleri: ${data.orangeRoles.length > 0 ? message.guild.roles.cache.get(data.orangeRoles) : `\` ❌ \``}
Yeşil Rolleri: ${data.greenRoles.length > 0 ? message.guild.roles.cache.get(data.greenRoles) : `\` ❌ \``}
Kahverengi Rolleri: ${data.brownRoles.length > 0 ? message.guild.roles.cache.get(data.brownRoles) : `\` ❌ \``}
Bordo Rolleri: ${data.burgundyRoles.length > 0 ? message.guild.roles.cache.get(data.burgundyRoles) : `\` ❌ \``}
Turkuaz Rolleri: ${data.turquoiseRoles.length > 0 ? message.guild.roles.cache.get(data.turquoiseRoles) : `\` ❌ \``}
Bej Rolleri: ${data.beigeRoles.length > 0 ? message.guild.roles.cache.get(data.beigeRoles) : `\` ❌ \``}
Lacivert Rolleri: ${data.navyblueRoles.length > 0 ? message.guild.roles.cache.get(data.navyblueRoles) : `\` ❌ \``}
Açık Mavi Rolleri: ${data.lightblueRoles.length > 0 ? message.guild.roles.cache.get(data.lightblueRoles) : `\` ❌ \``}
Fıstık Yeşili Rolleri: ${data.pistachiogreenRoles.length > 0 ? message.guild.roles.cache.get(data.pistachiogreenRoles) : `\` ❌ \``}
Çekiliş Katılımcısı Rolleri: ${data.cekilisRoles.length > 0 ? message.guild.roles.cache.get(data.cekilisRoles) : `\` ❌ \``}
Etkinlik Katılımcısı Rolleri: ${data.etkinlikRoles.length > 0 ? message.guild.roles.cache.get(data.etkinlikRoles) : `\` ❌ \``}
Sevgilim Var Rolleri: ${data.coupleRoles.length > 0 ? message.guild.roles.cache.get(data.coupleRoles) : `\` ❌ \``}
Sevgilim Yok Rolleri: ${data.aloneRoles.length > 0 ? message.guild.roles.cache.get(data.aloneRoles) : `\` ❌ \``}
Sevgili Yapmıyorum Rolleri: ${data.syRoles.length > 0 ? message.guild.roles.cache.get(data.syRoles) : `\` ❌ \``}
Minecraft Rolleri: ${data.minecraftRoles.length > 0 ? message.guild.roles.cache.get(data.minecraftRoles) : `\` ❌ \``}
Fortnite Rolleri: ${data.fortniteRoles.length > 0 ? message.guild.roles.cache.get(data.fortniteRoles) : `\` ❌ \``}
Mobile Legends Rolleri: ${data.mlbbRoles.length > 0 ? message.guild.roles.cache.get(data.mlbbRoles) : `\` ❌ \``}
Counter Strike Rolleri: ${data.csRoles.length > 0 ? message.guild.roles.cache.get(data.csRoles) : `\` ❌ \``}
Pubg Rolleri: ${data.pubgRoles.length > 0 ? message.guild.roles.cache.get(data.pubgRoles) : `\` ❌ \``}
Among Us Rolleri: ${data.amongusRoles.length > 0 ? message.guild.roles.cache.get(data.amongusRoles) : `\` ❌ \``}
League Of Legends Rolleri: ${data.lolRoles.length > 0 ? message.guild.roles.cache.get(data.lolRoles) : `\` ❌ \``}
Gta V Rolleri: ${data.gtavRoles.length > 0 ? message.guild.roles.cache.get(data.gtavRoles) : `\` ❌ \``}
Valorant Rolleri: ${data.valorantRoles.length > 0 ? message.guild.roles.cache.get(data.valorantRoles) : `\` ❌ \``}
Beşiktaş Rolleri: ${data.bjkRoles.length > 0 ? message.guild.roles.cache.get(data.bjkRoles) : `\` ❌ \``}
Galatasaray Rolleri: ${data.gsRoles.length > 0 ? message.guild.roles.cache.get(data.gsRoles) : `\` ❌ \``}
Fenerbahçe Rolleri: ${data.fbRoles.length > 0 ? message.guild.roles.cache.get(data.fbRoles) : `\` ❌ \``}
Trabzonspor Rolleri: ${data.tsRoles.length > 0 ? message.guild.roles.cache.get(data.tsRoles) : `\` ❌ \``}
Akrep Rolleri: ${data.akrepRoles.length > 0 ? message.guild.roles.cache.get(data.akrepRoles) : `\` ❌ \``}
Yengeç Rolleri: ${data.yengecRoles.length > 0 ? message.guild.roles.cache.get(data.yengecRoles) : `\` ❌ \``}
İkizler Rolleri: ${data.ikizlerRoles.length > 0 ? message.guild.roles.cache.get(data.ikizlerRoles) : `\` ❌ \``}
Yay Rolleri: ${data.yayRoles.length > 0 ? message.guild.roles.cache.get(data.yayRoles) : `\` ❌ \``}
Aslan Rolleri: ${data.aslanRoles.length > 0 ? message.guild.roles.cache.get(data.aslanRoles) : `\` ❌ \``}
Terazi Rolleri: ${data.teraziRoles.length > 0 ? message.guild.roles.cache.get(data.teraziRoles) : `\` ❌ \``}
Başak Rolleri: ${data.basakRoles.length > 0 ? message.guild.roles.cache.get(data.basakRoles) : `\` ❌ \``}
Kova Rolleri: ${data.kovaRoles.length > 0 ? message.guild.roles.cache.get(data.kovaRoles) : `\` ❌ \``}
Balık Rolleri: ${data.balikRoles.length > 0 ? message.guild.roles.cache.get(data.balikRoles) : `\` ❌ \``}
Oğlak Rolleri: ${data.oglakRoles.length > 0 ? message.guild.roles.cache.get(data.oglakRoles) : `\` ❌ \``}
Koç Rolleri: ${data.kocRoles.length > 0 ? message.guild.roles.cache.get(data.kocRoles) : `\` ❌ \``}
Boğa Rolleri: ${data.bogaRoles.length > 0 ? message.guild.roles.cache.get(data.bogaRoles) : `\` ❌ \``}`
await msj.delete().catch(err => {})
const chunk = await client.splitMessage(msg, 4096)
for (const msg of chunk) {
await interaction.channel.send({embeds: [embed.setDescription(msg)]})
}
} else if(interaction.customId == "channelSetup") {
const data = await setups.findOne({ guildID: settings.Moderation.guildID });
if(!data) return;
let msg = `
**${message.guild.name} Sunucu Kanal Ayarları;**

Chat Kanalı: ${data.chatChannel.length > 0 ? message.guild.channels.cache.get(data.chatChannel) : `\` ❌ \``}
Hoşgeldin Kanalı: ${data.welcomeChannel.length > 0 ? message.guild.channels.cache.get(data.welcomeChannel) : `\` ❌ \``}
İnvite Kanalı: ${data.inviteChannel.length > 0 ? message.guild.channels.cache.get(data.inviteChannel) : `\` ❌ \``}
Kurallar Kanalı: ${data.rulesChannel.length > 0 ? message.guild.channels.cache.get(data.rulesChannel) : `\` ❌ \``}
Sorun Çözme Log Kanalı: ${data.solvingLog.length > 0 ? message.guild.channels.cache.get(data.solvingLog) : `\` ❌ \``}
Afk Kanalı: ${data.afkChannel.length > 0 ? message.guild.channels.cache.get(data.afkChannel) : `\` ❌ \``}
Public Kategorileri: ${data.publicParents.length > 0 ? data.publicParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Register Kategorileri: ${data.registerParents.length > 0 ? data.registerParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Sorun Çözme Kategorileri: ${data.solvingParents.length > 0 ? data.solvingParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Secret Kategoriler: ${data.privateParents.length > 0 ? data.privateParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Alone Kategorileri: ${data.aloneParents.length > 0 ? data.aloneParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Eğlence Kategorileri: ${data.funParents.length > 0 ? data.funParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Vampir Köylü Kategorileri: ${data.vkParents.length > 0 ? data.vkParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Streamer Kateogileri: ${data.streamerParents.length > 0 ? data.streamerParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}`
await msj.delete().catch(err => {})
const chunk = await client.splitMessage(msg, 4096)
for (const msg of chunk) {
await interaction.channel.send({embeds: [embed.setDescription(msg)]})
}
} else if(interaction.customId == "punishmentSetup") {
const data = await setups.findOne({ guildID: settings.Moderation.guildID });
if(!data) return;
let msg = `
**${message.guild.name} Sunucu Cezalandırma Ayarları;**

Ban Yetkili Rolleri: ${data.banHammer.length > 0 ? data.banHammer.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Jail Yetkili Rolleri: ${data.jailHammer.length > 0 ? data.jailHammer.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Mute Yetkili Rolleri: ${data.muteHammer.length > 0 ?data.muteHammer.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Karantina Rolleri: ${data.jailRoles.length > 0 ? data.jailRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Reklam Rolleri: ${data.reklamRoles.length > 0 ? data.reklamRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Chat Mute Rolleri: ${data.muteRoles.length > 0 ? data.muteRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Ses Mute Rolleri: ${data.vmuteRoles.length > 0 ? data.vmuteRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Yasaklı Tag Rolleri: ${data.bannedTagRoles.length > 0 ? data.bannedTagRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Yeni Hesap Rolleri: ${data.fakeAccRoles.length > 0 ? data.fakeAccRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Saatlik Mute Limit: **${data.muteLimites}**
Saatlik Jail Limit: **${data.jailLimites}**
Saatlik Ban Limit: **${data.banLimites}**
Mute Ceza Puan: **${data.mutePenaltiesPoint}**
Jail Ceza Puan: **${data.jailPenaltiesPoint}**
Ban Ceza Puan: **${data.banPenaltiesPoint}**
Toplam Ceza Puan Limit: **${data.totalPenaltiesPoint}** (\` Ceza Puanı Bu Miktara Ulaşınca Jaile Düşer. \`)`
await msj.delete().catch(err => {})
const chunk = await client.splitMessage(msg, 4096)
for (const msg of chunk) {
await interaction.channel.send({embeds: [embed.setDescription(msg)]})
}
} else if(interaction.customId == "güncelle") {
await client.SetupUpdate(settings.Moderation.guildID)
await interaction.update({embeds: [embed.setDescription(`Sunucu Ayarları Güncellendi.`)], components: []})
} else if(interaction.customId == "iptal") {
await interaction.update({embeds: [embed.setDescription(`Sunucu Ayarları Kurulumu İptal Edildi.`)], components: []})
}
})
})
if(args[0] && ["servertag"].some((x) => args[0].toLowerCase() === x)) {
await TextSetup(args, 1, "serverTag", 10, message, "tag")
} else if(args[0] && ["defaulttag"].some((x) => args[0].toLowerCase() === x)) {
await TextSetup(args, 1, "defaultTag", 10, message, "tag")
} else if(args[0] && ["nametag"].some((x) => args[0].toLowerCase() === x)) {
await TextSetup(args, 1, "nameTag", 10, message, "tag")
} else if(args[0] && ["botfooter"].some((x) => args[0].toLowerCase() === x)) {
await TextSetup(args, 1, "botFooter", 100, message, "text")
} else if(args[0] && ["unregistername"].some((x) => args[0].toLowerCase() === x)) {
await TextSetup(args, 1, "unregName", 20, message, "text")
} else if(args[0] && ["guildname"].some((x) => args[0].toLowerCase() === x)) {
await TextSetup(args, 1, "GuildName", 20, message, "text")
} else if(args[0] && ["guildurl"].some((x) => args[0].toLowerCase() === x)) {
await TextSetup(args, 1, "serverURL", 20, message, "text")
} else if(args[0] && ["botroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("botRoles", "Bot Rol(leri)", "role", message)
} else if(args[0] && ["voicechannel"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("voiceChannel", "Botun Bağlanacağı Ses Kanalı", "vchannel", message)
} else if(args[0] && ["minage"].some((x) => args[0].toLowerCase() === x)) {
    
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {})
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { MemberUnbanLimites: age } }, { upsert: true })
} else if(args[0] && ["manroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("manRoles", "Erkek Rol(leri)", "role", message)
} else if(args[0] && ["womanroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("womanRoles", "Kadın Rol(leri)", "role", message)
} else if(args[0] && ["unregisterroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("unregRoles", "Kayıtsız Rol(leri)", "role", message)
} else if(args[0] && ["staffroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("staffRoles", "Yetkili Rol(leri)", "role", message)
} else if(args[0] && ["seniorstaffroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("seniorStaffRoles", "Üst Yetkili Rol(leri)", "role", message)
} else if(args[0] && ["staffstartroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("staffStartRoles", "Yetkili Başlangıç Rol(leri)", "role", message)
} else if(args[0] && ["registerroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("registerRoles", "Kayıt Sorumlusu Rol(leri)", "role", message)
} else if(args[0] && ["registerperms"].some((x) => args[0].toLowerCase() === x)) {
await RoleSetup(message, "registerPerms")
} else if(args[0] && ["tagroles"].some((x) => args[0].toLowerCase() === x)) {
await RoleSetup(message, "tagRoles")
} else if(args[0] && ["ownerroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("ownerRoles", "Sahip Rol(leri)", "role", message)
} else if(args[0] && ["boosterroles"].some((x) => args[0].toLowerCase() === x)) {
await RoleSetup(message, "boosterRoles")
} else if(args[0] && ["warnhammer"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("warnHammer", "Kullanıcıları Uyarabilcek Yetkili Rol(leri)", "role", message)
} else if(args[0] && ["banhammer"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("banHammer", "Kullanıcıları Banlayabilcek Yetkili Rol(leri)", "role", message)
} else if(args[0] && ["jailhammer"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("jailHammer", "Kullanıcıları Cezalayabilcek Yetkili Rol(leri)", "role", message)
} else if(args[0] && ["mutehammer"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("muteHammer", "Kullanıcıları Susturabilcek Yetkili Rol(leri)", "role", message)
} else if(args[0] && ["jailroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("jailRoles", "Karantina Rol(leri)", "role", message)
} else if(args[0] && ["reklamroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("reklamRoles", "Reklamcı Rol(leri)", "role", message)
} else if(args[0] && ["muteroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("muteRoles", "Chat Mute Rol(leri)", "role", message)
} else if(args[0] && ["vmuteroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("vmuteRoles", "Voice Mute Rol(leri)", "role", message)
} else if(args[0] && ["fakeaccroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("fakeAccRoles", "Yeni Hesap Rol(leri)", "role", message)
} else if(args[0] && ["fakeaccroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("fakeAccRoles", "Yeni Hesap Rol(leri)", "role", message)
} else if(args[0] && ["bannedtagroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("bannedTagRoles", "Yasaklı Tag Rol(leri)", "role", message)
} else if(args[0] && ["roleaddroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("roleAddRoles", "Rol İşlem Yapabilen Rol(ler)", "role", message)
} else if(args[0] && ["viproles"].some((x) => args[0].toLowerCase() === x)) {
await RoleSetup(message, "vipRoles")
} else if(args[0] && ["katildiperm"].some((x) => args[0].toLowerCase() === x)) {
 await RoleSetup(message, "katildiPerms")
} else if(args[0] && ["katilmadiperm"].some((x) => args[0].toLowerCase() === x)) {
 await RoleSetup(message, "katilmadiPerms")
} else if(args[0] && ["mazeretperm"].some((x) => args[0].toLowerCase() === x)) {
 await RoleSetup(message, "mazeretPerms")
} else if(args[0] && ["scroles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("scRoles", "Sorun Çözme Yetkili Rol(leri)", "role", message)
} else if(args[0] && ["registerRoles"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("registerRoles", "Kayıt Sorumlusu Rol(leri)", "role", message)
} else if(args[0] && ["chatchannel"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("chatChannel", "Sohbet Kanalı", "channel", message)
} else if(args[0] && ["invitechannel"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("inviteChannel", "İnvite Kanalı", "channel", message)
} else if(args[0] && ["registerchannel"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("welcomeChannel", "Kayıt Kanalı", "channel", message)
} else if(args[0] && ["ruleschannel"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("rulesChannel", "Kurallar Kanalı", "channel", message)
} else if(args[0] && ["solvingchannel"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("solvingLog", "Sorun Çözme Log Kanalı", "channel", message)
} else if(args[0] && ["afkchannel"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("afkChannel", "Afk Ses Kanalı", "vchannel", message)
} else if(args[0] && ["publicparents"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("publicParents", "Public Kategorisi", "category", message)
} else if(args[0] && ["registerparents"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("registerParents", "Kayıt Kategorisi", "category", message)
} else if(args[0] && ["solvingparents"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("solvingParents", "Sorun Çözme Kategorisi", "category", message)
} else if(args[0] && ["privateparents"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("privateParents", "Secret Kategorisi", "category", message)
} else if(args[0] && ["aloneparents"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("aloneParents", "Alone Kategorisi", "category", message)
} else if(args[0] && ["funparents"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("funParents", "Eğlence Kategorisi", "category", message)
} else if(args[0] && ["vkparents"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("vkParents", "VK Kategorisi", "category", message)
} else if(args[0] && ["streamerparents"].some((x) => args[0].toLowerCase() === x)) {
await SetupsUpdates("streamerParents", "Streamer Kategorisi", "category", message)
}
}
}

async function TextSetup(args, number, setupsType, length, message, types) {
try {
if(types == "text") {
const names = args.slice(number).join(" ")
if(!names) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir text belirt.`}).sil(15)
if(names.length >= length) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Belirtilen metin ${length} karakterden fazla olamaz.`}).sil(15)
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { [setupsType]: names } }, { upsert: true });
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {})
} else if(types == "tag") {
const tag = args[number]
if(!tag) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir tag belirt.`}).sil(15)
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { [setupsType]: tag } }, { upsert: true });
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {})
}
} catch (error) {
console.error(`[ERROR] ${error}`);
}
}

async function RoleSetup(message, type) {
let rol = message.mentions.roles.first()
if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15)
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { [type]: rol.id } }, { upsert: true });
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {})
}

async function ServerSetups(types, message) {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(types == "rol") {
const blackRoles = await message.guild.roles.create({
name: "Siyah",
color: "#030101",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
})
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { blackRoles: blackRoles.id } }, { upsert: true })
const blueRoles = await message.guild.roles.create({
name: "Mavi",
color: "#2e8ff0",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
})
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { blueRoles: blueRoles.id } }, { upsert: true })
const whiteRoles = await message.guild.roles.create({
name: "Beyaz",
color: "#ffffff",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { whiteRoles: whiteRoles.id } }, { upsert: true })
const redRoles = await message.guild.roles.create({
name: "Kırmızı",
color: "#ff0000",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { redRoles: redRoles.id } }, { upsert: true })
const yellowRoles = await message.guild.roles.create({
name: "Sarı",
color: "#a3ff00",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { yellowRoles: yellowRoles.id } }, { upsert: true })
const pinkRoles = await message.guild.roles.create({
name: "Pembe",
color: "#ff0cfc",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { pinkRoles: pinkRoles.id } }, { upsert: true })
const purpleRoles = await message.guild.roles.create({
name: "Mor",
color: "#7c00f8",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { purpleRoles: purpleRoles.id } }, { upsert: true })
const orangeRoles = await message.guild.roles.create({
name: "Turuncu",
color: "#ff7c00",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { orangeRoles: orangeRoles.id } }, { upsert: true })
const greenRoles = await message.guild.roles.create({
name: "Yeşil",
color: "#119f14",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { greenRoles: greenRoles.id } }, { upsert: true })
const brownRoles = await message.guild.roles.create({
name: "Kahverengi",
color: "#703307",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { brownRoles: brownRoles.id } }, { upsert: true })
const burgundyRoles = await message.guild.roles.create({
name: "Bordo",
color: "#670303",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { burgundyRoles: burgundyRoles.id } }, { upsert: true })
const turquoiseRoles = await message.guild.roles.create({
name: "Turkuaz",
color: "#00ffdb",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { turquoiseRoles: turquoiseRoles.id } }, { upsert: true })
const beigeRoles = await message.guild.roles.create({
name: "Bej",
color: "#fdffe0",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { beigeRoles: beigeRoles.id } }, { upsert: true })
const navyblueRoles = await message.guild.roles.create({
name: "Lacivert",
color: "#02002c",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { navyblueRoles: navyblueRoles.id } }, { upsert: true })
const lightblueRoles = await message.guild.roles.create({
name: "Açık Mavi",
color: "#92cbf0",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { lightblueRoles: lightblueRoles.id } }, { upsert: true })
const pistachiogreenRoles = await message.guild.roles.create({
name: "Fıstık Yeşili",
color: "#009e7d",
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq.",
position: ayar && ayar.boosterRoles ? message.guild.roles.cache.get(ayar.boosterRoles).position + 1 : 0
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { pistachiogreenRoles: pistachiogreenRoles.id } }, { upsert: true })
await message.guild.roles.create({
name: "━━━━Etkinlik Rolleri━━━━",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
const etkinlikRoles = await message.guild.roles.create({
name: "🎉 Etkinlik Katılımcısı",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { etkinlikRoles: etkinlikRoles.id } }, { upsert: true })
const cekilisRoles = await message.guild.roles.create({
name: "🎁 Çekiliş Katılımcısı",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { cekilisRoles: cekilisRoles.id } }, { upsert: true })
await message.guild.roles.create({
name: "━━━━İlişki Rolleri━━━━",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
const coupleRoles =  await message.guild.roles.create({
name: "Sevgilim Var",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
})
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { coupleRoles: coupleRoles.id } }, { upsert: true })
const aloneRoles = await message.guild.roles.create({
name: "Sevgilim Yok",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { aloneRoles: aloneRoles.id } }, { upsert: true })
const syRoles = await message.guild.roles.create({
name: "Sevgili Yapmıyorum",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { syRoles: syRoles.id } }, { upsert: true })
await message.guild.roles.create({
name: "━━━━Oyun Rolleri━━━━",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
const minecraftRoles = await message.guild.roles.create({
name: "Minecraft",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { minecraftRoles: minecraftRoles.id } }, { upsert: true })
const fortniteRoles = await message.guild.roles.create({
name: "Fortnite",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { fortniteRoles: fortniteRoles.id } }, { upsert: true })
const mlbbRoles = await message.guild.roles.create({
name: "Mobile Legends",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { mlbbRoles: mlbbRoles.id } }, { upsert: true })
const csRoles = await message.guild.roles.create({
name: "Counter Strike",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { csRoles: csRoles.id } }, { upsert: true })
const pubgRoles = await message.guild.roles.create({
name: "Pubg",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { pubgRoles: pubgRoles.id } }, { upsert: true })
const amongusRoles = await message.guild.roles.create({
name: "Among Us",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { amongusRoles: amongusRoles.id } }, { upsert: true })
const lolRoles = await message.guild.roles.create({
name: "League Of Legends",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { lolRoles: lolRoles.id } }, { upsert: true })
const gtavRoles = await message.guild.roles.create({
name: "Gta V",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { gtavRoles: gtavRoles.id } }, { upsert: true })
const valorantRoles = await message.guild.roles.create({
name: "Valorant",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { valorantRoles: valorantRoles.id } }, { upsert: true })
const metinTwoRoles = await message.guild.roles.create({
name: "Metin 2",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { metinTwoRoles: metinTwoRoles.id } }, { upsert: true })
const fivemRoles = await message.guild.roles.create({
name: "FiveM",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { fivemRoles: fivemRoles.id } }, { upsert: true })
const zulaRoles = await message.guild.roles.create({
name: "Zula",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { zulaRoles: zulaRoles.id } }, { upsert: true })
const mtaRoles = await message.guild.roles.create({
name: "MTA:SA",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { mtaRoles: mtaRoles.id } }, { upsert: true })
await message.guild.roles.create({
name: "━━━━Takım Rolleri━━━━",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
const bjkRoles = await message.guild.roles.create({
name: "Beşiktaş",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { bjkRoles: bjkRoles.id } }, { upsert: true })
const gsRoles = await message.guild.roles.create({
name: "Galatasaray",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { gsRoles: gsRoles.id } }, { upsert: true })
const fbRoles = await message.guild.roles.create({
name: "Fenerbahçe",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { fbRoles: fbRoles.id } }, { upsert: true })
const tsRoles = await message.guild.roles.create({
name: "Trabzonspor",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { tsRoles: tsRoles.id } }, { upsert: true })
await message.guild.roles.create({
name: "━━━━Burç Rolleri━━━━",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
const akrepRoles = await message.guild.roles.create({
name: "♏ Akrep",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { akrepRoles: akrepRoles.id } }, { upsert: true })
const yengecRoles = await message.guild.roles.create({
name: "♋ Yengeç",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { yengecRoles: yengecRoles.id } }, { upsert: true })
const ikizlerRoles = await message.guild.roles.create({
name: "♊ İkizler",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { ikizlerRoles: ikizlerRoles.id } }, { upsert: true })
const yayRoles = await message.guild.roles.create({
name: "♐ Yay",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { yayRoles: yayRoles.id } }, { upsert: true })
const aslanRoles = await message.guild.roles.create({
name: "♌ Aslan",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { aslanRoles: aslanRoles.id } }, { upsert: true })
const teraziRoles = await message.guild.roles.create({
name: "♎ Terazi",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { teraziRoles: teraziRoles.id } }, { upsert: true })
const basakRoles = await message.guild.roles.create({
name: "♍ Başak",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { basakRoles: basakRoles.id } }, { upsert: true })
const kovaRoles = await message.guild.roles.create({
name: "♒ Kova",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { kovaRoles: kovaRoles.id } }, { upsert: true })
const balikRoles = await message.guild.roles.create({
name: "♓ Balık",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { balikRoles: balikRoles.id } }, { upsert: true })
const oglakRoles = await message.guild.roles.create({
name: "♑ Oğlak",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { oglakRoles: oglakRoles.id } }, { upsert: true })
const bogaRoles = await message.guild.roles.create({
name: "♉ Boğa",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { bogaRoles: bogaRoles.id } }, { upsert: true })
const kocRoles = await message.guild.roles.create({
name: "♈ Koç",
color: randomColor(),
permissions: "0",
reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { kocRoles: kocRoles.id } }, { upsert: true })
await message.guild.roles.create({
name: "━━━━Aylık Perm Rolleri━━━━",
color: randomColor(),
permissions: "0",
reason: "Aylık perm için Lazımki kurduk sanane aq."
});
const oneMonthRoles = await message.guild.roles.create({
name: "🥇 1 Aylık Üye",
color: randomColor(),
permissions: "0",
reason: "Aylık perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { oneMonthRoles: oneMonthRoles.id } }, { upsert: true })
const threeMonthRoles = await message.guild.roles.create({
name: "🥉 3 Aylık Üye",
color: randomColor(),
permissions: "0",
reason: "Aylık perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { threeMonthRoles: threeMonthRoles.id } }, { upsert: true })
const sixMonthRoles = await message.guild.roles.create({
name: "🏅 6 Aylık Üye",
color: randomColor(),
permissions: "0",
reason: "Aylık perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { sixMonthRoles: sixMonthRoles.id } }, { upsert: true })
const nineMonthRoles = await message.guild.roles.create({
name: "🎖️ 9 Aylık Üye",
color: randomColor(),
permissions: "0",
reason: "Aylık perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { nineMonthRoles: nineMonthRoles.id } }, { upsert: true })
const oneYearRoles = await message.guild.roles.create({
name: "🏆 1 Senelik Üye",
color: randomColor(),
permissions: "0",
reason: "Aylık perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { oneYearRoles: oneYearRoles.id } }, { upsert: true })
await message.guild.roles.create({
name: "━━━━Perm Rolleri━━━━",
color: randomColor(),
permissions: "0",
reason: "Bot için Lazımki kurduk sanane aq."
});
const katildiPerms = await message.guild.roles.create({
name: "✔️ Katıldı",
color: randomColor(),
permissions: "0",
reason: "Perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { katildiPerms: katildiPerms.id } }, { upsert: true })
const katilmadiPerms = await message.guild.roles.create({
name: "❌ Katılmadı",
color: randomColor(),
permissions: "0",
reason: "Perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { katilmadiPerms: katilmadiPerms.id } }, { upsert: true })
const mazeretPerms = await message.guild.roles.create({
name: "✔️ Mazeretli",
color: randomColor(),
permissions: "0",
reason: "Permiçin Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.Moderation.guildID }, { $set: { mazeretPerms: mazeretPerms.id } }, { upsert: true })
} else if(types == "emoji") {
const emojiNames = {
yes: emojis.yes,
no: emojis.no,
sifir: emojis.sifir,
bir: emojis.bir,
iki: emojis.iki,
uc: emojis.uc,
dort: emojis.dort,
bes: emojis.bes,
alti: emojis.alti,
yedi: emojis.yedi,
sekiz: emojis.sekiz,
dokuz: emojis.dokuz,
fillStart: emojis.fillStart,
fill: emojis.fill,
fillEnd: emojis.fillEnd,
empty: emojis.empty,
emptyEnd: emojis.emptyEnd,
info: emojis.info,
warn: emojis.warn,
top_bir: emojis.top_bir,
top_iki: emojis.top_iki,
top_uc: emojis.top_uc,
nocommand: emojis.nocommand,
kalp: emojis.kalp,
punish: emojis.punish,
star: emojis.star,
face: emojis.face,
fire: emojis.fire,
like: emojis.like,
sagok: emojis.sagok,
stat: emojis.stat,
member: emojis.member,
dislike: emojis.dislike,
nokta: emojis.nokta,
}
const emojiList = {
[emojiNames.yes]: "https://cdn.discordapp.com/emojis/1235175799846469684.webp?size=128&quality=lossless",
[emojiNames.no]: "https://cdn.discordapp.com/emojis/1235161622021144576.webp?size=128&quality=lossless",
[emojiNames.sifir]: "https://cdn.discordapp.com/emojis/1266745986231963820.gif?size=128&quality=lossless",
[emojiNames.bir]: "https://cdn.discordapp.com/emojis/1266745586577702983.gif?size=128&quality=lossless",
[emojiNames.iki]: "https://cdn.discordapp.com/emojis/1266745591405482046.gif?size=128&quality=lossless",
[emojiNames.uc]: "https://cdn.discordapp.com/emojis/1266745597571104909.gif?size=128&quality=lossless",
[emojiNames.dort]: "https://cdn.discordapp.com/emojis/1266745602134249585.gif?size=128&quality=lossless",
[emojiNames.bes]: "https://cdn.discordapp.com/emojis/1266745607431786576.gif?size=128&quality=lossless",
[emojiNames.alti]: "https://cdn.discordapp.com/emojis/1266745611257118842.gif?size=128&quality=lossless",
[emojiNames.yedi]: "https://cdn.discordapp.com/emojis/1266745616789409812.gif?size=128&quality=lossless",
[emojiNames.sekiz]: "https://cdn.discordapp.com/emojis/1266745621306675253.gif?size=128&quality=lossless",
[emojiNames.dokuz]: "https://cdn.discordapp.com/emojis/1266745626289242226.gif?size=128&quality=lossless",
[emojiNames.fillStart]: "https://cdn.discordapp.com/emojis/1235161873029140593.webp?size=128&quality=lossless",
[emojiNames.empty]: "https://cdn.discordapp.com/emojis/1235161782645952541.webp?size=128&quality=lossless",
[emojiNames.emptyEnd]: "https://cdn.discordapp.com/emojis/1235161798446026762.webp?size=128&quality=lossless",
[emojiNames.fillEnd]: "https://cdn.discordapp.com/emojis/1235161914296897626.webp?size=128&quality=lossless",
[emojiNames.fill]: "https://cdn.discordapp.com/emojis/1235161899046535169.webp?size=128&quality=lossless",
[emojiNames.warn]: "https://cdn.discordapp.com/emojis/1235162120644198410.webp?size=128&quality=lossless",
[emojiNames.info]: "https://cdn.discordapp.com/emojis/1235175778032029756.gif?size=128&quality=lossless",
[emojiNames.top_bir]: "https://cdn.discordapp.com/emojis/1235161684969259009.webp?size=128&quality=lossless",
[emojiNames.top_iki]: "https://cdn.discordapp.com/emojis/1235177405513994273.webp?size=128&quality=lossless",
[emojiNames.top_uc]: "https://cdn.discordapp.com/emojis/1235162066755649546.webp?size=128&quality=lossless",
[emojiNames.nocommand]: "https://cdn.discordapp.com/emojis/1235162103262871592.webp?size=128&quality=lossless",
[emojiNames.kalp]: "https://cdn.discordapp.com/emojis/1235161713402187836.webp?size=128&quality=lossless",
[emojiNames.punish]: "https://cdn.discordapp.com/emojis/1235161749410545664.webp?size=128&quality=lossless",
[emojiNames.star]: "https://cdn.discordapp.com/emojis/1235161929752903772.webp?size=128&quality=lossless",
[emojiNames.face]: "https://cdn.discordapp.com/emojis/1235161643852365886.webp?size=128&quality=lossless",
[emojiNames.fire]: "https://cdn.discordapp.com/emojis/1235161657681117224.webp?size=128&quality=lossless",
[emojiNames.like]: "https://cdn.discordapp.com/emojis/1235161731819376780.webp?size=128&quality=lossless",
[emojiNames.sagok]: "https://cdn.discordapp.com/emojis/1238493890714013717.webp?size=128&quality=lossless",
[emojiNames.stat]: "https://cdn.discordapp.com/emojis/1102633652074057738.gif?size=128&quality=lossless",
[emojiNames.member]: "https://cdn.discordapp.com/emojis/1202317755764965386.webp?size=128&quality=lossless",
[emojiNames.dislike]: "https://cdn.discordapp.com/emojis/1266349718666215424.webp?size=128&quality=lossless",
[emojiNames.nokta]: "https://cdn.discordapp.com/emojis/1268245979157631159.webp?size=128&quality=lossless",
};
for (const [emojiName, emojiLink] of Object.entries(emojiList)) {
setTimeout(async() => {
const emojiler = await message.guild.emojis.create({ attachment: emojiLink, name: emojiName }).then((emojiler) => {
message.channel.send({content: `Başarıyla ${message.guild.emojiGöster(emojiName)} Emojisi Oluşturuldu.`})}).catch((err) => console.log(err))
}, 3000)
}
} else if(types == "channel") {
message.reply({ content: `Log Kanallarının kurulumu başarıyla tamamlanmıştır.`, ephemeral: true })
const parent = await message.guild.channels.create({name: 'Moderasyon Log', type: Discord.ChannelType.GuildCategory, permissionOverwrites: [{id: settings.Moderation.guildID,deny: [Discord.PermissionFlagsBits.ViewChannel],}]});
await message.guild.channels.create({name: 'message-log',  type: Discord.ChannelType.GuildText, parent: parent.id});
await message.guild.channels.create({name: 'voice-log',  type: Discord.ChannelType.GuildText, parent: parent.id});
await message.guild.channels.create({name: 'tag-log',  type: Discord.ChannelType.GuildText, parent: parent.id});
await message.guild.channels.create({name: 'rol-log',  type: Discord.ChannelType.GuildText, parent: parent.id});
await message.guild.channels.create({name: 'mute-log', type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'vmute-log', type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'jail-log', type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'reklamcı-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'yasaklıtag-log', type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'ban-log', type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'ceza-log', type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'üye-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'kayıt-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'mazeret-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'gorev-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'terfi-sistem-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'yetki-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'streamer-basvuru-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'yetkili-basvuru-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'şikayet-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'öneri-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'istek-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'özeloda-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'yetki-bırakan-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'yetki-çek-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'taglı-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'timeout-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'günlük-sıfırlama-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'haftalık-sıfırlama-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
await message.guild.channels.create({name: 'aylık-sıfırlama-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
const parents = await message.guild.channels.create({name: 'Guard Log', type: Discord.ChannelType.GuildCategory, permissionOverwrites: [{id: settings.Moderation.guildID,deny: [Discord.PermissionFlagsBits.ViewChannel],}]});
await message.guild.channels.create({name: 'kanal-koruma-log',  type: Discord.ChannelType.GuildText, parent: parents.id});
await message.guild.channels.create({name: 'rol-koruma-log',  type: Discord.ChannelType.GuildText, parent: parents.id});
await message.guild.channels.create({name: 'emoji-koruma-log',  type: Discord.ChannelType.GuildText, parent: parents.id});
await message.guild.channels.create({name: 'stick-koruma-log',  type: Discord.ChannelType.GuildText, parent: parents.id});
await message.guild.channels.create({name: 'üye-koruma-log',  type: Discord.ChannelType.GuildText, parent: parents.id});
await message.guild.channels.create({name: 'sunucu-koruma-log',  type: Discord.ChannelType.GuildText, parent: parents.id});
await message.guild.channels.create({name: 'web-koruma-log',  type: Discord.ChannelType.GuildText, parent: parents.id});
await message.guild.channels.create({name: 'offline-koruma-log',  type: Discord.ChannelType.GuildText, parent: parents.id});
await message.guild.channels.create({name: 'guard-log', type: Discord.ChannelType.GuildText, parent: parents.id });
}
}

function randomColor() {
const letters = '0123456789ABCDEF';
let color = '#';
for (let i = 0; i < 6; i++) {
color += letters[Math.floor(Math.random() * 16)];
}
return color;
}

async function SetupsMessage(message) {
const data = await setups.findOne({ guildID: settings.Moderation.guildID });
if(!data) return;
let msg = `
**${message.guild.name} Sunucu Ayarları;**

Sunucu Tagı: ${data.serverTag.length > 0 ? data.serverTag : `\` ❌ \``}
İsim Tagı: ${data.nameTag.length > 0 ? data.nameTag : `\` ❌ \``}
Tagsız İsim Tagı: ${data.defaultTag.length > 0 ? data.defaultTag : `\` ❌ \``}
Kayıtsız İsmi: ${data.unregName.length > 0 ? `${data.defaultTag ? data.defaultTag : "•"} ${data.unregName}` : `\` ❌ \``}
Bot Texti: ${data.botFooter.length > 0 ? data.botFooter : `\` ❌ \``}
Bot Rolü: ${data.botRoles.length > 0 ? data.botRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Bot Ses Kanalı: ${data.voiceChannel.length > 0 ? message.guild.channels.cache.get(data.voiceChannel) : `\` ❌ \``}
Sunucu URL: ${data.serverURL.length > 0 ? data.serverURL : `\` ❌ \``}
Minimum Kayıt Yaşı: **${data.minRegisterAge}**
Saatlik Mute Limit: **${data.muteLimites}**
Saatlik Jail Limit: **${data.jailLimites}**
Saatlik Ban Limit: **${data.banLimites}**
Saatlik Timeout Limit: **${data.timeoutLimites}**
Mute Ceza Puan: **${data.mutePenaltiesPoint}**
Jail Ceza Puan: **${data.jailPenaltiesPoint}**
Ban Ceza Puan: **${data.banPenaltiesPoint}**
Toplam Ceza Puan Limit: **${data.totalPenaltiesPoint}** (\` Ceza Puanı Bu Miktara Ulaşınca Jaile Düşer. \`)
Rol Oluşturma Limit: **${data.RoleCreateLimites}**
Rol Güncelleme Limit: **${data.RoleUpdateLimites}**
Rol Silme Limit: **${data.RoleDeleteLimites}**
Kanal Oluşturma Limit: **${data.ChannelCreateLimites}**
Kanal Güncelleme Limit: **${data.ChannelUpdateLimites}**
Kanal Silme Limit: **${data.ChannelDeleteLimites}**
Emoji Oluşturma Limit: **${data.EmojiCreateLimites}**
Emoji Güncelleme Limit: **${data.EmojiUpdateLimites}**
Emoji Silme Limit: **${data.EmojiDeleteLimites}**
Sticker Oluşturma Limit: **${data.StickerCreateLimites}**
Sticker Güncelleme Limit: **${data.StickerUpdateLimites}**
Sticker Silme Limit: **${data.StickerDeleteLimites}**
Üye Rol Güncelleme Limit: **${data.MemberRoleUpdateLimites}**
Webhook Oluşturma Limit: **${data.WebhookCreateLimites}**
Webhook güncelleme Limit: **${data.WebhookUpdateLimites}**
Webhook Silme Limit: **${data.WebhookDeleteLimites}**
Üye Ban Limit: **${data.MemberBanLimites}**
Üye Kick Limit: **${data.MemberKickLimites}**
Üye Unban Limit: **${data.MemberUnbanLimites}**

**${message.guild.name} Sunucu Rol Ayarları;**

Erkek Rolleri: ${data.manRoles.length > 0 ? data.manRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Kadın Rolleri: ${data.womanRoles.length > 0 ? data.womanRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Kayıtsız Rolleri: ${data.unregRoles.length > 0 ? data.unregRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Yetkili Rolleri: ${data.staffRoles.length > 0 ? data.staffRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Üst Yetkili Rolleri: ${data.seniorStaffRoles.length > 0 ? data.seniorStaffRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Yetki Başlangıç Rolleri: ${data.staffStartRoles.length > 0 ? data.staffStartRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Kayıt Yetkili Rolleri: ${data.registerRoles.length > 0 ? data.registerRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Kayıt Yetki Permleri: ${data.registerPerms.length > 0 ? message.guild.roles.cache.get(data.registerPerms) : `\` ❌ \``}
Booster Rolleri: ${data.boosterRoles.length > 0 ? message.guild.roles.cache.get(data.boosterRoles) : `\` ❌ \``}
Katıldı Permleri: ${data.katildiPerms.length > 0 ? message.guild.roles.cache.get(data.katildiPerms) : `\` ❌ \``}
Katılmadı Permleri: ${data.katilmadiPerms.length > 0 ? message.guild.roles.cache.get(data.katilmadiPerms) : `\` ❌ \``}
Mazeret Permleri: ${data.mazeretPerms.length > 0 ? message.guild.roles.cache.get(data.mazeretPerms) : `\` ❌ \``}
Taglı Rolü: ${data.tagRoles.length > 0 ? message.guild.roles.cache.get(data.tagRoles) : `\` ❌ \``}
Owner Rolleri: ${data.ownerRoles.length > 0 ? data.ownerRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Ban Yetkili Rolleri: ${data.banHammer.length > 0 ? data.banHammer.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Jail Yetkili Rolleri: ${data.jailHammer.length > 0 ? data.jailHammer.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Mute Yetkili Rolleri: ${data.muteHammer.length > 0 ?data.muteHammer.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Karantina Rolleri: ${data.jailRoles.length > 0 ? data.jailRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Reklam Rolleri: ${data.reklamRoles.length > 0 ? data.reklamRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Chat Mute Rolleri: ${data.muteRoles.length > 0 ? data.muteRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Ses Mute Rolleri: ${data.vmuteRoles.length > 0 ? data.vmuteRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Yasaklı Tag Rolleri: ${data.bannedTagRoles.length > 0 ? data.bannedTagRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Yeni Hesap Rolleri: ${data.fakeAccRoles.length > 0 ? data.fakeAccRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Rol Ekleyen Yetkili Rolleri: ${data.roleAddRoles.length > 0 ? data.roleAddRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}
Vip Rolleri: ${data.vipRoles.length > 0 ? message.guild.roles.cache.get(data.vipRoles) : `\` ❌ \``}
Sorun Çözme Rolleri: ${data.scRoles.length > 0 ? data.scRoles.map(x => message.guild.roles.cache.get(x)).join(", ") : `\` ❌ \``}

**${message.guild.name} Sunucu Kanal Ayarları;**
Chat Kanalı: ${data.chatChannel.length > 0 ? message.guild.channels.cache.get(data.chatChannel) : `\` ❌ \``}
Hoşgeldin Kanalı: ${data.welcomeChannel.length > 0 ? message.guild.channels.cache.get(data.welcomeChannel) : `\` ❌ \``}
İnvite Kanalı: ${data.inviteChannel.length > 0 ? message.guild.channels.cache.get(data.inviteChannel) : `\` ❌ \``}
Kurallar Kanalı: ${data.rulesChannel.length > 0 ? message.guild.channels.cache.get(data.rulesChannel) : `\` ❌ \``}
Sorun Çözme Log Kanalı: ${data.solvingLog.length > 0 ? message.guild.channels.cache.get(data.solvingLog) : `\` ❌ \``}
Afk Kanalı: ${data.afkChannel.length > 0 ? message.guild.channels.cache.get(data.afkChannel) : `\` ❌ \``}
Public Kategorileri: ${data.publicParents.length > 0 ? data.publicParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Register Kategorileri: ${data.registerParents.length > 0 ? data.registerParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Sorun Çözme Kategorileri: ${data.solvingParents.length > 0 ? data.solvingParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Secret Kategoriler: ${data.privateParents.length > 0 ? data.privateParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Alone Kategorileri: ${data.aloneParents.length > 0 ? data.aloneParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Eğlence Kategorileri: ${data.funParents.length > 0 ? data.funParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Vampir Köylü Kategorileri: ${data.vkParents.length > 0 ? data.vkParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}
Streamer Kategorileri: ${data.streamerParents.length > 0 ? data.streamerParents.map(x => message.guild.channels.cache.get(x)) : `\` ❌ \``}

**${message.guild.name} Sunucu Rol Alma & Level Rolleri;**
1 Aylık Üye Rolleri: ${data.oneMonthRoles.length > 0 ? message.guild.roles.cache.get(data.oneMonthRoles) : `\` ❌ \``}
3 Aylık Üye Rolleri: ${data.threeMonthRoles.length > 0 ? message.guild.roles.cache.get(data.threeMonthRoles) : `\` ❌ \``}
6 Aylık Üye Rolleri: ${data.sixMonthRoles.length > 0 ? message.guild.roles.cache.get(data.sixMonthRoles) : `\` ❌ \``}
9 Aylık Üye Rolleri: ${data.nineMonthRoles.length > 0 ? message.guild.roles.cache.get(data.nineMonthRoles) : `\` ❌ \``}
1 Yıllık Üye Rolleri: ${data.oneYearRoles.length > 0 ? message.guild.roles.cache.get(data.oneYearRoles) : `\` ❌ \``}
Siyah Rolleri: ${data.blackRoles.length > 0 ? message.guild.roles.cache.get(data.blackRoles) : `\` ❌ \``}
Mavi Rolleri: ${data.blueRoles.length > 0 ? message.guild.roles.cache.get(data.blueRoles) : `\` ❌ \``}
Beyaz Rolleri: ${data.whiteRoles.length > 0 ? message.guild.roles.cache.get(data.whiteRoles) : `\` ❌ \``}
Kırmızı Rolleri: ${data.redRoles.length > 0 ? message.guild.roles.cache.get(data.redRoles) : `\` ❌ \``}
Sarı Rolleri: ${data.yellowRoles.length > 0 ? message.guild.roles.cache.get(data.yellowRoles) : `\` ❌ \``}
Pembe Rolleri: ${data.pinkRoles.length > 0 ? message.guild.roles.cache.get(data.pinkRoles) : `\` ❌ \``}
Mor Rolleri: ${data.purpleRoles.length > 0 ? message.guild.roles.cache.get(data.purpleRoles) : `\` ❌ \``}
Turuncu Rolleri: ${data.orangeRoles.length > 0 ? message.guild.roles.cache.get(data.orangeRoles) : `\` ❌ \``}
Yeşil Rolleri: ${data.greenRoles.length > 0 ? message.guild.roles.cache.get(data.greenRoles) : `\` ❌ \``}
Kahverengi Rolleri: ${data.brownRoles.length > 0 ? message.guild.roles.cache.get(data.brownRoles) : `\` ❌ \``}
Bordo Rolleri: ${data.burgundyRoles.length > 0 ? message.guild.roles.cache.get(data.burgundyRoles) : `\` ❌ \``}
Turkuaz Rolleri: ${data.turquoiseRoles.length > 0 ? message.guild.roles.cache.get(data.turquoiseRoles) : `\` ❌ \``}
Bej Rolleri: ${data.beigeRoles.length > 0 ? message.guild.roles.cache.get(data.beigeRoles) : `\` ❌ \``}
Lacivert Rolleri: ${data.navyblueRoles.length > 0 ? message.guild.roles.cache.get(data.navyblueRoles) : `\` ❌ \``}
Açık Mavi Rolleri: ${data.lightblueRoles.length > 0 ? message.guild.roles.cache.get(data.lightblueRoles) : `\` ❌ \``}
Fıstık Yeşili Rolleri: ${data.pistachiogreenRoles.length > 0 ? message.guild.roles.cache.get(data.pistachiogreenRoles) : `\` ❌ \``}
Çekiliş Katılımcısı Rolleri: ${data.cekilisRoles.length > 0 ? message.guild.roles.cache.get(data.cekilisRoles) : `\` ❌ \``}
Etkinlik Katılımcısı Rolleri: ${data.etkinlikRoles.length > 0 ? message.guild.roles.cache.get(data.etkinlikRoles) : `\` ❌ \``}
Sevgilim Var Rolleri: ${data.coupleRoles.length > 0 ? message.guild.roles.cache.get(data.coupleRoles) : `\` ❌ \``}
Sevgilim Yok Rolleri: ${data.aloneRoles.length > 0 ? message.guild.roles.cache.get(data.aloneRoles) : `\` ❌ \``}
Sevgili Yapmıyorum Rolleri: ${data.syRoles.length > 0 ? message.guild.roles.cache.get(data.syRoles) : `\` ❌ \``}
Minecraft Rolleri: ${data.minecraftRoles.length > 0 ? message.guild.roles.cache.get(data.minecraftRoles) : `\` ❌ \``}
Fortnite Rolleri: ${data.fortniteRoles.length > 0 ? message.guild.roles.cache.get(data.fortniteRoles) : `\` ❌ \``}
Mobile Legends Rolleri: ${data.mlbbRoles.length > 0 ? message.guild.roles.cache.get(data.mlbbRoles) : `\` ❌ \``}
Counter Strike Rolleri: ${data.csRoles.length > 0 ? message.guild.roles.cache.get(data.csRoles) : `\` ❌ \``}
Pubg Rolleri: ${data.pubgRoles.length > 0 ? message.guild.roles.cache.get(data.pubgRoles) : `\` ❌ \``}
Among Us Rolleri: ${data.amongusRoles.length > 0 ? message.guild.roles.cache.get(data.amongusRoles) : `\` ❌ \``}
League Of Legends Rolleri: ${data.lolRoles.length > 0 ? message.guild.roles.cache.get(data.lolRoles) : `\` ❌ \``}
Gta V Rolleri: ${data.gtavRoles.length > 0 ? message.guild.roles.cache.get(data.gtavRoles) : `\` ❌ \``}
Valorant Rolleri: ${data.valorantRoles.length > 0 ? message.guild.roles.cache.get(data.valorantRoles) : `\` ❌ \``}
Beşiktaş Rolleri: ${data.bjkRoles.length > 0 ? message.guild.roles.cache.get(data.bjkRoles) : `\` ❌ \``}
Galatasaray Rolleri: ${data.gsRoles.length > 0 ? message.guild.roles.cache.get(data.gsRoles) : `\` ❌ \``}
Fenerbahçe Rolleri: ${data.fbRoles.length > 0 ? message.guild.roles.cache.get(data.fbRoles) : `\` ❌ \``}
Trabzonspor Rolleri: ${data.tsRoles.length > 0 ? message.guild.roles.cache.get(data.tsRoles) : `\` ❌ \``}
Akrep Rolleri: ${data.akrepRoles.length > 0 ? message.guild.roles.cache.get(data.akrepRoles) : `\` ❌ \``}
Yengeç Rolleri: ${data.yengecRoles.length > 0 ? message.guild.roles.cache.get(data.yengecRoles) : `\` ❌ \``}
İkizler Rolleri: ${data.ikizlerRoles.length > 0 ? message.guild.roles.cache.get(data.ikizlerRoles) : `\` ❌ \``}
Yay Rolleri: ${data.yayRoles.length > 0 ? message.guild.roles.cache.get(data.yayRoles) : `\` ❌ \``}
Aslan Rolleri: ${data.aslanRoles.length > 0 ? message.guild.roles.cache.get(data.aslanRoles) : `\` ❌ \``}
Terazi Rolleri: ${data.teraziRoles.length > 0 ? message.guild.roles.cache.get(data.teraziRoles) : `\` ❌ \``}
Başak Rolleri: ${data.basakRoles.length > 0 ? message.guild.roles.cache.get(data.basakRoles) : `\` ❌ \``}
Kova Rolleri: ${data.kovaRoles.length > 0 ? message.guild.roles.cache.get(data.kovaRoles) : `\` ❌ \``}
Balık Rolleri: ${data.balikRoles.length > 0 ? message.guild.roles.cache.get(data.balikRoles) : `\` ❌ \``}
Oğlak Rolleri: ${data.oglakRoles.length > 0 ? message.guild.roles.cache.get(data.oglakRoles) : `\` ❌ \``}
Koç Rolleri: ${data.kocRoles.length > 0 ? message.guild.roles.cache.get(data.kocRoles) : `\` ❌ \``}
Boğa Rolleri: ${data.bogaRoles.length > 0 ? message.guild.roles.cache.get(data.bogaRoles) : `\` ❌ \``}`
return msg;
}
async function SetupsUpdates(modal, desc, type, message) {
const channelrow = new Discord.ActionRowBuilder().addComponents(new Discord.ChannelSelectMenuBuilder().setCustomId("channel_select").addChannelTypes(Discord.ChannelType.GuildText,Discord.ChannelType.AnnouncementThread,Discord.ChannelType.GuildForum,Discord.ChannelType.GuildAnnouncement,).setMinValues(1).setMaxValues(1),);
const vchannelrow = new Discord.ActionRowBuilder().addComponents(new Discord.ChannelSelectMenuBuilder().setCustomId("vchannel_select").addChannelTypes(Discord.ChannelType.GuildVoice).setMinValues(1).setMaxValues(1),);
const categoryrow = new Discord.ActionRowBuilder().addComponents(new Discord.ChannelSelectMenuBuilder().setCustomId("category_select").addChannelTypes(Discord.ChannelType.GuildCategory).setMinValues(1).setMaxValues(1),);
const rolerow = new Discord.ActionRowBuilder().addComponents(new Discord.RoleSelectMenuBuilder().setCustomId("role_select").setMinValues(1).setMaxValues(20),);
if (type == "channel") {
let db = await setups.findOne({guildID: settings.Moderation.guildID});
let msg = await message.reply({content: `**${desc}** ayarlamak için aşağıdaki menüyü kullanın.`, components: [channelrow]});
var filter = (interaction) => interaction.user.id;
const collector = msg.createMessageComponentCollector({filter, time: 120000});
collector.on("collect", async (interaction) => {
channelrow.components[0].setDisabled(true);
msg.edit({ components: [channelrow] });
if (interaction.customId === "channel_select") {
interaction.deferUpdate();
db[modal] = interaction.values[0];
await db.save()
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {})
msg.edit({content: `Sunucu **${desc}** başarıyla ${message.guild.channels.cache.get(interaction.values[0])} olarak ayarlandı.`})
}
});
collector.on("end", async () => {
channelrow.components[0].setDisabled(true);
msg.edit({ components: [channelrow] });
});
}
if (type == "vchannel") {
let db = await setups.findOne({guildID: settings.Moderation.guildID});
let msg = await message.reply({content: `**${desc}** ayarlamak için aşağıdaki menüyü kullanın.`, components: [vchannelrow]});
var filter = (interaction) => interaction.user.id;
const collector = msg.createMessageComponentCollector({filter, time: 120000});
collector.on("collect", async (interaction) => {
vchannelrow.components[0].setDisabled(true);
msg.edit({ components: [vchannelrow] });
if (interaction.customId === "vchannel_select") {
interaction.deferUpdate();
db[modal] = interaction.values[0];
await db.save();
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {})
msg.edit({content: `**${desc}** başarıyla ${message.guild.channels.cache.get(interaction.values[0])} olarak ayarlandı.`})
}
});
collector.on("end", async () => {
vchannelrow.components[0].setDisabled(true);
msg.edit({ components: [vchannelrow] });
});
}
if (type == "category") {
let db  = await setups.findOne({guildID: settings.Moderation.guildID,});
let msg = await message.reply({content: `**${desc}** ayarlamak için aşağıdaki menüyü kullanın.`, components: [categoryrow]});
var filter = (interaction) => interaction.user.id;
const collector = msg.createMessageComponentCollector({filter, time: 120000});
collector.on("collect", async (interaction) => {
categoryrow.components[0].setDisabled(true);
msg.edit({ components: [categoryrow] });
if (interaction.customId === "category_select") {
interaction.deferUpdate();
db[modal] = interaction.values[0];
await db.save()
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {})
msg.edit({content: `Sunucu **${desc}** başarıyla ${message.guild.channels.cache.get(interaction.values[0])} olarak ayarlandı.`})
}
});
collector.on("end", async () => {
categoryrow.components[0].setDisabled(true);
msg.edit({ components: [categoryrow] });
});
} else if (type == "role") {
let db = await setups.findOne({guildID: settings.Moderation.guildID});
let msg = await message.reply({content: `**${desc}** ayarlamak için aşağıdaki menüyü kullanın.`, components: [rolerow]});
var filter = (interaction) => interaction.user.id;
const collector = msg.createMessageComponentCollector({filter, time: 600000});
collector.on("collect", async (interaction) => {
rolerow.components[0].setDisabled(true);
msg.edit({ components: [rolerow] });
if (interaction.customId === "role_select") {
interaction.deferUpdate();
db[modal] = interaction.values.map((id) => id);
await db.save(),
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {})
msg.edit({content: `Sunucu **${desc}** başarıyla ${interaction.values.map((id) => interaction.guild.roles.cache.get(id).toString()).join(", ")} olarak ayarlandı.`})
}
});
collector.on("end", async () => {
rolerow.components[0].setDisabled(true);
msg.edit({ components: [rolerow] });
});
}
}