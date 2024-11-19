const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const emojis = require("../../../../Src/Settings/emojiName.json");
const Names = require("../../../../Src/Schemas/Names");
const BoosterName = require("../../../../Src/Schemas/Booster");
const registerStats = require("../../../../Src/Schemas/RegisterStaffStats");
const Discord = require("discord.js");
const moment = require("moment");
const RankSystem = require("../../../../Src/Schemas/RankSystem");
const Puans = require("../../../../Src/Schemas/Puans");
const axios = require("axios");
require("moment-duration-format");
moment.locale("tr");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions")
module.exports = {
conf: {
aliases: ["kayıt", "k", "register", "kayit", "erkek", "kadın", "kadin", "e", "kadın", "kız", "kiz", "kayıt", "kayit"],
name: "register",
help: "kayıt @Darkdays/ID [İsim] [Yaş] [Cinsiyet]",
category: "kayit",
cooldown: 0
},
Cyrstal: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID });
if(!ayar) return;
const Name = ["kayıt", "k", "register", "kayit", "erkek", "kadın", "kadin", "e", "kadın", "kız", "kiz", "kayıt", "kayit"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.registerRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.staffRoles.some(oku => message.member.roles.cache.has(oku))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Yetkin bulunmamakta. Yetkili olmak istersen başvuru yapabilirsin.`)]}).sil(15)
}
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!member) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Bir üye belirtmelisin!`)]}).sil(15)
}
if(ayar.manRoles.some(oku => member.roles.cache.has(oku)) || ayar.womanRoles.some(oku => member.roles.cache.has(oku))) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Belirttiğin üye zaten kayıtlı!`)]}).sil(15)
}
if(member.user.id === message.author.id) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendin Üzerinde İşlem Yapamazsın"}).sil(15)
}
if(ayar.SafeBots.includes(member.user.id)) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Botlara İşlem Yapamazsın"}).sil(15)
}
if(message.member.roles.highest.position <= member.roles.highest.position) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({content: "Kendinden Üstteki Kullanıcıya İşlem Yapamazsın"}).sil(15)
}
args = args.filter(a => a !== "" && a !== " ").splice(1);
let setName;
let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
let age = args.filter(arg => !isNaN(arg))[0] || "";
if(!name & !age) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`\`${prefix}kayıt <@Darkdays/ID> <İsim> <Yaş>\``)]}).sil(15)
}
if(!age) {
if(ayar.ageSystem == true && !age) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`\`${prefix}kayıt <@Darkdays/ID> <İsim> <Yaş>\``)]}).sil(15)
}
setName = `${ayar.tagSystem == true ? (member.user.globalName && member.user.globalName.includes(ayar.nameTag) ? ayar.nameTag : (ayar.defaultTag ? ayar.defaultTag : (ayar.nameTag || ""))) : ''} ${name}`;
} else if(ayar.ageSystem == false && age) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`\`${prefix}kayıt <@Darkdays/ID> <İsim>\``)]}).sil(15)
} else {
if(ayar.ageSystem == true) {
if(ayar.minRegisterAge > age) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({embeds: [embed.setDescription(`Belirttiğin Yaş Minimum Yaş Sınırının Altında.`)]}).sil(15)
}
setName = `${ayar.tagSystem == true ? (member.user.globalName && member.user.globalName.includes(ayar.nameTag) ? ayar.nameTag : (ayar.defaultTag ? ayar.defaultTag : (ayar.nameTag || ""))) : ''} ${name} | ${age}`;
}
}
await member.setNickname(setName).catch(e => { });
await message.react(message.guild.emojiGöster(emojis.yes))
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder()
.setCustomId("erkek")
.setLabel("Erkek")
.setEmoji("1139681289092468850")
.setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder()
.setCustomId("kadın")
.setLabel("Kadın")
.setEmoji("1139681291986550875")
.setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder()
.setCustomId("names")
.setLabel("İsim Verileri")
.setEmoji("1087380479189196870")
.setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder()
.setCustomId("exit")
.setLabel("İptal")
.setEmoji(message.guild.emojiGöster(emojis.no).id)
.setStyle(Discord.ButtonStyle.Danger),
);
const data = await Names.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
const nameSize = data ? data.names.map((x) => x.name).length : 0;
let msg = await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member} Kullanıcısının İsmi Başarıyla \` ${setName} \` Olarak Değiştirildi!

Kullanıcının Geçmiş İsimleri; (**${nameSize}**)

\`\`\`yml
${data ? data.names.splice(0, 3).map((x, i) => `${i+1}. İsim: ${x.name && x.name.length > 0 ? `${x.name}` : "Bulunamadı."}${x.age && x.age.length > 0 ? ` | Yaş: ${x.age}` : ""} Yetkili: (${message.guild.members.cache.get(x.executor) ? message.guild.members.cache.get(x.executor).user.username : "Bulunamadı."}) [${moment(x.Date).format("LLL")}]`).join("\n\n") : "Daha önce kayıt olmamış."}
\`\`\`

__**Cinsiyet Seçmek İçin Menüyü Kullanabilirsiniz.**__`).setAuthor({ name: `${member.user.displayName} Kullanıcısının Kaydı Yapıldı!`, iconURL: member.user.avatarURL({ dynamic: true })}).setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))], components: [row]});
let filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 60000 });
collector.on("collect", async (button) => {
if(button.customId === "erkek") {
await member.setRoles(ayar.manRoles)
await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.face)} ${member} Kullanıcısının İsmi Başarıyla \` ${setName} \` Olarak Değiştirildi!\n\nCinsiyet Seçimi: \` Erkek \``).setAuthor({ name: `${member.user.displayName} Kullanıcısının Kaydı Yapıldı!`, iconURL: member.user.avatarURL({ dynamic: true })}).setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))], components: []});
await message.react(message.guild.emojiGöster(emojis.yes))
let sex = message.guild.channels.cache.filter(c => ayar.publicParents.some(a => a == c.parentId) && c.type === Discord.ChannelType.GuildVoice);
const ch = sex.random()
if(member.voice.channel) await member.voice.setChannel(ch).catch(e => {}), member.send({content: `Hey! Teyit odasında kayıt olduktan sonra zaman geçiremezsin, otomatik olarak sohbet odalarından **${ch.name}** kanalına seni taşıdım.`}).catch(e => {});
await registerStats.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { top: 1, erkek: 1, erkek1: 1, top1: 1, erkek7: 1, erkek30: 1, top7: 1, top30: 1 }, }, { upsert: true });
await Names.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $push: { names: { name: member.displayName, executor: message.author.id, rol: ayar.manRoles, Date: Date.now() } } }, { upsert: true });
await BoosterName.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { names: member.displayName, cinsiyet: "Erkek" } }, { upsert: true });
message.guild.channels.cache.get(ayar.chatChannel).send({ content:`${member} Adlı Kullanıcı Aramıza Katıldı Ona Hoşgeldin Diyelim!`}).sil(10)
const rdb = await RankSystem.findOne({ guildID: settings.Moderation.guildID });
const rank = JSON.parse(await client.ranks(message.guild.id));
if(rdb && rdb.RankSystem === true && !rank.some((x) => message.member.roles.cache.has(x.roleID))) {
await Puans.updateOne({ guildID: message.guild.id, userID: message.author.id }, { $inc: { puan: rdb && rdb.registerCoin } }, { upsert: true });
await message.member.görevGüncelle(settings.Moderation.guildID, "kayıt", 1);
}
const klog = await client.kanalBul("kayıt-log")
const datas = await registerStats.findOne({ guildID: settings.Moderation.guildID, userID: message.member.id });
await klog.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} ${message.author} Tarafından ${member.toString()} kullanıcısı **Erkek** olarak kayıt edildi.

