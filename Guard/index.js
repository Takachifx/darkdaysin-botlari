const fs = require('fs');
const Discord = require("discord.js")
const panels = require("../Src/Schemas/Panels")
const settings = require('../Src/Settings/Settings.json')
const Penalties = require("../Src/Schemas/Penalties");
const PrivateRoomsGuild = require("../Src/Schemas/PrivateRoomsGuild");
const PrivateRoomsUser = require("../Src/Schemas/PrivateRoomsUser");
const Web = require("../Src/Schemas/UserWeb");
const VoiceLimit = require("../Src/Schemas/VoiceLimit");
const PDB = require('../Src/Schemas/Panels')
const setups = require('../Src/Schemas/Setup')
const Tasks = require("../Src/Schemas/Tasks");
const StreamerDB = require("../Src/Schemas/Streamer");
const { Client } = require('discord.js-selfbot-v13')
const { Connect } = require('../Connects')
const { Bots } = require('../Clients')
const mainShield = global.mainShield = new Bots();
const roleShield = global.roleShield = new Bots();
const channelShield = global.channelShield = new Bots();
const chatShield = global.chatShield = new Bots();
const otherShield = global.otherShield = new Bots();
const otherShields = global.otherShields = new Bots();
const selfShield = global.selfShield = new Client({checkUpdate: false});
require("./Functions/function")(mainShield)
require("./Functions/function")(roleShield)
require("./Functions/function")(channelShield)
require("./Functions/function")(chatShield)
require("./Functions/function")(otherShield)
require("./Functions/function")(otherShields)
require("./Functions/function")(selfShield)
const Botlar = global.Botlar = [mainShield, roleShield, channelShield, otherShield, otherShields, chatShield, selfShield]
const kufurler = ["kasar", "oclari", "oçları", "allahoc","allahoç","allahamk","allahaq","0r0spuc0cu","4n4n1 sk3r1m","p1c","@n@nı skrm","evladi","orsb","orsbcogu","amnskm","anaskm","oc","abaza","abazan","ag","a\u011fz\u0131na s\u0131\u00e7ay\u0131m","fuck","shit","ahmak","seks","sex","allahs\u0131z","amar\u0131m","ambiti","am biti","amc\u0131\u011f\u0131","amc\u0131\u011f\u0131n","amc\u0131\u011f\u0131n\u0131","amc\u0131\u011f\u0131n\u0131z\u0131","amc\u0131k","amc\u0131k ho\u015faf\u0131","amc\u0131klama","amc\u0131kland\u0131","amcik","amck","amckl","amcklama","amcklaryla","amckta","amcktan","amcuk","am\u0131k","am\u0131na","amına","am\u0131nako","am\u0131na koy","am\u0131na koyar\u0131m","am\u0131na koyay\u0131m","am\u0131nakoyim","am\u0131na koyyim","am\u0131na s","am\u0131na sikem","am\u0131na sokam","am\u0131n feryad\u0131","am\u0131n\u0131","am\u0131n\u0131 s","am\u0131n oglu","am\u0131no\u011flu","am\u0131n o\u011flu","am\u0131s\u0131na","am\u0131s\u0131n\u0131","amina","amina g","amina k","aminako","aminakoyarim","amina koyarim","amina koyay\u0131m","amina koyayim","aminakoyim","aminda","amindan","amindayken","amini","aminiyarraaniskiim","aminoglu","amin oglu","amiyum","amk","amkafa","amk \u00e7ocu\u011fu","amlarnzn","aml\u0131","amm","ammak","ammna","amn","amna","amnda","amndaki","amngtn","amnn","amona","amq","ams\u0131z","amsiz","amsz","amteri","amugaa","amu\u011fa","amuna","anaaann","anal","analarn","anan\u0131","anan\u0131","anan\u0131n","anan\u0131n am","anan\u0131n am\u0131","anan\u0131n d\u00f6l\u00fc","anan\u0131nki","anan\u0131sikerim","anan\u0131 ","anan\u0131sikeyim","anan\u0131 sikeyim","anan\u0131z\u0131n","anan\u0131z\u0131n am","ananisikerim","anani ","ananisikeyim","anani sikeyim","anann","ananz","anas","anas\u0131n\u0131","anas\u0131n\u0131n am","anas\u0131 orospu","anasi","anasinin","anay","anayin","angut","anneni","annenin","annesiz","anuna","atkafas\u0131","atm\u0131k","att\u0131rd\u0131\u011f\u0131m","attrrm","auzlu","ayklarmalrmsikerim","azd\u0131m","azd\u0131r","azd\u0131r\u0131c\u0131","babaannesi ka\u015far","baban\u0131","baban\u0131n","babani","babas\u0131 pezevenk","baca\u011f\u0131na s\u0131\u00e7ay\u0131m","bac\u0131na","bac\u0131n\u0131","bac\u0131n\u0131n","bacini","bacn","bacndan","bacy","bastard","b\u0131z\u0131r","bitch","biting","boner","bosalmak","bo\u015falmak","cenabet","cibiliyetsiz","cibilliyetini","cibilliyetsiz","cif","cikar","cim","\u00e7\u00fck","dalaks\u0131z","dallama","daltassak","dalyarak","dalyarrak","dangalak","dassagi","diktim","dildo","dingil","dingilini","dinsiz","dkerim","domal","domalan","domald\u0131","domald\u0131n","domal\u0131k","domal\u0131yor","domalmak","domalm\u0131\u015f","domals\u0131n","domalt","domaltarak","domalt\u0131p","domalt\u0131r","domalt\u0131r\u0131m","domaltip","domaltmak","d\u00f6l\u00fc","d\u00f6nek","d\u00fcd\u00fck","ecdad\u0131n\u0131","ecdadini","embesil","fahise","fahi\u015fe","feri\u015ftah","ferre","fuck","fucker","fuckin","fucking","gavad","gavat","giberim","giberler","gibis","gibi\u015f","gibmek","gibtiler","goddamn","godo\u015f","godumun","goyiim","goyum","goyuyim","goyyim","g\u00f6t","g\u00f6t deli\u011fi","g\u00f6telek","g\u00f6t herif","g\u00f6tlalesi","g\u00f6tlek","g\u00f6to\u011flan\u0131","g\u00f6t o\u011flan\u0131","g\u00f6to\u015f","g\u00f6tten","g\u00f6t\u00fc","g\u00f6t\u00fcn","g\u00f6t\u00fcne","g\u00f6t\u00fcnekoyim","g\u00f6t\u00fcne koyim","g\u00f6t\u00fcn\u00fc","g\u00f6tveren","g\u00f6t veren","g\u00f6t verir","gtelek","gtn","gtnde","gtnden","gtne","gtten","gtveren","hasiktir","hassikome","hassiktir","has siktir","hassittir","haysiyetsiz","hayvan herif","ho\u015faf\u0131","h\u00f6d\u00fck","hsktr","huur","\u0131bnel\u0131k","ibina","ibine","ibinenin","ibne","ibnedir","ibneleri","ibnelik","ibnelri","ibneni","ibnenin","ibnerator","ibnesi","idiot","idiyot","imansz","ipne","iserim","i\u015ferim","ito\u011flu it","kafam girsin","kafas\u0131z","kafasiz","kahpe","kahpenin","kahpenin feryad\u0131","kaka","kaltak","kanc\u0131k","kancik","kappe","karhane","ka\u015far","kavat","kavatn","kaypak","kayyum","kerane","kerhane","kerhanelerde","kevase","keva\u015fe","kevvase","koca g\u00f6t","kodu\u011fmun","kodu\u011fmunun","kodumun","kodumunun","koduumun","koyarm","koyay\u0131m","koyiim","koyiiym","koyim","koyum","koyyim","krar","kukudaym","laciye boyad\u0131m","libo\u015f","madafaka","malafat","malak","mcik","meme","memelerini","mezveleli","minaamc\u0131k","mincikliyim","mna","monakkoluyum","motherfucker","mudik","oc","oç","ocuu","ocuun","O\u00c7","o\u00e7","o. \u00e7ocu\u011fu","o\u011flan","o\u011flanc\u0131","o\u011flu it","orosbucocuu","orospu","orospucocugu","orospu cocugu","orospu \u00e7oc","orospu\u00e7ocu\u011fu","orospu \u00e7ocu\u011fu","orospu \u00e7ocu\u011fudur","o\u00e7","orospu \u00e7ocuklar\u0131","orospudur","orospular","orospunun","orospunun evlad\u0131","orospuydu","orospuyuz","orostoban","orostopol","orrospu","oruspu","oruspu\u00e7ocu\u011fu","oruspu \u00e7ocu\u011fu","osbir","ossurduum","ossurmak","ossuruk","osur","osurduu","osuruk","osururum","otuzbir","\u00f6k\u00fcz","\u00f6\u015fex","patlak zar","penis","pezevek","pezeven","pezeveng","pezevengi","pezevengin evlad\u0131","pezevenk","pezo","pic","piç","pi\u00e7","pici","picler","pi\u00e7","pi\u00e7in o\u011flu","pi\u00e7 kurusu","pi\u00e7ler","pipi","pipi\u015f","pisliktir","porno","pussy","pu\u015ft","pu\u015fttur","rahminde","revizyonist","s1kerim","s1kerm","s1krm","sakso","saksofon","saxo","sekis","serefsiz","sevgi koyar\u0131m","sevi\u015felim","sexs","s\u0131\u00e7ar\u0131m","s\u0131\u00e7t\u0131\u011f\u0131m","s\u0131ecem","sikdi\u011fim","sikilmi\u015f","siki\u015f","siki\u015fen","siki\u015fme","sikti\u011fim","sikti\u011fimin","sikti\u011fiminin","sokar\u0131m","sokay\u0131m","soktu\u011fumunun","soku\u015f","sokuyum","soxum","sulaleni","s\u00fclaleni","s\u00fclalenizi","s\u00fcrt\u00fck","\u015ferefsiz","\u015f\u0131ll\u0131k","taaklarn","taaklarna","tarrakimin","tasak","tassak","ta\u015fak","ta\u015f\u015fak","tipini s.k","tipinizi s.keyim","tiyniyat","toplarm","topsun","toto\u015f","vajina","vajinan\u0131","veled","veledizina","veled i zina","verdiimin","weled","weledizina","whore","xikeyim","yaaraaa","yalama","yalar\u0131m","yalarum","yaraaam","yarak","yaraks\u0131z","yaraktr","yaram","yaraminbasi","yaramn","yararmorospunun","yarra","yarraaaa","yarraak","yarraam","yarraam\u0131","yarragi","yarragimi","yarragina","yarragindan","yarragm","yarra\u011f","yarra\u011f\u0131m","yarra\u011f\u0131m\u0131","yarraimin","yarrak","yarram","yarramin","yarraminba\u015f\u0131","yarramn","yarran","yarrana","yarrrak","yavak","yav\u015f","yav\u015fak","yav\u015fakt\u0131r","yavu\u015fak","y\u0131l\u0131\u015f\u0131k","yilisik","yogurtlayam","yo\u011furtlayam","yrrak","z\u0131kk\u0131m\u0131m","zibidi","zigsin","zikeyim","zikiiim","zikiim","zikik","zikim","ziksiiin","ziksiin","zulliyetini","zviyetini"]
const usersMap = new Map();
const LIMIT = 8;
const TIME = 10000;
const DIFF = 7000;
Connect.BotLogin(mainShield, settings.Guard.mainShield)
Connect.BotLogin(roleShield, settings.Guard.roleShield)
Connect.BotLogin(channelShield, settings.Guard.channelShield)
Connect.BotLogin(chatShield, settings.Guard.chatShield)
Connect.BotLogin(otherShield, settings.Guard.otherShield)
Connect.BotLogin(otherShields, settings.Guard.otherShields)
Connect.SelfLogin(selfShield, settings.Guard.selfShield)
Connect.MongoLogin(settings.Moderation.mongoURL)

