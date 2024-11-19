const settings = require("../../../../Src/Settings/Settings.json")
const setups = require("../../../../Src/Schemas/Setup")
const emojis = require("../../../../Src/Settings/emojiName.json")
const Discord = require("discord.js")
const children = require("child_process")
module.exports = {
conf: {
aliases: ["pm2", "pm2", "pm2"],
name: "pm2",
help: "pm2",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
if(!args) return message.reply({content: ".pm2 <restart/stop/start/list> (Proc ID)" })
const ls = children.exec(`pm2 ${args.join(' ')}`);
ls.stdout.on('data', async function (content) {
if (content.length > 1900) {
const chunks = await client.splitMessage(content, 1900);
for (const chunk of chunks) {
await message.channel.send({content: `\`\`\`\n${chunk}\n\`\`\`` });
}
} else {
await message.channel.send({content: `\`\`\`\n${content}\n\`\`\`` });
}
})
}
}