Kullanıcı: \` ${member.user.globalName ? member.user.globalName : member.user.username} \` - \` ${member.id} \`
Yetkili: \` ${message.member.globalName ? message.member.globalName : message.member.user.username} \` - \` ${message.author.id} \`
Kayıt türü: \` Erkek \`
Yetkili kayıt sayısı: \` ${datas ? datas.top : 0} \`
Tarih: <t:${String(Date.now()).slice(0, 10)}:R>
Kullanıcı isim geçmişi; (**${nameSize}**)

\`\`\`yml
${data ? data.names.splice(0, 3).map((x, i) => `${i+1}. İsim:  ${x.name ? `${x.name}` : "Bulunamadı."} ${x.age ? ` | Yaş: ${x.age}` : ""} Rol: (${x.rol ? x.rol.length == 1 ? message.guild.roles.cache.get(x.rol).name : x.rol.map((x) => `${message.guild.roles.cache.get(x).name}`).join(", ") : "Bulunamadı."}) Yetkili: (${message.guild.members.cache.get(x.executor) ? message.guild.members.cache.get(x.executor).user.username : "Bulunamadı."}) [${moment(x.Date).format("LLL")}]`).join("\n\n") : "Daha önce kayıt olmamış."}
\`\`\``)
.setAuthor({name: member.displayName, iconURL: member.displayAvatarURL({dynamic: true})})
.setThumbnail(member.displayAvatarURL({dynamic: true}))
.setFooter({text: `${member.displayName} Sunucumuza ${message.member.displayName} Tarafından Kayıt Edildi.`, iconURL: message.author.displayAvatarURL({dynamic: true})})]})
}
if(button.customId === "kadın") {
await member.setRoles(ayar.womanRoles)
await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.face)} ${member} Kullanıcısının İsmi Başarıyla \` ${setName} \` Olarak Değiştirildi!\n\nCinsiyet Seçimi: \` Kadın \``).setAuthor({ name: `${member.user.displayName} Kullanıcısının Kaydı Yapıldı!`, iconURL: member.user.avatarURL({ dynamic: true })}).setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))], components: []});
await message.react(message.guild.emojiGöster(emojis.yes))
let sex = message.guild.channels.cache.filter(c => ayar.publicParents.some(a => a == c.parentId) && c.type === Discord.ChannelType.GuildVoice);
const ch = sex.random()
if(member.voice.channel) await member.voice.setChannel(ch).catch(e => {}), member.send({content: `Hey! Teyit odasında kayıt olduktan sonra zaman geçiremezsin, otomatik olarak sohbet odalarından **${ch.name}** kanalına seni taşıdım.`}).catch(e => {});
await registerStats.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $inc: { top: 1, kadin: 1, kadin1: 1, top1: 1, kadin7: 1, kadin30: 1, top7: 1, top30: 1 }, }, { upsert: true });
await Names.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $push: { names: { name: member.displayName, executor: message.author.id, rol: ayar.womanRoles, Date: Date.now() } } }, { upsert: true });
await BoosterName.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { names: member.displayName, cinsiyet: "Kadın" } }, { upsert: true });
message.guild.channels.cache.get(ayar.chatChannel).send({ content:`${member} Adlı Kullanıcı Aramıza Katıldı Ona Hoşgeldin Diyelim!`}).sil(10)
const rdb = await RankSystem.findOne({ guildID: settings.Moderation.guildID });
const rank = JSON.parse(await client.ranks(message.guild.id));
if(rdb && rdb.RankSystem === true && !rank.some((x) => message.member.roles.cache.has(x.roleID))) {
await Puans.updateOne({ guildID: message.guild.id, userID: message.author.id }, { $inc: { puan: rdb && rdb.registerCoin } }, { upsert: true });
await message.member.görevGüncelle(settings.Moderation.guildID, "kayıt", 1);
}
const klog = await client.kanalBul("kayıt-log")
const datas = await registerStats.findOne({ guildID: settings.Moderation.guildID, userID: message.member.id });
await klog.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} ${message.author} Tarafından ${member.toString()} kullanıcısı **Kadın** olarak kayıt edildi.