fs.readdir("./Events", (err, files) => {
if (err) return console.error(err);
files
.filter((file) => file.endsWith(".js"))
.forEach((file) => {
let prop = require(`./Events/${file}`);
if (!prop.conf) return;
mainShield.on(prop.conf.name, prop)
console.log(`[GUARD - EVENT] ${prop.conf.name} Eventi Tüklendi!`);
});
});

mainShield.on(Discord.Events.ClientReady, async() => {
Connect.VoiceJoin(mainShield)
Connect.VoiceJoin(roleShield)
Connect.VoiceJoin(channelShield)
Connect.VoiceJoin(chatShield)
Connect.VoiceJoin(otherShield)
Connect.VoiceJoin(otherShields)
const guild = mainShield.guilds.cache.get(settings.Moderation.guildID)
setInterval(() => {
mainShield.ChannelBackup(guild, guild.id)
mainShield.RoleBackup(guild, guild.id)
}, 600000);
const Panels = await panels.findOne({guildID: settings.Moderation.guildID})
if(!Panels) new panels({guildID: settings.Moderation.guildID, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true}).save()
})

selfShield.on("ready", async() => {
const guild = selfShield.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if(!ayar) return;
const Panels = await panels.findOne({guildID: settings.Moderation.guildID})
if(!Panels) new panels({guildID: settings.Moderation.guildID, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true}).save()
if(Panels.urlShield == true) {
if(ayar.serverURL.length > 0 && guild.vanityURLCode !== ayar.serverURL) {
mainShield.SetVanityURL(ayar.serverURL)
}
}
if(ayar.serverURL.length > 0) {
setInterval(async() => {
await selfShield.URLSpammer()
}, 5000);
}
})

