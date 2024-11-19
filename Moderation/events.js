const settings = require("../Src/Settings/Settings.json")
const emojis = require("../Src/Settings/emojiName.json")
const MessageUser = require("../Src/Schemas/MessageUsers")
const MessageUserParents = require("../Src/Schemas/MessageUserParents")
const Inviter = require("../Src/Schemas/İnvited")
const VoiceUser = require("../Src/Schemas/VoiceUsers")
const VoiceGuild = require("../Src/Schemas/VoiceGuilds")
const BoosterName = require("../Src/Schemas/Booster")
const VoiceUserParents = require("../Src/Schemas/VoiceUserParents")
const VoiceGuildChannels = require("../Src/Schemas/VoiceGuildChannels")
const VoiceUserChannels = require("../Src/Schemas/VoiceUserChannels")
const voiceJoined = require("../Src/Schemas/VoiceJoinedAts")
const CameraJoined = require("../Src/Schemas/CameraJoinedAts")
const MessageGuild = require("../Src/Schemas/MessageGuilds")
const ForceBans = require("../Src/Schemas/ForceBans")
const RankSystem = require("../Src/Schemas/RankSystem")
const MessageUserChannels = require("../Src/Schemas/MessageUserChannels")
const MessageGuildChannels = require("../Src/Schemas/MessageGuildChannels")
const StreamJoined = require("../Src/Schemas/StreamJoinedAts")
const StreamUser = require("../Src/Schemas/StreamUsers")
const CameraUser = require("../Src/Schemas/CameraUsers")
const Discord = require("discord.js")
const setups = require("../Src/Schemas/Setup")
const Dolars = require("../Src/Schemas/Dolars")
const setup = require("../Src/Schemas/UserSetups")
const İnviteMembers = require("../Src/Schemas/İnviteMembers")
const path = require('path');
const fs = require('fs');
const ChatMessages = require("../Src/Schemas/iltifatDB")
const Canvas = require('@napi-rs/canvas');
const RankDB = require("../Src/Schemas/RankSystem")
const Puans = require("../Src/Schemas/Puans")
const LevelSystem = require("../Src/Schemas/LevelSystem")
const client = global.client;
const nums = new Map();
const moment = require("moment");
const VoiceLimit = require("../Src/Schemas/VoiceLimit")
const advert = require("../Src/Schemas/AdvertDB")
const ChatFriends = require("../Src/Schemas/ChatFriends")
const VoiceFriends = require("../Src/Schemas/VoiceFriends")
const SnipeDB = require("../Src/Schemas/Snipes")
const RoleLogs = require("../Src/Schemas/RoleLogs")
const Penalties = require("../Src/Schemas/Penalties")
const PenaltiesPoints = require("../Src/Schemas/PenaltyPoints")
const Voiceİnfo = require("../Src/Schemas/Voiceİnfo")
const PrivateCommands = require("../Src/Schemas/PrivateCommands")
const engelDB = require("../Src/Schemas/UserEngel")
const Users = require("../Src/Schemas/UsersDB")
const PrivateRoomsGuild = require("../Src/Schemas/PrivateRoomsGuild")
const PrivateRoomsUser = require("../Src/Schemas/PrivateRoomsUser")
const Afk = require("../Src/Schemas/Afk")
const bannedTag = require("../Src/Schemas/BannedTags")
const StreamerDB = require("../Src/Schemas/Streamer")
const ms = require("ms")
const Menu = require("../Src/Schemas/Menüs")
const UserVoice = require("../Src/Schemas/UserVoice")
const ScLimit = new Map();
let streamData = new Map()
let cameraData = new Map()
let bzaman = new Map()
let rzaman = new Map()
const voiceAfks = new Map();
const streamerAfks = new Map();
const sure = "10m"
const streamersure = "15m"
const Canvas2 = require('canvas')
Canvas2.registerFont(`../Src/Fonts/theboldfont.ttf`, { family: "Bold" });
Canvas2.registerFont(`../Src/Fonts/SketchMatch.ttf`, { family: "SketchMatch" });
Canvas2.registerFont(`../Src/Fonts/LuckiestGuy-Regular.ttf`, { family: "luckiest guy" });
Canvas2.registerFont(`../Src/Fonts/KeepCalm-Medium.ttf`, { family: "KeepCalm" });
let iltifatSayi = 0;
const FriendsVoiceStates = new Discord.Collection()
class BotEvents {
static EventsHandler = {
[Discord.Events.MessageCreate]: async (message, type) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
if (!message || !message.author) return;
if (message.author.bot) return;
if (message.guild && message.guild.id != settings.Moderation.guildID) return;
if(message.channel.type == Discord.ChannelType.DM) return;
if (type == "stat") {
if (message.content.startsWith(settings.Moderation.prefix) || message.content.startsWith(settings.Guard.prefix)) return;
await MessageUserChannels.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true })
await MessageSchemasHandler(settings.Moderation.guildID, message.author.id, message.channel, message)
const Messages = message.reference && message.reference.messageId ? message.channel.messages.cache.get(message.reference && message.reference.messageId) : null;
if (Messages) {
const UserIDs = Messages.author.id;
await ChatFriends.updateOne({ guildID: settings.Moderation.guildID, userID: UserIDs, repliedUserID: message.author.id }, { $inc: { replyLength: 1 } }, { new: true, upsert: true })
}
await StaffMessageHandler(settings.Moderation.guildID, message.author.id, message)
} else if (type == "afk") {
const data = await Afk.findOne({ guildID: settings.Moderation.guildID, userID: message.author.id }) || []
if (data.reason) {
if (message.member.displayName.includes("[AFK]") && message.member.manageable) await message.member.setNickname(message.member.displayName.replace("[AFK]", "")).catch(e => {})
await message.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} ${message.author} Adlı Kullanıcı **Afk** Modundan Çıktı. Tekrar Hoşgeldin!\nKullanıcı <t:${Math.floor(data.date / 1000)}> Tarihinden Beri **${data.reason}** Sebebiyle **AFK** Modundaydı!`).setAuthor({ name: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true }) }).setFooter({ text: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }).setThumbnail(message.author.displayAvatarURL({ dynamic: true }))] }).sil(15)
await Afk.updateOne({ guildID: settings.Moderation.guildID, userID: message.author.id }, { $set: { reason: null, date: null } })
return }
const member = message.mentions.members.first();
if (!member) return;
const afkData = await Afk.findOne({ guildID: settings.Moderation.guildID, userID: member.id }) || [];
if (afkData.reason) {
await message.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.info)} ${message.author} Etiketlediğiniz Kullanıcı **Afk** Modunda! Kullanıcı <t:${Math.floor(afkData.date / 1000)}> Tarihinden Beri **${afkData.reason}** Sebebiyle **AFK** Modunda!`).setAuthor({ name: member.displayName, iconURL: member.user.displayAvatarURL({ dynamic: true }) }).setFooter({ text: `${member.displayName}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) }).setThumbnail(member.user.displayAvatarURL({ dynamic: true }))] }).sil(15)
return }
} else if (type == "private") {
let data = await PrivateCommands.find({ guildID: settings.Moderation.guildID }) || [];
let ozelkomutlar = data;
let yazilanKomut = message.content.split(" ")[0];
let args = message.content.split(" ").slice(1);
yazilanKomut = yazilanKomut.slice(settings.Moderation.prefix.some(x => x.length));
let komut = ozelkomutlar.find(x => x.komutAd.toLowerCase() === yazilanKomut);
if (!komut) return;
const channel = await client.kanalBul("rol-log")
let verilenRol = message.guild.roles.cache.some(rol => komut.VerilecekRol.includes(rol.id));
if (!verilenRol) return message.react(message.guild.emojiGöster(emojis.no)), message.reply({ content: `**${komut.komutAd}** adlı komutun verilecek rolü bulunamadı.` }).sil(15);
let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (message.member.roles.cache.some(rol => komut.YetkiliRol.includes(rol.id)) || message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
if (!üye) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content: `Bir Kullanıcı Belirtmelisin.` }).sil(15)
return
}
if(üye.roles.highest.position >= message.member.roles.highest.position) {
await message.react(message.guild.emojiGöster(emojis.no))
await message.reply({ content: `Belirttigin Kullanıcı Senden Üst Yada Aynı Pozisyonda!` }).sil(15)
return
}
if (!komut.VerilecekRol.some(rol => üye.roles.cache.has(rol))) {
await üye.addRoles(komut.VerilecekRol).catch(e => { })
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla ${üye} Kişisine **${komut.VerilecekRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x).name : x)}** Rolünü <t:${String(Date.now()).slice(0, 10)}> Tarihinde Verdim.`)] })
await channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.member} Yetkilisi Tarafından ${üye} Kişisine **${komut.VerilecekRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x).name : x)}** Rolü <t:${String(Date.now()).slice(0, 10)}> Tarihinde Verildi.`)] })
} else {
await üye.removeRoles(komut.VerilecekRol).catch(e => { })
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla ${üye} Kişisinden **${komut.VerilecekRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x).name : x)}** Rolünü <t:${String(Date.now()).slice(0, 10)}> Tarihinde Aldım.`)] })
await channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.member} Yetkilisi Tarafından ${üye} Kişisinden **${komut.VerilecekRol.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x).name : x)}** Rolü <t:${String(Date.now()).slice(0, 10)}> Tarihinde Alındı.`)] })
}
}
} else if (type == "other") {
if (message.mentions.members.first()) {
let engel = await engelDB.findOne({ guildID: message.guild.id, userID: message.mentions.members.first().id })
if (engel) {
if (engel.veri.includes(message.member.id)) {
await message.delete().catch(e => { })
await message.channel.send({ content: `*${message.member} Bu Kullanıcı Tarafından Engellenmişsin!*` }).sil(15)
}
}
}
let kanallar = ["tweet", "tweet-chat"]
if (kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) {
if (message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && ayar.ownerRoles.some(x => message.member.roles.cache.has(x)) && ayar.roleAddRoles.some(r => message.member.roles.cache.has(r))) return;
if (!message.content.toLowerCase().includes(`${settings.Moderation.prefix}tweet`)) return message.delete().catch((e) => { })
}
let kanallars = ["selfie", "günün-fotoğrafı", "günün-fotosu", "fotosu", "fotoğrafı", "fotoğraf", "selfie-chat", "haftanın-fotoğrafı", "haftanın-fotosu", "haftanın-foto", "haftanın-fotosu", "haftanın-fotoğrafı", "fotoğraf-chat", "fotosu-chat", "selfie-chat"]
if (kanallars.some((x) => message.channel.name.toLowerCase().includes(x))) {
if (!message.attachments.first()) {
if (message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && ayar.ownerRoles.some(x => message.member.roles.cache.has(x)) && ayar.roleAddRoles.some(r => message.member.roles.cache.has(r))) return;
await message.delete().catch(e => { })
} else {
const emojiss = message.guild.emojis.cache.array();
shuffleArray(emojiss);
const emojisToAdd = emojiss.slice(0, 10);
try {
for (const emoji of emojisToAdd) {
await message.react(emoji);
}
} catch (e) {
}
}
}
let kanallarss = ["emoji", "emoji-ekle", "emoji-yükle"]
if (kanallarss.some((x) => message.channel.name.toLowerCase().includes(x))) {
if (!message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.ownerRoles.some(x => message.member.roles.cache.has(x)) && !ayar.roleAddRoles.some(s => message.member.roles.cache.has(s))) return;
if (!message.content.length) return;
if (message.content.split(" ").length >= 2) return;
let parsed = parseEmoji(message.content);
if (parsed.id) {
let ext = parsed.animated ? ".gif" : ".png";
let url = `https://cdn.discordapp.com/emojis/${parsed.id}${ext}`;
const emojisayisi = message.guild.emojis.cache.size
const name = `dark_${emojisayisi + 1}`
var emoji = await message.guild.emojis.create({ name: name, attachment: url }).catch(err => { return message.reply({ content: `**Bir Hata Oluştu!** ${err}` }) })
message.reply({ content: `${emoji} *Emoji Sunucuya Eklendi!*` })
}
function parseEmoji(text) {
if (text.includes('%')) text = decodeURIComponent(text);
if (!text.includes(':')) return { animated: false, name: text, id: undefined };
const match = text.match(/<?(?:(a):)?(\w{1,32}):(\d{17,19})?>?/);
return match && { animated: Boolean(match[1]), name: match[2], id: match[3] };
}
}
let kanallarsss = ["sticker", "sticker-ekle", "sticker-yükle"]
if (kanallarsss.some((x) => message.channel.name.toLowerCase().includes(x))) {
if (message.stickers.first()) {
if (!message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.ownerRoles.some(x => message.member.roles.cache.has(x)) && !ayar.roleAddRoles.some(s => message.member.roles.cache.has(s))) return;
const sticker = message.stickers.first();
let url = sticker.url;
if (!url) return;
const stickersayisi = message.guild.stickers.cache.size
const name = `sticker_${stickersayisi + 1}`
try {
await message.guild.stickers.create({ name: name, description: sticker.description, tags: sticker.tags, file: url, reason: `Sticker Eklendi ${message.member.user.username} Tarafından!` });
await message.reply({ content: `**${name}** *Adlı Sticker Sunucuya Eklendi!*` })
} catch (error) {
await message.reply({ content: `**Bir Hata Olustu!** ${error}` })
}
}
}
if (message.content.toLowerCase() === "tag" || message.content.toLowerCase() === "!tag" || message.content.toLowerCase() === ".tag") {
if (ayar.tagSystem == false) return;
const tags = ayar.serverTag.join(" - ")
await message.reply({ content: `${tags}` }).catch(e => { });
}
if (message.content.toLowerCase() == "selamin aleyküm" || message.content.toLowerCase() == "selamin aleykum" || message.content.toLowerCase() == "selamın aleyküm" || message.content.toLowerCase() == "selamın aleykum" || message.content.toLowerCase() == "selam" || message.content.toLowerCase() == "selamun aleykum" || message.content.toLowerCase() == "sea" || message.content.toLowerCase() == "selamün aleykum" || message.content.toLowerCase() == "selamün aleyküm" || message.content.toLowerCase() == "sa" || message.content.toLowerCase == "s.a") {
if (message.author.bot) return;
await message.reply({ content: `${message.member}, *Aleyküm Selam Hoşgeldin.*` }).catch(e => { });
}
} else if(type == "chat") {
if (message.content.startsWith(settings.Moderation.prefix) || message.content.startsWith(settings.Guard.prefix)) return;
let Data = await ChatMessages.findOne({ guildID: settings.Moderation.guildID })
let kelimeler = ["Yaşanılacak en güzel mevsim sensin.", "Sıradanlaşmış her şeyi, ne çok güzelleştiriyorsun.", "Gönlüm bir şehir ise o şehrin tüm sokakları sana çıkar.", "Birilerinin benim için ettiğinin en büyük kanıtı seninle karşılaşmam.", "Denize kıyısı olan şehrin huzuru birikmiş yüzüne.", "Ben çoktan şairdim ama senin gibi şiiri ilk defa dinliyorum.", "Gece yatağa yattığımda aklımda kalan tek gerçek şey sen oluyorsun.", "Ne tatlısın sen öyle. Akşam gel de iki bira içelim.", "Bir gamzen var sanki cennette bir çukur.", "Gecemi aydınlatan yıldızımsın.", "Ponçik burnundan ısırırım seni", "Bu dünyanın 8. harikası olma ihtimalin?", "fıstık naber?", "Dilek tutman için yıldızların kayması mı gerekiyor illa ki? Gönlüm gönlüne kaydı yetmez mi?", "Süt içiyorum yarım yağlı, mutluluğum sana bağlı.", "Müsaitsen aklım bu gece sende kalacak.", "Gemim olsa ne yazar liman sen olmadıktan sonra...", "Gözlerimi senden alamıyorum çünkü benim tüm dünyam sensin.", "Sabahları görmek istediğim ilk şey sensin.", "Mutluluk ne diye sorsalar, cevabı gülüşünde ve o sıcak bakışında arardım.", "Hayatım ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.", "Bir adada mahsur kalmak isteyeceğim kişiler listemde en üst sırada sen varsın.", "Sesini duymaktan- hikayelerini dinlemekten asla bıkmayacağım. Konuşmaktan en çok zevk aldığım kişi sensin.", "Üzerinde pijama olsa bile, nasıl oluyor da her zaman bu kadar güzel görünüyorsun? Merhaba, neden bu kadar güzel olduğunu bilmek istiyorum.", "Çok yorulmuş olmalısın. Bütün gün aklımda dolaşıp durdun.", "Çocukluk yapsan da gönlüme senin için salıncak mı kursam?", "Sen birazcık huzur aradığımda gitmekten en çok hoşlandığım yersin.", "Hangi çiçek anlatır güzelliğini? Hangi mevsime sığar senin adın. Hiçbir şey yeterli değil senin güzelliğine erişmeye. Sen eşsizsin...", "Rotanızı geçen her geminin ışığıyla değil, yıldızlara göre ayarlayın.", "Telaşımı hoş gör, ıslandığım ilk yağmursun.", "Gülüşün ne güzel öyle, cumhuriyetin bir gelişi gibi sanki", "Ne yaparsan yap, sen her zaman çok doğalsın.", "Sen, tanıdığım en cesur insansın. Keşke senin gibi olabilseydim.", "Sen tanıdığım en tatlı insansın.", "Seninle konuşmak, ferah bir nefes almak gibidir.", "Bugün harika iş çıkardın. Seninle çalışmayı çok seviyorum.", "Enerjinin bulaşıcı olduğunu kendi gözlerimle gördüm. Sen mükemmel bir insansın.", "O kadar nazik ve anlayışlısın ki etrafındaki herkesi daha iyi bir insan yapmayı başarıyorsun.", "En kötü durumları bile eğlenceli bir hale dönüştürmene bayılıyorum.", "Seninle birlikteyken, her şeyin daha iyi olacağını biliyorum.", "Seninle birlikteyken, her şey daha kolay hale geliyor.", "Seninle birlikteyken, her şey daha iyi oluyor.", "Seninle birlikteyken, her şey daha güzel oluyor.", "Seninle birlikteyken, her şey daha eğlenceli oluyor.", "Sen yeri doldurulamaz bir insansın. Senin gibi birini bulmak imkansız.", "Seninle birlikteyken, her şey daha anlamlı hale geliyor.", "Senin gibi bir arkadaşımın olması özel hissetmeme neden oluyor.", "Beni hiçbir zaman hayal kırıklığına uğratmıyorsun. Ne olursa olsun sana güvenebileceğimi biliyorum.", "Senin yanında olduğum zaman kendimi çok şanslı ve özel hissediyorum.", "Makyaj doğal güzelliğini kapatıyor resmen...", "Saçların denizin huzurunu yansıtıyor.", "Senin gülümsemen benim en derin mutluluğum.", "Harika bir tarzın var. Tarzına sahip olmayı çok isterdim.", "Sen herkesin hayatında olması gereken bir insansın.", "Masallardaki prensesin şekil bulmuş halisin.", "Şarkılarımın, şiirlerimin ilham kaynağısın.", "Yanında hissetmediğim güven ve huzuru hissediyorum.", "Bu kadar tatlı olmayı nasıl başarıyorsun?", "Gözlerin en güzel ışık kaynağım.", "En güzel iyikimsin.", "Yaşadığım tüm kötülüklere sen karşıma alıp izleyerek baş edebilirim.", "Çiçekleri kıskandıran bir güzelliğe sahipsin.", "Sen benim tüm imkansızlıklarıma rağmen hayattaki en değerlimsin", "Sen benim en güzel manzaramsın.", "Enerjin içimi aydınlatıyor.", "Seninle olmak benim için bir ayrıcalık.", "Seninle olmak benim için bir zevk.", "Seninle olmak benim için bir huzur.", "Seninle olmak benim için bir mutluluk.", "Seninle olmak benim için bir keyif.", "Seninle olmak benim için bir neşe.", "Seninle olmak benim için bir sevinç.", "Seninle olmak benim için bir coşku.", "Seninle olmak benim için bir heyecan.", "Seninle olmak benim için bir şans.", "Seninle olmak benim için bir aşk.", "Seninle olmak benim için bir tutku."]
if(!Data) Data = new ChatMessages({ guildID: message.guild.id, sözler: kelimeler.map(x => x) }).save();
let iltifatlar = Data ? Data.sözler : kelimeler;
if (message.channel.id === ayar.chatChannel && !message.author.bot) {
iltifatSayi++;
if (iltifatSayi >= 100) {
iltifatSayi = 0;
await message.reply({ content: `**${iltifatlar.random()}**`}).catch(e => {});
}
}
}
},
[Discord.Events.UserUpdate]: async (oldMember, newMember, type) => {
let guild = await (client.guilds.cache.get(settings.Moderation.guildID))
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
if (!guild) return;
if(!newMember) return;
if(!oldMember) return;
if(type == "tag") {
if (ayar.tagSystem == false) return;
let uye = guild.members.cache.get(oldMember.id)
let embed = new Discord.EmbedBuilder().setColor('Random').setFooter({ text: `${ayar.botFooter ? ayar.botFooter : `${oldMember.guild.name}`}` }).setTimestamp()
let tagges = guild.members.cache.filter(s => ayar.serverTag.some(a => s.user.globalName && s.user.globalName.includes(a))).size
const log = await client.kanalBul("tag-log");
const tags = ayar.serverTag.join(" - ")
if (oldMember.globalName && newMember.globalName && oldMember.globalName == newMember.globalName) return;
if (oldMember.globalName && newMember.globalName && !ayar.serverTag.some(x => oldMember.globalName.includes(x)) && ayar.serverTag.some(x => newMember.globalName.includes(x))) {
await uye.addRoles(ayar.tagRoles).catch(e => { })
if (uye.displayName.includes(ayar.defaultTag) && uye.manageable) await uye.setNickname(uye.displayName.replace(ayar.defaultTag, ayar.nameTag))
await log.send({ embeds: [embed.setDescription(`${guild.emojiGöster(emojis.face)} ${newMember} Adlı Kullanıcı Tagımızı Aldığı İçin Rolü Verildi.\n\n\`\`\`yml\nTagımız: ${tags}\nTaglı Üye Sayısı: ${tagges}\n\`\`\``)] })
} else if (oldMember.globalName && newMember.globalName && ayar.serverTag.some(x => oldMember.globalName.includes(x)) && !ayar.serverTag.some(x => newMember.globalName.includes(x))) {
const data = await Users.findOne({ _id: oldMember.id })
if (data && data.Tagged == true && data.Staff == true) {
const StaffAdmin = data?.StaffGiveAdmin;
const TagAdmin = data?.TaggedGiveAdmin;
ayar.staffRoles.map(async (s) => { await uye.removeRoles(s).catch(e => { }) })
ayar.staffStartRoles.map(async (s) => { await uye.removeRoles(s).catch(e => { }) })
await Users.updateOne({ _id: oldMember.id }, { $set: { Tagged: false, Staff: false, StaffGiveAdmin: "", TaggedGiveAdmin: "" } }).catch(e => { })
await Users.updateOne({ _id: StaffAdmin }, {$pull: { "Staffs": { id: oldMember.id } } }, { upsert: true }).exec();
await Users.updateOne({ _id: TagAdmin }, {$pull: { "Taggeds": { id: oldMember.id } } }, { upsert: true }).exec();
const ytlog = await client.kanalBul("yetki-bırakan-log");
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel(""+oldMember.username+" İle İlgilen.")
.setStyle(Discord.ButtonStyle.Primary)
.setEmoji("1246934421915832390")
.setCustomId(`ilgilen-${oldMember.id}`))
const msg = await ytlog.send({ embeds: [embed.setDescription(`${guild.emojiGöster(emojis.face)} ${newMember} Adlı Kullanıcı Tagımızı Çıkardığı İçin Rolü Alındı.\n\n\`\`\`yml\nTagımız: ${tags}\nTaglı Üye Sayısı: ${tagges}\n\`\`\``)], components: [row] })
const collector = msg.createMessageComponentCollector({})
collector.on('collect', async i => {
if (i.customId == `ilgilen-${oldMember.id}`) {
await i.deferUpdate()
row.components[0].setLabel(""+i.member.user.username+" İlgileniyor.")
row.components[0].setDisabled(true)
await msg.edit({components: [row]})
}
})
collector.on('end', async i => {
row.components[0].setLabel("Kimse İlgilenmiyor.")
await msg.edit({components: [row]})
})
}
if (uye.displayName.includes(ayar.nameTag) && uye.manageable) await uye.setNickname(uye.displayName.replace(ayar.nameTag, ayar.defaultTag)).catch(e => { });
await uye.removeRoles(ayar.tagRoles).catch(e => { })
await log.send({ embeds: [embed.setDescription(`${guild.emojiGöster(emojis.face)} ${newMember} Adlı Kullanıcı Tagımızı Çıkardığı İçin Rolü Alındı.\n\n\`\`\`yml\nTagımız: ${tags}\nTaglı Üye Sayısı: ${tagges}\n\`\`\``)] })
}
} else if (type == "bannedtag") {
const member = guild.members.cache.get(oldMember.id);
if (!member) return;
const res = await bannedTag.findOne({ guildID: settings.Moderation.guildID });
if (!res) return;
res.taglar.forEach((x) => {
if (oldMember.globalName && !oldMember.globalName.includes(x) && newMember.globalName && newMember.globalName.includes(x)) {
member.guild.members.cache.get(member.id).setRoles(ayar.bannedTagRoles).catch(e => {})
member.setNickname('Yasaklı Tag').catch(e => {});
member.send({ content:`${guild.name} adlı sunucumuza olan erişiminiz engellendi! Sunucumuzda yasaklı olan bir simgeyi (${x}) isminizde taşımanızdan dolayıdır. Sunucuya erişim sağlamak için simgeyi (${x}) isminizden çıkartmanız gerekmektedir.\n\nSimgeyi (${x}) isminizden kaldırmanıza rağmen üstünüzde halen Yasaklı Tag rolü varsa sunucudan gir çık yapabilirsiniz veya sağ tarafta bulunan yetkililer ile iletişim kurabilirsiniz. **-Yönetim**\n\n__Sunucu Tagımız__\n**${ayar.serverTag.map(x => `${x}`).join(" ")}**`}).catch(e => {});
} else if(oldMember.username && !oldMember.username.includes(x) && newMember.username && newMember.username.includes(x)) {
member.guild.members.cache.get(member.id).setRoles(ayar.bannedTagRoles).catch(e => {})
member.setNickname('Yasaklı Tag').catch(e => {});
member.send({ content:`${guild.name} adlı sunucumuza olan erişiminiz engellendi! Sunucumuzda yasaklı olan bir simgeyi (${x}) isminizde taşımanızdan dolayıdır. Sunucuya erişim sağlamak için simgeyi (${x}) isminizden çıkartmanız gerekmektedir.\n\nSimgeyi (${x}) isminizden kaldırmanıza rağmen üstünüzde halen Yasaklı Tag rolü varsa sunucudan gir çık yapabilirsiniz veya sağ tarafta bulunan yetkililer ile iletişim kurabilirsiniz. **-Yönetim**\n\n__Sunucu Tagımız__\n**${ayar.serverTag.map(x => `${x}`).join(" ")}**`}).catch(e => {});
} else if (oldMember.globalName && oldMember.globalName.includes(x) && newMember.globalName && !newMember.globalName.includes(x)) {
member.guild.members.cache.get(member.id).setRoles(ayar.unregRoles).catch(e => {})
member.setNickname(`${ayar.defaultTag} ${ayar.unregName}`).catch(e => {});
member.send({ content:`${guild.name} adlı sunucumuza olan erişim engeliniz kalktı. İsminizden (${x}) sembolünü kaldırarak sunucumuza erişim hakkı kazandınız. Keyifli Sohbetler**-Yönetim**`}).catch(e => {});
} else if(oldMember.username && oldMember.username.includes(x) && newMember.username && !newMember.username.includes(x)) {
member.guild.members.cache.get(member.id).setRoles(ayar.unregRoles).catch(e => {})
member.setNickname(`${ayar.defaultTag} ${ayar.unregName}`).catch(e => {});
member.send({ content:`${guild.name} adlı sunucumuza olan erişim engeliniz kalktı. İsminizden (${x}) sembolünü kaldırarak sunucumuza erişim hakkı kazandınız. Keyifli Sohbetler**-Yönetim**`}).catch(e => {});
}
})
}
},
[Discord.Events.VoiceStateUpdate]: async (oldState, newState, type) => {
if (oldState.member && oldState.member.user.bot) return;
if (newState.member && newState.member.user.bot) return;
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
if (type == "stat") {
if (!oldState.channelId && newState.channelId) await voiceJoined.updateOne({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
let joinedAtData = await voiceJoined.findOne({ userID: oldState.id });
if (!joinedAtData) {
await voiceJoined.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true, new: true })
joinedAtData = await voiceJoined.findOne({ userID: oldState.id });
}
const data = Date.now() - joinedAtData.date;
if (!oldState) return;
if (!oldState.id || !oldState.channelId || !oldState.channel || !oldState.guild || !oldState.guild.id) return;
if (oldState.channelId && !newState.channelId) {
await VoiceSchemasHandler(settings.Moderation.guildID, oldState, oldState.id, oldState.channel, data);
await voiceJoined.deleteOne({ userID: oldState.id });
} else if (oldState.channelId && newState.channelId) {
await VoiceSchemasHandler(settings.Moderation.guildID, oldState, oldState.id, oldState.channel, data);
await voiceJoined.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}
if (oldState.channelId && !oldState.streaming && newState.channelId && newState.streaming) await StreamJoined.updateOne({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
let streamJoinedAtData = await StreamJoined.findOne({ userID: oldState.id });
if (!streamJoinedAtData) {
await StreamJoined.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true, new: true })
streamJoinedAtData = await StreamJoined.findOne({ userID: oldState.id });
}
const ydata = Date.now() - streamJoinedAtData.date;
if (!oldState) return;
if (oldState.streaming && !newState.streaming) {
await StreamSchemasHandler(settings.Moderation.guildID, oldState, oldState.id, oldState.channel, ydata);
await StreamJoined.deleteOne({ userID: oldState.id });
} else if (oldState.channelId && oldState.streaming && newState.channelId && newState.streaming) {
await StreamSchemasHandler(settings.Moderation.guildID, oldState, oldState.id, oldState.channel, ydata);
await StreamJoined.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}
if (oldState.channelId && !oldState.selfVideo && newState.channelId && newState.selfVideo) await CameraJoined.updateOne({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
let cameraJoinedAtData = await CameraJoined.findOne({ userID: oldState.id });
if (!cameraJoinedAtData) {
await CameraJoined.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true, new: true })
cameraJoinedAtData = await CameraJoined.findOne({ userID: oldState.id });
}
const cdata = Date.now() - cameraJoinedAtData.date;
if (!oldState) return;
if (oldState.selfVideo && !newState.selfVideo) {
await CameraSchemasHandler(settings.Moderation.guildID, oldState, oldState.id, oldState.channel, cdata);
await CameraJoined.deleteOne({ userID: oldState.id });
} else if (oldState.selfVideo && newState.selfVideo) {
await CameraSchemasHandler(settings.Moderation.guildID, oldState, oldState.id, oldState.channel, cdata);
await CameraJoined.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}
} else if (type == "privateroom") {
let datas = await PrivateRoomsGuild.findOne({ guildId: newState.guild.id });
if (!datas) return;
if (!newState || !newState.member) return;
if (datas.private_voices.mode === false) return;
let user = await PrivateRoomsUser.findOne({guildId: settings.Moderation.guildID, userId: newState?.member?.user?.id });
if (!user) {
await PrivateRoomsUser.create({guildId: settings.Moderation.guildID, userId: newState?.member?.user?.id })
}
const channels = await client.kanalBul("özeloda-log")
let channelId = await datas.private_voices.channelId;
let categoryId = await datas.private_voices.categoryId;
if (oldState?.channelId !== datas.private_voices.channelId && oldState?.channel?.parentId == datas.private_voices.categoryId && oldState?.channel?.members?.size === 0) {
if (oldState?.channel?.parentId != datas.private_voices.categoryId) return;
if (!newState.guild.channels.cache.get(oldState.channelId)) return;
const embed = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: newState.member.displayName, iconURL: newState.member.displayAvatarURL({ dynamic: true }) })
.setThumbnail(newState.member.displayAvatarURL({ dynamic: true }))
.setDescription(`${newState.member} Adlı Kullanıcı Özel Odadan Çıktığı İçin Oda Silindi.\n\nOda Sahibi: ${newState.member}\nOda İsmi: ${oldState.channel.name}\nOda Panel: **${oldState.guild.channels.cache.get(user.private_voices.textId) ? oldState.guild.channels.cache.get(user.private_voices.textId).name : "Yok"}**\nOda Oluşturulma Tarihi: <t:${Math.floor(oldState.channel.createdTimestamp / 1000)}:R>\nOda Silinme Tarihi: <t:${String(Date.now()).slice(0, 10)}:R>\nOdanın Silinme Nedeni: Özel Odada Kimse Bulunmadığı İçin Silindi.`)
.setFooter({ text: `${newState.member.displayName}`, iconURL: newState.member.displayAvatarURL({ dynamic: true }) })
await channels.send({ embeds: [embed] })
const texts = await oldState.guild.channels.cache.get(user.private_voices.textId)
await texts?.delete({ reason: "Özel Odada Kimse Bulunmadığını Için Silindi." }).catch(e => { })
await oldState?.channel?.delete({ reason: "Özel Odada Kimse Bulunmadığı İçin Silindi." }).catch(e => { })
await PrivateRoomsUser.updateOne({guildId: settings.Moderation.guildID, userId: newState?.member?.user?.id }, { $set: { 'private_voices.voiceId': null, 'private_voices.lock': true, 'private_voices.textId': null }, }, { upsert: true })
}
if (datas?.private_voices?.mode === true) {
if (newState?.channel?.id == channelId) {
if (!ayar.manRoles.some(x => newState.member.roles.cache.has(x)) && !ayar.womanRoles.some(x => newState.member.roles.cache.has(x))) return newState.member.voice.disconnect().catch(e => { })
await newState.guild.channels.create({
name: `${newState.member.displayName}`,
type: Discord.ChannelType.GuildVoice,
userLimit: 1,
parent: categoryId,
permissionOverwrites: [{ id: newState.member.user.id, allow: [Discord.PermissionFlagsBits.UseVAD, Discord.PermissionFlagsBits.PrioritySpeaker, Discord.PermissionFlagsBits.RequestToSpeak, Discord.PermissionFlagsBits.Stream, Discord.PermissionFlagsBits.Speak, Discord.PermissionFlagsBits.Connect, Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.MuteMembers, Discord.PermissionFlagsBits.DeafenMembers] }, { id: newState.guild.id, deny: [Discord.PermissionFlagsBits.Connect, Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel] }, { id: ayar.unregRoles[0], deny: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.Connect] }, { id: ayar.jailRoles[0], deny: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.Connect] }, { id: ayar.reklamRoles[0], deny: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.Connect] }, { id: ayar.fakeAccRoles[0], deny: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.Connect] }, { id: ayar.bannedTagRoles[0], deny: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.Connect] }]
}).catch(e => { }).then(async (channel) => {
await newState.setChannel(channel).catch(e => { })
await newState.guild.channels.create({
name: `${newState.member.displayName}-panel`,
type: Discord.ChannelType.GuildText,
position: channel.position,
parent: categoryId,
permissionOverwrites: [{ id: newState.member.user.id, allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages] }, { id: newState.guild.id, deny: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages] }]
}).then(async (channelss) => {
await PrivateRoomsUser.updateOne({ userId: newState?.member?.user?.id, guildId: newState.guild.id }, { $set: { 'private_voices.voiceId': channel.id, 'private_voices.lock': false, 'private_voices.textId': channelss.id }, }, { upsert: true })
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId('private-voice')
.setPlaceholder('Özel Oda Menüsü')
.addOptions([
{ label: 'İsim Değiştir', value: 'rename', description: 'Özel Oda İsmini Değiştirir.', emoji: '📝' },
{ label: 'Kullanıcı Ekle', value: 'ekleme', description: 'Kullanıcı Ekleme Menüsü.', emoji: '🔎' },
{ label: 'Kullanıcı Kaldır', value: 'cikarma', description: 'Kullanıcı Kaldırma Menüsü.', emoji: '🔎' },
{ label: 'Oda Limiti', value: 'limit', description: 'Oda Limitini Belirler.', emoji: '👥' },
{ label: 'Sesten At', value: 'kick', description: 'Kullanıcıyı Sesten Atar.', emoji: '🚪' },
{ label: 'Odayı Kapat', value: 'lock', description: 'Odayı Kilitler.', emoji: '🔒' },
{ label: 'Odayı Aç', value: 'unlock', description: 'Odayı Açar.', emoji: '🔓' },
{ label: 'Odayı Sil', value: 'delete', description: 'Odayı Siler.', emoji: '🗑️' }
]))
let Embed = new Discord.EmbedBuilder().setAuthor({ name: `${newState.member.displayName} Özel Oda Panel`, iconURL: newState.member.displayAvatarURL({ dynamic: true }) })
.setDescription(`${newState.guild.emojiGöster(emojis.info)} ${newState.member} Özel Odan Başarıyla Oluşturuldu. Odayı İstediğin Şekilde Düzenleyebilirsin.

\` Oda Limitini Değiştir: \` \` 👥 \`
\` İsim Değiştir: \` \` 📝 \`
\` Kullanıcı Ekle: \` \` 🔎 \`
\` Kullanıcı Kaldır: \` \` 🔎 \`
\` Sesten At: \` \` 🚪 \`
\` Odayı Kapat: \` \` 🔒 \`
\` Odayı Aç: \` \` 🔓 \`
\` Odayı Sil: \` \` 🗑️ \`
\` Oda Sahibi: \` ${newState.member}
\` Oda İsmi: \` \` ${channel.name} \`
\` Oda Oluşturulma Tarihi: \` <t:${Math.floor(channel.createdTimestamp / 1000)}:R>
\` Oda Limiti: \` \` ${channel.userLimit || "Limitsiz"} \`
\` Oda Kiliti Durumu: \` \` ${user?.private_voices?.lock ? "Kilitli" : "Açık"} \``)
.setThumbnail(channel.guild.iconURL({ dynamic: true, size: 2048 }))
if(channelss) await channelss.send({ content: `${newState.member}`, embeds: [Embed], components: [row] })
await channels.send({ embeds: [new Discord.EmbedBuilder().setDescription(`${newState.member} Adlı Kullanıcı **${channel.name}** İsimli Özel Odayı Oluşturdu.\n\nOda Sahibi: ${newState.member}\nOda İsmi: ${channel.name}\nOda Panel: **${channelss.name}**\nOda Oluşturulma Tarihi: <t:${Math.floor(channel.createdTimestamp / 1000)}:R>`).setAuthor({ name: newState.member.displayName, iconURL: newState.member.displayAvatarURL({ dynamic: true }) }).setColor("Random").setFooter({ text: `${newState.member.displayName}`, iconURL: newState.member.displayAvatarURL({ dynamic: true }) }).setThumbnail(newState.member.displayAvatarURL({ dynamic: true }))] })
})
})
}
}
} else if (type == "other") {
const finishedPenal = await Penalties.findOne({ guildID: newState.guild.id, userID: newState.id, type: "VOICE-MUTE", removed: false, temp: true, finishDate: { $lte: Date.now() } });
if (finishedPenal) {
if (newState.serverMute) newState.setMute(false);
await newState.member.removeRoles(ayar.vmuteRoles).catch(e => { });
finishedPenal.active = false;
finishedPenal.removed = true;
await finishedPenal.save();
}
const activePenal = await Penalties.findOne({ guildID: newState.guild.id, userID: oldState.id, type: "VOICE-MUTE", active: true });
if (activePenal) {
if (!newState.serverMute) await newState.setMute(true).catch(e => { });
if (!ayar.vmuteRoles.some((x) => newState.member.roles.cache.has(x))) await newState.member.addRoles(ayar.vmuteRoles).catch(e => { });
}
if (!oldState.channelId && newState.channelId) await Voiceİnfo.updateOne({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
else if (oldState.channelId && !newState.channelId) await Voiceİnfo.deleteOne({ userID: oldState.id });
} else if (type == "friends") {
if (!oldState.member || !oldState.guild || oldState.channelId == newState.channelId) return;
const defaultQuery = {
channelId: oldState.channelId || newState.channelId,
joinedAt: Date.now(),
updateAt: Date.now(),
};
if (!oldState.channelId && newState.channelId) {
return FriendsVoiceStates.set(oldState.id, defaultQuery);
}
const cache = FriendsVoiceStates.get(oldState.id) || defaultQuery;
FriendsVoiceStates.set(oldState.id, cache);
const diff = Date.now() - cache.updateAt;
if (oldState.channelId && !newState.channelId) {
FriendsVoiceStates.delete(oldState.id);
if (diff > 0) await addStat(oldState.member, oldState.channelId, diff);
} else if (
oldState.channelId &&
newState.channelId &&
oldState.channelId !== newState.channelId
) {
FriendsVoiceStates.set(oldState.id, {
channelId: newState.channelId,
joinedAt: Date.now(),
updateAt: Date.now(),
});
if (diff > 0) await addStat(oldState.member, oldState.channelId, diff);
}
} else if (type == "log") {
if (!oldState.member && !newState.member) return;
if (!oldState.channel && !newState.channel) return;
const embed = new Discord.EmbedBuilder().setAuthor({ name: oldState.member.user.username || newState.member.user.username, iconURL: oldState.member.displayAvatarURL({ dynamic: true }) || newState.member.displayAvatarURL({ dynamic: true })}).setFooter({ text: `${ayar.botFooter ? ayar.botFooter : `${oldState.guild.name}`}`, iconURL: `${oldState.guild.iconURL({ dynamic: true })}`}).setColor(oldState.member.displayHexColor)
const channel = await client.kanalBul("voice-log");
if (!channel) return;
if (!oldState.channel && newState.channel) {
channel.send({
embeds: [embed.setDescription(`
${newState.guild.emojiGöster(emojis.info)} ${newState.member} Üyesi ${newState.channel} Kanalına Katıldı.
${newState.guild.emojiGöster(emojis.warn)} Kanala Girdiği Anda:
${newState.guild.emojiGöster(emojis.nokta)} Mikrofonu: **${newState.member.voice.mute ? `Kapalı` : `Açık`}**
${newState.guild.emojiGöster(emojis.nokta)} Kulaklığı: **${newState.member.voice.deaf ? `Kapalı` : `Açık`}**

${newState.guild.emojiGöster(emojis.nokta)} Girdiği Kanal: **${newState.channel}** (**${newState.channelId}**)
${newState.guild.emojiGöster(emojis.nokta)} Kullanıcı: **${newState.member}** (**${newState.member.user.id}**)
${newState.guild.emojiGöster(emojis.nokta)} Eylem Gerçekleşme: <t:${Math.floor(Date.now() / 1000)}>`)

.addFields([{
name: `${newState.guild.emojiGöster(emojis.warn)} **Girdiği Kanalda Bulunan Üyeler (${newState.channel.members.size})**`, value: `
${newState.channel.members ? newState.channel.members.array().slice(0, 5).map((x) => `${newState.guild.emojiGöster(emojis.nokta)} **${x}** - (**${x.user.id}**)`).join("\n") : "Üye Yoktur"}`
}])]
}).catch(e => { })
if(!ayar.staffRoles.some(x => oldState.member.roles.cache.has(x)) && !ayar.seniorStaffRoles.some(x => oldState.member.roles.cache.has(x)) && !ayar.ownerRoles.some(x => oldState.member.roles.cache.has(x)) && !oldState.member.permissions.has(Discord.PermissionFlagsBits.Administrator)){
const Data = await VoiceLimit.findOne({ guildID: oldState.guild.id, userID: oldState.id });
if (!Data) {
await new VoiceLimit({ guildID: oldState.guild.id, userID: oldState.id, db: 0 }).save();
} else {
if (Data.db >= 3) {
await VoiceLimit.updateOne(
{ guildID: oldState.guild.id, userID: oldState.id },
{ $set: { db: 0 } },
{ upsert: true }
);
const channel = await client.kanalBul("ceza-log");
if(channel) await channel.send({content: `${oldState.member} >>> ${oldState.channel} kanalına çok hızlı giriş çıkış yaptığın için 10 dakika zaman aşımı uygulandı.`});
await oldState?.member?.timeout(10 * 60 * 1000, "Ses Kanallarına Ard Arda Çık Gir Yaptı.").catch(e => {});
}
}
}
await UserVoice.updateOne({guildID: newState.guild.id, userID: newState.id}, { $addToSet: { [`Data.${newState.channel.id}`]: { Channel: newState.channel.id, Type: "GİRİŞ", Date: Date.now(), VoiceMembers: newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => x.id) : []} } }, { upsert: true })
return }
if (oldState.channel && !newState.channel) {
channel.send({
embeds: [embed.setDescription(`
${oldState.guild.emojiGöster(emojis.info)} ${newState.member} Üyesi ${oldState.channel} Kanalından Ayrıldı.

${newState.guild.emojiGöster(emojis.warn)} Kanaldan Çıktıgı Anda:
${newState.guild.emojiGöster(emojis.nokta)} Mikrofonu: **${newState.member.voice.mute ? `Kapalı` : `Açık`}**
${newState.guild.emojiGöster(emojis.nokta)} Kulaklığı: **${newState.member.voice.deaf ? `Kapalı` : `Açık`}**

${newState.guild.emojiGöster(emojis.nokta)} Çıktıgı Kanal: **${oldState.channel}** (**${oldState.channelId}**)
${newState.guild.emojiGöster(emojis.nokta)} Kullanıcı: **${newState.member}** (**${newState.member.user.id}**)
${newState.guild.emojiGöster(emojis.nokta)} Eylem Gerçekleşme: <t:${Math.floor(Date.now() / 1000)}>`)
.addFields([{
name: `${newState.guild.emojiGöster(emojis.warn)} **Çıktığı Kanalda Bulunan Üyeler (${oldState.channel.members.size})**`, value: `
${oldState.channel.members ? oldState.channel.members.array().slice(0, 5).map((x) => `${newState.guild.emojiGöster(emojis.nokta)} **${x}** - (**${x.user.id}**)`).join("\n") : "Üye Yoktur"}`
}])]
}).catch(e => { })
await VoiceLimit.updateOne({guildID: oldState.guild.id, userID: oldState.id}, { $inc: { db: 1 } }, { upsert: true })
if(!ayar.staffRoles.some(x => oldState.member.roles.cache.has(x)) && !ayar.seniorStaffRoles.some(x => oldState.member.roles.cache.has(x)) && !ayar.ownerRoles.some(x => oldState.member.roles.cache.has(x)) && !oldState.member.permissions.has(Discord.PermissionFlagsBits.Administrator)){
const Data = await VoiceLimit.findOne({ guildID: oldState.guild.id, userID: oldState.id });
if (!Data) {
await new VoiceLimit({ guildID: oldState.guild.id, userID: oldState.id, db: 0 }).save();
} else {
if (Data.db >= 3) {
await VoiceLimit.updateOne(
{ guildID: oldState.guild.id, userID: oldState.id },
{ $set: { db: 0 } },
{ upsert: true }
);
const channel = await client.kanalBul("ceza-log");
if(channel) await channel.send({content: `${oldState.member} >>> ${oldState.channel} kanalına çok hızlı giriş çıkış yaptığın için 10 dakika zaman aşımı uygulandı.`});
await oldState?.member?.timeout(10 * 60 * 1000, "Ses Kanallarına Ard Arda Çık Gir Yaptı.").catch(e => {});
}
}
}
await UserVoice.updateOne({guildID: oldState.guild.id, userID: oldState.id}, { $addToSet: { [`Data.${oldState.channel.id}`]: { Channel: oldState.channel.id, Type: "ÇIKIŞ", Date: Date.now(), VoiceMembers: oldState.channel.members ? oldState.channel.members.array().slice(0, 15).map((x) => x.id) : [] } } }, { upsert: true })
return }
if (oldState.channel.id && newState.channel.id && oldState.channel.id != newState.channel.id) {
channel.send({
embeds: [embed.setDescription(`
${oldState.guild.emojiGöster(emojis.info)} ${newState.member} Üyesi Ses Kanalını Değiştirdi.

${newState.guild.emojiGöster(emojis.warn)} Kanaldan Değiştirdiği Anda:
${newState.guild.emojiGöster(emojis.nokta)} Mikrofonu: **${newState.member.voice.mute ? `Kapalı` : `Açık`}**
${newState.guild.emojiGöster(emojis.nokta)} Kulaklığı: **${newState.member.voice.deaf ? `Kapalı` : `Açık`}**

${newState.guild.emojiGöster(emojis.nokta)} Çıktıgı Kanal: **${oldState.channel}** (**${oldState.channelId}**)
${newState.guild.emojiGöster(emojis.nokta)} Girdiği Kanal: **${newState.channel}** (**${newState.channelId}**)
${newState.guild.emojiGöster(emojis.nokta)} Kullanıcı: **${newState.member}** (**${newState.member.user.id}**)
${newState.guild.emojiGöster(emojis.nokta)} Eylem Gerçekleşme: <t:${Math.floor(Date.now() / 1000)}>`)
.addFields(
{
name: `${newState.guild.emojiGöster(emojis.warn)} **Eski Kanalda Bulunan Üyeler (${oldState.channel.members.size})**`, value: `
${oldState.channel.members ? oldState.channel.members.array().slice(0, 3).map((x) => `${newState.guild.emojiGöster(emojis.nokta)} **${x}** - (**${x.user.id}**)`).join("\n") : "Üye Yoktur"}`, inline: false
},
{
name: `${newState.guild.emojiGöster(emojis.warn)} **Yeni Kanalda Bulunan Üyeler (${newState.channel.members.size})**`, value: `
${newState.channel.members ? newState.channel.members.array().slice(0, 3).map((x) => `${newState.guild.emojiGöster(emojis.nokta)} **${x}** - (**${x.user.id}**)`).join("\n") : "Üye Yoktur"}`, inline: true
})
]
}).catch(e => { })
await UserVoice.updateOne({guildID: oldState.guild.id, userID: oldState.id}, { $addToSet: { [`Data.${oldState.channel.id}`]: { Channel: oldState.channel.id, Type: "ÇIKIŞ", Date: Date.now(), VoiceMembers: oldState.channel.members ? oldState.channel.members.array().slice(0, 15).map((x) => x.id) : [] } } }, { upsert: true })
await UserVoice.updateOne({guildID: newState.guild.id, userID: newState.id}, { $addToSet: { [`Data.${newState.channel.id}`]: { Channel: newState.channel.id, Type: "GİRİŞ", Date: Date.now(), VoiceMembers: newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => x.id) : [] } } }, { upsert: true })
return }
if (oldState.channel.id && oldState.selfMute && !newState.selfMute) return channel.send({ embeds: [embed.setDescription(`${oldState.guild.emojiGöster(emojis.info)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda kendi susturmasını kaldırdı!`)] }).catch(e => { });
if (oldState.channel.id && !oldState.selfMute && newState.selfMute) return channel.send({ embeds: [embed.setDescription(`${oldState.guild.emojiGöster(emojis.info)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda kendini susturdu!`)] }).catch(e => { });
if (oldState.channel.id && oldState.selfDeaf && !newState.selfDeaf) return channel.send({ embeds: [embed.setDescription(`${oldState.guild.emojiGöster(emojis.info)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda kendi sağırlaştırmasını kaldırdı!`)] }).catch(e => { });
if (oldState.channel.id && !oldState.selfDeaf && newState.selfDeaf) return channel.send({ embeds: [embed.setDescription(`${oldState.guild.emojiGöster(emojis.info)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda kendini sağırlaştırdı!`)] }).catch(e => { });
if (oldState.channel.id && !oldState.streaming && newState.channel.id && newState.streaming) {
streamData.set(newState.member.user.id, {
channelId: newState.channel.id,
Start: Date.now(),
})
channel.send({
embeds: [embed.setDescription(`
${oldState.guild.emojiGöster(emojis.info)} ${newState.member} Üyesi ${newState.channel} Kanalında Yayın Başlattı.

${newState.guild.emojiGöster(emojis.warn)} Yayın Açtığı Anda:
${newState.guild.emojiGöster(emojis.nokta)} Mikrofonu: **${newState.member.voice.mute ? `Kapalı` : `Açık`}**
${newState.guild.emojiGöster(emojis.nokta)} Kulaklığı: **${newState.member.voice.deaf ? `Kapalı` : `Açık`}**

${newState.guild.emojiGöster(emojis.nokta)} Yayın Başlattığı Kanal: ${newState.channel} (**${newState.channelId}**)
${newState.guild.emojiGöster(emojis.nokta)} Kullanıcı: ${newState.member} (**${newState.member.user.id}**)
${newState.guild.emojiGöster(emojis.nokta)} Eylem Gerçekleşme: <t:${String(Date.now()).slice(0, 10)}:R>`)
.addFields([{
name: `${newState.guild.emojiGöster(emojis.warn)} **Yayın Açtığı Kanalda Bulunan Üyeler (${newState.channel.members.size})**`, value: `
${newState.channel.members ? newState.channel.members.array().slice(0, 5).map((x) => `${newState.guild.emojiGöster(emojis.nokta)} **${x}** - (**${x.user.id}**)`).join("\n") : "Üye Yoktur"}`
}])]
}).catch(e => { })
await UserVoice.updateOne({guildID: newState.guild.id, userID: newState.id}, { $addToSet: { [`Data.${newState.channel.id}`]: { Channel: newState.channel.id, Type: "YAYIN AÇMA", Date: Date.now(), VoiceMembers: newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => x.id) : [] } } }, { upsert: true })
return }
if (oldState.channel.id && oldState.streaming && newState.channel.id && !newState.streaming) {
let data = streamData.get(newState.member.user.id)
if (data) {
let yayınSüresi = moment.duration(Date.now() - data.Start).format('Y [Yıl,] M [Ay,] d [Gün,] h [Saat,] m [Dakika] s [Saniye]')
channel.send({
embeds: [embed.setDescription(`
${oldState.guild.emojiGöster(emojis.info)} ${newState.member} Üyesi ${newState.channel} Kanalında Yayın Kapattı.

${newState.guild.emojiGöster(emojis.warn)} Yayın Kapattığında:
${newState.guild.emojiGöster(emojis.nokta)} Mikrofonu: **${newState.member.voice.mute ? `Kapalı` : `Açık`}**
${newState.guild.emojiGöster(emojis.nokta)} Kulaklığı: **${newState.member.voice.deaf ? `Kapalı` : `Açık`}**

${newState.guild.emojiGöster(emojis.nokta)} Yayın Kapattığı Kanal: ${newState.channel} (**${newState.channelId}**)
${newState.guild.emojiGöster(emojis.nokta)} Kullanıcı: ${newState.member} (**${newState.member.user.id}**)
${newState.guild.emojiGöster(emojis.nokta)} Eylem Gerçekleşme: <t:${String(Date.now()).slice(0, 10)}:R>`)
.addFields([{
name: `${newState.guild.emojiGöster(emojis.warn)} **Yayın Kapattığı Kanalda Bulunan Üyeler (${newState.channel.members.size})**`, value: `
${newState.channel.members ? newState.channel.members.array().slice(0, 5).map((x) => `${newState.guild.emojiGöster(emojis.nokta)} **${x}** - (**${x.user.id}**)`).join("\n") : "Üye Yoktur"}`
}])]
}).catch(e => { })
await UserVoice.updateOne({guildID: newState.guild.id, userID: newState.id}, { $addToSet: { [`Data.${newState.channel.id}`]: { Channel: newState.channel.id, Type: "YAYIN KAPATMA", Date: Date.now(), VoiceMembers: newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => x.id) : [], Time: yayınSüresi } } }, { upsert: true })
}
return }
if (oldState.channel.id && !oldState.selfVideo && newState.channel.id && newState.selfVideo) {
cameraData.set(newState.member.user.id, {
channelId: newState.channel.id,
Start: Date.now(),
})
channel.send({
embeds: [embed.setDescription(`
${newState.guild.emojiGöster(emojis.info)} ${newState.member} Üyesi ${newState.channel} Kanalında Kamera Açtı.

${newState.guild.emojiGöster(emojis.warn)} Kamera Açtığında:
${newState.guild.emojiGöster(emojis.nokta)} Mikrofonu: **${newState.member.voice.mute ? `Kapalı` : `Açık`}**
${newState.guild.emojiGöster(emojis.nokta)} Kulaklığı: **${newState.member.voice.deaf ? `Kapalı` : `Açık`}**

${newState.guild.emojiGöster(emojis.nokta)} Kamera Açtığı Kanal: ${newState.channel} (**${newState.channelId}**)
${newState.guild.emojiGöster(emojis.nokta)} Kullanıcı: ${newState.member} (**${newState.member.user.id}**)
${newState.guild.emojiGöster(emojis.nokta)} Eylem Gerçekleşme: <t:${String(Date.now()).slice(0, 10)}:R>`)

.addFields([{
name: `**Kamera Açtığı Kanalda Bulunan Üyeler (${newState.channel.members.size})**`, value: `
${newState.channel.members ? newState.channel.members.array().slice(0, 5).map((x) => `${newState.guild.emojiGöster(emojis.nokta)} **${x}** - (**${x.user.id}**)`).join("\n") : "Üye Yoktur"}`
}])]
}).catch(e => { })
await UserVoice.updateOne({guildID: newState.guild.id, userID: newState.id}, { $addToSet: { [`Data.${newState.channel.id}`]: { Channel: newState.channel.id, Type: "KAMERA AÇMA", Date: Date.now(), VoiceMembers: newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => x.id) : [] } } }, { upsert: true })
return }
if (oldState.channel.id && oldState.selfVideo && newState.channel.id && !newState.selfVideo) {
let data = cameraData.get(newState.member.user.id)
if (data) {
let kameraSüresi = moment.duration(Date.now() - data.Start).format('Y [Yıl,] M [Ay,] d [Gün,] h [Saat,] m [Dakika] s [Saniye]')
channel.send({
embeds: [embed.setDescription(`
${oldState.guild.emojiGöster(emojis.info)} ${newState.member} Üyesi ${newState.channel} Kanalında Kamera Kapattı.

${newState.guild.emojiGöster(emojis.warn)} Kamera Kapattığında:
${newState.guild.emojiGöster(emojis.nokta)} Mikrofonu: **${oldState.member.voice.mute ? `Kapalı` : `Açık`}**
${newState.guild.emojiGöster(emojis.nokta)} Kulaklığı: **${oldState.member.voice.deaf ? `Kapalı` : `Açık`}**

${newState.guild.emojiGöster(emojis.nokta)} Kamera Kapattığında Kanal: ${oldState.channel} (**${oldState.channelId}**)
${newState.guild.emojiGöster(emojis.nokta)} Kullanıcı: ${newState.member} (**${newState.member.user.id}**)
${newState.guild.emojiGöster(emojis.nokta)} Eylem Gerçekleşme: <t:${String(Date.now()).slice(0, 10)}:R>`)
.addFields([{
name: `${newState.guild.emojiGöster(emojis.warn)} **Kamera Kapattığı Kanalda Bulunan Üyeler (${oldState.channel.members.size})**`, value: `
${newState.channel.members ? newState.channel.members.array().slice(0, 5).map((x) => `${newState.guild.emojiGöster(emojis.nokta)} **${x}** - (**${x.user.id}**)`).join("\n") : "Üye Yoktur"}`
}])]
}).catch(e => { })
await UserVoice.updateOne({guildID: newState.guild.id, userID: newState.id}, { $addToSet: { [`Data.${newState.channel.id}`]: { Channel: newState.channel.id, Type: "KAMERA KAPATMA", Date: Date.now(), VoiceMembers: newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => x.id) : [], Time: kameraSüresi } } }, { upsert: true })
}
return }
} else if(type === "afkpublic") {
let member = oldState.member;
if(!member) return;
if(member.user.bot) return;
if(!newState.channelId) return await voiceAfks.delete(member.id)
if(oldState.channelId && !newState.channelId) {
if(voiceAfks.get(member.id)) return await voiceAfks.delete(member.id)
}
if(member.guild.channels.cache.get(newState.channelId).parentId != ayar.publicParents) return;
if(member.voice.selfDeaf || member.voice.selfMute) {
voiceAfks.set(member.id, { channel: newState.channelId, date: Date.now()+ms(sure) })
} else {
await voiceAfks.delete(member.id)
}
} else if(type === "afkstreamer") {
let member = oldState.member;
if(!member) return;
if(member.user.bot) return;
if(!newState.channelId) return await streamerAfks.delete(member.id)
if(oldState.channelId && !newState.channelId) {
if(streamerAfks.get(member.id)) return await streamerAfks.delete(member.id)
}
if(member.guild.channels.cache.get(newState.channelId).parentId != ayar.streamerParents) return;
if(member.voice.selfDeaf && member.voice.selfMute) {
streamerAfks.set(member.id, { channel: newState.channelId, date: Date.now()+ms(streamersure) })
} else {
await streamerAfks.delete(member.id)
}
}
},
[Discord.Events.ClientReady]: async (type) => {
const guild = client.guilds.cache.get(settings.Moderation.guildID);
if (!guild) return;
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if(!ayar) return;
const members = await guild.members.fetch()
if(type == "friends") {
members
.filter((member) => member.voice && member.voice.channelId && !member.user.bot)
.forEach((member) =>
FriendsVoiceStates.set(member.id, {
channelId: member.voice.channelId,
joinedAt: Date.now(),
updateAt: Date.now(),
})
);
setInterval(() => {
if (!FriendsVoiceStates.size) return;
FriendsVoiceStates.forEach(async (v, k) => {
FriendsVoiceStates.set(k, { ...v, updateAt: Date.now() });
const diff = Date.now() - v.updateAt;
if (diff > 0) {
const member = guild.members.cache.get(k);
if (!member) return FriendsVoiceStates.delete(k);
await addStat(member, v.channelId, diff);
}
});
}, 1000 * 30);
} else if(type == "afk") {
guild.channels.cache.filter(e =>
e.type == Discord.ChannelType.GuildVoice &&
e.members.size > 0 &&
e.parentId == ayar.streamerParents).forEach(channel => {
channel.members.filter(member => !member.user.bot && member.voice.selfDeaf && member.voice.selfMute && !member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !settings.Moderation.owners.includes(member.user.id)).forEach(async (member) => {
if(!streamerAfks.get(member.id)) return streamerAfks.set(member.id, { channel: channel.id, date: Date.now()+ms(streamersure) });
})
})
guild.channels.cache.filter(e =>
e.type == Discord.ChannelType.GuildVoice &&
e.members.size > 0 &&
e.parentId == ayar.publicParents &&
e.id != ayar.afkChannel).forEach(channel => {
channel.members.filter(member => !member.user.bot && (member.voice.selfDeaf || member.voice.selfMute) && !member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !settings.Moderation.owners.includes(member.user.id)).forEach(async (member) => {

if(!voiceAfks.get(member.id)) return voiceAfks.set(member.id, { channel: channel.id, date: Date.now()+ms(sure) });
})
})

setInterval(() => {
checkAfk()
checkStreamer()
}, 20000);
} else if(type == "event") {
setInterval(async () => {
await ilkYazan(2500)
setTimeout(async () => {
await matematikOyunu(5000)
setTimeout(async () => {
await doğruKasaBul(5000)
setTimeout(async () => {
await tahminEt(1000)
}, 1000*60*3)
}, 1000*60*5)
}, 1000*60*2)
}, 1000*60*18)
}
},
[Discord.Events.InviteCreate]: async (invite) => {
const invites = await invite.guild.invites.fetch();
const codeUses = new Map();
invites.each(inv => codeUses.set(inv.code, inv.uses));
client.Invites.set(invite.guild.id, codeUses);
},
[Discord.Events.InviteDelete]: async (invite) => {
const invites = await invite.guild.invites.fetch();
invites.delete(invite.code);
client.Invites.delete(invite.guild.id, invites);
},
[Discord.Events.GuildMemberAdd]: async (member, type) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
if (member.user.bot) return;
if (type == "other") {
const data = await ForceBans.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if (data) return member.guild.members.ban(member.user.id, { reason: "Sunucudan kalıcı olarak yasaklandı!" }).catch(() => { });
if (member.guild.id != settings.Moderation.guildID) return;
if (ayar && ayar.autoRole == true) {
await member.addRoles(ayar.unregRoles).catch(e => { })
}
await member.setNickname(`${ayar.defaultTag} ${ayar.unregName}`).catch(e => {});
const advertData = await advert.findOne({ guildID: settings.Moderation.guildID });
if (advertData) {
const channel = advertData.advert.map((x) => member.guild.channels.cache.get(x.channel));
if (channel.length > 0) {
channel.forEach((x) => {
if (!x) return;
x.send({ content: `${member}` }).sil(5);
});
}
}
} else if (type == "add") {
let guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
if (guvenilirlik) {
await member.setRoles(ayar.fakeAccRoles).catch(e => {});
await member.setNickname(`${ayar.defaultTag} Şüpheli Hesap`).catch(e => {});
const KayitChannel = member.guild.channels.cache.get(ayar.welcomeChannel);
KayitChannel.send({ content: `${member.guild.emojiGöster(emojis.info)} ${member} İsimli üye Sunucuya Katıldı Hesabı (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) Açıldığı İçin Şüpheli Olarak İşaretlendi.` });
return; }
if (ayar && ayar.autoRole == true) {
await member.addRoles(ayar.unregRoles).catch(e => { })
await member.setNickname(`${ayar.defaultTag} ${ayar.unregName}`).catch(e => {});
}
var üyesayısı = member.guild.memberCount.toString().replace(/ /g, "    ")
var üs = üyesayısı.match(/([0-9])/g)
üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase()
if(üs) {
üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
return {
'0': `${member.guild.emojiGöster(emojis.sifir)}`,
'1': `${member.guild.emojiGöster(emojis.bir)}`,
'2': `${member.guild.emojiGöster(emojis.iki)}`,
'3': `${member.guild.emojiGöster(emojis.uc)}`,
'4': `${member.guild.emojiGöster(emojis.dort)}`,
'5': `${member.guild.emojiGöster(emojis.bes)}`,
'6': `${member.guild.emojiGöster(emojis.alti)}`,
'7': `${member.guild.emojiGöster(emojis.yedi)}`,
'8': `${member.guild.emojiGöster(emojis.sekiz)}`,
'9': `${member.guild.emojiGöster(emojis.dokuz)}`}[d];
})
}
let memberGün = moment(member.user.createdAt).format("DD");
let memberTarih = moment(member.user.createdAt).format("YYYY HH:mm");
let memberAylar = moment(member.user.createdAt).format("MM").replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık");
const registerRooms = await member.guild.channels.cache.filter(c => ayar.registerParents.some(a => a == c.parentId) && c.type === Discord.ChannelType.GuildVoice);
const kurallar = await member.guild.channels.cache.get(ayar.rulesChannel);
const cachedInvites = await client.Invites.get(settings.Moderation.guildID)
const KayitChannel = await member.guild.channels.cache.get(ayar.welcomeChannel);
const İnviteChannel = await member.guild.channels.cache.get(ayar.inviteChannel);
if (!cachedInvites) {
İnviteChannel.send({ content: `📥 ${member} <t:${String(Date.now()).slice(0, 10)}:R> **Sunucuya Katıldı.** (**Davet Eden Bulunamadı.**)` })
KayitChannel.send({
content: `
>>> ${member}, **${member.guild.name}** Sunucumuza hoşgeldin. Seninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı.

Hesabın __${memberGün} ${memberAylar} ${memberTarih}__ tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) oluşturulmuş.
${registerRooms.random()} kanalına geçerek ${member.guild.roles.cache.get(ayar.registerPerms) ? member.guild.roles.cache.get(ayar.registerPerms) : "Kayıt Sorumlusu"} görevlilerine teyit verip kayıt olabilirsiniz.

Sunucumuza kayıt olduğunuzda ${kurallar} kanalına göz atmayı unutmayınız.
Kayıt olduğunuzda kuralları okuduğunuzu varsayarak ceza işlemerinizi bunu göz önünde bulundurarak yapacağız.`});
return
}
const newInvites = await member.guild.invites.fetch();
const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);
newInvites.each(inv => cachedInvites.set(inv.code, inv.uses));
client.Invites.set(settings.Moderation.guildID, cachedInvites);
if (!usedInvite) {
const url = await member.guild.vanityURLCode ? await member.guild.fetchVanityData() : "";
İnviteChannel.send({ content: `📥 ${member} **Adlı Kullanıcı <t:${String(Date.now()).slice(0, 10)}:R> Sunucuya Katıldı. \n\Davet Eden: Özel URL (Toplam Kullanım: ${url ? url.uses : 0})**` })
KayitChannel.send({
content: `
>>> ${member}, **${member.guild.name}** Sunucumuza hoşgeldin. Seninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı.

Hesabın __${memberGün} ${memberAylar} ${memberTarih}__ tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) oluşturulmuş.
${registerRooms.random()} kanalına geçerek ${member.guild.roles.cache.get(ayar.registerPerms) ? member.guild.roles.cache.get(ayar.registerPerms) : "Kayıt Sorumlusu"} görevlilerine teyit verip kayıt olabilirsiniz.

Sunucumuza kayıt olduğunuzda ${kurallar} kanalına göz atmayı unutmayınız.
Kayıt olduğunuzda kuralları okuduğunuzu varsayarak ceza işlemerinizi bunu göz önünde bulundurarak yapacağız.`});
return
}
await İnviteMembers.updateOne({ guildID: settings.Moderation.guildID, userID: member.user.id }, { $set: { inviter: usedInvite.inviter.id } }, { upsert: true });
if (Date.now() - member.user.createdTimestamp <= 1000 * 60 * 60 * 24 * 7) {
await Inviter.updateOne({ guildID: settings.Moderation.guildID, userID: usedInvite.inviter.id }, { $inc: { fake: 1, total: 1, total1: 1, fake1: 1, total7: 1, fake7: 1, total30: 1, fake30: 1 } }, { upsert: true });
const data = await Inviter.findOne({ guildID: settings.Moderation.guildID, userID: usedInvite.inviter.id });
İnviteChannel.send({ content: `📥 ${member} **Adlı Kullanıcı <t:${String(Date.now()).slice(0, 10)}:R> Sunucuya Katıldı. \nDavet Eden: ${usedInvite.inviter.tag} (Toplam Daveti: ${data && data.total ? data.total : 0})**` })
await member.setRoles(ayar.fakeAccRoles).catch(e => {});
await member.setNickname(`${ayar.defaultTag} Şüpheli Hesap`).catch(e => {});
} else {
await Inviter.updateOne({ guildID: settings.Moderation.guildID, userID: usedInvite.inviter.id }, { $inc: { total: 1, regular: 1, total1: 1, total7: 1, total30: 1, } }, { upsert: true });
const data = await Inviter.findOne({ guildID: settings.Moderation.guildID, userID: usedInvite.inviter.id });
İnviteChannel.send({ content: `📥 ${member} **Adlı Kullanıcı <t:${String(Date.now()).slice(0, 10)}:R> Sunucuya Katıldı. \nDavet Eden: ${usedInvite.inviter.tag} (Toplam Daveti: ${data && data.total ? data.total : 0})**` })
KayitChannel.send({
content: `
>>> ${member}, **${member.guild.name}** Sunucumuza hoşgeldin. Seninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı.

Hesabın __${memberGün} ${memberAylar} ${memberTarih}__ tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) oluşturulmuş.
${registerRooms.random()} kanalına geçerek ${member.guild.roles.cache.get(ayar.registerPerms) ? member.guild.roles.cache.get(ayar.registerPerms) : "Kayıt Sorumlusu"} görevlilerine teyit verip kayıt olabilirsiniz.

Sunucumuza kayıt olduğunuzda ${kurallar} kanalına göz atmayı unutmayınız.
Kayıt olduğunuzda kuralları okuduğunuzu varsayarak ceza işlemerinizi bunu göz önünde bulundurarak yapacağız.`});
const ranks = JSON.parse(await client.ranks(settings.Moderation.guildID));
const RankData = await RankDB.findOne({ guildID: settings.Moderation.guildID });
if (!RankData) return;
const inviterMember = member.guild.members.cache.get(usedInvite.inviter.id);
if (RankData.RankSystem === true && inviterMember && ranks.some((x) => inviterMember.roles.cache.has(x.roleID))) {
await Puans.updateOne({ guildID: settings.Moderation.guildID, userID: usedInvite.inviter.id }, { $inc: { puan: RankData.inviteCoin } }, { upsert: true });
if (inviterMember) await inviterMember.görevGüncelle(settings.Moderation.guildID, "invite", 1);
}
return
}
}
},
[Discord.Events.GuildMemberRemove]: async (member) => {
if (member.user.bot) return;
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
const İnviteChannel = member.guild.channels.cache.get(ayar.inviteChannel);
const İnviteMemberData = await İnviteMembers.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id });
if (!İnviteMemberData) {
İnviteChannel.send({ content: `📤 \` ${member.guild.members.cache.get(member.id) ? member.user.username : member.user.tag} \` **Adlı Kullanıcı <t:${String(Date.now()).slice(0, 10)}:R> Sunucumuzdan Ayrıldı. \nDavet Eden: Kim Tarafından Davet Edildiğini Bulamadım.**` });
} else {
const inviter = await client.users.fetch(İnviteMemberData.inviter);
await Inviter.updateOne({ guildID: settings.Moderation.guildID, userID: inviter.id }, { $inc: { leave: 1, total: -1, regular: -1, total1: -1, leave1: 1, total7: -1, leave7: 1, total30: -1, leave30: 1 } }, { upsert: true });
const tdb = await Inviter.findOne({ guildID: settings.Moderation.guildID, userID: İnviteMemberData.inviter });
const totals = tdb.total || 0;
İnviteChannel.send({ content: `📤 \` ${member.guild.members.cache.get(member.id) ? member.user.username : member.user.tag} \` **Adlı Kullanıcı <t:${String(Date.now()).slice(0, 10)}:R> Sunucumuzdan Ayrıldı. \nDavet Eden: ${inviter ? inviter.displayName : await client.users.fetch(İnviteMemberData.inviter).globalName} (Toplam Daveti: ${totals})**` });
const ranks = JSON.parse(await client.ranks(settings.Moderation.guildID));
const RankData = await RankDB.findOne({ guildID: settings.Moderation.guildID });
if (!RankData) return;
const members = member.guild.members.cache.get(İnviteMemberData.inviter);
if (!members) return;
if (RankData.RankSystem === true && ranks.some((x) => members && members.roles.cache.has(x.roleID))) {
await Puans.updateOne({ guildID: settings.Moderation.guildID, userID: inviter.id }, { $inc: { puan: -RankData.inviteCoin } }, { upsert: true });
if (members) await members.görevGüncelle(settings.Moderation.guildID, "invite", -1);
}
}
},
[Discord.Events.Error]: async (error) => {
console.error(error);
},
[Discord.Events.MessageDelete]: async (message) => {
if (!message) return;
if (!message.guild) return;
if (!message.author) return;
if (message.author.bot) return;
if(!message.attachments.first()) {
if (!message.content) return;
if (message.content.length > 300) return;
const snipe = new SnipeDB({
guildID: settings.Moderation.guildID,
channelID: message.channel.id,
messageContent: message.content,
userID: message.author.id,
createdDate: message.createdTimestamp,
deletedDate: Date.now()
});
snipe.save();
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: `${message.guild.name}`, iconURL: message.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png?ex=65e5bf06&is=65d34a06&hm=ad4431c79d6f35f19cd31b67a4fe00d4f2e08f98a3694b98deeabdf5cb69735a&" || message.author.avatarURL({ dynamic: true }) }).setAuthor({ name: message.author.displayName, iconURL: message.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png?ex=65e5bf06&is=65d34a06&hm=ad4431c79d6f35f19cd31b67a4fe00d4f2e08f98a3694b98deeabdf5cb69735a&" || message.author.avatarURL({ dynamic: true }) })
.setDescription(`
${message.guild.emojiGöster(emojis.info)} ${message.author} Tarafından ${message.channel} Kanalında Bir Mesaj Silindi.

\`Silinen Mesaj: \`      [${message.content}](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})
\`Kanal:         \`      ${message.channel} - (**${message.channel.id}**)
\`Kullanıcı:     \`      ${message.author} - (**${message.author.id}**)
\`Mesaj ID:      \`      **${message.id}**
\`Mesaj Tarihi:  \`      <t:${String(Date.now()).slice(0, 10)}:R>`);
const channel = await client.kanalBul("message-log")
await channel.send({ embeds: [embed] });
} else {
const snipe = new SnipeDB({
guildID: settings.Moderation.guildID,
channelID: message.channel.id,
messageContent: message.content,
userID: message.author.id,
image: message.attachments.first().proxyURL,
createdDate: message.createdTimestamp,
deletedDate: Date.now()
});
snipe.save();
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: `${message.guild.name}`, iconURL: message.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png?ex=65e5bf06&is=65d34a06&hm=ad4431c79d6f35f19cd31b67a4fe00d4f2e08f98a3694b98deeabdf5cb69735a&" || message.author.avatarURL({ dynamic: true }) }).setAuthor({ name: message.author.displayName, iconURL: message.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png?ex=65e5bf06&is=65d34a06&hm=ad4431c79d6f35f19cd31b67a4fe00d4f2e08f98a3694b98deeabdf5cb69735a&" || message.author.avatarURL({ dynamic: true }) })
.setImage(message.attachments.first().proxyURL)
.setDescription(`
${message.guild.emojiGöster(emojis.info)} ${message.author} Tarafından ${message.channel} Kanalında Bir Fotoğraf Silindi.

\`Silinen Mesaj: \`      [Fotoğraf](${message.attachments.first().proxyURL})
\`Kanal:         \`      ${message.channel.name} - (**${message.channel.id}**)
\`Kullanıcı:     \`      ${message.author} - (**${message.author.id}**)
\`Mesaj ID:      \`      **${message.id}**
\`Mesaj Tarihi:  \`      <t:${String(Date.now()).slice(0, 10)}:R>`);
const channel = await client.kanalBul("message-log")
await channel.send({ embeds: [embed] });
}
},
[Discord.Events.MessageUpdate]: async (oldMessage, newMessage) => {
if (!newMessage.author) return;
if (newMessage.author.bot) return;
if (!newMessage.guild) return;
if (!newMessage.attachments.first()) {
if(!newMessage.content) return;
if (newMessage.content.length > 300) return;
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: `${newMessage.guild.name}`, iconURL: newMessage.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png?ex=65e5bf06&is=65d34a06&hm=ad4431c79d6f35f19cd31b67a4fe00d4f2e08f98a3694b98deeabdf5cb69735a&" || newMessage.author.avatarURL({ dynamic: true }) }).setAuthor({ name: newMessage.author.displayName, iconURL: newMessage.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png?ex=65e5bf06&is=65d34a06&hm=ad4431c79d6f35f19cd31b67a4fe00d4f2e08f98a3694b98deeabdf5cb69735a&" || newMessage.author.avatarURL({ dynamic: true }) })
const channel = await client.kanalBul("message-log")
await channel.send({embeds: [embed.setDescription(`
${newMessage.guild.emojiGöster(emojis.info)} ${newMessage.author} Tarafından ${newMessage.channel} Kanalında Bir Mesaj Güncellendi.

\`Eski Mesaj:   \` **${oldMessage.content}**
\`Yeni Mesaj:   \` **${newMessage.content}**
\`Kanal:        \` ${newMessage.channel} - (**${newMessage.channel.id}**)
\`Kullanıcı:    \` ${newMessage.author} - (**${newMessage.author.id}**)
\`Mesaj ID:     \` **${newMessage.id}**
\`Mesaj Tarihi: \` <t:${String(Date.now()).slice(0, 10)}:R>`)]
});
} else {
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: `${newMessage.guild.name}`, iconURL: newMessage.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png?ex=65e5bf06&is=65d34a06&hm=ad4431c79d6f35f19cd31b67a4fe00d4f2e08f98a3694b98deeabdf5cb69735a&" || newMessage.author.avatarURL({ dynamic: true }) }).setAuthor({ name: newMessage.author.displayName, iconURL: newMessage.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29_413.png" || newMessage.author.avatarURL({ dynamic: true }) })
const channel = await client.kanalBul("message-log")
await channel.send({embeds: [embed.setDescription(`
${newMessage.guild.emojiGöster(emojis.info)} ${newMessage.author} Tarafından <#${newMessage.channel.id}> kanalında bir fotoğraf güncellendi.

\`Eski Fotoğraf:   \` [Eski Fotoğraf](${oldMessage.attachments.first() ? oldMessage.attachments.first().proxyURL : oldMessage.content})
\`Yeni Fotoğraf:   \` [Yeni Fotoğraf](${newMessage.attachments.first() ? newMessage.attachments.first().proxyURL : newMessage.content})
\`Kanal:        \` ${newMessage.channel} - (**${newMessage.channel.id}**)
\`Kullanıcı:    \` ${newMessage.author} - (**${newMessage.author.id}**)
\`Mesaj ID:     \` **${newMessage.id}**
\`Mesaj Tarihi: \` <t:${String(Date.now()).slice(0, 10)}:R>`).setImage(newMessage.attachments.first().proxyURL)]
});
}
},
[Discord.Events.GuildMemberUpdate]: async (oldMember, newMember, type) => {
if(type === "log") {
let audit = await newMember.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.MemberRoleUpdate })
const channel = await client.kanalBul("rol-log")
const entry = audit.entries.first();
if (!entry || !entry.executor || entry.executorId === client.user.id || entry.executor.bot) return;
let hedef = entry.target
let yapan = entry.executor
if (yapan.bot) return;
await newMember.roles.cache.forEach(async role => {
if (!oldMember.roles.cache.has(role.id)) {
const emed = new Discord.EmbedBuilder()
.setAuthor({ name: hedef.tag, iconURL: hedef.avatarURL({ dynamic: true }) })
.setColor("Random")
.setDescription(`
${newMember.guild.emojiGöster(emojis.info)} ${yapan} Tarafından ${hedef} Kullanıcısına ${role} Rolü Verildi.

\`Rol Eklenen kişi:  \` ${hedef} - (**${hedef.id}**)
\`Rolü Ekleyen Kişi: \` ${yapan} - (**${yapan.id}**)
\`Eklenen Rol:       \` ${role} - (**${role.id}**)
\`Tarih:             \` <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text: `${yapan.globalName ? yapan.globalName : yapan.tag}`, iconURL: yapan.avatarURL({ dynamic: true }) })
.setTimestamp()
await channel.send({ embeds: [emed] }).catch(e => { });
await RoleLogs.updateOne({ user: hedef.id }, { $push: { roller: { rol: role.id, mod: yapan.id, tarih: Date.now(), state: "Ekleme" } } }, { upsert: true })
}
});
await oldMember.roles.cache.forEach(async role => {
if (!newMember.roles.cache.has(role.id)) {
const emeed = new Discord.EmbedBuilder()
.setAuthor({ name: hedef.tag, iconURL: hedef.avatarURL({ dynamic: true }) })
.setColor("Random")
.setDescription(`
${newMember.guild.emojiGöster(emojis.info)} ${yapan} Tarafından ${hedef} Kullanıcısından ${role} Rolü Alındı.

\`Rol Alınan kişi:   \` ${hedef} - (**${hedef.id}**)
\`Rolü Alan Kişi:    \` ${yapan} - (**${yapan.id}**)
\`Alınan Rol:        \` ${role} - (**${role.id}**)
\`Tarih:             \` <t:${String(Date.now()).slice(0, 10)}:R>`)
.setFooter({ text: `${yapan.globalName ? yapan.globalName : yapan.tag}`, iconURL: yapan.avatarURL({ dynamic: true }) })
.setTimestamp()
await channel.send({ embeds: [emeed] }).catch(e => { });
await RoleLogs.updateOne({ user: hedef.id }, { $push: { roller: { rol: role.id, mod: yapan.id, tarih: Date.now(), state: "Kaldırma" } } }, { upsert: true })
}
});
} else if(type === "booster") {
const ayar = await setups.findOne({guildID: newMember.guild.id})
if(!ayar) return;
if(!oldMember && !newMember) return;
if (oldMember.roles.cache.has(ayar.boosterRoles) && !newMember.roles.cache.has(ayar.boosterRoles)) {
let member = newMember
await member.removeRoles(ayar.blackRoles).catch(() => {});
await member.removeRoles(ayar.blueRoles).catch(() => {});
await member.removeRoles(ayar.whiteRoles).catch(() => {});
await member.removeRoles(ayar.redRoles).catch(() => {});
await member.removeRoles(ayar.yellowRoles).catch(() => {});
await member.removeRoles(ayar.pinkRoles).catch(() => {});
await member.removeRoles(ayar.purpleRoles).catch(() => {});
await member.removeRoles(ayar.orangeRoles).catch(() => {});
await member.removeRoles(ayar.greenRoles).catch(() => {});
await member.removeRoles(ayar.brownRoles).catch(() => {});
await member.removeRoles(ayar.burgundyRoles).catch(() => {});
await member.removeRoles(ayar.turquoiseRoles).catch(() => {});
await member.removeRoles(ayar.beigeRoles).catch(() => {});
await member.removeRoles(ayar.navyblueRoles).catch(() => {});
await member.removeRoles(ayar.lightblueRoles).catch(() => {});
await member.removeRoles(ayar.pistachiogreenRoles).catch(() => {});
const booster = await BoosterName.findOne({guildID: settings.Moderation.guildID, userID: oldMember.id})
if(booster) {
let members = newMember
await members.setNickname(booster.names).catch(e => {})
}
}
}
},
[Discord.Events.InteractionCreate]: async (interaction, type) => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
const member = interaction.member;
if (!member) return;
if (type == "privateroom") {
if (interaction.customId === "private-voice") {
let data = await PrivateRoomsGuild.findOne({ guildId: settings.Moderation.guildID });
if (!data) return;
let user_olddata = await PrivateRoomsUser.findOne({ guildId: settings.Moderation.guildID, userId: interaction.member.id });
if (!user_olddata) { await PrivateRoomsUser.create({ guildId: settings.Moderation.guildID, userId: interaction.member.id }) }
let user_data = await PrivateRoomsUser.findOne({ guildId: settings.Moderation.guildID, userId: interaction.member.id });
if (data.private_voices.mode === true) {
if (!user_data.private_voices.textId && !user_data.private_voices.voiceId) return interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Özel Oda Bulunamadı!`, ephemeral: true })
if (!interaction.member.voice.channel) return interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Özel Oda Bulunamadı!`, ephemeral: true })
if (user_data.private_voices.textId != interaction.message.channel.id) return interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Bu Seçenek Sadece ${interaction.guild.channels.cache.get(user_data?.private_voices?.voiceId) ? interaction.guild.channels.cache.get(user_data?.private_voices?.voiceId).name : "Bulunamadı"} Kanalında Kullanılabilir!`, ephemeral: true })
if (interaction.values[0] === 'rename') {
const Modal = new Discord.ModalBuilder()
.setCustomId('channel-name')
.setTitle('Kanal İsmi Değiştirme');
const Input = new Discord.TextInputBuilder()
.setCustomId('Input')
.setPlaceholder('Özel Oda¹')
.setLabel("Yeni bir ad girin")
.setStyle(Discord.TextInputStyle.Short)
.setMinLength(1)
.setMaxLength(24)
let firstActionRow = new Discord.ActionRowBuilder().addComponents(Input);
Modal.addComponents(firstActionRow);
await interaction.showModal(Modal);
}
if (interaction.values[0] === 'limit') {
const Modal = new Discord.ModalBuilder()
.setCustomId('channel-limit')
.setTitle('Kullanıcı Limiti Değiştirme');
const Input = new Discord.TextInputBuilder()
.setCustomId('InputLimit')
.setPlaceholder('0 - 99')
.setLabel("Yeni bir kullanıcı sınırı girin")
.setStyle(Discord.TextInputStyle.Short)
.setMinLength(1)
.setMaxLength(2)
let firstActionRow = new Discord.ActionRowBuilder().addComponents(Input);
Modal.addComponents(firstActionRow);
await interaction.showModal(Modal);
}
}
}
if (interaction.isModalSubmit()) {
if (interaction.customId === 'channel-name') {
const input = interaction.fields.getTextInputValue('Input');
await interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${interaction.guild.emojiGöster(emojis.yes)} Kanal Adı Başarıyla Değiştirildi!`)], ephemeral: true })
await interaction.member.voice.channel.setName(input).catch(() => null)
}
if (interaction.customId === 'channel-limit') {
let input = interaction.fields.getTextInputValue('InputLimit');
if (isNaN(input)) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${interaction.guild.emojiGöster(emojis.no)} Lütfen Geçerli Bir Sayı Giriniz!`)], ephemeral: true })
if ((input >= 21) || input == 0) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${interaction.guild.emojiGöster(emojis.no)} Lütfen 1-20 Arasında Bir Sayı Giriniz!`)], ephemeral: true })
await interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${interaction.guild.emojiGöster(emojis.yes)} Kanal Limiti Başarıyla ${input} Olarak Değiştirildi!`)], ephemeral: true })
await interaction.member.voice.channel.setUserLimit(input).catch(() => null)
}
}
if (interaction.customId === "private-voice") {
await interaction.deferUpdate().catch(() => { })
let data = await PrivateRoomsGuild.findOne({ guildId: settings.Moderation.guildID });
if (!data) return;
let user_olddata = await PrivateRoomsUser.findOne({ guildId: settings.Moderation.guildID, userId: interaction.member.id });
if (!user_olddata) { await PrivateRoomsUser.create({ guildId: settings.Moderation.guildID, userId: interaction.member.id }) }
let user_data = await PrivateRoomsUser.findOne({ guildId: settings.Moderation.guildID, userId: interaction.member.id });
if (data.private_voices.mode === true) {
if (!user_data.private_voices.textId && !user_data.private_voices.voiceId) return interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Özel Oda Bulunamadı!`, ephemeral: true })
if (!interaction.member.voice.channel) return interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Özel Oda Bulunamadı!`, ephemeral: true })
if (user_data.private_voices.textId != interaction.message.channel.id) return interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Bu Seçenek Sadece ${interaction.guild.channels.cache.get(user_data?.private_voices?.voiceId) ? interaction.guild.channels.cache.get(user_data?.private_voices?.voiceId).name : "Bulunamadı"} Kanalında Kullanılabilir!`, ephemeral: true })
}
if (interaction.values[0] === 'ekleme') {
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.UserSelectMenuBuilder()
.setCustomId('private-voice-add')
.setPlaceholder('Kullanıcı Ekle')
.setMinValues(1)
.setMaxValues(1))
const msj = await interaction.channel.send({ content: `${interaction.guild.emojiGöster(emojis.face)} Kullanıcı Menüsü Açıldı!`, components: [row] })
let filter = (m) => interaction.member.id;
const collector = msj.createMessageComponentCollector({ filter, time: 120000 });
collector.on("collect", async (b) => {
if (b.customId === "private-voice-add") {
const member = b.guild.members.cache.get(b.values[0]);
if (!member) return b.reply({ content: `${b.guild.emojiGöster(emojis.no)} Kullanıcı Bulunamadı!`, ephemeral: true })
if (member.id === b.member.id) return b.reply({ content: `${b.guild.emojiGöster(emojis.no)} Kendinizi Sese Ekleyemezsiniz!`, ephemeral: true })
await b.member.voice.channel.permissionOverwrites.edit(member.id, { ViewChannel: true, Connect: true, Speak: true, Stream: true, PrioritySpeaker: true, RequestToSpeak: true, UseVAD: true }).catch(() => { })
await msj.edit({ content: `${b.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcı Başarıyla Odaya Eklendi!`, components: [] })
await member.voice.setChannel(b.member.voice.channel).catch(e => { })
}
})
collector.on("end", async () => {
await msj.delete().catch(() => { })
})
} else if (interaction.values[0] === 'cikarma') {
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.UserSelectMenuBuilder()
.setCustomId('private-voice-remove')
.setPlaceholder('Kullanıcı Kaldır')
.setMinValues(1)
.setMaxValues(1))
const msj = await interaction.channel.send({ content: `${interaction.guild.emojiGöster(emojis.face)} Kullanıcı Menüsü Açıldı!`, components: [row] })
let filter = (m) => interaction.member.id;
const collector = msj.createMessageComponentCollector({ filter, time: 120000 });
collector.on("collect", async (b) => {
if (b.customId === "private-voice-remove") {
const member = b.guild.members.cache.get(b.values[0]);
if (!member) return b.reply({ content: `${b.guild.emojiGöster(emojis.no)} Kullanıcı Bulunamadı!`, ephemeral: true })
if (member.id === b.member.id) return b.reply({ content: `${b.guild.emojiGöster(emojis.no)} Kendinizi Sesten Kaldıramazsınız!`, ephemeral: true })
await b.member.voice.channel.permissionOverwrites.edit(member.id, { ViewChannel: null, Connect: false, Speak: false, Stream: false, PrioritySpeaker: false, RequestToSpeak: false, UseVAD: false }).catch(() => { })
await msj.edit({ content: `${b.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcı Başarıyla Odadan Kaldırıldı!`, components: [] })
}
})
collector.on("end", async () => {
await msj.delete().catch(() => { })
})
} else if (interaction.values[0] === 'kick') {
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.UserSelectMenuBuilder()
.setCustomId('private-voice-kick')
.setPlaceholder('Kullanıcı At')
.setMinValues(1)
.setMaxValues(1))
const msj = await interaction.channel.send({ content: `${interaction.guild.emojiGöster(emojis.face)} Kullanıcı Menüsü Açıldı!`, components: [row] })
let filter = (m) => interaction.member.id;
const collector = msj.createMessageComponentCollector({ filter, time: 120000 });
collector.on("collect", async (b) => {
if (b.customId === "private-voice-kick") {
const member = b.guild.members.cache.get(b.values[0]);
if (!member) return b.reply({ content: `${b.guild.emojiGöster(emojis.no)} Kullanıcı Bulunamadı!`, ephemeral: true })
if (member.id === b.member.id) return b.reply({ content: `${b.guild.emojiGöster(emojis.no)} Kendinizi Sesten Atamazsınız!`, ephemeral: true })
if (!member.voice.channel) return b.reply({ content: `${b.guild.emojiGöster(emojis.no)} Bu Kullanıcı Seste Değil!`, ephemeral: true })
if (member.voice.channel.id !== b.member.voice.channel.id) return b.reply({ content: `${b.guild.emojiGöster(emojis.no)} Bu Kullanıcı Seste Değil!`, ephemeral: true })
await member.voice.disconnect().catch(() => { })
await msj.edit({ content: `${b.guild.emojiGöster(emojis.yes)} ${member} Adlı Kullanıcı Başarıyla Odadan Atıldı!`, components: [] })
}
})
collector.on("end", async () => {
await msj.delete().catch(() => { })
})
} else if (interaction.values[0] === 'lock') {
await interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: false, Connect: false, Speak: false, Stream: false, PrioritySpeaker: false, RequestToSpeak: false, UseVAD: false }).catch(() => { })
await interaction.followUp({ content: `${interaction.guild.emojiGöster(emojis.yes)} Oda Başarıyla Kilitlendi!`, ephemeral: true })
await PrivateRoomsUser.updateOne({ userId: interaction.member.user.id }, { $set: { 'private_voices.lock': true }, }, { upsert: true })
} else if (interaction.values[0] === 'unlock') {
await interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: true, Connect: true, Speak: true, Stream: true, PrioritySpeaker: false, RequestToSpeak: false, UseVAD: false }).catch(() => { })
await interaction.followUp({ content: `${interaction.guild.emojiGöster(emojis.yes)} Oda Başarıyla Açıldı!`, ephemeral: true })
await PrivateRoomsUser.updateOne({ userId: interaction.member.user.id }, { $set: { 'private_voices.lock': false }, }, { upsert: true })
} else if (interaction.values[0] === 'delete') {
await interaction.followUp({ content: `${interaction.guild.emojiGöster(emojis.yes)} Oda Başarıyla Silindi!`, ephemeral: true })
await interaction.member.voice.channel.delete().catch(() => { })
const textChannel = await interaction.guild.channels.cache.get(user_data.private_voices.textId)
await textChannel?.delete().catch(() => { })
await PrivateRoomsUser.deleteOne({ guildId: settings.Moderation.guildID, userId: interaction.member.id }, { upsert: true })
}
}
} else if (type == "role") {
let Database = await Menu.find({})
if(Database && Database.length >= 1) {
for (let index = 0; index < Database.length; index++) {
let menu = interaction.customId
let Data = Database[index]
if(Data.Secret == menu) {
let customMap = new Map()
Data.Roller.forEach(r => customMap.set(r, r))
let roles = Data.Roller
var role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = customMap.get(ids)
role.push(den)
}
if (interaction.values[0] === "rolsil") {
await member.removeRoles(roles).catch((e) => {})
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.kalp)} Başarıyla **${roles.map(r => interaction.guild.roles.cache.get(r) ? interaction.guild.roles.cache.get(r).name : "Rol").join(", ")}** Rol(leri) Alındı.`, ephemeral: true})
} else {
if (!interaction.values.length) {
await member.removeRoles(roles).catch(err => {})
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.kalp)} Başarıyla **${interaction.guild.roles.cache.get(roles[0]) ? interaction.guild.roles.cache.get(roles[0]).name : "Rol"}** Rolü Alındı.`, ephemeral: true})
} else {
await member.removeRoles(roles).catch(err => {})
await member.addRoles(role).catch(err => {})
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.kalp)} Başarıyla **${interaction.guild.roles.cache.get(role[0]) ? interaction.guild.roles.cache.get(role[0]).name : "Rol"}** Rolü Verildi.`, ephemeral: true})
}
}
}
}
}
if (interaction.customId === "etkinlikrol") {
let eventsMap = new Map([
["etkinlikkatilimcisi", ayar.etkinlikRoles],
["cekiliskatilimcisi", ayar.cekilisRoles]
])
let roles = [ayar.etkinlikRoles, ayar.cekilisRoles]
const role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = eventsMap.get(ids)
role.push(den);
}
if (interaction.values[0] === "temizle") {
await member.removeRoles(roles)
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla ${roles ? roles.map(x => `${interaction.guild.roles.cache.get(x)?.toString()}`).join(" | ") : `${interaction.guild.roles.cache.get(roles)?.toString()}`} Rol(leri) Alındı!`, ephemeral: true });
} else {
if (!interaction.values.length) {
await member.removeRoles(roles).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla ${roles ? roles.map(x => `${interaction.guild.roles.cache.get(x)?.toString()}`).join(" | ") : `${interaction.guild.roles.cache.get(roles)?.toString()}`} Rol(leri) Alındı!`, ephemeral: true });
} else if (interaction.values.length > 1) {
await member.addRoles(roles).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla ${roles ? roles.map(x => `${interaction.guild.roles.cache.get(x)?.toString()}`).join(" | ") : `${interaction.guild.roles.cache.get(roles)?.toString()}`} Rol(leri) Verildi!`, ephemeral: true });
} else if (interaction.values.length === 1) {
await member.removeRoles(roles).catch(err => { })
await member.addRoles(role).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla ${roles ? roles.map(x => `${interaction.guild.roles.cache.get(x)?.toString() || 'Bilinmeyen Rol'}`).join(" | ") : `${interaction.guild.roles.cache.get(roles)?.toString() || 'Bilinmeyen Rol'}`} Rol(leri) Alındı Ve ${role ? role.map(x => `${interaction.guild.roles.cache.get(x)?.toString() || 'Bilinmeyen Rol'}`).join(" | ") : `${interaction.guild.roles.cache.get(role)?.toString() || 'Bilinmeyen Rol'}`} Rol(ü) Verildi!`, ephemeral: true });
}
}
} else if (interaction.customId === "renkrol") {
let color = new Map([
["siyah", ayar.blackRoles],
["mavi", ayar.blueRoles],
["beyaz", ayar.whiteRoles],
["kirmizi", ayar.redRoles],
["sari", ayar.yellowRoles],
["pembe", ayar.pinkRoles],
["mor", ayar.purpleRoles],
["turuncu", ayar.orangeRoles],
["yesil", ayar.greenRoles],
["kahverengi", ayar.brownRoles],
["bordo", ayar.burgundyRoles],
["turkuaz", ayar.turquoiseRoles],
["bej", ayar.beigeRoles],
["lacivert", ayar.navyblueRoles],
["mavitwo", ayar.lightblueRoles],
["yesiltwo", ayar.pistachiogreenRoles],
])
let role = color.get(interaction.values[0])
let renkroller = [ayar.blackRoles, ayar.blueRoles, ayar.whiteRoles, ayar.redRoles, ayar.yellowRoles, ayar.pinkRoles, ayar.purpleRoles, ayar.orangeRoles, ayar.greenRoles, ayar.brownRoles, ayar.burgundyRoles, ayar.turquoiseRoles, ayar.beigeRoles, ayar.navyblueRoles, ayar.lightblueRoles, ayar.pistachiogreenRoles]
if (!member.roles.cache.has(ayar.tagRoles) && !member.roles.cache.has(ayar.boosterRoles) && !member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: "Rollerin Güncellenirken Bir Hata Oluştu!", ephemeral: true });
if (interaction.values[0] === "temizle") {
await member.removeRoles(renkroller)
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla Renk Rol(leri) Alındı!`, ephemeral: true });
} else {
if (!interaction.values.length) {
await member.removeRoles(renkroller).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} Renk Rol(leri) Alındı!`, ephemeral: true });
} else if (interaction.values.length > 1) {
await member.addRoles(role).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla ${role ? interaction.guild.roles.cache.get(role)?.toString() : 'Bilinmeyen Rol'} Rol(leri) Verildi!`, ephemeral: true });
} else {
await member.removeRoles(renkroller).catch(err => { })
await member.addRoles(role).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla Renk Rol(leri) Alındı Ve ${role ? interaction.guild.roles.cache.get(role)?.toString() : 'Bilinmeyen Rol'} Rol(ü) Verildi!`, ephemeral: true });
}
}
} else if (interaction.customId === "burcrol") {
let burçMap = new Map([
["koç", ayar.kocRoles],
["boğa", ayar.bogaRoles],
["ikizler", ayar.ikizlerRoles],
["yengeç", ayar.yengecRoles],
["aslan", ayar.aslanRoles],
["başak", ayar.basakRoles],
["terazi", ayar.teraziRoles],
["akrep", ayar.akrepRoles],
["yay", ayar.yayRoles],
["oğlak", ayar.oglakRoles],
["kova", ayar.kovaRoles],
["balık", ayar.balikRoles],
])
let roles = [ayar.akrepRoles, ayar.yengecRoles, ayar.ikizlerRoles, ayar.yayRoles, ayar.aslanRoles, ayar.teraziRoles, ayar.basakRoles, ayar.kovaRoles, ayar.balikRoles, ayar.oglakRoles, ayar.bogaRoles, ayar.kocRoles]
const role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = burçMap.get(ids)
role.push(den)
}
if (interaction.values[0] === "temizle") {
await member.removeRoles(roles)
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla Burç Rol(leri) Alındı!`, ephemeral: true });
} else {
if (!interaction.values.length) {
await member.removeRoles(roles).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla Burç Rol(leri) Alındı!`, ephemeral: true });
} else if (interaction.values.length > 1) {
await member.addRoles(roles).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla ${role ? role.map(x => `${interaction.guild.roles.cache.get(x)?.toString()}`).join(" | ") : `${interaction.guild.roles.cache.get(roles)?.toString()}`} Rol(leri) Verildi!`, ephemeral: true });
} else {
await member.removeRoles(roles).catch(err => { })
await member.addRoles(role).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla Burç Rol(leri) Alındı Ve ${role ? role.map(x => `${interaction.guild.roles.cache.get(x)?.toString()}`).join(" | ") : `${interaction.guild.roles.cache.get(role)?.toString()}`} Rol(ü) Verildi!`, ephemeral: true });
}
}
} else if (interaction.customId === "takimrol") {
let takimMap = new Map([
["fb", ayar.fbRoles],
["gs", ayar.gsRoles],
["bjk", ayar.bjkRoles],
["ts", ayar.tsRoles],
])
let roles = [ayar.fbRoles, ayar.gsRoles, ayar.bjkRoles, ayar.tsRoles]
const role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = takimMap.get(ids)
role.push(den)
}
if (interaction.values[0] === "temizle") {
await member.removeRoles(roles)
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla Takım Rol(leri) Alındı!`, ephemeral: true });
} else {
if (!interaction.values.length) {
await member.removeRoles(roles).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla Takım Rol(leri) Alındı!`, ephemeral: true });
} else if (interaction.values.length > 1) {
await member.addRoles(roles).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla ${role ? role.map(x => `${interaction.guild.roles.cache.get(x)?.toString()}`).join(" | ") : `${interaction.guild.roles.cache.get(roles)?.toString()}`} Rol(leri) Verildi!`, ephemeral: true });
} else {
await member.removeRoles(roles).catch(err => { })
await member.addRoles(role).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla Takım Rol(leri) Alındı Ve ${role ? role.map(x => `${interaction.guild.roles.cache.get(x)?.toString()}`).join(" | ") : `${interaction.guild.roles.cache.get(role)?.toString()}`} Rol(ü) Verildi!`, ephemeral: true });
}
}
} else if (interaction.customId === "iliskirol") {
let LoveMap = new Map([
["couple", ayar.coupleRoles],
["alone", ayar.aloneRoles],
["sy", ayar.syRoles],
])
let roles = [ayar.coupleRoles, ayar.aloneRoles, ayar.syRoles]
const role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = LoveMap.get(ids)
role.push(den)
}
if (interaction.values[0] === "temizle") {
await member.removeRoles(roles)
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla İlişki Durumu Rol(leri) Alındı!`, ephemeral: true });
} else {
if (!interaction.values.length) {
await member.removeRoles(roles).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla İlişki Durumu Rol(leri) Alındı!`, ephemeral: true });
} else if (interaction.values.length > 1) {
await member.addRoles(roles).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla ${role ? role.map(x => `${interaction.guild.roles.cache.get(x)?.toString()}`).join(" | ") : `${interaction.guild.roles.cache.get(roles)?.toString()}`} Rol(leri) Verildi!`, ephemeral: true });
} else {
await member.removeRoles(roles).catch(err => { })
await member.addRoles(role).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla İlişki Durumu Rol(leri) Alındı Ve ${role ? role.map(x => `${interaction.guild.roles.cache.get(x)?.toString()}`).join(" | ") : `${interaction.guild.roles.cache.get(role)?.toString()}`} Rol(ü) Verildi!`, ephemeral: true });
}
}
} else if (interaction.customId === "oyunrol") {
let GameMap = new Map([
["csgo", ayar.csRoles],
["lol", ayar.lolRoles],
["valorant", ayar.valorantRoles],
["gta5", ayar.gtavRoles],
["pubg", ayar.pubgRoles],
["fortnite", ayar.fortniteRoles],
["minecraft", ayar.minecraftRoles],
["mobilelegends", ayar.mlbbRoles],
["amongus", ayar.amongusRoles],
["metin2", ayar.metinTwoRoles],
["fivem", ayar.fivemRoles],
["zula", ayar.zulaRoles],
["mta", ayar.mtaRoles],
])
let roles = [ayar.amongusRoles, ayar.pubgRoles, ayar.csRoles, ayar.fortniteRoles, ayar.gtavRoles, ayar.valorantRoles, ayar.lolRoles, ayar.mlbbRoles, ayar.minecraftRoles, ayar.metinTwoRoles, ayar.fivemRoles, ayar.zulaRoles, ayar.mtaRoles]
const role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = GameMap.get(ids)
role.push(den)
}
if (interaction.values[0] === "temizle") {
await member.removeRoles(roles)
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla Oyun Rol(leri) Alındı!`, ephemeral: true });
} else {
if (!interaction.values.length) {
await member.removeRoles(roles).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla Oyun Rol(leri) Alındı!`, ephemeral: true });
} else if (interaction.values.length > 3) {
await member.addRoles(roles).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla ${role ? role.map(x => `${interaction.guild.roles.cache.get(x)?.toString()}`).join(" | ") : `${interaction.guild.roles.cache.get(roles)?.toString()}`} Rol(leri) Verildi!`, ephemeral: true });
} else {
await member.removeRoles(roles).catch(err => { })
await member.addRoles(role).catch(err => { })
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} ${member.toString()} Başarıyla Oyun Rol(leri) Alındı Ve ${role ? role.map(x => `${interaction.guild.roles.cache.get(x)?.toString()}`).join(" | ") : `${interaction.guild.roles.cache.get(role)?.toString()}`} Rol(leri) Verildi!`, ephemeral: true });
}
}
}
} else if (type == "application") {
if (interaction.customId === "cezapuans") {
const data = await PenaltiesPoints.findOne({ guildID: interaction.guild.id, userID: member.id })
if (!data) {
return await interaction.reply({ content: `${member} **${interaction.guild.name}** Sunucusunda **0** Ceza Puanın Bulunmakta.`, ephemeral: true })
}
await interaction.reply({ content: `${member} **${interaction.guild.name}** Sunucusunda **${data.cezapuan}** Ceza Puanın Bulunmakta.`, ephemeral: true })
}
if (interaction.customId === "punishs") {
let data = await Penalties.find({ guildID: interaction.guild.id, userID: member.id, active: true }).sort({ date: -1 }).limit(20)
if (!data) {
return await interaction.reply({ content: `\`\`\`yml\nTebrikler! ${interaction.guild.name} Sunucusun da Sana Ait Ceza Bilgisine Ulaşılamadı.\`\`\``, ephemeral: true })
}
const typeMapping = {
"CHAT-MUTE": "C-Mute",
"VOICE-MUTE": "V-Mute",
"JAIL": "Jail",
"BAN": "Ban",
"TEMP-JAIL": "T-Jail",
"WARN": "Uyarı",
};
data = data.map((x, index) => {
const type = typeMapping[x.type] || x.type;
return `\` ${index+1}. \` \` ${x.active == true ? "🟢 (Aktif)" : "🔴 (Deaktif)"} \` [**${type}**] <t:${Math.floor(x.date / 1000)}> Tarihinde **${interaction.guild.members.cache.get(x.staff) ? interaction.guild.members.cache.get(x.staff).toString() : client.users.cache.get(x.staff).globalName}** Tarafından **${x.reason}** Sebebiyle Cezalandırıldın.`;
});
await interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${interaction.guild.emojiGöster(emojis.info)} ${member} **(${data.length})** Ceza Bilgilerin Aşağıda Belirtilmiştir.\n\n${data.join("\n") || "```yml\nVeri bulunamadı.\n```"}`).setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }).setColor("Green").setFooter({ text: member.user.username, iconURL: member.displayAvatarURL({ dynamic: true })}).setThumbnail(member.displayAvatarURL({ dynamic: true }))], ephemeral: true })
}
if(interaction.customId === "punishtime") {
let data = await Penalties.find({ guildID: interaction.guild.id, userID: member.id, active: true }).sort({ date: -1 }).limit(20)
if (!data) {
return await interaction.reply({ content: `\`\`\`yml\nTebrikler! ${interaction.guild.name} Sunucusun da Sana Ait Ceza Bilgisine Ulaşılamadı.\`\`\``, ephemeral: true })
}
const typeMapping = {
"CHAT-MUTE": "C-Mute",
"VOICE-MUTE": "V-Mute",
"JAIL": "Jail",
"BAN": "Ban",
"TEMP-JAIL": "T-Jail",
"WARN": "Uyarı",
};
data = data.map((x, index) => {
const type = typeMapping[x.type] || x.type;
return `\` ${index+1}. \` <t:${Math.floor(x.date / 1000)}> Tarihinde **${interaction.guild.members.cache.get(x.staff) ? interaction.guild.members.cache.get(x.staff).toString() : client.users.cache.get(x.staff).globalName}** Tarafından [**${type}**] Türündeki Cezalandırman <t:${Math.floor(x.finishDate / 1000)}:R> Biticektir.`;
});
await interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${interaction.guild.emojiGöster(emojis.info)} ${member} **(${data.length})** Ceza Bitiş Süreleri Aşağıda Belirtilmiştir.\n\n${data.join("\n") || "```yml\nVeri bulunamadı.\n```"}`).setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }).setColor("Green").setFooter({ text: member.user.username, iconURL: member.displayAvatarURL({ dynamic: true })}).setThumbnail(member.displayAvatarURL({ dynamic: true }))], ephemeral: true })
}
if(interaction.customId === "sahiplen") {
const Roller = interaction.guild.roles.cache.filter(x => x.name.includes("Streamer") || x.name.includes("Yayın") || x.name.includes("Yayıncı") || x.name.includes("Kamera") || x.name.includes("Camera") || x.name.includes("stream") || x.name.includes("streamer") || x.name.includes("🎥 Streamer")).map(x => x.id)
if(!Roller || !Roller.some(x => member.roles.cache.has(x))) {
return await interaction.reply({content: "Bu Komutu Kullanabilmek için Streamer Rolüne Sahip Olmanız Gerekli.", ephemeral: true})
}
if(!interaction.member.voice.channel) {
return await interaction.reply({content: "Bir sesli kanalda olmalısın!", ephemeral: true})
}
if(interaction.member.voice.channel?.parentId != ayar.streamerParents) {
return await interaction.reply({content: "Streamer Seslerinde Olman Gerekli.", ephemeral: true})
}
const Data = await StreamerDB.findOne({guildID: interaction.guild.id, channelID: interaction.member.voice.channelId})
if(Data && Data.Owner.length > 1 && !Data.Owner.includes(interaction.user.id)) {
return await interaction.reply({content: "Bu Kanalın Sahibi Değilsin.", ephemeral: true})
}
if(Data && Data.Owner.includes(interaction.user.id)) {
return await interaction.reply({content: "Bu Kanalı Zaten Sahiplenmişsin.", ephemeral: true})
}
const perm = {Stream: true, MuteMembers: true, DeafenMembers: true, UseVAD: true, PrioritySpeaker: true, RequestToSpeak: true, Speak: true}
await interaction.member.voice.channel.permissionOverwrites.edit(interaction.user.id, perm).catch(err => { })
await StreamerDB.updateOne({guildID: interaction.guild.id, channelID: interaction.member.voice.channelId}, { $set: { Owner: interaction.user.id, Date: Date.now(), AllowStreamer: [], DenyStreamer: []} }, { upsert: true })
await interaction.reply({content: "Başarıyla Kanalı Sahiplendin.", ephemeral: true})
}
if(interaction.customId === "streamizinver") {
const Roller = interaction.guild.roles.cache.filter(x => x.name.includes("Streamer") || x.name.includes("Yayın") || x.name.includes("Yayıncı") || x.name.includes("Kamera") || x.name.includes("Camera") || x.name.includes("stream") || x.name.includes("streamer") || x.name.includes("🎥 Streamer")).map(x => x.id)
if(!Roller || !Roller.some(x => member.roles.cache.has(x))) {
return await interaction.reply({content: "Bu Komutu Kullanabilmek için Streamer Rolüne Sahip Olmanız Gerekli.", ephemeral: true})
}
if(!interaction.member.voice.channel) {
return await interaction.reply({content: "Bir sesli kanalda olmalısın!", ephemeral: true})
}
if(interaction.member.voice.channel?.parentId != ayar.streamerParents) {
return await interaction.reply({content: "Streamer Seslerinde Olman Gerekli.", ephemeral: true})
}
const Data = await StreamerDB.findOne({guildID: interaction.guild.id, channelID: interaction.member.voice.channelId})
if(!Data) {
return await interaction.reply({content: "Bu Kanalı Sahiplenmen Gerekli.", ephemeral: true})
}
if(Data.Owner.length > 1 && !Data.Owner.includes(interaction.user.id)) {
return await interaction.reply({content: "Bu Kanalın Sahibi Değilsin.", ephemeral: true})
}
const Members = interaction.member.voice.channel.members;
const options = [];
Members.forEach(x => {
options.push({label: x.displayName, value: x.id})
})
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("addPermission")
.setPlaceholder("Bir Kullanıcı Seç.")
.addOptions(options))
await interaction.reply({components: [row], ephemeral: true})
}
if(interaction.customId === "streamizinal") {
const Roller = interaction.guild.roles.cache.filter(x => x.name.includes("Streamer") || x.name.includes("Yayın") || x.name.includes("Yayıncı") || x.name.includes("Kamera") || x.name.includes("Camera") || x.name.includes("stream") || x.name.includes("streamer") || x.name.includes("🎥 Streamer")).map(x => x.id)
if(!Roller || !Roller.some(x => member.roles.cache.has(x))) {
return await interaction.reply({content: "Bu Komutu Kullanabilmek için Streamer Rolüne Sahip Olmanız Gerekli.", ephemeral: true})
}
if(!interaction.member.voice.channel) {
return await interaction.reply({content: "Bir sesli kanalda olmalısın!", ephemeral: true})
}
if(interaction.member.voice.channel?.parentId != ayar.streamerParents) {
return await interaction.reply({content: "Streamer Seslerinde Olman Gerekli.", ephemeral: true})
}
const Data = await StreamerDB.findOne({guildID: interaction.guild.id, channelID: interaction.member.voice.channelId})
if(!Data) {
return await interaction.reply({content: "Bu Kanalı Sahiplenmen Gerekli.", ephemeral: true})
}
if(Data.Owner.length > 1 && !Data.Owner.includes(interaction.user.id)) {
return await interaction.reply({content: "Bu Kanalın Sahibi Değilsin.", ephemeral: true})
}
const Members = interaction.member.voice.channel.members;
const options = [];
Members.forEach(x => {
options.push({label: x.displayName, value: x.id})
})
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("removePermission")
.setPlaceholder("Bir Kullanıcı Seç.")
.addOptions(options))
await interaction.reply({components: [row], ephemeral: true})
}
if(interaction.customId === "removePermission") {
if(!interaction.values[0]) {
return await interaction.update({content: "Bir Kullanıcı Seç.", components: []})
}
const Data = await StreamerDB.findOne({guildID: interaction.guild.id, channelID: interaction.member.voice.channelId})
if(!Data) {
return await interaction.update({content: "Bu Kanalı Sahiplenmen Gerekli.", components: []})
}
if(Data.Owner.length > 1 && !Data.Owner.includes(interaction.user.id)) {
return await interaction.update({content: "Bu Kanalın Sahibi Değilsin.", components: []})
}
await interaction.member.voice.channel.permissionOverwrites.edit(interaction.values[0], {Stream: false, UseVAD: false, PrioritySpeaker: false, RequestToSpeak: false, Speak: false}).catch(err => { })
await StreamerDB.updateOne({guildID: interaction.guild.id, channelID: interaction.member.voice.channelId}, {$push: {DenyStreamer: interaction.values[0]}}).catch(err => { })
if(Data.AllowStreamer.includes(interaction.values[0])) {
await StreamerDB.updateOne({guildID: interaction.guild.id, channelID: interaction.member.voice.channelId}, {$pull: {AllowStreamer: interaction.values[0]}}).catch(err => { })
}
await interaction.update({content: "Kullanıcı İzinleri Silindi.", components: []})
}
if(interaction.customId === "addPermission") {
if(!interaction.values[0]) {
return await interaction.update({content: "Bir Kullanıcı Seç.", components: []})
}
const Data = await StreamerDB.findOne({guildID: interaction.guild.id, channelID: interaction.member.voice.channelId})
if(!Data) {
return await interaction.update({content: "Bu Kanalı Sahiplenmen Gerekli.", components: []})
}
if(Data.Owner.length > 1 && !Data.Owner.includes(interaction.user.id)) {
return await interaction.update({content: "Bu Kanalın Sahibi Değilsin.", components: []})
}
await interaction.member.voice.channel.permissionOverwrites.edit(interaction.values[0], {Stream: true, UseVAD: true, PrioritySpeaker: true, RequestToSpeak: true, Speak: true}).catch(err => { })
await StreamerDB.updateOne({guildID: interaction.guild.id, channelID: interaction.member.voice.channelId}, {$push: {AllowStreamer: interaction.values[0]}}).catch(err => { })
if(Data.DenyStreamer.includes(interaction.values[0])) {
await StreamerDB.updateOne({guildID: interaction.guild.id, channelID: interaction.member.voice.channelId}, {$pull: {DenyStreamer: interaction.values[0]}}).catch(err => { })
}
await interaction.update({content: "Başarıyla İzin Verildi.", components: []})
}
if(interaction.customId === "register-panel") {
if(!interaction.member.voice.channel) {
return await interaction.reply({content: "Bir sesli kanalda olmalısın!", ephemeral: true})
}
if(interaction.member.voice.channel?.parentId != ayar.registerParents) {
return await interaction.reply({content: "Register Seslerinde Olman Gerekli.", ephemeral: true})
}
if(rzaman.get(member.id) >= 1) {
return await interaction.reply({content: "15 dakika sonra tekrar deneyin.", ephemeral: true})
}
const channelMembers = interaction.member.voice.channel.members.filter(x => !x.user.bot && ayar.registerRoles.some(y => x.roles.cache.has(y)) && ayar.staffRoles.some(y => x.roles.cache.has(y)) && ayar.seniorStaffRoles.some(y => x.roles.cache.has(y)) && x.permissions.has(Discord.PermissionFlagsBits.Administrator) && ayar.ownerRoles.some(y => x.roles.cache.has(y)))
const staff = interaction.guild.roles.cache.filter(x => x.id != ayar.registerPerms)
if(ayar.registerRoles.some(y => member.roles.cache.has(y)) && ayar.staffRoles.some(y => member.roles.cache.has(y)) && ayar.seniorStaffRoles.some(y => member.roles.cache.has(y)) && member.permissions.has(Discord.PermissionFlagsBits.Administrator) && ayar.ownerRoles.some(y => member.roles.cache.has(y))) {
return await interaction.reply({content: "Bu Buttonu Sadece Kayıtsızlar Kullanabilir.", ephemeral: true})
}
if(channelMembers.size > 0) {
return await interaction.reply({content: "Bu Kanalda Zaten Yetkili Bulunuyor.", ephemeral: true})
}
await interaction.reply({content: "Başarıyla Yetkili Çağırıldı Lütfen Bekleyin.", ephemeral: true})
if(channelMembers.size < 1) {
const channel = await interaction.guild.channels.cache.get(ayar.welcomeChannel)
if(channel) await channel.send({content: `${staff.map(x => x.toString()).join(", ")} | ${member} Kullanıcısı Sizi ${member.voice.channel} Kanalında Kayıt İçin Bekliyor.`})
rzaman.set(member.id, (rzaman.get(member.id) || 1));
setTimeout(() => {
rzaman.delete(member.id)
}, 1000 * 60 * 15 * 1)
}
}
if(interaction.customId === "streamname") {
if(!interaction.member.voice.channel) {
return await interaction.reply({content: "Bir sesli kanalda olmalısın!", ephemeral: true})
}
if(interaction.member.voice.channel?.parentId != ayar.streamerParents) {
return await interaction.reply({content: "Streamer Seslerinde Olman Gerekli.", ephemeral: true})
}
const Data = await StreamerDB.findOne({guildID: interaction.guild.id, channelID: interaction.member.voice.channelId})
if(!Data) {
return await interaction.reply({content: "Bu Kanalı Sahiplenmen Gerekli.", ephemeral: true})
}
if(Data.Owner.length > 1 && !Data.Owner.includes(interaction.user.id)) {
return await interaction.reply({content: "Bu Kanalın Sahibi Değilsin.", ephemeral: true})
}
const Roller = interaction.guild.roles.cache.filter(x => x.name.includes("Streamer Lider") || x.name.includes("Streamer Lideri") || x.name.includes("Streamer Sorumlusu") || x.name.includes("Streamer Sorumlu")).map(x => x.id)
if(!Roller || !Roller.some(x => member.roles.cache.has(x))) {
return await interaction.reply({content: "Bu Komutu Kullanabilmek için Streamer Rolüne Sahip Olmanız Gerekli.", ephemeral: true})
}
const Modal = new Discord.ModalBuilder()
.setCustomId('streamer-channel-name')
.setTitle('Kanal İsmi Değiştirme');
const Input = new Discord.TextInputBuilder()
.setCustomId('channel-name')
.setPlaceholder('Özel Oda¹')
.setLabel("Yeni bir ad girin")
.setStyle(Discord.TextInputStyle.Short)
.setMinLength(1)
.setMaxLength(24)
let firstActionRow = new Discord.ActionRowBuilder().addComponents(Input);
Modal.addComponents(firstActionRow);
await interaction.showModal(Modal);
}
if (interaction.isModalSubmit()) {
if (interaction.customId === 'streamer-channel-name') {
const input = interaction.fields.getTextInputValue('channel-name');
await interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${interaction.guild.emojiGöster(emojis.yes)} Kanal Adı Başarıyla Değiştirildi!`)], ephemeral: true })
await interaction.member.voice.channel.setName(input).catch(() => null)
}
}
if(interaction.customId === "yardimss") {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId('helps')
.setPlaceholder('Bot komutlarını görüntülemek için tıklayınız!')
.addOptions([
{
label: "Kullanıcı",
description: 'Kullanıcı komutlarını görüntülemek için tıklayınız.',
value: 'kullanicik',
emoji: interaction.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Özel Komutlar',
description: 'Özel Komutları görüntülemek için tıklayınız.',
value: 'ozelkk',
emoji: interaction.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Cezalandırma',
description: 'Cezalandırma komutlarını görüntülemek için tıklayınız.',
value: 'cezalandirmak',
emoji: interaction.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Kayıt',
description: 'Kayıt komutlarını görüntülemek için tıklayınız.',
value: 'kayitcommand',
emoji: interaction.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Yetkili',
description: 'Yetkiki komutlarını görüntülemek için tıklayınız.',
value: 'yetkilik',
emoji: interaction.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Üst Yetkili',
description: 'Üst Yetkili komutlarını görüntülemek için tıklayınız.',
value: 'ustyetkilik',
emoji: interaction.guild.emojiGöster(emojis.sagok).id,
},
{
label: 'Owner',
description: 'Owner komutlarını görüntülemek için tıklayınız.',
value: 'ownerk',
emoji: interaction.guild.emojiGöster(emojis.sagok).id,
},
]),
);
await interaction.reply({ content: `**Merhaba!** Yardım almak ister misin?\nAşağıda bulunan menüden yardım almak istediğiniz kategoriyi seçin. 🎉`, components: [row], ephemeral: true}).catch((e) => {})
}
if(interaction.customId === "helps") {
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
if(interaction.customId === "ayliks") {
const db = await setup.findOne({guildID: settings.Moderation.guildID, userID: member.id})
if(!db) new setup({guildID: settings.Moderation.guildID, userID: member.id, levelSystem: true, monthlySystem: true}).save();
if(db) {
if(db.monthlySystem == false) await setup.updateOne({guildID: settings.Moderation.guildID, userID: member.id}, {$set: { monthlySystem: true } }, { upsert: true }), interaction.reply({content: 'Başarıyla Aylık Rol Sistemi Aktif Hale Getirildi.', ephemeral: true}).catch((e) => {})
if(db.monthlySystem == true) await setup.updateOne({guildID: settings.Moderation.guildID, userID: member.id}, {$set: { monthlySystem: false } }, { upsert: true }), interaction.reply({content: 'Başarıyla Aylık Rol Sistemi Deaktif Hale Getirildi.', ephemeral: true}).catch((e) => {})
}
}
if(interaction.customId === "levels") {
const db = await setup.findOne({guildID: settings.Moderation.guildID, userID: member.id})
if(!db) new setup({guildID: settings.Moderation.guildID, userID: member.id, levelSystem: true, monthlySystem: true}).save();
if(db) {
if(db.levelSystem == false) await setup.updateOne({guildID: settings.Moderation.guildID, userID: member.id}, {$set: { levelSystem: true } }, { upsert: true }), interaction.reply({content: 'Başarıyla Level Sistemi Aktif Hale Getirildi.', ephemeral: true}).catch((e) => {})
if(db.levelSystem == true) await setup.updateOne({guildID: settings.Moderation.guildID, userID: member.id}, {$set: { levelSystem: false } }, { upsert: true }), interaction.reply({content: 'Başarıyla Level Sistemi Deaktif Hale Getirildi.', ephemeral: true}).catch((e) => {})
}
}
const modalsss = new Discord.ModalBuilder()
.setCustomId('bisims')
.setTitle('Booster Panel')
const sssssss = new Discord.TextInputBuilder()
.setCustomId('isim')
.setLabel('İsminiz ?')
.setStyle(Discord.TextInputStyle.Short)
.setPlaceholder('Buraya İsminizi Yazınız!');
const sxxxxxxxx = new Discord.ActionRowBuilder().addComponents(sssssss);
modalsss.addComponents(sxxxxxxxx);
if(interaction.isButton()) {
if(interaction.customId === "boosters") {
if(!interaction.member.roles.cache.has(ayar.boosterRoles)) return interaction.reply({content: `${interaction.guild.roles.cache.get(ayar.boosterRoles)} Booster Olmadığın İçin Bu Sistemi Kullanamazsın.`, ephemeral: true}).catch(() => {});
if (bzaman.get(member.id) >= 1) return interaction.reply({content: `${member} Bu komutu 15 dakika'da bir kullanabilirsin.`, ephemeral: true}).catch(() => {});
interaction.showModal(modalsss, {
client: client,
interaction: interaction,
})
}
}
if(interaction.customId === "bisims") {
const bilgisi = interaction.fields.getTextInputValue('isim');
const engel = ["!", "'", "?", "$", "#", "%", ",", ".", "*", "/", "-", "+", ":", ";", "<", ">", "(", ")", "&", "^", "£", "!", "{", "}", "[", "]", "=", "§", "��"];
if(bzaman.get(member.id) >= 1) return interaction.reply({content: `${member} Bu komutu 15 dakika'da bir kullanabilirsin.`, ephemeral: true}).catch(() => {});
if(engel.some(char => bilgisi.toLowerCase().includes(char))) return interaction.reply({content: 'İsmine Özel Karakter Koyamazsın.', ephemeral: true}).catch(() => {});
if(bilgisi.length >= 18) return interaction.reply({content: 'İsmin 18 Karakterden Uzun Olamaz.', ephemeral: true}).catch(() => {});
await member.setNickname(`${member.user.globalName && member.user.globalName.includes(ayar.nameTag) ? ayar.nameTag : (ayar.defaultTag ? ayar.defaultTag : (ayar.nameTag || ""))} ${bilgisi}`).catch(() => {});
await interaction.reply({content: `Başarıyla İsmin **${bilgisi}** Olarak Değiştirildi.`, ephemeral: true }).catch(() => {});
bzaman.set(member.id, (bzaman.get(member.id) || 1));
setTimeout(() => {
bzaman.delete(member.id)
}, 1000 * 60 * 15 * 1)
}
if(interaction.customId === "levelss") {
const MData = await MessageUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id }) || []
const VData = await VoiceUser.findOne({ guildID: settings.Moderation.guildID, userID: member.user.id }) || []
if(!VData && !MData) return interaction.reply({ content: `${member} Level Bilgileri Bulunamadı.`, ephemeral: true }).catch(() => {})
await interaction.reply({content: `${interaction.guild.emojiGöster(emojis.info)} ${member} Seviye Bilgilerin Aşağıda Belirtilmiştir.

${interaction.guild.emojiGöster(emojis.sagok)} __**Mesaj Seviye**__
${interaction.guild.emojiGöster(emojis.nokta)} Seviye: \` ${MData.messageLevel} Sv. \` \` %${Math.floor((MData.messageXP ? MData.messageXP.toFixed(1) : 0)/((MData.messageLevel + 1) * 1000)*100)} \` ${await client.progressBar(MData.messageXP ? MData.messageXP.toFixed(1) : 0, (MData.messageLevel + 1) * 1000, 5, MData.messageXP ? MData.messageXP.toFixed(1) : 0)}

${interaction.guild.emojiGöster(emojis.sagok)} __**Ses Seviye**__
${interaction.guild.emojiGöster(emojis.nokta)} Seviye: \` ${VData.voiceLevel} Sv. \` \` %${Math.floor((VData.voiceXP ? VData.voiceXP.toFixed(1) : 0)/((VData.voiceLevel + 1) * 7200000)*100)} \` ${await client.progressBar(VData.voiceXP ? VData.voiceXP.toFixed(1) : 0, (VData.voiceLevel + 1) * 7200000, 5, VData.voiceXP ? VData.voiceXP.toFixed(1) : 0)}`, ephemeral: true})
}
if(interaction.customId === "aylikss") {
const mesaj = await interaction.reply({content: 'Veri Yükleniyor...', ephemeral: true})
let bilgi = await monthlycontrol(member)
mesaj.edit({ content: `${bilgi}`, ephemeral: true }).catch(() => {});
}
if (interaction.customId === "suphekontrol") {
if(!ayar.fakeAccRoles.some(x => interaction.member.roles.cache.has(x)) || ayar.manRoles.some(x => interaction.member.roles.cache.has(x)) || ayar.womanRoles.some(x => interaction.member.roles.cache.has(x)) || interaction.member.roles.highest.position >= interaction.guild.roles.cache.get(ayar.fakeAccRoles[0]).position) return interaction.reply({content: `Zaten Kayıtlısın Sunucuda.`, ephemeral: true})
if (Date.now() - interaction.user.createdTimestamp < ms("7d")) {
const embed = new Discord.EmbedBuilder().setDescription(`*Hesabının kuruluş tarihi: <t:${Math.floor(interaction.member.user.createdTimestamp / 1000)}>\n\nHesabın: <t:${Math.floor(interaction.member.user.createdTimestamp / 1000)}:R> kurulmuş\n\nHesabının kuruluş tarihi 7 günü geçmediği için seni şüpheliden çıkartamadım. Daha sonra tekrar kontrol edebilirsin.*`)
.setColor("Red");
await interaction.reply({ embeds: [embed], ephemeral: true });
} else {
interaction.member.setRoles(ayar.unregRoles[0]).catch(e => {});
const embed = new Discord.EmbedBuilder().setColor("Green").setDescription(`*Hesabının kuruluş tarihi: <t:${Math.floor(interaction.member.user.createdTimestamp / 1000)}>\n\nHesabın: <t:${Math.floor(interaction.member.user.createdTimestamp / 1000)}:R> kurulmuş\n\nHesabının kuruluş tarihi 7 günü geçtiği için seni şüpheliden çıkarttım. Teyit kanallarımıza girip kayıt olabilirsin.*`);
await interaction.reply({ embeds: [embed], ephemeral: true });
}
}
if(interaction.customId === "sc-panel") {
if (ScLimit.get(interaction.member.id) >= 1) return interaction.reply({content: "15 dakika sonra tekrar dene.", ephemeral: true})
if(!interaction.member.voice.channel) return interaction.reply({content: "Bir ses kanalında olmalısın.", ephemeral: true})
if(interaction.member.voice.channel.parentId != ayar.solvingParents) return interaction.reply({content: "Sorun Çözme Kanallarında Olmalısın.", ephemeral: true})
await interaction.reply({content: "Sorun Çözme Başarıyla Çağırıldı Lütfen Bekleyiniz.", ephemeral: true})
const channel = await interaction.guild.channels.cache.get(ayar.solvingLog)
const yt = await interaction.guild.members.cache.filter(x => ayar.scRoles.some(a => x.roles.cache.has(a)))
if(channel) await channel.send({content: `${ayar.scRoles.map(y => interaction.guild.roles.cache.get(y)).join(", ") || yt.map(x => x.toString()).join(", ")} | ${interaction.member} Kullanıcısı Sizi ${interaction.member.voice.channel} Kanalında Sorun Çözme İçin Çağırıyor.`})
ScLimit.set(interaction.member.id, (ScLimit.get(interaction.member.id) || 1));
setTimeout(() => {
ScLimit.delete(interaction.member.id)
}, 1000 * 60 * 15 * 1)
}
if (interaction.customId === "application-panel") {
if (interaction.values[0] === "streamerapplication") {
const modal = new Discord.ModalBuilder()
.setTitle("Streamer Başvuru Formu")
.setCustomId("streamerapplications");

const neden = new Discord.TextInputBuilder()
.setCustomId("neden")
.setPlaceholder("Neden Streamer Olmak İstiyorsun?")
.setLabel("Neden Streamer Olmak İstiyorsun?")
.setMinLength(10)
.setStyle(1);

const saat = new Discord.TextInputBuilder()
.setCustomId("saat")
.setPlaceholder("Kaç Saat Yayın Yapıyorsun?")
.setLabel("Kaç Saat Yayın Yapıyorsun?")
.setMinLength(10)
.setStyle(1);

const diger = new Discord.TextInputBuilder()
.setCustomId("diger")
.setPlaceholder("Daha Önce Hangi Sunucularda Yayın Yaptın?")
.setLabel("Daha Önce Hangi Sunucularda Yayın Yaptın?")
.setMinLength(10)
.setStyle(1);

const kbilgi = new Discord.TextInputBuilder()
.setCustomId("kbilgi")
.setPlaceholder("Kendin Hakkında Bilgi Ver")
.setLabel("Kendin Hakkında Bilgi Ver")
.setMinLength(10)
.setStyle(1);

const speedtest = new Discord.TextInputBuilder()
.setCustomId("speedtest")
.setPlaceholder("Speedtest Sonucun")
.setLabel("Speedtest Sonucunu Paylaş")
.setMinLength(10)
.setStyle(1);

const actionRow1 = new Discord.ActionRowBuilder().addComponents(neden);
const actionRow2 = new Discord.ActionRowBuilder().addComponents(saat);
const actionRow3 = new Discord.ActionRowBuilder().addComponents(diger);
const actionRow4 = new Discord.ActionRowBuilder().addComponents(kbilgi);
const actionRow5 = new Discord.ActionRowBuilder().addComponents(speedtest);
modal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4, actionRow5);
await interaction.showModal(modal);
} else if (interaction.values[0] === "staffapplication") {
const modal = new Discord.ModalBuilder()
.setTitle("Yetkili Başvuru Formu")
.setCustomId("staffapplications");

const neden = new Discord.TextInputBuilder()
.setCustomId("neden")
.setPlaceholder("Neden Yetkili Olmak İstiyorsun?")
.setLabel("Neden Yetkili Olmak İstiyorsun?")
.setMinLength(10)
.setStyle(1);

const saat = new Discord.TextInputBuilder()
.setCustomId("saat")
.setPlaceholder("Discord'da Kaç Saat Aktifsin?")
.setLabel("Discord'da Kaç Saat Aktifsin?")
.setMinLength(10)
.setStyle(1);

const diger = new Discord.TextInputBuilder()
.setCustomId("diger")
.setPlaceholder("Daha Önce Hangi Sunucularda Yetkili Oldun?")
.setLabel("Daha Önce Hangi Sunucularda Yetkili Oldun?")
.setMinLength(10)
.setStyle(1);

const kbilgi = new Discord.TextInputBuilder()
.setCustomId("kbilgi")
.setPlaceholder("Kendin Hakkında Bilgi Ver")
.setLabel("Kendin Hakkında Bilgi Ver")
.setMinLength(10)
.setStyle(1);

const actionRow1 = new Discord.ActionRowBuilder().addComponents(neden);
const actionRow2 = new Discord.ActionRowBuilder().addComponents(saat);
const actionRow3 = new Discord.ActionRowBuilder().addComponents(diger);
const actionRow4 = new Discord.ActionRowBuilder().addComponents(kbilgi);
modal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4);
await interaction.showModal(modal);
} else if (interaction.values[0] === "complaintapplication") {
const modal = new Discord.ModalBuilder()
.setTitle("Şikayet Başvuru Formu")
.setCustomId("complaintapplications");

const neden = new Discord.TextInputBuilder()
.setCustomId("neden")
.setPlaceholder("Şikayet Nedeni")
.setLabel("Şikayet Nedeni")
.setMinLength(10)
.setStyle(1);

const sikayet = new Discord.TextInputBuilder()
.setCustomId("sikayet")
.setPlaceholder("Durumu Belirtin")
.setLabel("Şikayetinizin Durumunu Belirtin")
.setMinLength(10)
.setStyle(1);

const diger = new Discord.TextInputBuilder()
.setCustomId("diger")
.setPlaceholder("Şikayetiniz Hakkında Detaylı Bilgi Verin")
.setLabel("Şikayetiniz Hakkında Detaylı Bilgi Verin")
.setMinLength(20)
.setStyle(2);

const actionRow1 = new Discord.ActionRowBuilder().addComponents(neden);
const actionRow2 = new Discord.ActionRowBuilder().addComponents(sikayet);
const actionRow3 = new Discord.ActionRowBuilder().addComponents(diger);
modal.addComponents(actionRow1, actionRow2, actionRow3);
await interaction.showModal(modal);
} else if (interaction.values[0] === "suggestionapplication") {
const modal = new Discord.ModalBuilder()
.setTitle("Öneri Başvuru Formu")
.setCustomId("suggestionapplications");

const neden = new Discord.TextInputBuilder()
.setCustomId("neden")
.setPlaceholder("Ne Hakkında Öneride Bulunmak İstiyorsun?")
.setLabel("Ne Hakkında Öneride Bulunmak İstiyorsun?")
.setMinLength(10)
.setStyle(1);

const detayli = new Discord.TextInputBuilder()
.setCustomId("detayli")
.setPlaceholder("Öneri Hakkında Detaylı Bilgi Verin")
.setLabel("Öneri Hakkında Detaylı Bilgi Verin")
.setMinLength(10)
.setStyle(2);

const actionRow1 = new Discord.ActionRowBuilder().addComponents(neden);
const actionRow2 = new Discord.ActionRowBuilder().addComponents(detayli);
modal.addComponents(actionRow1, actionRow2);
await interaction.showModal(modal);
} else if (interaction.values[0] === "requestapplication") {
const modal = new Discord.ModalBuilder()
.setTitle("İstek Başvuru Formu")
.setCustomId("requestapplications");

const neden = new Discord.TextInputBuilder()
.setCustomId("neden")
.setPlaceholder("Ne Hakkında İstekte Bulunmak İstiyorsun?")
.setLabel("Ne Hakkında İstekte Bulunmak İstiyorsun?")
.setMinLength(10)
.setStyle(1);

const detayli = new Discord.TextInputBuilder()
.setCustomId("detayli")
.setPlaceholder("İstek Hakkında Detaylı Bilgi Verin")
.setLabel("İstek Hakkında Detaylı Bilgi Verin")
.setMinLength(10)
.setStyle(2);

const actionRow1 = new Discord.ActionRowBuilder().addComponents(neden);
const actionRow2 = new Discord.ActionRowBuilder().addComponents(detayli);
modal.addComponents(actionRow1, actionRow2);
await interaction.showModal(modal);
}
}
if (interaction.customId === "streamerapplications") {
const neden = interaction.fields.getTextInputValue("neden");
const saat = interaction.fields.getTextInputValue("saat");
const diger = interaction.fields.getTextInputValue("diger");
const kbilgi = interaction.fields.getTextInputValue("kbilgi");
const speedtest = interaction.fields.getTextInputValue("speedtest");
if (!neden || !saat || !diger || !kbilgi) {
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Lütfen Tüm Alanları Doldurunuz!`, ephemeral: true });
return
}
if (!speedtest.includes("https://www.speedtest.net/result/")) {
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Lütfen Geçerli Bir Speedtest Linki Giriniz!`, ephemeral: true });
return
}
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} Başvurunuz Başarıyla İletildi!`, ephemeral: true });
const channel = await client.kanalBul("streamer-basvuru-log")
const embed = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: member.displayName, iconURL: await client.avatarGet(member.user.id) })
.setThumbnail(await client.avatarGet(member.user.id))
.setFooter({ text: `${member.displayName}`, iconURL: member.user.avatarURL({ dynamic: true }) })
.setDescription(`${interaction.guild.emojiGöster(emojis.info)} ${member} Adlı Kullanıcısı Streamer Başvurusu Yaptı. [Speedtest Sonuçu](${speedtest})

