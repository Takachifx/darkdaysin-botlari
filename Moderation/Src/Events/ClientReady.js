const settings = require("../../../Src/Settings/Settings.json");
const RegisterStaffStats = require("../../../Src/Schemas/RegisterStaffStats");
const setups = require("../../../Src/Schemas/Setup");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const { BotEvents } = require("../../events")
const ChatMessage = require("../../../Src/Schemas/iltifatDB")
const client = global.client;
module.exports = async () => {
await BotEvents.EventsHandler.ready("friends")
await BotEvents.EventsHandler.ready("afk")
await BotEvents.EventsHandler.ready("event")
let kelimeler = ["Yaşanılacak en güzel mevsim sensin.", "Sıradanlaşmış her şeyi, ne çok güzelleştiriyorsun.", "Gönlüm bir şehir ise o şehrin tüm sokakları sana çıkar.", "Birilerinin benim için ettiğinin en büyük kanıtı seninle karşılaşmam.", "Denize kıyısı olan şehrin huzuru birikmiş yüzüne.", "Ben çoktan şairdim ama senin gibi şiiri ilk defa dinliyorum.", "Gece yatağa yattığımda aklımda kalan tek gerçek şey sen oluyorsun.", "Ne tatlısın sen öyle. Akşam gel de iki bira içelim.", "Bir gamzen var sanki cennette bir çukur.", "Gecemi aydınlatan yıldızımsın.", "Ponçik burnundan ısırırım seni", "Bu dünyanın 8. harikası olma ihtimalin?", "fıstık naber?", "Dilek tutman için yıldızların kayması mı gerekiyor illa ki? Gönlüm gönlüne kaydı yetmez mi?", "Süt içiyorum yarım yağlı, mutluluğum sana bağlı.", "Müsaitsen aklım bu gece sende kalacak.", "Gemim olsa ne yazar liman sen olmadıktan sonra...", "Gözlerimi senden alamıyorum çünkü benim tüm dünyam sensin.", "Sabahları görmek istediğim ilk şey sensin.", "Mutluluk ne diye sorsalar, cevabı gülüşünde ve o sıcak bakışında arardım.", "Hayatım ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.", "Bir adada mahsur kalmak isteyeceğim kişiler listemde en üst sırada sen varsın.", "Sesini duymaktan- hikayelerini dinlemekten asla bıkmayacağım. Konuşmaktan en çok zevk aldığım kişi sensin.", "Üzerinde pijama olsa bile, nasıl oluyor da her zaman bu kadar güzel görünüyorsun? Merhaba, neden bu kadar güzel olduğunu bilmek istiyorum.", "Çok yorulmuş olmalısın. Bütün gün aklımda dolaşıp durdun.", "Çocukluk yapsan da gönlüme senin için salıncak mı kursam?", "Sen birazcık huzur aradığımda gitmekten en çok hoşlandığım yersin.", "Hangi çiçek anlatır güzelliğini? Hangi mevsime sığar senin adın. Hiçbir şey yeterli değil senin güzelliğine erişmeye. Sen eşsizsin...", "Rotanızı geçen her geminin ışığıyla değil, yıldızlara göre ayarlayın.", "Telaşımı hoş gör, ıslandığım ilk yağmursun.", "Gülüşün ne güzel öyle, cumhuriyetin bir gelişi gibi sanki", "Ne yaparsan yap, sen her zaman çok doğalsın.", "Sen, tanıdığım en cesur insansın. Keşke senin gibi olabilseydim.", "Sen tanıdığım en tatlı insansın.", "Seninle konuşmak, ferah bir nefes almak gibidir.", "Bugün harika iş çıkardın. Seninle çalışmayı çok seviyorum.", "Enerjinin bulaşıcı olduğunu kendi gözlerimle gördüm. Sen mükemmel bir insansın.", "O kadar nazik ve anlayışlısın ki etrafındaki herkesi daha iyi bir insan yapmayı başarıyorsun.", "En kötü durumları bile eğlenceli bir hale dönüştürmene bayılıyorum.", "Seninle birlikteyken, her şeyin daha iyi olacağını biliyorum.", "Seninle birlikteyken, her şey daha kolay hale geliyor.", "Seninle birlikteyken, her şey daha iyi oluyor.", "Seninle birlikteyken, her şey daha güzel oluyor.", "Seninle birlikteyken, her şey daha eğlenceli oluyor.", "Sen yeri doldurulamaz bir insansın. Senin gibi birini bulmak imkansız.", "Seninle birlikteyken, her şey daha anlamlı hale geliyor.", "Senin gibi bir arkadaşımın olması özel hissetmeme neden oluyor.", "Beni hiçbir zaman hayal kırıklığına uğratmıyorsun. Ne olursa olsun sana güvenebileceğimi biliyorum.", "Senin yanında olduğum zaman kendimi çok şanslı ve özel hissediyorum.", "Makyaj doğal güzelliğini kapatıyor resmen...", "Saçların denizin huzurunu yansıtıyor.", "Senin gülümsemen benim en derin mutluluğum.", "Harika bir tarzın var. Tarzına sahip olmayı çok isterdim.", "Sen herkesin hayatında olması gereken bir insansın.", "Masallardaki prensesin şekil bulmuş halisin.", "Şarkılarımın, şiirlerimin ilham kaynağısın.", "Yanında hissetmediğim güven ve huzuru hissediyorum.", "Bu kadar tatlı olmayı nasıl başarıyorsun?", "Gözlerin en güzel ışık kaynağım.", "En güzel iyikimsin.", "Yaşadığım tüm kötülüklere sen karşıma alıp izleyerek baş edebilirim.", "Çiçekleri kıskandıran bir güzelliğe sahipsin.", "Sen benim tüm imkansızlıklarıma rağmen hayattaki en değerlimsin", "Sen benim en güzel manzaramsın.", "Enerjin içimi aydınlatıyor.", "Seninle olmak benim için bir ayrıcalık.", "Seninle olmak benim için bir zevk.", "Seninle olmak benim için bir huzur.", "Seninle olmak benim için bir mutluluk.", "Seninle olmak benim için bir keyif.", "Seninle olmak benim için bir neşe.", "Seninle olmak benim için bir sevinç.", "Seninle olmak benim için bir coşku.", "Seninle olmak benim için bir heyecan.", "Seninle olmak benim için bir şans.", "Seninle olmak benim için bir aşk.", "Seninle olmak benim için bir tutku."]
const sözData = await ChatMessage.findOne({guildID: settings.Moderation.guildID})
if(!sözData) {
const newData = new ChatMessage({
guildID: settings.Moderation.guildID,
sözler: kelimeler.map((x) => x)
})
await newData.save()
}
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if(!ayar) await new setups({ guildID: settings.Moderation.guildID }).save()
const guild = client.guilds.cache.get(settings.Moderation.guildID)
guild.invites.fetch()
.then(invites => {
const codeUses = new Map();
invites.each(inv => codeUses.set(inv.code, inv.uses));
client.Invites.set(guild.id, codeUses);
})
await client.SetupUpdate(settings.Moderation.guildID);
setInterval(() => {
if (ayar && ayar.autoRole == true) {
RolsuzeKayitsizVerme();
}
}, 10 * 1000);
setInterval(() => { TagAlıncaKontrol(); }, 10 * 1000);
setInterval(() => { TagBırakanKontrol(); }, 10 * 1000);
}
module.exports.conf = {
name: "ready",
};