chatShield.on(Discord.Events.MessageCreate, async (message) => {
if (message.author.bot || message.member && message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) || message.channel.type == Discord.ChannelType.DM) return;
const guild = mainShield.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
let panel = await PDB.findOne({ guildID: guild.id });
if(!panel) panel = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(!message && !message.content) return;
const ayar = await setups.findOne({ guildID: guild.id })
if(!ayar) return;
const kelime = ["discord.gg", "discord.me", "discordapp.com", "discord.io", "discord.tk", ".gg/", ".gg"];
let links = message.content.match(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}?\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi);
let matched = message.content.replace(/[^A-Z]/g, "").length
let yuzde = percentage(matched, message.content.length)
let args = message.content.split(" ");
if(panel.capslockShield == true) {
if (Math.round(yuzde) >= 15 && matched / 2 >= 7) {
if(await mainShield.WhitelistControl(message.author.id, "capslock") || await mainShield.WhitelistControl(message.author.id, "full")) return;
if(links) return;
if(message.deletable) message.delete().catch(e => {})
message.channel.send({content: `${message.author} *CapsLock Kullanımını Azaltalım Lütfen.*`}).sil(15)
}
}
if(panel.spamShield == true) {
if(await mainShield.WhitelistControl(message.author.id, "spam") || await mainShield.WhitelistControl(message.author.id, "full")) return;
let kanallar = ["owo", "kumar", "ship", "kelime-oyunu", "kelime"]
if (kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) return;
if(usersMap.has(message.author.id)) {
const userData = usersMap.get(message.author.id);
const {lastMessage, timer} = userData;
const difference = message.createdTimestamp - lastMessage.createdTimestamp;
let msgCount = userData.msgCount;
if(difference > DIFF) {
clearTimeout(timer);
userData.msgCount = 1;
userData.lastMessage = message;
userData.timer = setTimeout(() => {
usersMap.delete(message.author.id);
}, TIME);
usersMap.set(message.author.id, userData)
} else {
msgCount++;
if(parseInt(msgCount) === LIMIT) {
sonMesajlar(message, 9)
usersMap.delete(message.author.id);
await message.channel.send({content: `${message.author} Spam Yaptığın İçin 3 Dakika **Timeout Atıldı.** Lütfen Tekrarlamayınız.`}).sil(15)
await message.member.timeout(3 * 60 * 1000).catch(e => {})
return
} else {
userData.msgCount = msgCount;
usersMap.set(message.author.id, userData)
}
}
} else {
let fn = setTimeout(() => {
usersMap.delete(message.author.id)
}, TIME);
usersMap.set(message.author.id, {
msgCount: +1,
lastMessage: message,
timer: fn
})
}
}
async function sonMesajlar(message, count) {
let messages = await message.channel.messages.fetch({ limit: 100 });
let filtered = [...messages.filter((x) => x.author.id === message.author.id).values()].splice(0, count);
message.channel.bulkDelete(filtered).catch(err => {});
}
function percentage(partialValue, totalValue) {
return (100 * partialValue) / totalValue;
}
if (panel.swearShield == true && kufurler.some(word => args.some(c => word.toLowerCase() == c.toLowerCase())) && !["t-sustum"].some(ver => message.channel.name.includes(ver))) {
if(await mainShield.WhitelistControl(message.author.id, "swear") || await mainShield.WhitelistControl(message.author.id, "full") || args.some(c => c.toLowerCase() == "düdük")) return;
message.delete().catch(e => {})
message.channel.send({ content: `${message.author} *Küfür Kullanımına Dikkat Edelim Lütfen.*` }).sil(15)
}
if (panel.advertShield == true && kelime.some(reklam => message.content.toLowerCase().includes(reklam)) && ![chatShield.guilds.cache.get(settings.Moderation.guildID).premiumSubscriptionCount > 14 && message.guild.vanityURLCode].some(reklam => message.content.toLocaleLowerCase().includes(reklam))) {
if(await mainShield.WhitelistControl(message.author.id, "advert") || await mainShield.WhitelistControl(message.author.id, "full")) return;
if (message.deletable) message.delete().catch(err => {});
message.channel.send({content: `${message.author} *Reklam Yapmamaya Dikkat Edelim Lütfen.*` }).sil(15)
} else {
if (!links) return;
if(panel.advertShield == true) {
if(await mainShield.WhitelistControl(message.author.id, "advert") || await mainShield.WhitelistControl(message.author.id, "full")) return;
if(message.content.toLowerCase().includes("open.spotify")) return;
if(message.member.roles.cache.has(ayar.boosterRoles)) return;
if (message.deletable) message.delete().catch(err => {});
message.channel.send({content: `${message.author} *Reklam Yapmamaya Dikkat Edelim Lütfen.*` }).sil(15)
}
}
})

