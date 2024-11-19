const settings = require('../../../../Src/Settings/Settings.json')
const bannedTag = require('../../../../Src/Schemas/BannedTags');
const Discord = require('discord.js')
const setups = require('../../../../Src/Schemas/Setup');
const emojis = require('../../../../Src/Settings/emojiName.json')
const CommandPermissions = require('../../../../Src/Schemas/CommandPermissions')
module.exports = {
conf: {
aliases: ["yasaklı-tag", "yasakli-tag", "yasaklitag", "bannedtag","ytag"],
name: "yasaklıtag",
help: "yasaklıtag [ekle/sil] [tag] / [say/liste]",
category: "ustyetkili"
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: message.guild.id})
if(!ayar) return;
const Name = ["yasaklı-tag", "yasakli-tag", "yasaklitag", "bannedtag","ytag"]
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır.`}).sil(15)
return }
if (!args[0]) {
await message.reply({ content:`\`${settings.Moderation.prefix}yasaklıtag ekle/sil/liste [Tag]\` `}).sil(15)
return }
const data = await bannedTag.findOne({ guildID: settings.Moderation.guildID });
if (args[0] == "ekle") {
if (!args[1]) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:"Yasaklıya atmak istediğin tagı belirtmelisin."}).sil(15)
}
if (!data) {
let arr = []
arr.push(args[1])
const newData = new bannedTag({ guildID: settings.Moderation.guildID, taglar: arr })
newData.save().catch(e => console.log(e))
let üyeler = message.guild.members.cache.filter(x => {
return x.user.globalName && x.user.globalName.includes(args[1]) || x.user.username.includes(args[1]) && !ayar.bannedTagRoles.some(y => x.roles.cache.has(y))
})
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:"**" + args[1] + "** tagında " + üyeler.size + " kişi bulundu hepsine yasaklı tag permi veriyorum."})
await bannedTag.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $push: { tags: args[1] } }, { upsert: true });
üyeler.map(x => {
setTimeout(() => {
x.setNickname('Yasaklı Tag');
x.setRoles(ayar.bannedTagRoles[0]).catch(() => {})
}, 1000)
})
} else {
let taglar = data.taglar
if (taglar.includes(args[1])) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content:"Yasaklıya atmak istediğin tag veritabanında zaten yasaklı."}).sil(15)
}
data.taglar.push(args[1])
data.save().catch(e => console.log(e))
await bannedTag.findOneAndUpdate({ guildID: settings.Moderation.guildID }, { $push: { tags: args[1] } }, { upsert: true });
let üyeler = message.guild.members.cache.filter(x => {
return x.user.globalName && x.user.globalName.includes(args[1]) || x.user.username.includes(args[1]) && !ayar.bannedTagRoles.some(y => x.roles.cache.has(y))
})
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:"**" + args[1] + "** tagında " + üyeler.size + " kişi bulundu hepsine yasaklı tag permi veriyorum."})
üyeler.map(x => {
setTimeout(() => {
x.setNickname('Yasaklı Tag');
x.setRoles(ayar.bannedTagRoles[0]).catch(() => {})
}, 1000)
x.send({ content:`${message.guild.name} adlı sunucumuza olan erişiminiz engellendi! Sunucumuzda yasaklı olan bir simgeyi (`+ args[1] +`) isminizde taşımanızdan dolayıdır. Sunucuya erişim sağlamak için simgeyi (`+ args[1] +`) isminizden çıkartmanız gerekmektedir.\n\nSimgeyi (`+ args[1] +`) isminizden kaldırmanıza rağmen üstünüzde halen Yasaklı Tag rolü varsa sunucudan gir çık yapabilirsiniz veya sağ tarafta bulunan yetkililer ile iletişim kurabilirsiniz. **-Yönetim**\n\n__Sunucu Taglarımız__\n**${ayar.serverTag}**`}).catch(err => message.guild.channels.cache.get(ayar.chatChannel).send({ content:`${x} ${message.guild.name} adlı sunucumuza olan erişiminiz engellendi! Sunucumuzda yasaklı olan bir simgeyi (` + args[1] + `) isminizde taşımanızdan dolayıdır. Sunucuya erişim sağlamak için simgeyi (` + args[1] + `) isminizden çıkartmanız gerekmektedir.\n\nSimgeyi (` + args[1] + `) isminizden kaldırmanıza rağmen üstünüzde halen Yasaklı Tag rolü varsa sunucudan gir çık yapabilirsiniz veya sağ tarafta bulunan yetkililer ile iletişim kurabilirsiniz. **-Yönetim**\n\n__Sunucu Tagımız__\n**${ayar.serverTag}**`}).sil(15))
})

}
}