\`\`\`fix
Neden Streamer Olmak İstiyorsun: ${neden}

Kaç Saat Yayın Yapıyorsun: ${saat}

Daha Önce Hangi Sunucularda Yayın Yaptın: ${diger}

Kendin Hakkında Bilgi Ver: ${kbilgi}
\`\`\``)
await channel.send({ embeds: [embed] });
} else if (interaction.customId === "staffapplications") {
const neden = interaction.fields.getTextInputValue("neden");
const saat = interaction.fields.getTextInputValue("saat");
const diger = interaction.fields.getTextInputValue("diger");
const kbilgi = interaction.fields.getTextInputValue("kbilgi");
if (!neden || !saat || !diger || !kbilgi) {
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Lütfen Tüm Alanları Doldurunuz!`, ephemeral: true });
return
}
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} Başvurunuz Başarıyla İletildi!`, ephemeral: true });
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel("Onayla")
.setCustomId("onayla")
.setStyle(Discord.ButtonStyle.Success)
.setEmoji(interaction.guild.emojiGöster(emojis.yes).id),
new Discord.ButtonBuilder()
.setLabel("Reddet")
.setCustomId("reddet")
.setStyle(Discord.ButtonStyle.Danger)
.setEmoji(interaction.guild.emojiGöster(emojis.no).id))
const channel = await client.kanalBul("yetkili-basvuru-log")
const embed = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: member.displayName, iconURL: await client.avatarGet(member.user.id) })
.setThumbnail(await client.avatarGet(member.user.id))
.setFooter({ text: `${member.displayName}`, iconURL: member.user.avatarURL({ dynamic: true }) })
.setDescription(`${interaction.guild.emojiGöster(emojis.info)} ${member} Adlı Kullanıcısı Yetkili Başvurusu Yaptı.

\`\`\`fix
Neden Yetkili Olmak İstiyorsun: ${neden}

Discord'da Kaç Saat Aktifsin: ${saat}

Daha Önce Hangi Sunucularda Yetkili Oldun: ${diger}

Kendin Hakkında Bilgi Ver: ${kbilgi}
\`\`\``)
const msg = await channel.send({content: `${ayar.seniorStaffRoles.filter(x => interaction.guild.roles.cache.get(x)).map(x => `${interaction.guild.roles.cache.get(x).toString()}`)}`,  embeds: [embed], components: [row] });
const collector = msg.createMessageComponentCollector({ });
collector.on("collect", async (i) => {
if(i.customId === "onayla") {
if(!i.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.seniorStaffRoles.some(x => i.member.roles.cache.has(x)) && !ayar.roleAddRoles.some(x => i.member.roles.cache.has(x)) && !ayar.ownerRoles.some(x => i.member.roles.cache.has(x))) {
return await i.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Yetkiniz Bulunmamakta!`, ephemeral: true });
}
await i.reply({ content: `${interaction.guild.emojiGöster(emojis.yes)} Yetkili Başvurusu Başarıyla Onaylandı!`, ephemeral: true });
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
await msg.edit({content: `${i.member} İlgilendi.`, embeds: [embed], components: [row] }).catch(err => {})
const ranks = JSON.parse(await client.ranks(interaction.guild.id));
if(ranks) {
await member.addRoles(ranks.slice(0, 1).map(x => x.roleID) || "").catch(e => {})
await member.addRoles(ranks.slice(0, 1).map(x => x.hammer) || "").catch(e => {})
} else {
await member.addRoles(ayar.staffStartRoles).catch(e => {})
}
const rdb = await RankSystem.findOne({ guildID: interaction.guild.id });
if(!rdb) return;
if(rdb.RankSystem === true) {
await Users.updateOne({ _id: member.id }, { $set: { Staff: true, StaffGiveAdmin: i.member.id, Date: Date.now() } }, { upsert: true }).exec();
await Users.updateOne({ _id: i.member.id }, { $push: { Staffs: { id: member.id, Date: Date.now() } } }, { upsert: true }).exec();
await Puans.updateOne({ guildID: interaction.guild.id, userID: member.id }, { $set: { puan: ranks[0].puan } }, { upsert: true }).exec();
await Puans.updateOne({ guildID: interaction.guild.id, userID: member.id }, { $inc: { puan: 1 } }, { upsert: true }).exec();
}
await member.send({content: `${member} **${interaction.guild.name}** Sunucusundaki Yetkili Başvurun Onaylandı.🎉\n\nOnaylayan Yetkili: ${i.member}\nTarih: <t:${String(Date.now()).slice(0, 10)}:R>\nVerilen Yetki: **${interaction.guild.roles.cache.get(ranks[0].roleID).name} (1. Yetki)**`}).catch(err => {
i.reply({content: `${i.member}, ${member} Kullanıcısını Dm Üzerinden Bilgilendiremiyorum Lütfen Bilgilendirin.\n\nOnaylayan Yetkili: ${i.member}\nTarih: <t:${String(Date.now()).slice(0, 10)}:R>\nVerilen Yetki: **${interaction.guild.roles.cache.get(ranks[0].roleID).name} (1. Yetki)**`})
})
}
if(i.customId === "reddet") {
if(!i.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayar.seniorStaffRoles.some(x => i.member.roles.cache.has(x)) && !ayar.roleAddRoles.some(x => i.member.roles.cache.has(x)) && !ayar.ownerRoles.some(x => i.member.roles.cache.has(x))) {
return await i.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Yetkiniz Bulunmamakta!`, ephemeral: true });
}
await i.reply({ content: `${interaction.guild.emojiGöster(emojis.yes)} Yetkili Başvurusu Başarıyla Reddedildi!`, ephemeral: true });
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
await msg.edit({content: `${i.member} İlgilendi.`, embeds: [embed], components: [row] }).catch(err => {})
await member.send({content: `${member} **${interaction.guild.name}** Sunucusundaki Yetkili Başvurun Reddedildi.🎉\n\nReddeden Yetkili: ${i.member}\nTarih: <t:${String(Date.now()).slice(0, 10)}:R>`}).catch(err => {
i.reply({content: `${i.member}, ${member} Kullanıcısını Dm Üzerinden Bilgilendiremiyorum Lütfen Bilgilendirin.\n\nReddeden Yetkili: ${i.member}\nTarih: <t:${String(Date.now()).slice(0, 10)}:R>`})
})
}
})
} else if (interaction.customId === "complaintapplications") {
const neden = interaction.fields.getTextInputValue("neden");
const sikayet = interaction.fields.getTextInputValue("sikayet");
const diger = interaction.fields.getTextInputValue("diger");
if (!neden || !sikayet || !diger) {
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Lütfen Tüm Alanları Doldurunuz!`, ephemeral: true });
return
}
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} Başvurunuz Başarıyla İletildi!`, ephemeral: true });
const channel = await client.kanalBul("şikayet-log")
const embed = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: member.displayName, iconURL: await client.avatarGet(member.user.id) })
.setThumbnail(await client.avatarGet(member.user.id))
.setFooter({ text: `${member.displayName}`, iconURL: member.user.avatarURL({ dynamic: true }) })
.setDescription(`${interaction.guild.emojiGöster(emojis.info)} ${member} Adlı Kullanıcısı Şikayet Başvurusu Yaptı.

\`\`\`fix
Şikayet Nedeni: ${neden}

Şikayetinizin Durumunu Belirtin: ${sikayet}

Şikayetiniz Hakkında Detaylı Bilgi Verin: ${diger}
\`\`\``)
await channel.send({ embeds: [embed] });
} else if (interaction.customId === "suggestionapplications") {
const neden = interaction.fields.getTextInputValue("neden");
const detayli = interaction.fields.getTextInputValue("detayli");
if (!neden || !detayli) {
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Lütfen Tüm Alanları Doldurunuz!`, ephemeral: true });
return
}
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} Başvurunuz Başarıyla İletildi!`, ephemeral: true });
const channel = await client.kanalBul("öneri-log")
const embed = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: member.displayName, iconURL: await client.avatarGet(member.user.id) })
.setThumbnail(await client.avatarGet(member.user.id))
.setFooter({ text: `${member.displayName}`, iconURL: member.user.avatarURL({ dynamic: true }) })
.setDescription(`${interaction.guild.emojiGöster(emojis.info)} ${member} Adlı Kullanıcısı Öneri Başvurusu Yaptı.

\`\`\`fix
Ne Hakkında Öneride Bulunmak İstiyorsun: ${neden}

Öneri Hakkında Detaylı Bilgi Verin: ${detayli}
\`\`\``)
await channel.send({ embeds: [embed] });
} else if (interaction.customId === "requestapplications") {
const neden = interaction.fields.getTextInputValue("neden");
const detayli = interaction.fields.getTextInputValue("detayli");
if (!neden || !detayli) {
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.no)} Lütfen Tüm Alanları Doldurunuz!`, ephemeral: true });
return
}
await interaction.reply({ content: `${interaction.guild.emojiGöster(emojis.face)} Başvurunuz Başarıyla İletildi!`, ephemeral: true });
const channel = await client.kanalBul("istek-log")
const embed = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: member.displayName, iconURL: await client.avatarGet(member.user.id) })
.setThumbnail(await client.avatarGet(member.user.id))
.setFooter({ text: `${member.displayName}`, iconURL: member.user.avatarURL({ dynamic: true }) })
.setDescription(`${interaction.guild.emojiGöster(emojis.info)} ${member} Adlı Kullanıcısı İstek Başvurusu Yaptı.