chatShield.on(Discord.Events.MessageUpdate, async (oldMessage, newMessage) => {
if (oldMessage.author && oldMessage.author.bot || newMessage.member && newMessage.member.permissions.has(Discord.PermissionFlagsBits.Administrator) || newMessage.channel.type == Discord.ChannelType.Dm) return;
const guild = mainShield.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
let panel = await PDB.findOne({ guildID: guild.id });
if(!panel) panel = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if (!oldMessage) return;
if(!newMessage) return;
if(!newMessage.content) return;
const ayar = await setups.findOne({ guildID: guild.id })
if(!ayar) return;
const kelime = ["discord.gg", "discord.me", "discordapp.com", "discord.io", "discord.tk", ".gg/", ".gg"];
let args = newMessage.content.split(" ");
let links = newMessage.content.match(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}?\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi);
let matched = newMessage.content.replace(/[^A-Z]/g, "").length
let yuzde = percentage(matched, newMessage.content.length)
if(panel.capslockShield == true) {
if (Math.round(yuzde) >= 15 && matched / 2 >= 7) {
if(await mainShield.WhitelistControl(message.author.id, "capslock") || await mainShield.WhitelistControl(message.author.id, "full")) return;
if(links) return;
if(newMessage.deletable) newMessage.delete().catch(e => {})
newMessage.channel.send({content: `${newMessage.author} *CapsLock Kullanımını Azaltalım Lütfen.*`}).sil(15)
}
}
function percentage(partialValue, totalValue) {
return (100 * partialValue) / totalValue;
}
if (panel.swearShield == true && kufurler.some(word => args.some(c => word.toLowerCase() == c.toLowerCase())) && !["sus"].some(ver => newMessage.channel.name.includes(ver))) {
if(await mainShield.WhitelistControl(newMessage.author.id, "swear") || await mainShield.WhitelistControl(newMessage.author.id, "full")) return;
newMessage.delete().catch(e => {}).then(message => {
newMessage.channel.send({ content: `${newMessage.author} *Küfür Kullanımına Dikkat Edelim Lütfen.*` }).sil(15)
});
}
if (panel.advertShield == true && kelime.some(reklam => newMessage.content.toLowerCase().includes(reklam)) && ![newMessage.guild.vanityURLCode].some(reklam => newMessage.content.toLocaleLowerCase().includes(reklam))) {
if(await mainShield.WhitelistControl(newMessage.author.id, "advert") || await mainShield.WhitelistControl(newMessage.author.id, "full")) return;
if (newMessage.deletable) newMessage.delete().catch(err => {});
newMessage.channel.send({content: `${newMessage.member} *Reklam Yapmamaya Dikkat Edelim Lütfen.*` }).sil(15)
} else {
if (!links) return;
if(panel.advertShield == true) {
if(await mainShield.WhitelistControl(newMessage.author.id, "advert") || await mainShield.WhitelistControl(newMessage.author.id, "full")) return;
if(newMessage.content.toLowerCase().includes("open.spotify")) return;
if(newMessage.member.roles.cache.has(ayar.boosterRoles)) return;
if (newMessage.deletable) newMessage.delete().catch(err => {});
newMessage.channel.send({content: `${newMessage.member} *Reklam Yapmamaya Dikkat Edelim Lütfen.*` }).sil(15)
}
}
})