Kullanıcı: \` ${member.user.globalName ? member.user.globalName : member.user.username} \` - \` ${member.id} \`
Yetkili: \` ${message.member.globalName ? message.member.globalName : message.member.user.username} \` - \` ${message.author.id} \`
Kayıt türü: \` Kadın \`
Yetkili kayıt sayısı: \` ${datas ? datas.top : 0} \`
Tarih: <t:${String(Date.now()).slice(0, 10)}:R>
Kullanıcı isim geçmişi; (**${nameSize}**)

\`\`\`yml
${data ? data.names.splice(0, 3).map((x, i) => `${i+1}. İsim:  ${x.name ? `${x.name}` : "Bulunamadı."} ${x.age ? ` | Yaş: ${x.age}` : ""} Rol: (${x.rol ? x.rol.length == 1 ? message.guild.roles.cache.get(x.rol).name : x.rol.map((x) => `${message.guild.roles.cache.get(x).name}`).join(", ") : "Bulunamadı."}) Yetkili: (${message.guild.members.cache.get(x.executor) ? message.guild.members.cache.get(x.executor).user.username : "Bulunamadı."}) [${moment(x.Date).format("LLL")}]`).join("\n\n") : "Daha önce kayıt olmamış."}
\`\`\``)
.setAuthor({name: member.displayName, iconURL: member.displayAvatarURL({dynamic: true})})
.setThumbnail(member.displayAvatarURL({dynamic: true}))
.setFooter({text: `${member.displayName} Sunucumuza ${message.member.displayName} Tarafından Kayıt Edildi.`, iconURL: message.author.displayAvatarURL({dynamic: true})})]})
}
if(button.customId === "names") {
const response = await axios.get(`http://2.56.108.172:1555/api/user?id=${member.id}`)
if(!response.data) return button.reply({content: "Veri bulunamadı.", ephemeral: true})
await message.react(message.guild.emojiGöster(emojis.yes))
const userData = response.data
const userGender = userData.base.gender;
let text = userData.guilds.slice(0, 10).map(x => `Sunucu: ${x.serverName}\nİsim: ${x.displayName}\nCinsiyet: ${userGender ? userGender : "Belirsiz"}`).join("\n\n")
await button.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} ${member} Kullanıcısının Diğer Sunuculardaki (**${userData.guilds.length}**) Verisi Aşağıda Belirtilmiştir.

\`\`\`yml
${text}
\`\`\``)], ephemeral: true})
}
if(button.customId === "exit") {
await msg.edit({embeds: [embed.setDescription(`Kayıt İşlemi İptal Edildi!`)], components: []}).sil(15)
if(ayar.unregRoles.some(oku => member.roles.cache.has(oku))) {
await member.setNickname(`${ayar.defaultTag} ${ayar.unregName}`).catch(e => {});
}
}
})
collector.on("end", async () => {
if(msg) msg.edit({components: []})
if(ayar.unregRoles.some(oku => member.roles.cache.has(oku))) {
await member.setNickname(`${ayar.defaultTag} ${ayar.unregName}`).catch(e => {});
}
});
}
};