async function TagAlıncaKontrol() {
const guild = client.guilds.cache.get(settings.Moderation.guildID)
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
if (ayar.tagSystem == false) return;
const members = [...guild.members.cache.filter(member => ayar.serverTag.some(tag => member.user.globalName && member.user.globalName.includes(tag) || member.user.username.includes(tag)) && !member.user.bot && !member.roles.cache.has(ayar.jailRoles) && !member.roles.cache.has(ayar.tagRoles)).values()].splice(0, 10)
for await (const member of members) {
if (member.displayName.includes(ayar.defaultTag) && member.manageable) await member.setNickname(member.displayName.replace(ayar.defaultTag, ayar.nameTag))
await member.addRoles(ayar.tagRoles).catch(err => { })
}
};
async function TagBırakanKontrol() {
const guild = client.guilds.cache.get(settings.Moderation.guildID)
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
if (ayar.tagSystem == false) return;
const memberss = [...guild.members.cache.filter(member => !ayar.serverTag.some(tag => member.user.globalName && member.user.globalName.includes(tag) || member.user.username.includes(tag)) && !member.user.bot && member.roles.cache.has(ayar.tagRoles)).values()].splice(0, 10)
for await (const member of memberss) {
if (member.displayName.includes(ayar.nameTag) && member.manageable) await member.setNickname(member.displayName.replace(ayar.nameTag, ayar.defaultTag)).catch(e => { });
await member.removeRoles(ayar.tagRoles).catch(err => { })
}
if (ayar.tagMode === true) {
const guild = client.guilds.cache.get(settings.Moderation.guildID)
const memberss = [...guild.members.cache.filter(member => !ayar.ownerRoles.some(x => member.roles.cache.has(x)) && !member.roles.cache.has(ayar.vipRoles) && !member.roles.cache.has(ayar.boosterRoles) && !ayar.serverTag.some(tag => member.user.globalName && member.user.globalName.includes(tag) || member.user.username.includes(tag)) && !member.user.bot).values()].splice(0, 10)
for await (const member of memberss) {
await member.setRoles(ayar.unregRoles).catch(e => { });
await member.setNickname(`${ayar.defaultTag} ${ayar.unregName}`).catch(e => { })
}
}
};
async function RolsuzeKayitsizVerme() {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
if (!ayar) return;
const guild = client.guilds.cache.get(settings.Moderation.guildID);
let dark = guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== guild.id).size == 0)
dark.forEach(r => {
if (r.voice) r.voice.disconnect().catch(e => { })
r.addRoles(ayar.unregRoles).catch(err => { })
r.setNickname(`${ayar.defaultTag} ${ayar.unregName}`).catch(err => { })
})
};
client.SetupUpdate = async function (guildID) {
const Data = await client.SetupsGet(guildID)
if(!Data) return;
try {
if(Data.BotOwner && Data.BotOwner.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { BotOwner: Data.BotOwner } }, { upsert: true });
}
if(Data.GuildOwner && Data.GuildOwner.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { GuildOwner: Data.GuildOwner } }, { upsert: true });
}
if(Data.voiceChannel && Data.voiceChannel.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { voiceChannel: Data.voiceChannel } }, { upsert: true });
}
if(Data.afkChannel && Data.afkChannel.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { afkChannel: Data.afkChannel } }, { upsert: true });
}
if(Data.GuildName && Data.GuildName.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { GuildName: Data.GuildName } }, { upsert: true });
}
if(Data.serverTag && Data.serverTag.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { serverTag: Data.serverTag } }, { upsert: true });
}
if(Data.unregisterName && Data.unregisterName.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { unregName: Data.unregisterName } }, { upsert: true });
}
if(Data.WelcomeChannel  && Data.WelcomeChannel.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { WelcomeChannel: Data.WelcomeChannel } }, { upsert: true });
}
if(Data.botFooter && Data.botFooter.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { botFooter: Data.botFooter } }, { upsert: true });
}
if(Data.defaultTag && Data.defaultTag.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { defaultTag: Data.defaultTag } }, { upsert: true });
}
if(Data.nameTag && Data.nameTag.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { nameTag: Data.nameTag } }, { upsert: true });
}
if(Data.botRoles && Data.botRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { botRoles: Data.botRoles } }, { upsert: true });
}
if(Data.registerMinimumAge && Data.registerMinimumAge.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { minRegisterAge: Data.registerMinimumAge } }, { upsert: true });
}
if(Data.muteLimities && Data.muteLimities.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { muteLimites: Data.muteLimities } }, { upsert: true });
}
if(Data.jailLimities && Data.jailLimities.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { jailLimites: Data.jailLimities } }, { upsert: true });
}
if(Data.banLimities && Data.banLimities.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { banLimites: Data.banLimities } }, { upsert: true });
}
if(Data.timeoutLimities && Data.timeoutLimities.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { timeoutLimites: Data.timeoutLimities } }, { upsert: true });
}
if(Data.muteCezaPuan && Data.muteCezaPuan.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { mutePenaltiesPoint: Data.muteCezaPuan } }, { upsert: true });
}
if(Data.jailCezaPuan && Data.jailCezaPuan.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { jailPenaltiesPoint: Data.jailCezaPuan } }, { upsert: true });
}
if(Data.banCezaPuan && Data.banCezaPuan.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { banPenaltiesPoint: Data.banCezaPuan } }, { upsert: true });
}
if(Data.limitiesCezaPuan && Data.limitiesCezaPuan.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { totalPenaltiesPoint: Data.limitiesCezaPuan } }, { upsert: true });
}
if(Data.funCategory && Data.funCategory.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { funParents: Data.funCategory } }, { upsert: true });
}
if(Data.aloneCategory && Data.aloneCategory.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { aloneParents: Data.aloneCategory } }, { upsert: true });
}
if(Data.solvingCategory && Data.solvingCategory.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { solvingParents: Data.solvingCategory } }, { upsert: true });
}
if(Data.registerCategory && Data.registerCategory.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { registerParents: Data.registerCategory } }, { upsert: true });
}
if(Data.publicCategory && Data.publicCategory.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { publicParents: Data.publicCategory } }, { upsert: true });
}
if(Data.privateCategory && Data.privateCategory.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { privateParents: Data.privateCategory } }, { upsert: true });
}
if(Data.streamerCategory && Data.streamerCategory.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { streamerParents: Data.streamerCategory } }, { upsert: true });
}
if(Data.vkCategory && Data.vkCategory.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { vkParents: Data.vkCategory } }, { upsert: true });
}
if(Data.manRoles && Data.manRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { manRoles: Data.manRoles } }, { upsert: true });
}
if(Data.womanRoles && Data.womanRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { womanRoles: Data.womanRoles } }, { upsert: true });
}
if(Data.unregisterRoles && Data.unregisterRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { unregRoles: Data.unregisterRoles } }, { upsert: true });
}
if(Data.registerPerms && Data.registerPerms.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { registerPerms: Data.registerPerms } }, { upsert: true });
}
if(Data.registerRoles && Data.registerRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { registerRoles: Data.registerRoles } }, { upsert: true });
}
if(Data.welcomeChannel && Data.welcomeChannel.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { welcomeChannel: Data.welcomeChannel } }, { upsert: true });
}
if(Data.inviteChannel && Data.inviteChannel.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { inviteChannel: Data.inviteChannel } }, { upsert: true });
}
if(Data.chatChannel && Data.chatChannel.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { chatChannel: Data.chatChannel } }, { upsert: true });
}
if(Data.rulesChannel && Data.rulesChannel.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { rulesChannel: Data.rulesChannel } }, { upsert: true });
}
if(Data.seniorStaffRoles && Data.seniorStaffRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { seniorStaffRoles: Data.seniorStaffRoles } }, { upsert: true });
}
if(Data.staffStartRoles && Data.staffStartRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { staffStartRoles: Data.staffStartRoles } }, { upsert: true });
}
if(Data.boosterRoles && Data.boosterRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { boosterRoles: Data.boosterRoles } }, { upsert: true });
}
if(Data.katildiPerms && Data.katildiPerms.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { katildiPerms: Data.katildiPerms } }, { upsert: true });
}
if(Data.katilmadiPerms && Data.katilmadiPerms.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { katilmadiPerms: Data.katilmadiPerms } }, { upsert: true });
}
if(Data.mazeretPerms && Data.mazeretPerms.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { mazeretPerms: Data.mazeretPerms } }, { upsert: true });
}
if(Data.tagRoles && Data.tagRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { tagRoles: Data.tagRoles } }, { upsert: true });
}
if(Data.ownerRoles && Data.ownerRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { ownerRoles: Data.ownerRoles } }, { upsert: true });
}
if(Data.banHammer && Data.banHammer.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { banHammer: Data.banHammer } }, { upsert: true });
}
if(Data.jailHammer && Data.jailHammer.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { jailHammer: Data.jailHammer } }, { upsert: true });
}
if(Data.muteHammer && Data.muteHammer.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { muteHammer: Data.muteHammer } }, { upsert: true });
}
if(Data.jailRoles && Data.jailRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { jailRoles: Data.jailRoles } }, { upsert: true });
}
if(Data.muteRoles && Data.muteRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { muteRoles: Data.muteRoles } }, { upsert: true });
}
if(Data.vmuteRoles && Data.vmuteRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { vmuteRoles: Data.vmuteRoles } }, { upsert: true });
}
if(Data.reklamRoles && Data.reklamRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { reklamRoles: Data.reklamRoles } }, { upsert: true });
}
if(Data.bannedTagRoles && Data.bannedTagRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { bannedTagRoles: Data.bannedTagRoles } }, { upsert: true });
}
if(Data.fakeAccRoles && Data.fakeAccRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { fakeAccRoles: Data.fakeAccRoles } }, { upsert: true });
}
if(Data.roleAddRoles && Data.roleAddRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { roleAddRoles: Data.roleAddRoles } }, { upsert: true });
}
if(Data.vipRoles && Data.vipRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { vipRoles: Data.vipRoles } }, { upsert: true });
}
if(Data.staffRoles && Data.staffRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { staffRoles: Data.staffRoles } }, { upsert: true });
}
if(Data.solvingStaffRoles && Data.solvingStaffRoles.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { scRoles: Data.solvingStaffRoles } }, { upsert: true });
}
if(Data.SafeBots && Data.SafeBots.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { SafeBots: Data.SafeBots } }, { upsert: true });
}
if(Data.solvingLog && Data.solvingLog.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { solvingLog: Data.solvingLog } }, { upsert: true });
}
if(Data.autoRoleSystem && Data.autoRoleSystem == 'true') {
await setups.updateOne({ guildID: guildID }, { $set: { autoRole: true } }, { upsert: true });
}
if(Data.autoRegisterSystem && Data.autoRegisterSystem == 'true') {
await setups.updateOne({ guildID: guildID }, { $set: { otoRegister: true } }, { upsert: true });
}
if(Data.tagSystem && Data.tagSystem == 'true') {
await setups.updateOne({ guildID: guildID }, { $set: { tagSystem: true } }, { upsert: true });
}
if(Data.ageSystem && Data.ageSystem == 'true') {
await setups.updateOne({ guildID: guildID }, { $set: { ageSystem: true } }, { upsert: true });
}
if(Data.tagMode && Data.tagMode == 'true') {
await setups.updateOne({ guildID: guildID }, { $set: { taggesMode: true } }, { upsert: true });
}
if(Data.RoleCreateLimites && Data.RoleCreateLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { RoleCreateLimites: Data.RoleCreateLimites } }, { upsert: true });
}
if(Data.RoleDeleteLimites && Data.RoleDeleteLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { RoleDeleteLimites: Data.RoleDeleteLimites } }, { upsert: true });
}
if(Data.RoleUpdateLimites && Data.RoleUpdateLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { RoleUpdateLimites: Data.RoleUpdateLimites } }, { upsert: true });
}
if(Data.ChannelCreateLimites && Data.ChannelCreateLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { ChannelCreateLimites: Data.ChannelCreateLimites } }, { upsert: true });
}
if(Data.ChannelDeleteLimites && Data.ChannelDeleteLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { ChannelDeleteLimites: Data.ChannelDeleteLimites } }, { upsert: true });
}
if(Data.ChannelUpdateLimites && Data.ChannelUpdateLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { ChannelUpdateLimites: Data.ChannelUpdateLimites } }, { upsert: true });
}
if(Data.EmojiCreateLimites && Data.EmojiCreateLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { EmojiCreateLimites: Data.EmojiCreateLimites } }, { upsert: true });
}
if(Data.EmojiDeleteLimites && Data.EmojiDeleteLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { EmojiDeleteLimites: Data.EmojiDeleteLimites } }, { upsert: true });
}
if(Data.EmojiUpdateLimites && Data.EmojiUpdateLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { EmojiUpdateLimites: Data.EmojiUpdateLimites } }, { upsert: true });
}
if(Data.StickerCreateLimites && Data.StickerCreateLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { StickerCreateLimites: Data.StickerCreateLimites } }, { upsert: true });
}
if(Data.StickerDeleteLimites && Data.StickerDeleteLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { StickerDeleteLimites: Data.StickerDeleteLimites } }, { upsert: true });
}
if(Data.StickerUpdateLimites && Data.StickerUpdateLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { StickerUpdateLimites: Data.StickerUpdateLimites } }, { upsert: true });
}
if(Data.WebhookCreateLimites && Data.WebhookCreateLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { WebhookCreateLimites: Data.WebhookCreateLimites } }, { upsert: true });
}
if(Data.WebhookDeleteLimites && Data.WebhookDeleteLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { WebhookDeleteLimites: Data.WebhookDeleteLimites } }, { upsert: true });
}
if(Data.WebhookUpdateLimites && Data.WebhookUpdateLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { WebhookUpdateLimites: Data.WebhookUpdateLimites } }, { upsert: true });
}
if(Data.MemberBanLimites && Data.MemberBanLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { MemberBanLimites: Data.MemberBanLimites } }, { upsert: true });
}
if(Data.MemberUnbanLimites && Data.MemberUnbanLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { MemberUnbanLimites: Data.MemberUnbanLimites } }, { upsert: true });
}
if(Data.MemberKickLimites && Data.MemberKickLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { MemberKickLimites: Data.MemberKickLimites } }, { upsert: true });
}
if(Data.MemberRoleUpdateLimites && Data.MemberRoleUpdateLimites > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { MemberRoleUpdateLimites: Data.MemberRoleUpdateLimites } }, { upsert: true });
}
if(Data.serverURL && Data.serverURL.length > 0) {
await setups.updateOne({ guildID: guildID }, { $set: { serverURL: Data.serverURL } }, { upsert: true });
}
} catch (err) {
console.error(err)
}
}