if (args[0] == "liste" && !args[1]) {
if (!data || data && !data.taglar.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content:"Sunucuda yasaklanmış tag bulunmamakta."}).sil(15)
}
let num = 1
let arrs = data.taglar.map(x => `\`${num++}.\` ${x} - (${message.guild.members.cache.filter(s => s.user.globalName && s.user.globalName.includes(x) || s.user.username.includes(x)  && !ayar.bannedTagRoles.some(y => s.roles.cache.has(y))).size || 0} üye)`)
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content: arrs.join("\n") })
}

if (args[0] == "liste" && args[1] == "üye") {
if (!args[2]) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content:"Üyelerini listelemek istediğin yasaklı tagı belirtmelisin."}).sil(15)
}
if (!data || data && !data.taglar.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content:"Veritabanında listelenecek yasaklı tag bulunmuyor."}).sil(15)
}
if (!data.taglar.includes(args[2])) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content:"**" + data.taglar.join(",") + "** tag(ları) sunucuda yasaklanmış durumdadır. Belirttiğin tag veritabanında bulunmuyor."}).sil(15)
}
await message.react(message.guild.emojiGöster(emojis.yes))
let text = `${message.guild.members.cache.filter(x => x.user.globalName && x.user.globalName.includes(args[2])|| x.user.username.includes(args[2])  && !ayar.bannedTagRoles.some(y => x.roles.cache.has(y))).map(x => `${message.guild.members.cache.get(x.id) ? message.guild.members.cache.get(x.id).toString() : x.user.username}`).join("\n")}`
const chunk = await client.splitMessage(text, 4060)
for (text of chunk) {
await message.channel.send({embeds: [embed.setDescription(`${text}`)]})
}
}

if (args[0] == "kaldır" || args[0] == "sil") {
if (!data || data && !data.taglar.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content:"Veritabanında kaldırılılacak yasaklı tag bulunmuyor."}).sil(15)
}
if (!data.taglar.includes(args[1])) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content:"Belirttiğin tag yasaklı tag listesinde bulunmuyor"}).sil(15)
}
let üyeler = message.guild.members.cache.filter(x => {
return x.user.globalName && x.user.globalName.includes(args[1]) || x.user.username.includes(args[1]) && !ayar.bannedTagRoles.some(y => s.roles.cache.has(y))
})
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content:"**" + args[1] + "** tagında " + üyeler.size + " kişi bulundu hepsineden yasaklı tag permini alıp sistemden tagı kaldırıyorum."})
data.taglar = data.taglar.filter((x) => !x.includes(args[1]));
data.save().catch(e => console.log(e))
üyeler.map(x => {
setTimeout(async () => {
x.setNickname(`${ayar.defaultTag} ${ayar.unregName}`);
x.setRoles(ayar.unregRoles[0]).catch(() => {})
}, 1000);
x.send({ content:`${message.guild.name}  adlı sunucumuza olan erişim engeliniz kalktı. İsminizden (`+ args[1] +`) sembolünü kaldırarak sunucumuza erişim hakkı kazandınız. Keyifli Sohbetler**-Yönetim**`}).catch(err =>  message.guild.channels.cache.get(ayar.chatChannel).send({ content:`${x} ${message.guild.name} adlı sunucumuza olan erişim engeliniz kalktı. İsminizden (`+ args[1] +`) sembolünü kaldırarak sunucumuza erişim hakkı kazandınız. Keyifli Sohbetler**-Yönetim**`}).sil(15))
})
}

if (args[0] == "kontrol") {
if (!data || data && !data.taglar.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return await message.reply({ content:"Veritabanında kontrol edilecek yasaklı tag bulunmuyor."}).sil(15)
}
data.taglar.forEach(x => {
let üye = message.guild.members.cache.filter(mems => {
return mems.user.globalName && mems.user.globalName.includes(x) || mems.user.username.includes(x) && !ayar.bannedTagRoles.some(y => mems.roles.cache.has(y))
}).map(x => x.id)
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({ content:`${x} Tagı Bulunup ${message.guild.roles.cache.get(ayar.bannedTagRoles[0])} Rolü Olmayan ${üye.length} Adet Kullanıcıya Rolü Veriyorum.`})
for (let i = 0; i < üye.length;i++) {
setTimeout(() => {
message.guild.members.cache.get(üye[i]).setRoles(ayar.bannedTagRoles[0]).catch(() => {})
}, (i + 1) * 1000)
}
})
}
}
}