otherShield.on(Discord.Events.ClientReady, async () => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
const guild = chatShield.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
await guild.members.fetch()
setInterval(async () => {
const Permissions = [
Discord.PermissionFlagsBits.Administrator,
Discord.PermissionFlagsBits.ManageRoles,
Discord.PermissionFlagsBits.ManageChannels,
Discord.PermissionFlagsBits.ManageGuild,
Discord.PermissionFlagsBits.ManageWebhooks
];
let panel = await PDB.findOne({ guildID: guild.id });
if(!panel) panel = new PDB({ guildID: guild.id, guildShield: true, roleShield: true, channelShield: true, urlShield: true, botShield: true, emojiShield: true, stickerShield: true, bankickShield: true, swearShield: true, advertShield: true, capslockShield: true, spamShield: true, webShield: false, offlineShield: false}).save();
if(panel.webShield == false) return;
guild.members.cache.filter(x => !x.user.bot && x.presence && x.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && Permissions.some((a) => e.permissions.has(a)))).forEach(async (member) => {
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true, size: 2048 })}).setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true })}).setThumbnail(member.user.avatarURL({ dynamic: true }))
const kanal = guild.channels.cache.find(x => x.name == "web-koruma-log") || guild.channels.cache.find(x => x.name == "guard-log");
if(!kanal) return console.log("Log kanalı bulunamadı.");
if(await otherShield.CheckBot(member.user.id)) return;
if(await otherShield.WhitelistControl(member.user.id, "web") || await otherShield.WhitelistControl(member.user.id, "full")) return;
let arr = []
let Dedection =  Object.keys(member.presence.clientStatus);
let CheckWeb = Dedection.find(x => x == "web");
let Roller =  member.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && Permissions.some((a) => e.permissions.has(a)));
if(Roller) Roller.forEach(rol => {
arr.push(rol.id)
})
let Row = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder()
.setCustomId('ver')
.setEmoji("1157606786627543070")
.setLabel('Rolleri Geri Ver!')
.setStyle(Discord.ButtonStyle.Secondary),
)
if(CheckWeb && Permissions.some(x => member.permissions.has(x))) {
await Web.updateOne({ guildID: guild.id, userID: member.user.id }, { $set: { roller: arr, Date: Date.now() } }, { upsert: true })
await member.removeRoles(arr).catch(e => { })
const msg = await kanal.send({embeds: [embed
.setTitle("Bir Yönetici Sunucuya Webden Giriş Sağladı!")
.setDescription(`${member} (\`${member.id}\`) İsimli Yönetici Web Tarayıcısından **Sunucu** Ekranına Giriş Yaptığı İçin Yetkisi Çekildi.
\`\`\`fix
Üzerinden Alınan Roller; (${arr.length})
${arr.length >= 1 ? `${arr.filter(x => member.guild.roles.cache.get(x)).map(x => member.guild.roles.cache.get(x).name).join(", ")}` : `Üzerinden herhangi bir rol alınmadı.`}
\`\`\``)], components: [Row]}).catch(() => {})
const tacsahip = await guild.fetchOwner();
const filter = (i) =>  i.customId == "ver" && (settings.Moderation.owners.includes(i.user.id) || i.user.id === tacsahip.id)
const collector = msg.createMessageComponentCollector({ filter, max: 1 })
collector.on('collect', async i => {
if(i.customId == "ver") {
let Data = await Web.findOne({ guildID: guild.id, userID: member.id })
if(!Data) return;
if(Data.roller.length > 0) {
await i.reply({content: `${member} Üyesinin Çekilen Rolleri Başarıyla Geri Verildi.`, ephemeral: true})
if(Data.roller) await member.addRoles(Data.roller, `${i.user.username} Tarafından Tekrardan Verildi.`).catch(err => {})
await Web.updateOne({ guildID: guild.id, userID: member.id }, { $set: { roller: [], endDate: Date.now() } }, { upsert: true })
} else {
await i.reply({content: `${member} Üyesinin Rolleri Veritabanında Bulunamadığından İşlem Sonlandırıldı.`, ephemeral: true})
}
}
})
collector.on('end', c => {
msg.edit({embeds: [embed], components: []}).catch(err => {})
})
}
})
}, 20000);
})

