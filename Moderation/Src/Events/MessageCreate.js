const Discord = require("discord.js");
const client = global.client;
const settings = require("../../../Src/Settings/Settings.json")
const setups = require("../../../Src/Schemas/Setup")
const bannedCmd = require("../../../Src/Schemas/BannedCommand")
const emojis = require("../../../Src/Settings/emojiName.json")
const CooldownCommands = new Map();
module.exports = async (message) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
let prefix = settings.Moderation.prefix.find((x) => message.content.toLowerCase().startsWith(x));
if (message.author.bot || !message.guild || !prefix) return;
let args = message.content.substring(prefix.length).trim().split(" ");
if(!args[0]) return;
let commandName = args[0].toLowerCase();
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: `${ayar && ayar.botFooter ? ayar.botFooter : `${message.guild.name}`}`, iconURL: message.author.avatarURL({ dynamic: true })}).setAuthor({ name: message.author.username, iconURL: message.author.avatarURL({ dynamic: true })}).setTimestamp();
args = args.splice(1);
let cmd = client.Komutlar.has(commandName) ? client.Komutlar.get(commandName) : client.Komutlar.get(client.Aliases.get(commandName));
if (cmd) {
if (cmd.conf.owner && !settings.Moderation.owners.includes(message.author.id)) {
await message.react(message.guild.emojiGöster(emojis.nocommand));
return message.reply({content: `${message.guild.emojiGöster(emojis.nocommand)} Bu Komutu Kullanamazsın!`}).sil(15);
}
let kanallar = [ayar && ayar.chatChannel]
if(kanallar.includes(message.channel.id) && !["snipe", "sil", "temizle", "kilit"].some(x => commandName == x) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.reply({content: `${message.guild.emojiGöster(emojis.nocommand)} Bot Komutlarını Sohbet Kanalında Kullanamazsın!`}).sil(15);
var veri = await bannedCmd.findOne({guildID: settings.Moderation.guildID}) || {"kullanici": []};
if (veri.kullanici.includes(message.member.id)) return message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.nocommand)} ${message.member} Komut Kullanımınız Yasaklanmış.`)]}).sil(15)
if (cmd.conf.cooldown > 0) {
const Cooldowns = GetRemainingCooldown(message.author.id, cmd);
if (Cooldowns > 0 && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !settings.Moderation.owners.includes(message.author.id)) {
const timestamp = Math.floor(Date.now() / 1000) + Math.round(Cooldowns / 1);
message.reply({content: `${message.author}, Bu Komutu Tekrar Kullanabilmek İçin <t:${timestamp}:R> Denemelisin!`}).sil(Cooldowns);
return;
}
}
cmd.Cyrstal(client, message, args, embed, prefix);
if (cmd.conf.cooldown > 0) CooldownApply(message.author.id, cmd);
}
};
module.exports.conf = {
name: "messageCreate",
};

function CooldownApply(memberId, cmd) {
const key = cmd.name + '|' + memberId;
CooldownCommands.set(key, Date.now());
}

function GetRemainingCooldown(memberId, cmd) {
const key = cmd.name + '|' + memberId;
if (CooldownCommands.has(key)) {
const remaining = (Date.now() - CooldownCommands.get(key)) * 0.001;
if (remaining > cmd.conf.cooldown) {
CooldownCommands.delete(key);
return 0;
}
return cmd.conf.cooldown - remaining;
}
return 0;
}