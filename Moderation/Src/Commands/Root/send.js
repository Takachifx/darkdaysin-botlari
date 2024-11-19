const settings = require("../../../../Src/Settings/Settings.json")
module.exports = {
conf: {
aliases: ["yaz"],
name: "send",
help: "yaz [Text]",
category: "owner",
owner: true
},
Cyrstal: async (client, message, args, embed) => {
if(!args) return message.reply({content: ".send <Text>" }).sil(15)
await message.delete().catch(() => {});
let text = args.join(" ");
const chunk = await client.splitMessage(text, 4060)
for (text of chunk) {
await message.channel.send({content: `${text}`})
}
}
}