chatShield.on(Discord.Events.ClientReady, async () => {
const ayar = await setups.findOne({ guildID: settings.Moderation.guildID })
const guild = chatShield.guilds.cache.get(settings.Moderation.guildID)
if(!guild) return;
await guild.members.fetch()
setInterval(() => { PunishedControled(); }, 10 * 1000);
setInterval(() => { gorevKontrol(); }, 15 * 1000)
setInterval(() => { özelOdaControl(settings.Moderation.guildID); }, 10 * 1000)
setInterval(() => { streamerOdaControl(settings.Moderation.guildID); }, 10 * 1000)
setInterval(() => { VoiceLimitControl(settings.Moderation.guildID); }, 60000)
async function PunishedControled() {
if(!ayar) return;
const logChannels = {
"CHAT-MUTE": await chatShield.kanalBul("mute-log"),
"VOICE-MUTE": await chatShield.kanalBul("vmute-log"),
"JAIL": await chatShield.kanalBul("jail-log"),
"TEMP-JAIL": await chatShield.kanalBul("jail-log"),
};
const finishedPenals = await Penalties.find({ guildID: guild.id, active: true, temp: true, finishDate: { $lte: Date.now() } });
finishedPenals.filter((x) => guild.members.cache.get(x.userID)).forEach(async (x) => {
const member = guild.members.cache.get(x.userID);
switch (x.type) {
case "CHAT-MUTE":
await handleChatMute(x, member, ayar, logChannels["CHAT-MUTE"]);
break;
case "VOICE-MUTE":
await handleVoiceMute(x, member, ayar, logChannels["VOICE-MUTE"]);
break;
case "TEMP-JAIL":
await handleTempJail(x, member, ayar, logChannels["TEMP-JAIL"]);
break;
}
});
const activePenals = await Penalties.find({ guildID: guild.id, active: true });
activePenals.filter((x) => guild.members.cache.get(x.userID)).forEach(async (x) => {
const member = guild.members.cache.get(x.userID);
switch (x.type) {
case "CHAT-MUTE":
if (!ayar.muteRoles.some((x) => member.roles.cache.has(x))) await member.addRoles(ayar.muteRoles).catch(e => {});
break;
case "JAIL":
if (!ayar.jailRoles.some((x) => member.roles.cache.has(x))) await member.setRoles(ayar.jailRoles).catch(e => {});
break;
case "TEMP-JAIL":
if (!ayar.jailRoles.some((x) => member.roles.cache.has(x))) await member.setRoles(ayar.jailRoles).catch(e => {});
break;
case "VOICE-MUTE":
if (!ayar.vmuteRoles.some((x) => member.roles.cache.has(x))) await member.addRoles(ayar.vmuteRoles).catch(e => {});
if (member.voice.channelId && !member.voice.serverMute) await member.voice.setMute(true).catch(e => {});
break;
}
});
};

async function handleChatMute(x, member, ayar, logChannel) {
x.active = false;
await x.save();
await member.removeRoles(ayar.muteRoles).catch(e => { });
sendLogMessage(member, logChannel, "Text Kanallarındaki Mute Süresi Doldu.");
}
async function handleTempJail(x, member, ayar, logChannel) {
x.active = false;
await x.save();
await member.setRoles(x.roles.map(x => x)).catch(e => { });
sendLogMessage(member, logChannel, "Karantina Cezası Doldu.");
}
async function handleVoiceMute(x, member, ayar, logChannel) {
if (member.voice.channelId) {
x.removed = true;
await x.save();
if (member.voice.serverMute) member.voice.setMute(false).catch(e => { });
}
x.active = false;
await x.save();
await member.removeRoles(ayar.vmuteRoles).catch(e => { });
sendLogMessage(member, logChannel, "Ses Kanallarındaki Mute Süresi Doldu.");
}

function sendLogMessage(member, logChannel, description) {
logChannel.send({
embeds: [
new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true }) })
.setThumbnail(member.user.avatarURL({ dynamic: true }))
.setDescription(`${member.toString()} Adlı Kullanıcının **${description}**`)
]
}).catch(e => { });
}