\`\`\`fix
Ne Hakkında İstekte Bulunmak İstiyorsun: ${neden}

İstek Hakkında Detaylı Bilgi Verin: ${detayli}
\`\`\``)
await channel.send({ embeds: [embed] });
}
}
},

}
}

async function StaffMessageHandler(guildID, userID, message) {
const RankData = await RankDB.findOne({ guildID: guildID });
if (!RankData) return;
if (!message) return;
if (!message.guild) return;
if (!message.member) return;
const ranks = JSON.parse(await client.ranks(guildID));
if (RankData.RankSystem === true && ranks.some((x) => message.member && message.member.roles.cache.has(x.roleID))) {
const num = nums.get(message.author.id);
if (num && (num % RankData.messageCount) === 0) {
nums.set(message.author.id, num + 1);
await Puans.updateOne({ guildID: message.guild.id, userID: message.author.id }, { $inc: { puan: RankData.messageCoin } }, { upsert: true });
const puanData = await Puans.findOne({ guildID: message.guild.id, userID: message.author.id });
if (puanData && ranks.some(x => puanData.puan == x.puan)) {
let newRank = ranks.filter(x => puanData.puan >= x.puan);
newRank = newRank[newRank.length - 1];
const oldRank = ranks[ranks.indexOf(newRank) - 1];
if(oldRank?.hammer != newRank?.hammer || !oldRank.hammer.includes(newRank.hammer.length > 1 ? newRank.hammer.map(x => x) : newRank.hammer || "")) {
await message.member.removeRoles(oldRank?.hammer ? oldRank?.hammer : "" || "").catch(e => { })
}
await message.member.removeRoles(oldRank?.roleID).catch(e => { })
await message.member.addRoles(newRank?.roleID).catch(e => { })
await message.member.addRoles(newRank?.hammer || "").catch(e => { })
const channel = await client.kanalBul("terfi-sistem-log")
const embed = new Discord.EmbedBuilder().setColor("Random");
channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.fire)} ${message.member.toString()} üyesi **${puanData.puan}** puan hedefine ulaştı **${Array.isArray(newRank.roleID) ? newRank.roleID.map(x => `${message.guild.roles.cache.get(x).name}`).join(" | ") : `${message.guild.roles.cache.get(newRank.roleID).name}`}** ${`ve ${newRank.hammer.map(x => `**${message.guild.roles.cache.get(x).name}**`).join(" | ")}` || ""} rol(leri) verildi!`)] });
}
} else nums.set(message.author.id, num ? num + 1 : 1);
await message.member.görevGüncelle(message.guild.id, "mesaj", 1, message.channel);
}
}

async function StaffVoiceHandler(guildID, user, data, channel) {
const ayar = await setups.findOne({ guildID: guildID })
if (!ayar) return;
const RankData = await RankDB.findOne({ guildID: guildID });
if (!RankData) return;
const ranks = JSON.parse(await client.ranks(guildID));
if (RankData.RankSystem === true && ranks.some((x) => user.member && user.member.roles.cache.has(x.roleID))) {
if (channel.id == ayar.afkChannel) return;
if (user.selfVideo && user.streaming) return;
if (data >= (1000 * 60) * RankData.voiceCount) await Puans.updateOne({ guildID: guildID, userID: user.id }, { $inc: { puan: Math.floor(parseInt(data / 1000 / 60) / RankData.voiceCount) * RankData.voiceCoin } }, { upsert: true });
const PuanData = await Puans.findOne({ guildID: guildID, userID: user.id });
if (PuanData && ranks.some(x => x.puan == PuanData.puan)) {
let newRank = ranks.filter(x => PuanData.puan >= x.puan);
newRank = newRank[newRank.length - 1];
if (newRank && Array.isArray(newRank.roleID) && !newRank.roleID.some(x => user.member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.roleID) && !user.member.roles.cache.has(newRank.roleID)) {
const oldRank = ranks[ranks.indexOf(newRank) - 1];
if(oldRank?.hammer != newRank?.hammer && !oldRank.hammer.includes(newRank.hammer.length > 1 ? newRank.hammer.map(x => x) : newRank.hammer || "")) {
await user.member.removeRoles(oldRank?.hammer ? oldRank?.hammer : "" || "").catch(e => { })
}
await user.member.removeRoles(oldRank?.roleID).catch(e => { })
await user.member.addRoles(newRank?.roleID).catch(e => { })
await user.member.addRoles(newRank?.hammer || "").catch(e => { })
const embed = new Discord.EmbedBuilder().setColor("Random");
const channel = await client.kanalBul("terfi-sistem-log")
channel.send({ embeds: [embed.setDescription(`${user.guild.emojiGöster(emojis.fire)} ${user.member.toString()} üyesi **${PuanData.puan}** puan hedefine ulaştı **${Array.isArray(newRank.roleID) ? newRank.roleID.map(x => `${user.guild.roles.cache.get(x).name}`).join(" | ") : `${user.guild.roles.cache.get(newRank.roleID).name}`}** ${`ve ${newRank.hammer.map(x => `**${user.guild.roles.cache.get(x).name}**`).join(" | ")}` || ""} rol(leri) verildi!`)] });
}
}
await user.member.görevGüncelle(guildID, "ses", data, channel);
}
}

async function StaffStreamHandler(guildID, user, data, channel) {
const ayar = await setups.findOne({ guildID: guildID })
if (!ayar) return;
const RankData = await RankDB.findOne({ guildID: guildID });
if (!RankData) return;
const ranks = JSON.parse(await client.ranks(guildID));
if (RankData.RankSystem === true && ranks.some((x) => user.member && user.member.roles.cache.has(x.roleID))) {
if (channel.id == ayar.afkChannel) return;
if (data >= (1000 * 60) * RankData.streamCount) await Puans.updateOne({ guildID: guildID, userID: user.id }, { $inc: { puan: Math.floor(parseInt(data / 1000 / 60) / RankData.streamCount) * RankData.streamCoin } }, { upsert: true });
const PuanData = await Puans.findOne({ guildID: guildID, userID: user.id });
if (PuanData && ranks.some(x => x.puan == PuanData.puan)) {
let newRank = ranks.filter(x => PuanData.puan >= x.puan);
newRank = newRank[newRank.length - 1];
if (newRank && Array.isArray(newRank.roleID) && !newRank.roleID.some(x => user.member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.roleID) && !user.member.roles.cache.has(newRank.roleID)) {
const oldRank = ranks[ranks.indexOf(newRank) - 1];
if(oldRank?.hammer != newRank?.hammer && !oldRank.hammer.includes(newRank.hammer.length > 1 ? newRank.hammer.map(x => x) : newRank.hammer || "")) {
await user.member.removeRoles(oldRank?.hammer ? oldRank?.hammer : "" || "").catch(e => { })
}
await user.member.removeRoles(oldRank?.roleID).catch(e => { })
await user.member.addRoles(newRank?.roleID).catch(e => { })
await user.member.addRoles(newRank?.hammer || "").catch(e => { })
const embed = new Discord.EmbedBuilder().setColor("Random");
const channel = await client.kanalBul("terfi-sistem-log")
channel.send({ embeds: [embed.setDescription(`${user.guild.emojiGöster(emojis.fire)} ${user.member.toString()} üyesi **${PuanData.puan}** puan hedefine ulaştı **${Array.isArray(newRank.roleID) ? newRank.roleID.map(x => `${user.guild.roles.cache.get(x).name}`).join(" | ") : `${user.guild.roles.cache.get(newRank.roleID).name}`}** ${`ve ${newRank.hammer.map(x => `**${user.guild.roles.cache.get(x).name}**`).join(" | ")}` || ""} rol(leri) verildi!`)] });
}
}
await user.member.görevGüncelle(guildID, "yayin", data, channel);
}
}

async function StaffCameraHandler(guildID, user, data, channel) {
const ayar = await setups.findOne({ guildID: guildID })
if (!ayar) return;
const RankData = await RankDB.findOne({ guildID: guildID });
if (!RankData) return;
const ranks = JSON.parse(await client.ranks(guildID));
if (RankData.RankSystem === true && ranks.some((x) => user.member && user.member.roles.cache.has(x.roleID))) {
if (channel.id == ayar.afkChannel) return;
if (data >= (1000 * 60) * RankData.cameraCount) await Puans.updateOne({ guildID: guildID, userID: user.id }, { $inc: { puan: Math.floor(parseInt(data / 1000 / 60) / RankData.cameraCount) * RankData.cameraCoin } }, { upsert: true });
const PuanData = await Puans.findOne({ guildID: guildID, userID: user.id });
if (PuanData && ranks.some(x => x.puan == PuanData.puan)) {
let newRank = ranks.filter(x => PuanData.puan >= x.puan);
newRank = newRank[newRank.length - 1];
if (newRank && Array.isArray(newRank.roleID) && !newRank.roleID.some(x => user.member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.roleID) && !user.member.roles.cache.has(newRank.roleID)) {
const oldRank = ranks[ranks.indexOf(newRank) - 1];
if(oldRank?.hammer != newRank?.hammer && !oldRank.hammer.includes(newRank.hammer.length > 1 ? newRank.hammer.map(x => x) : newRank.hammer || "")) {
await user.member.removeRoles(oldRank?.hammer ? oldRank?.hammer : "" || "").catch(e => { })
}
await user.member.removeRoles(oldRank?.roleID).catch(e => { })
await user.member.addRoles(newRank?.roleID).catch(e => { })
await user.member.addRoles(newRank?.hammer || "").catch(e => { })
const embed = new Discord.EmbedBuilder().setColor("Random");
const channel = await client.kanalBul("terfi-sistem-log")
channel.send({ embeds: [embed.setDescription(`${user.guild.emojiGöster(emojis.fire)} ${user.member.toString()} üyesi **${PuanData.puan}** puan hedefine ulaştı **${Array.isArray(newRank.roleID) ? newRank.roleID.map(x => `${user.guild.roles.cache.get(x).name}`).join(" | ") : `${user.guild.roles.cache.get(newRank.roleID).name}`}** ${`ve ${newRank.hammer.map(x => `**${user.guild.roles.cache.get(x).name}**`).join(" | ")}` || ""} rol(leri) verildi!`)] });
}
}
await user.member.görevGüncelle(guildID, "camera", data, channel);
}
}

async function monthlycontrol(member) {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID });
const guild = client.guilds.cache.get(settings.Moderation.guildID);
if (!ayar) return;
const monthRoles = [
{limit: 30, role: 'oneMonthRoles'},
{limit: 90, role: 'threeMonthRoles'},
{limit: 180, role: 'sixMonthRoles'},
{limit: 270, role: 'nineMonthRoles'},
{limit: 365, role: 'oneYearRoles'}
];
const joinDate = new Date(member.joinedAt);
let nextRank = '';
let kalanZaman = 0;
if (joinDate) {
const kalanGün = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
for (let i = 0; i < monthRoles.length; i++) {
if (kalanGün < monthRoles[i].limit) {
nextRank = ayar[monthRoles[i].role];
kalanZaman = monthRoles[i].limit - kalanGün;
break;
}
}
if (nextRank !== '') {
return `${member.guild.emojiGöster(emojis.fire)} ${member} **${guild.roles.cache.get(nextRank).name}** Rolüne Ulaşmak İçin **${kalanZaman}** Gün Daha Sunucuda Bulunman Gerekli.`;
} else {
return;
}
} else {
return 'Veri Alınamadı.';
}
}

async function VoiceSchemasHandler(guild, user, userID, channel, data) {
await VoiceUser.updateOne({ guildID: guild, userID: userID }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data, threeWeeklyStat: data, monthStat: data }, $set: { Date: Date.now(), Channel: channel.id } }, { upsert: true })
await VoiceGuild.updateOne({ guildID: guild }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data, threeWeeklyStat: data, monthStat: data } }, { upsert: true })
await VoiceUserParents.updateOne({ guildID: guild, userID: userID, parentID: channel.parentId }, { $inc: { parentData: data } }, { upsert: true })
await VoiceGuildChannels.updateOne({ guildID: guild, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true })
await VoiceUserChannels.updateOne({ guildID: guild, userID: userID, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true })
await StaffVoiceHandler(guild, user, data, channel)
if(user) await LevelUp(user, "ses", data)
}

async function CameraSchemasHandler(guild, user, userID, channel, data) {
await CameraUser.updateOne({ guildID: guild, userID }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data, threeWeeklyStat: data, monthStat: data } }, { upsert: true })
await StaffCameraHandler(guild, user, data, channel)
}

async function StreamSchemasHandler(guild, user, userID, channel, data) {
await StreamUser.updateOne({ guildID: guild, userID }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data, threeWeeklyStat: data, monthStat: data } }, { upsert: true })
await StaffStreamHandler(guild, user, data, channel)
}

async function MessageSchemasHandler(guild, userID, channel, message) {
await MessageUser.updateOne({ guildID: guild, userID: userID }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1, threeWeeklyStat: 1, monthStat: 1 }, $set: { Date: Date.now(), Channel: channel.id } }, { upsert: true })
await MessageUserParents.updateOne({ guildID: guild, userID: userID, parentID: message.channel.parentId }, { $inc: { parentData: 1 } }, { upsert: true })
await MessageGuild.updateOne({ guildID: guild }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1, threeWeeklyStat: 1, monthStat: 1 } }, { upsert: true })
await MessageGuildChannels.updateOne({ guildID: guild, channelID: channel.id }, { $inc: { channelData: 1 } }, { upsert: true })
await Dolars.updateOne({ guildID: guild, userID: userID }, { $inc: { dolar: 1 } }, { upsert: true })
await StaffMessageHandler(guild, userID, channel, message)
if(message) await LevelUp(message, "mesaj")
}
async function addStat(member, channelId, diff) {
await VoiceFriends.updateOne({ guildID: settings.Moderation.guildID, userID: member.id }, { $inc: { [`voices.channels.${channelId}`]: diff, 'voices.total': diff } }, { upsert: true, new: true });
const channel = member.guild.channels.cache.get(channelId);
if (!channel) return;
const voiceFriends = channel.members.filter((m) => !m.user.bot && m.user.id != member.id);
if (voiceFriends.size < 1) return;
for (const [id] of voiceFriends) {
await VoiceFriends.updateOne({ guildID: settings.Moderation.guildID, userID: member.id }, { $inc: { [`voiceFriends.${id}`]: diff } }, { upsert: true, new: true });
}
};
async function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];
}
}
async function LevelUp(message, type, data) {
if(!message && !message.member) return;
const logKanal = await client.kanalBul("üye-log")
const user = message.author ? message.author.id : message.member.user.id
const datas = await setup.findOne({ guildID: settings.Moderation.guildID, userID: user })
if (!datas) return await new setup({ guildID: settings.Moderation.guildID, userID: user, levelSystem: true, monthlySystem: true }).save()
if(datas.levelSystem == false) return;
if (type == "mesaj") {
const Data = await MessageUser.findOne({ guildID: settings.Moderation.guildID, userID: message.author.id }) || [];
if (!Data) return;
let siradakilevel = Data.messageLevel * 450;
if (siradakilevel < Data.messageXP) {
const Types = ["Message", "message", "Mesaj", "mesaj"]
const LDB = await LevelSystem.findOne({ guildID: settings.Moderation.guildID, Type: Types.map(x => x), Level: Data.messageLevel + 1 });
const image = Canvas.createCanvas(740, 128);
const ctx = image.getContext("2d");
const imagePath = path.join(__dirname, '..', 'Src', 'İmages', 'level.png');
const background = await Canvas.loadImage(imagePath);
ctx.drawImage(background, 0, 0, 740, 128);
const avatarUrl = message.member.displayAvatarURL({ format: "png" }) || message.member.avatarURL({ format: "png" });
const avatar = await Canvas.loadImage(avatarUrl);
ctx.drawImage(avatar, 621, 12, 105.5, 105.5);
ctx.font = '28px Segoe UI';
ctx.fillStyle = "#0a0a0a";
ctx.fillText(`${500 * (Data.messageLevel + 1)}`, 330, 87, 200);
let para = 2000 * (Data.messageLevel + 1);
ctx.font = '38px Arial Black';
ctx.fillStyle = "#fff";
const currentLevelX = (Data.messageLevel).toString().length == 1 ? 53 : 40;
ctx.fillText(`${Data.messageLevel}`, currentLevelX, 77, 350);
ctx.font = '38px Arial Black';
ctx.fillStyle = "#fff";
const nextLevelX = (Data.messageLevel + 1).toString().length == 1 ? 233 : 220;
ctx.fillText(`${Data.messageLevel + 1}`, nextLevelX, 77, 350);
ctx.save();
const attachment = new Discord.AttachmentBuilder(await image.encode('png'), { name: "level.png" });
await MessageUser.findOneAndUpdate(
{ guildID: settings.Moderation.guildID, userID: message.author.id },
{ $set: { messageXP: 0 }, $inc: { messageLevel: 1 } },
{ upsert: true }
);
await Dolars.findOneAndUpdate(
{ guildID: settings.Moderation.guildID, userID: message.author.id },
{ $inc: { dolar: +para } },
{ upsert: true }
);
if(LDB) {
await message.member.addRoles(LDB.Roles.map(x => x)).catch(e => { })
}
const OldRoles = await LevelSystem.find({ guildID: settings.Moderation.guildID, Type: Types.map(x => x) });
if (OldRoles && OldRoles.length > 0) {
const oldData = OldRoles.find(x => x.Level < Data.messageLevel + 1);
const newData = OldRoles.find(x => x.Level === Data.messageLevel + 1);
if (oldData && newData && newData.Roles && newData.Roles.length > 0) {
await message.member.removeRoles(oldData.Roles.map(x => x)).catch(e => {});
}
}
await logKanal.send({
content: `>>> ${message.author} Tebrikler. Mesaj Kanallarında Seviyeniz Yükseldi Yeni Seviyeniz: (**${Data.messageLevel + 1}**)`,
files: [attachment]
});
return;
}
await MessageUser.findOneAndUpdate(
{ guildID: settings.Moderation.guildID, userID: message.author.id },
{ $inc: { messageXP: 1 } },
{ upsert: true }
);
} else if (type == "ses") {
if(!message && !message.member && !message.member.user) return;
const Data = await VoiceUser.findOne({ guildID: settings.Moderation.guildID, userID: message.member.user.id }) || [];
if (!Data) return;
const Types = ["Voice", "voice", "Ses", "ses"]
const LDB = await LevelSystem.findOne({ guildID: settings.Moderation.guildID, Type: Types.map(x => x), Level: Data.voiceLevel + 1 });
let siradakilevel = Data.voiceLevel * 7200000;
if (siradakilevel < Data.voiceXP) {
const image = Canvas.createCanvas(740, 128);
const ctx = image.getContext("2d");
const imagePath = path.join(__dirname, '..', 'Src', 'İmages', 'level.png');
const background = await Canvas.loadImage(imagePath);
ctx.drawImage(background, 0, 0, 740, 128);
const avatarUrl = message.member.displayAvatarURL({ format: "png" }) || message.member.avatarURL({ format: "png" });
const avatar = await Canvas.loadImage(avatarUrl);
ctx.drawImage(avatar, 621, 12, 105.5, 105.5);
ctx.font = '28px Segoe UI';
ctx.fillStyle = "#0a0a0a";
ctx.fillText(`${500 * (Data.voiceLevel + 1)}`, 330, 87, 200);
let para = 2000 * (Data.voiceLevel + 1);
ctx.font = '38px Arial Black';
ctx.fillStyle = "#fff";
const currentLevelX = (Data.voiceLevel).toString().length == 1 ? 53 : 40;
ctx.fillText(`${Data.voiceLevel}`, currentLevelX, 77, 350);
ctx.font = '38px Arial Black';
ctx.fillStyle = "#fff";
const nextLevelX = (Data.voiceLevel + 1).toString().length == 1 ? 233 : 220;
ctx.fillText(`${Data.voiceLevel + 1}`, nextLevelX, 77, 350);
ctx.save();
const attachment = new Discord.AttachmentBuilder(await image.encode('png'), { name: "level.png" });
await VoiceUser.findOneAndUpdate(
{ guildID: settings.Moderation.guildID, userID: message.member.user.id },
{ $set: { voiceXP: 0 }, $inc: { voiceLevel: 1 } },
{ upsert: true }
);
await Dolars.findOneAndUpdate(
{ guildID: settings.Moderation.guildID, userID: message.member.user.id },
{ $inc: { dolar: +para } },
{ upsert: true }
);
if(LDB) {
await message.member.addRoles(LDB.Roles.map(x => x)).catch(e => { })
}
const OldRoles = await LevelSystem.find({ guildID: settings.Moderation.guildID, Type: Types.map(x => x) });
if (OldRoles && OldRoles.length > 0) {
const oldData = OldRoles.find(x => x.Level < Data.voiceLevel + 1);
const newData = OldRoles.find(x => x.Level === Data.voiceLevel + 1);
if (oldData && newData && newData.Roles && newData.Roles.length > 0) {
await message.member.removeRoles(oldData.Roles.map(x => x)).catch(e => {});
}
}
await logKanal.send({
content: `>>> ${message.member} Tebrikler. Ses Kanallarında Seviyeniz Yükseldi Yeni Seviyeniz: (**${Data.voiceLevel + 1}**)`,
files: [attachment]
});
return;
}
await VoiceUser.findOneAndUpdate(
{ guildID: settings.Moderation.guildID, userID: message.member.user.id },
{ $inc: { voiceXP: data } },
{ upsert: true }
);
}
}

async function checkStreamer() {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if(!ayar) return;
let guild = client.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
guild.channels.cache.filter(e =>
e.type == Discord.ChannelType.GuildVoice &&
e.members.size > 0 &&
e.parentId == ayar.streamerParents).forEach(channel => {
channel.members.filter(member => !member.user.bot && streamerAfks.get(member.id) && !member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !settings.Moderation.owners.includes(member.user.id)).forEach(async (member) => {
let data = streamerAfks.get(member.id);
if(data && Date.now() >= data.date) {
await streamerAfks.delete(member.id);
if(member) member.send({content: `${member}, "**${channel}**" Sohbet Kanalında Afk Olduğunu Fark Ettim.
Seni Otomatik Olarak "**${member.guild.channels.cache.get(ayar.afkChannel)}**" Kanalına Gönderdim.`}).catch(err => {})
if(member && member.voice.channel) return member.voice.setChannel(ayar.afkChannel).catch(err => {})
}
})
})
}

async function checkAfk() {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if(!ayar) return;
let guild = client.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
guild.channels.cache.filter(e =>
e.type == Discord.ChannelType.GuildVoice &&
e.members.size > 0 &&
e.parentId == ayar.publicParents &&
e.id != ayar.afkChannel).forEach(channel => {
channel.members.filter(member => !member.user.bot && voiceAfks.get(member.id) && !member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !settings.Moderation.owners.includes(member.user.id)).forEach(async (member) => {
let data = voiceAfks.get(member.id);
if(data && Date.now() >= data.date) {
await voiceAfks.delete(member.id);
if(member) member.send({content: `${member}, "**${channel}**" Sohbet Kanalında Afk Olduğunu Fark Ettim.
Seni Otomatik Olarak "**${member.guild.channels.cache.get(ayar.afkChannel)}**" Kanalına Gönderdim.`}).catch(err => {})
if(member && member.voice.channel) return member.voice.setChannel(ayar.afkChannel).catch(err => {})
}
})
})
}

async function ilkYazan(odül = Number(Math.floor(Math.random() * 10000) + 200)) {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if(!ayar) return;
const guild = client.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
const kanal = guild.channels.cache.get(ayar.chatChannel)
if(!kanal) return;
let kod = kodOluştur(10)
let canvas = Canvas2.createCanvas(1080, 400),
ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.moveTo(0 + Number(30), 0);
ctx.lineTo(0 + 1080 - Number(30), 0);
ctx.quadraticCurveTo(0 + 1080, 0, 0 + 1080, 0 + Number(30));
ctx.lineTo(0 + 1080, 0 + 400 - Number(30));
ctx.quadraticCurveTo(
0 + 1080,
0 + 400,
0 + 1080 - Number(30),
0 + 400
);
ctx.lineTo(0 + Number(30), 0 + 400);
ctx.quadraticCurveTo(0, 0 + 400, 0, 0 + 400 - Number(30));
ctx.lineTo(0, 0 + Number(30));
ctx.quadraticCurveTo(0, 0, 0 + Number(30), 0);
ctx.closePath();
ctx.clip();
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, 1080, 400);
let background = await Canvas2.loadImage("https://4kwallpapers.com/images/wallpapers/mountain-range-3840x2160-18000.jpg");
ctx.drawImage(background, 0, 0, 1080, 400);
ctx.restore();
ctx.closePath();
ctx.beginPath();
ctx.globalAlpha = 0.5
ctx.fillStyle = "#000000";
ctx.moveTo(50,  22);
ctx.lineTo(canvas.width - 50,  22);
ctx.quadraticCurveTo(canvas.width - 50,  22, canvas.width -  22, 50);
ctx.lineTo(canvas.width -  22, canvas.height - 50);
ctx.quadraticCurveTo(canvas.width - 25, canvas.height -  22, canvas.width - 50, canvas.height -  22);
ctx.lineTo(50, canvas.height - 22);
ctx.quadraticCurveTo(25, canvas.height -  22,  22, canvas.height - 50);
ctx.lineTo( 22, 50);
ctx.quadraticCurveTo( 22,  22, 50,  22);
ctx.fill();
ctx.closePath();
ctx.globalAlpha = 1
ctx.stroke();
ctx.textAlign = "left";
ctx.fillStyle = "#ffffff";
ctx.font = applyText(canvas, "Tahmin Et.", 75, 500, "Bold");
ctx.strokeStyle = "#ffffff";
ctx.fillText("İlk Yazan Sen Ol Ve Kazan", 70, 125);
ctx.textAlign = "left";
ctx.fillStyle = "#ffffff";
ctx.font = applyText(canvas, `${odül} ${ayar.GuildName.toUpperCase()} Doları Kazanacaksın.`, 45, 690, "Bold");
ctx.fillText(`Sen Yazarsan ${odül} ${ayar.GuildName.toUpperCase()} Doları Kazanacaksın.`,70, 130 + 85 );
ctx.textAlign = "center";
let renk = [Discord.Colors]
ctx.fillStyle = renk[Math.floor(Math.random()*renk.length)]
ctx.strokeRect(0, 0, canvas.width, canvas.height)
ctx.font = applyText(canvas, kod, 100, 400, "luckiest guy");
ctx.fillText(kod, 525, 350 );
const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: 'kod.png'});
let msg = await kanal.send({content: "**Hızlı Ol Ve Kazan**\nAşağıda Rastgele Verilmiş Bir Kodu Doğru Yaz Ve Kazan! Bunun İçin 20 Saniyeniz Var!", files: [attachment] ,components: []})
const filter = m => m.content.includes(kod);
const collector = kanal.createMessageCollector({ filter, max: 1, time: 15000 });
collector.on('collect',async (m) => {
await m.react(guild.emojiGöster(emojis.yes))
let uye = m.guild.members.cache.get(m.member.id)
await kanal.send({content: `${guild.emojiGöster(emojis.yes)} **Tebrikler!** Hızlı Ol Ve Kazan Etkinliğini ${uye} Kazandı!` , files: [], files: []}).sil(15)
await msg.delete().catch(err =>{})
if(uye) await Dolars.updateOne({guildID: guild.id, userID: uye.id}, {$inc: {dolar: Number(odül)}}, {upsert: true});
});
collector.on('end', collected => {
msg.delete().catch(err => {})
});
function applyText(canvas, text, defaultFontSize, width, font){
const ctx = canvas.getContext("2d");
do {
ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
} while (ctx.measureText(text).width > width);
return ctx.font;
}
function kodOluştur(length) {
var randomChars = '123456789';
var result = '';
for ( var i = 0; i < length; i++ ) {
result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
}
return result;
}
}
async function tahminEt(odül = Number(Math.floor(Math.random() * 4000) + 1000)) {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if(!ayar) return;
const guild = client.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
const kanal = guild.channels.cache.get(ayar.chatChannel)
if(!kanal) return;
let cevap = Math.floor(Math.random() * 5) + 1
let basanlar = []
let canvas = Canvas2.createCanvas(1080, 400),
ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.moveTo(0 + Number(30), 0);
ctx.lineTo(0 + 1080 - Number(30), 0);
ctx.quadraticCurveTo(0 + 1080, 0, 0 + 1080, 0 + Number(30));
ctx.lineTo(0 + 1080, 0 + 400 - Number(30));
ctx.quadraticCurveTo(
0 + 1080,
0 + 400,
0 + 1080 - Number(30),
0 + 400
);
ctx.lineTo(0 + Number(30), 0 + 400);
ctx.quadraticCurveTo(0, 0 + 400, 0, 0 + 400 - Number(30));
ctx.lineTo(0, 0 + Number(30));
ctx.quadraticCurveTo(0, 0, 0 + Number(30), 0);
ctx.closePath();
ctx.clip();
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, 1080, 400);
let background = await Canvas2.loadImage("https://4kwallpapers.com/images/wallpapers/mountain-range-3840x2160-18000.jpg");
ctx.drawImage(background, 0, 0, 1080, 400);
ctx.restore();
ctx.beginPath();
ctx.globalAlpha = 0.5
ctx.fillStyle = "#000000";
ctx.moveTo(50,  22);
ctx.lineTo(canvas.width - 50,  22);
ctx.quadraticCurveTo(canvas.width - 50,  22, canvas.width -  22, 50);
ctx.lineTo(canvas.width -  22, canvas.height - 50);
ctx.quadraticCurveTo(canvas.width - 25, canvas.height -  22, canvas.width - 50, canvas.height -  22);
ctx.lineTo(50, canvas.height - 22);
ctx.quadraticCurveTo(25, canvas.height -  22,  22, canvas.height - 50);
ctx.lineTo( 22, 50);
ctx.quadraticCurveTo( 22,  22, 50,  22);
ctx.fill();
ctx.closePath();
ctx.globalAlpha = 1
ctx.stroke();
ctx.textAlign = "left";
ctx.fillStyle = "#ffffff";
ctx.font = applyText(canvas, "Tahmin Et.", 75, 500, "Bold");
ctx.textAlign = "left";
ctx.fillStyle = "#ffffff";
ctx.font = applyText(canvas, `${odül} ${ayar.GuildName.toUpperCase()} Doları Kazanacaksın.`, 45, 690, "Bold");
ctx.fillText(`Doğru Cevabı Bulursan`,350, 130 + 85 );
ctx.textAlign = "left";
ctx.fillStyle = "#ffffff";
ctx.font = applyText(canvas, `${odül} ${ayar.GuildName.toUpperCase()} Doları Kazanacaksın.`, 45, 690, "Bold");
ctx.fillText(`${odül} ${ayar.GuildName.toUpperCase()} Doları Kazanacaksın.`,210, 180 + 85 );
ctx.font = applyText(canvas, "Sadece Bir Kere Hakkın Var.", 200, 710, "Bold");
ctx.fillText("Sadece Bir Kere Hakkın Var.", 190, 310 + 40 );
const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: 'tahmin.png'});
let rakamSatirBir = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder().setCustomId('1').setLabel('1').setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder().setCustomId('2').setLabel('2').setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder().setCustomId('3').setLabel('3').setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder().setCustomId('4').setLabel('4').setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder().setCustomId('5').setLabel('5').setStyle(Discord.ButtonStyle.Secondary)
)
let msg = await kanal.send({content: "**Hızlı Ol Ve Kazan**\nAşağıda 1 İle 5 Arası Verilen Rakamlardan Doğru Rakamı Tahmin Edin. Bunun İçin 30 Saniyeniz Var!", files: [attachment] ,components: [rakamSatirBir]})
const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 30000 });
collector.on('collect', async i => {
if (i.customId === String(cevap)) {
if(basanlar.includes(i.user.id)) return await i.reply({content: `${guild.emojiGöster(emojis.no)} Cevap hakkınızı doldurmuşsunuz. Üzgünüm!`, ephemeral: true});
await i.reply({ content: `> **Tebrikler!** Etkinliği Hazandığınız İçin Hesabınıza +**${odül}** ${ayar.GuildName} Doları Aktarıldı.`, ephemeral: true})
let uye = i.guild.members.cache.get(i.user.id)
await kanal.send({content: `${guild.emojiGöster(emojis.yes)} **Tebrikler!** Hızlı Ol Ve Kazan etkinliğini ${uye} Kazandı!` , files: []}).sil(15)
await msg.delete().catch(err =>{})
basanlar.push(i.user.id)
if(uye) await Dolars.updateOne({guildID: guild.id, userID: uye.id}, {$inc: {dolar: Number(odül)}}, {upsert: true});
}
if(i.customId != String(cevap)) {
if(basanlar.includes(i.user.id)) return await i.reply({content: `${guild.emojiGöster(emojis.no)} Cevap hakkınızı doldurmuşsunuz. Üzgünüm!`, ephemeral: true});
basanlar.push(i.user.id)
await i.reply({ content: `${guild.emojiGöster(emojis.no)} **Hay Aksi!** Yanlış, Artık Birdahaki Sorulara. Cevap Hakkınız Doldu!`, ephemeral: true})
}
});
collector.on('end', collected => msg.delete().catch(err => {}));
function applyText(canvas, text, defaultFontSize, width, font){
const ctx = canvas.getContext("2d");
do {
ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
} while (ctx.measureText(text).width > width);
return ctx.font;
}
}
async function matematikOyunu(odül = Number(Math.floor(Math.random() * 2000) + 500)) {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if(!ayar) return;
const guild = client.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
const kanal = guild.channels.cache.get(ayar.chatChannel)
if(!kanal) return;
var a = Math.floor(Math.random() * 400) + 200
var b = Math.floor(Math.random() * 250)
let cevap = '';
let soru = '';
let randd = ["toplama", "çıkartma", "çarpma", "bölme"]
let sonuclandır = randd[Math.floor(Math.random() * 3)]
if(sonuclandır == "toplama") cevap = a + b, soru = `${a} + ${b}`
if(sonuclandır == "çıkartma") cevap = a - b, soru = `${a} - ${b}`
if(sonuclandır == "çarpma") cevap = a * b, soru = `${a} * ${b}`
if(sonuclandır == "bölme") cevap = a / b, soru = `${a} / ${b}`
let basanlar = []
let canvas = Canvas2.createCanvas(1080, 400),
ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.moveTo(0 + Number(30), 0);
ctx.lineTo(0 + 1080 - Number(30), 0);
ctx.quadraticCurveTo(0 + 1080, 0, 0 + 1080, 0 + Number(30));
ctx.lineTo(0 + 1080, 0 + 400 - Number(30));
ctx.quadraticCurveTo(
0 + 1080,
0 + 400,
0 + 1080 - Number(30),
0 + 400
);
ctx.lineTo(0 + Number(30), 0 + 400);
ctx.quadraticCurveTo(0, 0 + 400, 0, 0 + 400 - Number(30));
ctx.lineTo(0, 0 + Number(30));
ctx.quadraticCurveTo(0, 0, 0 + Number(30), 0);
ctx.closePath();
ctx.clip();
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, 1080, 400);
let background = await Canvas2.loadImage("https://4kwallpapers.com/images/wallpapers/mountain-range-3840x2160-18000.jpg");
ctx.drawImage(background, 0, 0, 1080, 400);
ctx.restore();
ctx.beginPath();
ctx.globalAlpha = 0.5
ctx.fillStyle = "#000000";
ctx.moveTo(50,  22);
ctx.lineTo(canvas.width - 50,  22);
ctx.quadraticCurveTo(canvas.width - 50,  22, canvas.width -  22, 50);
ctx.lineTo(canvas.width -  22, canvas.height - 50);
ctx.quadraticCurveTo(canvas.width - 25, canvas.height -  22, canvas.width - 50, canvas.height -  22);
ctx.lineTo(50, canvas.height - 22);
ctx.quadraticCurveTo(25, canvas.height -  22,  22, canvas.height - 50);
ctx.lineTo( 22, 50);
ctx.quadraticCurveTo( 22,  22, 50,  22);
ctx.fill();
ctx.closePath();
ctx.globalAlpha = 1
ctx.stroke();
ctx.textAlign = "left";
ctx.fillStyle = "#ffffff";
ctx.font = applyText(canvas, "Tahmin Et.", 75, 500, "Bold");
ctx.textAlign = "center";
ctx.fillStyle = "#fff3f3";
ctx.font = applyText(canvas, `${odül} ${ayar.GuildName.toUpperCase()} Doları Kazanacaksın.`, 100, 890, "luckiest guy");
ctx.fillText(`${soru}`,550, 120 + 85);
ctx.textAlign = "left";
ctx.fillStyle = "#ffffff";
ctx.font = applyText(canvas, `${odül} ${ayar.GuildName.toUpperCase()} Doları Kazanacaksın.`, 45, 690, "Bold");
ctx.fillText(`Doğru Cevabı Bulursan`, 360, 180 + 65 );
ctx.textAlign = "left";
ctx.fillStyle = "#ffffff";
ctx.font = applyText(canvas, `${odül} ${ayar.GuildName.toUpperCase()} Doları Kazanacaksın.`, 45, 690, "Bold");
ctx.fillText(`${odül} ${ayar.GuildName.toUpperCase()} Doları Kazanacaksın.`,210, 260 + 40 );
ctx.font = applyText(canvas, "Sadece Bir Kere Hakkın Var.", 45, 690, "Bold");
ctx.fillText("Sadece Bir Kere Hakkın Var.", 260, 310 + 40 );
const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: 'image.png'});
let buttons = [
new Discord.ButtonBuilder().setCustomId('qwe').setLabel(`${Math.floor(Math.random() * 550)}`).setStyle(Discord.ButtonStyle.Success),
new Discord.ButtonBuilder().setCustomId('qwe1').setLabel(`${Math.floor(Math.random() * 942) + 1}`).setStyle(Discord.ButtonStyle.Success),
new Discord.ButtonBuilder().setCustomId('qwe2').setLabel(`${Math.floor(Math.random() * 250)}`).setStyle(Discord.ButtonStyle.Success),
new Discord.ButtonBuilder().setCustomId(`${cevap}`).setLabel(`${cevap}`).setStyle(Discord.ButtonStyle.Success),
new Discord.ButtonBuilder().setCustomId('qwe6').setLabel(`${Math.floor(Math.random() * 2000)}`).setStyle(Discord.ButtonStyle.Success)
]
let buttonları = buttons.shuffle()
let rakamSatirBir = new Discord.ActionRowBuilder().addComponents(buttonları)
let msg = await kanal.send({content: "**Cevabı Bul!**\nAşağıda Sorunun Cevabını Doğru Cevaplayın. Bunun İçin 30 Saniyeniz Var!", files: [attachment] ,components: [rakamSatirBir]})
const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 30000 });
collector.on('collect', async i => {
if (i.customId === String(cevap)) {
if(basanlar.includes(i.user.id)) return  await i.reply({content: `${guild.emojiGöster(emojis.no)} Cevap Hakkınızı Doldurmuşsunuz. Üzgünüm!`, ephemeral: true});
await i.reply({ content: `> **Tebrikler!** Etkinliği Hazandığınız İçin Hesabınıza +**${odül}** ${ayar.GuildName} Doları Aktarıldı.`, ephemeral: true})
let uye = i.guild.members.cache.get(i.user.id)
basanlar.push(i.user.id)
kanal.send({content: `${guild.emojiGöster(emojis.yes)} **Tebrikler!** Cevabı Bul Etkinliğini ${uye} Kazandı!` , files: []}).sil(15)
msg.delete().catch(err =>{})
if(uye) await Dolars.updateOne({guildID: guild.id, userID: uye.id}, {$inc: {dolar: Number(odül)}}, {upsert: true});
}
if(i.customId != String(cevap)) {
if(basanlar.includes(i.user.id)) return  await i.reply({content: `${guild.emojiGöster(emojis.no)} Cevap Hakkınızı Doldurmuşsunuz. Üzgünüm!`, ephemeral: true});
basanlar.push(i.user.id)
await i.reply({ content: `${guild.emojiGöster(emojis.no)} **Hay Aksi!** Yanlış, Artık Birdahaki Sorulara. Cevap Hakkınız Doldu!`, ephemeral: true})
}
});

collector.on('end', collected => msg.delete().catch(err => {}));
function applyText(canvas, text, defaultFontSize, width, font){
const ctx = canvas.getContext("2d");
do {
ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
} while (ctx.measureText(text).width > width);
return ctx.font;
}
}

async function doğruKasaBul(odül = Number(Math.floor(Math.random() * 100000) + 3000)) {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if(!ayar) return;
const guild = client.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
const kanal = guild.channels.cache.get(ayar.chatChannel)
if(!kanal) return;
let cevap = Math.floor(Math.random() * 5) + 1
let basanlar = []
let canvas = Canvas2.createCanvas(1080, 400),
ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.moveTo(0 + Number(30), 0);
ctx.lineTo(0 + 1080 - Number(30), 0);
ctx.quadraticCurveTo(0 + 1080, 0, 0 + 1080, 0 + Number(30));
ctx.lineTo(0 + 1080, 0 + 400 - Number(30));
ctx.quadraticCurveTo(
0 + 1080,
0 + 400,
0 + 1080 - Number(30),
0 + 400
);
ctx.lineTo(0 + Number(30), 0 + 400);
ctx.quadraticCurveTo(0, 0 + 400, 0, 0 + 400 - Number(30));
ctx.lineTo(0, 0 + Number(30));
ctx.quadraticCurveTo(0, 0, 0 + Number(30), 0);
ctx.closePath();
ctx.clip();
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, 1080, 400);
let background = await Canvas2.loadImage("https://4kwallpapers.com/images/wallpapers/mountain-range-3840x2160-18000.jpg");
ctx.drawImage(background, 0, 0, 1080, 400);
ctx.restore();
ctx.beginPath();
ctx.globalAlpha = 0.5
ctx.fillStyle = "#000000";
ctx.moveTo(50,  22);
ctx.lineTo(canvas.width - 50,  22);
ctx.quadraticCurveTo(canvas.width - 50,  22, canvas.width -  22, 50);
ctx.lineTo(canvas.width -  22, canvas.height - 50);
ctx.quadraticCurveTo(canvas.width - 25, canvas.height -  22, canvas.width - 50, canvas.height -  22);
ctx.lineTo(50, canvas.height - 22);
ctx.quadraticCurveTo(25, canvas.height -  22,  22, canvas.height - 50);
ctx.lineTo( 22, 50);
ctx.quadraticCurveTo( 22,  22, 50,  22);
ctx.fill();
ctx.closePath();
ctx.globalAlpha = 1
ctx.stroke();
ctx.textAlign = "left";
ctx.fillStyle = "#ffffff";
ctx.font = applyText(canvas, "Tahmin Et", 75, 500, "Bold");
ctx.fillText("Doğru Kasayı Bul", 210, 125);
ctx.textAlign = "left";
ctx.fillStyle = "#ffffff";
ctx.font = applyText(canvas, `${odül} ${ayar.GuildName.toUpperCase()} Doları Kazanıcaksın.`, 45, 690, "Bold");
ctx.fillText(`${ayar.GuildName.toUpperCase()} Kasaların Sana Süprizi Var`,180, 180 + 85 );
ctx.font = applyText(canvas, "Sadece Bir Kere Hakkın Var.", 45, 690, "Bold");
ctx.fillText("Sadece Bir Kere Hakkın Var.", 210, 310 + 40 );
const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), 'image.png');
let rakamSatirBir = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder().setCustomId('1').setEmoji("1061214943418011678").setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder().setCustomId('2').setEmoji("1061214943418011678").setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder().setCustomId('3').setEmoji("1061214943418011678").setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder().setCustomId('4').setEmoji("1061214943418011678").setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder().setCustomId('5').setEmoji("1061214943418011678").setStyle(Discord.ButtonStyle.Secondary))
let msg = await kanal.send({content: "**Doğru Kasayı Bul!**\nAşağıda Düğmelerde Verilen Kasalardan Doğru Kasayı Bulunuz. Bunun İçin 30 Saniyeniz Var!", files: [attachment] ,components: [rakamSatirBir]})
const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 30000 });
collector.on('collect', async i => {
if (i.customId === String(cevap)) {
if(basanlar.includes(i.user.id)) return  await i.reply({content: `${guild.emojiGöster(emojis.no)} Cevap Hakkınızı Doldurmuşsunuz. Üzgünüm!`, ephemeral: true});
await i.reply({ content: `> **Tebrikler!** Etkinliği Hazandığınız İçin Hesabınıza +**${odül}** ${ayar.GuildName} Doları Aktarıldı.`, ephemeral: true})
let uye = i.guild.members.cache.get(i.user.id)
kanal.send({content: `${guild.emojiGöster(emojis.yes)} **Tebrikler!** Doğru Kasayı Bul Etkinliğini ${uye} Kazandı!` , files: []}).sil(15)
msg.delete().catch(err =>{})
basanlar.push(i.user.id)
if(uye) await Dolars.updateOne({guildID: guild.id, userID: uye.id}, {$inc: {dolar: Number(odül)}}, {upsert: true});
}
if(i.customId != String(cevap)) {
if(basanlar.includes(i.user.id)) return  await i.reply({content: `${guild.emojiGöster(emojis.no)} Cevap Hakkınızı Doldurmuşsunuz. Üzgünüm!`, ephemeral: true});
basanlar.push(i.user.id)
await i.reply({ content: `${guild.emojiGöster(emojis.no)} **Hay Aksi!** Yanlış, Artık Birdahaki Sorulara. Cevap Hakkınız Doldu!`, ephemeral: true})
}
});
collector.on('end', collected => msg.delete().catch(err => {}));
function applyText(canvas, text, defaultFontSize, width, font){
const ctx = canvas.getContext("2d");
do {
ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
} while (ctx.measureText(text).width > width);
return ctx.font;
}
}
function applyText(canvas, text, defaultFontSize, width, font){
const ctx = canvas.getContext("2d");
do {
ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
} while (ctx.measureText(text).width > width);
return ctx.font;
}

module.exports = { BotEvents };