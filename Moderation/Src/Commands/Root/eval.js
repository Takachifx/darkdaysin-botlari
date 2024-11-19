const settings = require("../../../../Src/Settings/Settings.json")
const Discord = require('discord.js');
const setups = require("../../../../Src/Schemas/Setup")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = {
conf: {
name: "eval",
aliases: ["root"],
help: "eval [Code]",
owner: true,
category: "owner"
},
Cyrstal: async (client, message, args) => {
const ayar = await setups.findOne({guildID: settings.Moderation.guildID})
if (!args[0]) return message.reply({ content: "Lütfen geçerli bir kod belirtin!" }).sil(15);
try {
const code = args.join(" ");
if(code.includes(client.token)) return message.reply({ content: "Tokeni yarramın başını yersen alırsın orospu evladı"});
if(code.includes("client.token")) return message.reply({ content: "Tokeni yarramın başını yersen alırsın orospu evladı"});
if(code.includes("process.env")) return message.reply({ content: "Tokeni yarramın başını yersen alırsın orospu evladı"});
if(code.includes(settings.Moderation.token)) return message.reply({ content: "Tokeni yarramın başını yersen alırsın orospu evladı"});
if(code.includes("process")) return message.reply({ content: "Tokeni yarramın başını yersen alırsın orospu evladı"});
if(code.includes("token")) return message.reply({ content: "Tokeni yarramın başını yersen alırsın orospu evladı"});
let evaled = clean(await eval(code));
if (typeof evaled !== "string")
evaled = require("util")
.inspect(evaled);
const arr = splitMessages(evaled, { maxLength: 1950, char: "\n" });
arr.forEach((element) => {
message.channel.send({ content: `\`\`\`js\n${element}\n\`\`\`` });
});
} catch (err) {
message.channel.send(`\`EX-ERR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
}

function splitMessages(text, options = {}) {
const maxLength = options.maxLength || 2000;
const char = options.char || "\n";
const messages = [];

const lines = text.split(char);
let currentMessage = "";
let currentLength = 0;

for (const line of lines) {
if (currentLength + line.length + char.length <= maxLength) {
currentMessage += line + char;
currentLength += line.length + char.length;
} else {
messages.push(currentMessage);
currentMessage = line + char;
currentLength = line.length + char.length;
}
}

if (currentMessage.length > 0) {
messages.push(currentMessage);
}

return messages;
}
}
};

function clean(text) {
if (typeof text === "string")
return text
.replace(/`/g, "`" + String.fromCharCode(8203))
.replace(/@/g, "@" + String.fromCharCode(8203));
else return text;
}