const settings = require("../../../../Src/Settings/Settings.json");
const setups = require("../../../../Src/Schemas/Setup");
const Discord = require("discord.js");
const emojis = require("../../../../Src/Settings/emojiName.json");
const CommandPermissions = require("../../../../Src/Schemas/CommandPermissions");
module.exports = {
conf: {
aliases: ["tagges-info", "taggesinfo", "tagbilgi", "tag-bilgi", "tagsay", "tag-say"],
name: "tagges-info",
help: "tag-say",
category: "ustyetkili",
cooldown: 15
},
Cyrstal: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Name = ["tagges-info", "taggesinfo", "tagbilgi", "tag-bilgi", "tagsay", "tag-say"];
const Data = await CommandPermissions.findOne({ guildID: message.guild.id, Command: Name.map(x => x)});
if(!Data?.Permissions?.some(x => message.member.roles.cache.has(x) || x.includes(message.author.id)) && !ayar.seniorStaffRoles.some(x => message.member.roles.cache.has(x)) && !ayar.staffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({content: `Bu Komutu Kullanabilmek İçin Yeterli Yetkiniz Bulunmamaktadır.`}).sil(15)
return }
let page = 1;
let tag = args.slice(0).join(" ") || ayar.serverTag.map(x => x).join(", ")
const memberss = message.guild.members.cache.filter((member) => ayar.serverTag.some(x => member.user?.globalName?.includes(x) || member.user?.username?.includes(x)) && !member.user.bot);
let liste = memberss.map((member) => `${member} - \` ${member.user.globalName ? member.user.globalName : member.user.tag} \``) || `**${tag}** Tagını Almış Kullanıcı Bulunamadı.`
let tagges = message.guild.members.cache.filter(member => member.user?.username?.includes(tag) || member.user?.globalName?.includes(tag)).size
let tagges2 = message.guild.members.cache.filter(member => member.user?.username?.includes(tag) || member.user?.globalName?.includes(tag) && !ayar.manRoles.some(x => member.roles.cache.has(x)) && !ayar.womanRoles.some(x => member.roles.cache.has(x))).size
let tagges3 = message.guild.members.cache.filter(member => member.user?.username?.includes(tag) || member.user?.globalName?.includes(tag) && ayar.womanRoles.some(x => member.roles.cache.has(x))).size
let tagges4 = message.guild.members.cache.filter(member => member.user?.username?.includes(tag) || member.user?.globalName?.includes(tag) && ayar.manRoles.some(x => member.roles.cache.has(x))).size
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("önce")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1137686672709005322"),
new Discord.ButtonBuilder()
.setCustomId("kapat")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1137686658779709522"),
new Discord.ButtonBuilder()
.setCustomId("sonra")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1137686676278362204"),
);
const msg = await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.info)} **${message.guild.name}** Sunucusunda Toplam **${tagges}** Kişi **${tag}** Tagını Almıştır.

Toplam **${tagges2}** Kişi **${tag}** Tagını Almış Fakat Cinsiyet Rollerini Almamıştır.
Toplam **${tagges4}** Kişi **${tag}** Tagını Almış Ve **Erkek** Rolüne Sahiptir.
Toplam **${tagges3}** Kişi **${tag}** Tagını Almış Ve **Kadın** Rolüne Sahiptir.

Kişilerin Listesi Aşağıda Verilmiştir;
${liste.slice(page == 1 ? 0 : page * 40 - 40, page * 40).join('\n')}`)], components: [row]});
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
collector.on("collect", async (button) => {
if (liste.length < 0) return button.reply({content: `**${tag.join(", ")}** Tagını Almış Kullanıcı Bulunamadı.`, ephemeral: true})
if(button.customId === "sonra") {
await button.deferUpdate();
if (liste.slice((page + 1) * 40 - 40, (page + 1) * 40).length <= 0) return;
page += 1;
let tagsay = liste.slice(page == 1 ? 0 : page * 40 - 40, page * 40).join("\n");
await msg?.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} **${message.guild.name}** Sunucusunda Toplam **${tagges}** Kişi **${tag}** Tagını Almıştır.

Toplam **${tagges2}** Kişi **${tag}** Tagını Almış Fakat Cinsiyet Rollerini Almamıştır.
Toplam **${tagges4}** Kişi **${tag}** Tagını Almış Ve **Erkek** Rolüne Sahiptir.
Toplam **${tagges3}** Kişi **${tag}** Tagını Almış Ve **Kadın** Rolüne Sahiptir.

Kişilerin Listesi Aşağıda Verilmiştir;
${tagsay}`)] });
}
if(button.customId === "önce") {
await button.deferUpdate();
if (liste.slice((page - 1) * 40 - 40, (page - 1) * 40).length <= 0) return;
page -= 1;
let tagsay = liste.slice(page == 1 ? 0 : page * 40 - 40, page * 40).join("\n");
await msg?.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} **${message.guild.name}** Sunucusunda Toplam **${tagges}** Kişi **${tag}** Tagını Almıştır.

Toplam **${tagges2}** Kişi **${tag}** Tagını Almış Fakat Cinsiyet Rollerini Almamıştır.
Toplam **${tagges4}** Kişi **${tag}** Tagını Almış Ve **Erkek** Rolüne Sahiptir.
Toplam **${tagges3}** Kişi **${tag}** Tagını Almış Ve **Kadın** Rolüne Sahiptir.

Kişilerin Listesi Aşağıda Verilmiştir;
${tagsay}`)] });
}
if(button.customId === "kapat") {
await button.deferUpdate();
if(msg) msg?.delete().catch(e => {})
}
})
}
}