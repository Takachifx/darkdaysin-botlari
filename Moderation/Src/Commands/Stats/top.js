const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const MessageUser = require("../../../../Src/Schemas/MessageUsers")
const VoiceUser = require("../../../../Src/Schemas/VoiceUsers")
const CameraUser = require("../../../../Src/Schemas/CameraUsers")
const StreamUser = require("../../../../Src/Schemas/StreamUsers")
const Invited = require("../../../../Src/Schemas/İnvited")
const Inviter = require("../../../../Src/Schemas/İnviteMembers")
const registerStats = require("../../../../Src/Schemas/RegisterStaffStats")
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
module.exports = {
conf: {
aliases: ["top","topstat"],
name: "topstat",
help: "topstat",
category: "kullanici"
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const msj = await message.reply({embeds: [embed.setDescription(`${message.guild.name} sunucusuna ait veri sıralaması yükleniyor. Lütfen bekleyin!`)]})
const messageUsersData1 = await MessageUser.find({ guildID: settings.Moderation.guildID }).select('userID topStat').sort({ topStat: -1 });
const voiceUsersData1 = await VoiceUser.find({ guildID: settings.Moderation.guildID }).select('userID topStat').sort({ topStat: -1 });
const mesajeniyi = messageUsersData1.filter((x) => message.guild.members.cache.get(x.userID)).splice(0, 5).map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`).join("\n");
const seseniyi = voiceUsersData1.filter((x) => message.guild.members.cache.get(x.userID)).splice(0, 5).map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`).join("\n");
const inviteUsers1 = await Invited.find({ guildID: settings.Moderation.guildID }).select('userID total').sort({ total: -1 });
const kayitUsers1 = await registerStats.find({ guildID: settings.Moderation.guildID }).select('userID top').sort({ top: -1 });
const inviteniyi = inviteUsers1.filter((x) => message.guild.members.cache.get(x.userID)).splice(0, 5).map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`).join("\n");
const kayiteniyi = kayitUsers1.filter((x) => message.guild.members.cache.get(x.userID)).splice(0, 5).map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`).join("\n");
const streamUsers1 = await StreamUser.find({ guildID: settings.Moderation.guildID }).select('userID topStat').sort({ topStat: -1 });
const cameraUsers1 = await CameraUser.find({ guildID: settings.Moderation.guildID }).select('userID topStat').sort({ topStat: -1 });
const yayineniyi = streamUsers1.splice(0, 5).map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`).join("\n");
const kameraeniyi = cameraUsers1.splice(0, 5).map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`).join("\n");
///
const voiceUsersData = await VoiceUser.find({ guildID: settings.Moderation.guildID }).select('userID topStat').sort({ topStat: -1 });
let list = voiceUsersData
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");
const voiceUsersData3 = await VoiceUser.find({ guildID: settings.Moderation.guildID }).select('userID weeklyStat').sort({ weeklyStat: -1 });
let listt = voiceUsersData3
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${moment.duration(x.weeklyStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");
const messageUsersData = await MessageUser.find({ guildID: settings.Moderation.guildID }).select('userID topStat').sort({ topStat: -1 });
let mlist = messageUsersData
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${Number(x.topStat).toLocaleString()} Mesaj \``)
.join("\n");
const messageUsersData3 = await MessageUser.find({ guildID: settings.Moderation.guildID }).select('userID weeklyStat').sort({ weeklyStat: -1 });
let mlistt = messageUsersData3
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${Number(x.weeklyStat).toLocaleString()} Mesaj \``)
.join("\n");
const streamUsersData = await StreamUser.find({ guildID: settings.Moderation.guildID }).select('userID topStat').sort({ topStat: -1 });
let ylist = streamUsersData
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");
const cameraUsersData = await CameraUser.find({ guildID: settings.Moderation.guildID }).select('userID topStat').sort({ topStat: -1 });
let clist = cameraUsersData
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");
let data = await Invited.find({ guildID: settings.Moderation.guildID }).select('userID total').sort({ total: -1 });
let dlist = data
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${x.total} Davet. \``)
.join("\n");
let data2 = await Invited.find({ guildID: settings.Moderation.guildID }).select('userID total7').sort({ total7: -1 });
let dlist2 = data2
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${x.total7} Davet. \``)
.join("\n");
let kdata = await registerStats.find({ guildID: settings.Moderation.guildID }).select('userID top').sort({ top: -1 });
let klist = kdata
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${x.top} Kayıt. \``)
.join("\n");
const kdata2 = await registerStats.find({ guildID: settings.Moderation.guildID }).select('userID top7').sort({ top7: -1 });
let klist2 = kdata2
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${x.top7} Kayıt. \``)
.join("\n");
const streamUsersData2 = await StreamUser.find({ guildID: settings.Moderation.guildID }).select('userID weeklyStat').sort({ weeklyStat: -1 });
let ylist2 = streamUsersData2
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${moment.duration(x.weeklyStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");
const cameraUsersData2 = await CameraUser.find({ guildID: settings.Moderation.guildID }).select('userID weeklyStat').sort({ weeklyStat: -1 });
let clist2 = cameraUsersData2
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${moment.duration(x.weeklyStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");
const menu = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId('menu1')
.setPlaceholder(`${message.guild.name} sunucunun verilerini görüntüle`)
.setMinValues(0)
.setMaxValues(1)
.addOptions([
{
label: 'Sunucunun En İyileri',
description: 'En iyi istatistiğe sahip 5 üyeler.',
value: 'eniyi',
emoji: '🏆',
},
{
label: 'Genel Ses Sıralaması',
description: 'Tüm zamanların genel 20 ses sıralaması.',
value: 'tums',
emoji: '🎧',
},
{
label: 'Haftalık Ses Sıralaması',
description: 'Bu haftanın 20 ses sıralaması.',
value: 'weeks',
emoji: '🎧',
},
{
label: 'Genel Mesaj Sıralaması',
description: 'Tüm zamanların genel 20 mesaj sıralaması.',
value: 'tumm',
emoji: '📝',
},
{
label: 'Haftalık Mesaj Sıralaması',
description: 'Bu haftanın 20 mesaj sıralaması.',
value: 'weekm',
emoji: '📝',
},
{
label: 'Genel Davet Sıralaması',
description: 'Tüm zamanların genel 20 davet sıralaması.',
value: 'tumd',
emoji: '📩',
},
{
label: 'Haftalık Davet Sıralaması',
description: 'Bu haftanın 20 davet sıralaması.',
value: 'weekd',
emoji: '📩',
},
{
label: 'Genel Kayıt Sıralaması',
description: 'Tüm zamanların genel 20 kayıt sıralaması.',
value: 'tumk',
emoji: '👤',
},
{
label: 'Haftalık Kayıt Sıralaması',
description: 'Bu haftanın 20 kayıt sıralaması.',
value: 'weekk',
emoji: '👤',
},
{
label: 'Genel Yayın Sıralaması',
description: 'Tüm zamanların genel 20 yayın sıralaması.',
value: 'tumy',
emoji: '🖥️',
},
{
label: 'Haftalık Yayın Sıralaması',
description: 'Bu haftanın 20 yayın sıralaması.',
value: 'weeky',
emoji: '🖥️',
},
{
label: 'Genel Kamera Sıralaması',
description: 'Tüm zamanların genel 20 kamera sıralaması.',
value: 'tumc',
emoji: '📸',
},
{
label: 'Haftalık Kamera Sıralaması',
description: 'Bu haftanın 20 kamera sıralaması.',
value: 'weekka',
emoji: '📸',
},
{
label: 'İşlem İptal',
value: 'iptal',
emoji: '1087150197282447510',
},
]),
);
embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setDescription(`${message.guild.emojiGöster(emojis.info)} Aşağıdaki Menüden **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihli Tüm Zamanlar Ve Haftalık İstatistik Verilerini Listeleyebilirsiniz.`)
msj.edit({embeds: [embed], components: [menu]}).then(msg => {
const filter = (xd) => xd.user.id == message.author.id;
const collector = msg.createMessageComponentCollector({filter})
collector.on("collect", async (button) => {
if(button.values && button.values[0] == 'eniyi'){
await button.deferUpdate ();
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki En İyileri Sıralanmaktadır.

${message.guild.emojiGöster(emojis.stat)} __**En İyi 5 Ses**__
${seseniyi ? seseniyi : "Veri Bulunmuyor."}
${message.guild.emojiGöster(emojis.stat)} __**En İyi 5 Mesaj**__
${mesajeniyi ? mesajeniyi : "Veri Bulunmuyor."}

${message.guild.emojiGöster(emojis.stat)} __**En İyi 5 Kayıt**__
${kayiteniyi ? kayiteniyi : "Veri Bulunmuyor."}
${message.guild.emojiGöster(emojis.stat)} __**En İyi 5 Davet**__
${inviteniyi ? inviteniyi : "Veri Bulunmuyor."}

${message.guild.emojiGöster(emojis.stat)} __**En İyi 5 Yayın**__
${yayineniyi ? yayineniyi : "Veri Bulunmuyor."}
${message.guild.emojiGöster(emojis.stat)} __**En İyi 5 Kamera**__
${kameraeniyi ? kameraeniyi : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

await msg.edit({ embeds: [embeds], components : [menu] })
}
if(button.values && button.values[0] == 'tums'){
await button.deferUpdate();
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Genel Ses Sıralaması Listelenmektedir.

${list ? list : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

await msg.edit({ embeds: [embeds], components : [menu] })
}
if(button.values && button.values[0] == 'weeks'){
await button.deferUpdate();
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Haftalık Ses Sıralaması Listelenmektedir.

${listt ? listt : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
await msg.edit({ embeds: [embeds], components : [menu] })
}
if(button.values && button.values[0] == 'tumm'){
await button.deferUpdate();

const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Genel Mesaj Sıralaması Listelenmektedir.

${mlist ? mlist : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

await msg.edit({ embeds: [embeds], components : [menu] })
}
if(button.values && button.values[0] == 'weekm'){
await button.deferUpdate();

const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Haftalık Mesaj Sıralaması Listelenmektedir.

${mlistt ? mlistt : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

await msg.edit({ embeds: [embeds], components : [menu] })
}
if(button.values && button.values[0] == 'tumd'){
await button.deferUpdate();
const embeds2 = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Genel Davet Sıralaması Listelenmektedir.

${dlist ? dlist : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
await msg.edit({ embeds: [embeds2], components : [menu] })
}
if(button.values && button.values[0] == 'weekd'){
await button.deferUpdate();
const embeds2 = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Haftalık Davet Sıralaması Listelenmektedir.

${dlist2 ? dlist2 : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
await msg.edit({ embeds: [embeds2], components : [menu] })
}
if(button.values && button.values[0] == 'tumk'){
await button.deferUpdate();
const embeds2 = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Genel Kayıt Sıralaması Listelenmektedir.

${klist ? klist : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
await msg.edit({ embeds: [embeds2], components : [menu] })
}
if(button.values && button.values[0] == 'weekk'){
await button.deferUpdate();
const embeds2 = new Discord.EmbedBuilder()
.setDescription(`${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Haftalık Kayıt Sıralaması Listelenmektedir.

${klist2 ? klist2 : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
await msg.edit({ embeds: [embeds2], components : [menu] })
}
if(button.values && button.values[0] == 'tumy'){
await button.deferUpdate();
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Genel Yayın Sıralaması Listelenmektedir.

${ylist ? ylist : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

await msg.edit({ embeds: [embeds], components : [menu] })
}
if(button.values && button.values[0] == 'weeky'){
await button.deferUpdate();
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Haftalık Yayın Sıralaması Listelenmektedir.

${ylist2 ? ylist2 : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
await msg.edit({ embeds: [embeds], components : [menu] })
}
if(button.values && button.values[0] == 'tumc'){
await button.deferUpdate();
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Genel Kamera sıralaması Listelenmektedir.

${clist ? clist : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

await msg.edit({ embeds: [embeds], components : [menu] })
}
if(button.values && button.values[0] == 'weekka'){
await button.deferUpdate();
const embeds = new Discord.EmbedBuilder()
.setDescription(`${message.guild.emojiGöster(emojis.info)} Aşağıda **${message.guild.name}** Sunucusunun <t:${String(Date.now()).slice(0, 10)}> Tarihindeki Haftalık Kamera Sıralaması Listelenmektedir.

${clist2 ? clist2 : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
await msg.edit({ embeds: [embeds], components : [menu] })
}
if(button.values && button.values[0] == 'iptal'){
await button.deferUpdate();
await msg.delete().catch(e => {});
}
})
})
}
}