async function gorevKontrol() {
await Tasks.updateOne({ guildID: settings.Moderation.guildID, active: true, finishDate: { $lte: Date.now() } }, { active: false, limit: 0 })
}
async function özelOdaControl(guildID) {
if (!ayar) return;
const datas = await PrivateRoomsGuild.findOne({ guildID: guildID })
if (!datas) return;
const channels = await guild.channels.fetch()
const voiceChannels = channels.filter(x => x.type === Discord.ChannelType.GuildVoice && x.parentId == datas?.private_voices?.categoryId && x.id != datas?.private_voices?.channelId)
if (!voiceChannels) return;
if (datas?.private_voices?.mode == false) return;
await voiceChannels.forEach(async (channel) => {
if (!guild.channels.cache.get(channel.id)) return;
if (channel.members.size < 1) {
const channels = await chatShield.kanalBul("özeloda-log")
const data = await PrivateRoomsUser.findOne({ guildId: guildID, 'private_voices.voiceId': channel.id})
const owner = await guild.members.cache.get(data?.userId) || await chatShield.users.fetch(data?.userId)
await channels.send({ embeds: [new Discord.EmbedBuilder().setDescription(`${channel} Kanalında Kimse Bulunmadığı İçin Silindi\n\nKanalın Sahibi: ${owner || "Bulunamadı."}\nKanalın Oluşturulma Tarihi: <t:${Math.floor(channel.createdAt / 1000)}:R>\nKanalın Silinme Tarihi: <t:${String(Date.now()).slice(0, 10)}:R>\nOda İsmi: ${channel.name}\nÖzel Odanın Silinme Nedeni: Kanalda Kimse Bulunmaması`).setColor("Random").setAuthor({ name: owner?.user.username, iconURL: owner?.user?.avatarURL({ dynamic: true }) }).setThumbnail(owner?.user?.avatarURL({ dynamic: true }) || guild.iconURL({ dynamic: true })).setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })] })
await channel.delete({ reason: "Özel Odada Kimse Bulunmadığı İçin Silindi." }).catch(e => { })
const textChannel = await guild.channels.cache.get(data?.private_voices.textId)
await textChannel?.delete({ reason: "Özel Odada Kimse Bulunmadığı İçin Silindi." }).catch(e => { })
await PrivateRoomsUser.deleteOne({ guildId: guildID, userId: data?.userId })
}
})
}
async function streamerOdaControl(guildID) {
if (!ayar) return;
const datas = await StreamerDB.find({ guildID: guildID })
if (!datas) return;
const channels = datas.map(x => guild.channels.cache.get(x.channelID))
channels.forEach(async channel => {
if (!channel) return;
const Data = await StreamerDB.findOne({ guildID: guildID, channelID: channel.id })
if (!Data) return;
if(channel.members.size < 1 && Data.Owner.length > 1) {
await channel.permissionOverwrites.delete(Data.Owner)
for (const member of Data.AllowStreamer || Data.DenyStreamer) {
await channel.permissionOverwrites.delete(member)
}
for (const member of Data.DenyStreamer || Data.AllowStreamer) {
await channel.permissionOverwrites.delete(member)
}
await StreamerDB.updateOne({guildID: guildID, channelID: channel.id}, { $set: { Owner: "", AllowStreamer: [], DenyStreamer: [] } }, { upsert: true });
}
})
}

async function VoiceLimitControl (guildID) {
const guild = chatShield.guilds.cache.get(guildID)
await guild.members.fetch()
guild.members.cache.forEach(async member => {
if(!member) return;
if(member.user.bot) return;
const Data = await VoiceLimit.findOne({ guildID: guildID, userID: member.user.id })
if(Data && Data.db > 0) {
await VoiceLimit.updateOne({ guildID: guildID, userID: member.user.id }, { $set: { db: 0 } }, { upsert: true });
}
})
}
})