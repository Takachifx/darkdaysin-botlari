const rankDB = require("../../../../Src/Schemas/RankSystem")
const emojis = require("../../../../Src/Settings/emojiName.json")
const settings = require("../../../../Src/Settings/Settings.json")
const Discord = require("discord.js")
module.exports = {
conf: {
name: "rank",
aliases: ["ranks"],
help: "rank ekle/sil/liste/ayarla/düzenle [Puan] @Rol/ID - @Hammer/ID",
owner: true,
category: "owner"
},
Cyrstal: async (client, message, args, embed) => {
if (!args[0]) return message.reply({ content: "Lütfen geçerli bir işlem belirtin!" }).sil(15)
if (args[0] === "ekle") {
if (!args[1]) return message.reply({ content: "Lütfen geçerli bir puan belirtin!" }).sil(15);
if(!Number(args[1])) return message.reply({ content: "Lütfen bir sayı belirtin!" }).sil(15);
const args2 = args.splice(2).join(" ").split(" - ");
if (!args2) {
await message.react(message.guild.emojiGöster(emojis.no));
return message.reply({ content: "Lütfen bir rol belirtin!" }).sil(15);
}
const role = args2[0].split(" ").map((e) => e.replace(/<@&/g, "").replace(/>/g, ""));
if(!role) return message.reply({ content: "Lütfen bir rol belirtin!" }).sil(15)
let hammer;
if(!args2[0]) return message.reply({ content: "Lütfen bir rol belirtin!" }).sil(15)
if (args2[1]) hammer = args2[1].split(" ").map((e) => e.replace(/<@&/g, "").replace(/>/g, ""));
let data = await rankDB.findOne({ guildID: message.guild.id});
if (!data) data = await new rankDB({ guildID: message.guild.id }).save();
if (data && data.ranks.map(rank => rank.roleID).includes(role.id)) return message.reply({ content: "Bu rol zaten veritabanında bulunuyor!" }).sil(15)
await rankDB.updateOne({ guildID: message.guild.id}, { $push: { ranks: { roleID: String(role), puan: Number(args[1]), hammer: hammer ? hammer : [] } } }, { upsert: true });
data.RankSystem = true;
data.save()
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content: "Başarılı bir şekilde "+role.map(r => `**${message.guild.roles.cache.get(r).name}**`).join(", ")+" rolü veritabanına eklendi!" });
} else if (args[0] === "sil") {
let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
if (!role) return message.reply({ content: "Lütfen geçerli bir rol belirtin!" }).sil(15)
let data = await rankDB.findOne({ guildID: message.guild.id, ranks: { $elemMatch: { roleID: role.id } } });
if (data && !data.ranks.map(rank => rank.roleID).includes(role.id)) return message.reply({ content: "Bu rol veritabanında bulunamadı!" }).sil(15)
await rankDB.updateOne({ guildID: message.guild.id }, { $pull: { ranks: { roleID: role.id } } });
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ content: "Başarılı bir şekilde **"+role.name+"** rolü veritabanından silindi!" });
} else if (args[0] === "liste") {
let data = await rankDB.findOne({ guildID: message.guild.id });
if (!data) return message.reply({ content: "Veritabanında hiçbir rol bulunamadı!" }).sil(15)
embed.setFooter({text: "Toplam Yetki Sayısı: "+data.ranks.length, iconURL: message.guild.iconURL({ dynamic: true })});
embed.setDescription(`${message.guild.emojiGöster(emojis.info)} **${message.guild.name}** Sunucusunun Rank Sistem Ayarları Aşağıda Belirtilmiştir;\n\n${data.ranks.map((rank, index) => `\` ${index+1}. \` **Yetki: ${message.guild.roles.cache.get(rank.roleID) || "Bulunamadı."} Puan: ${rank.puan} Hammer: ${rank.hammer.map(y => message.guild.roles.cache.get(y)).join(", ") || "Bulunamadı."}**`).join("\n\n")}`);
await message.react(message.guild.emojiGöster(emojis.yes))
await message.reply({ embeds: [embed] });
} else if(args[0] === "düzenle") {
const yt = args[1]
if(!yt) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Lütfen bir yetki sırası belirtin!" }).sil(15)
}
let data = await rankDB.findOne({ guildID: message.guild.id });
if (!data) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Veritabanında hiçbir yetki bulunamadı!" }).sil(15)
}
if (!data.ranks) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Veritabanında hiçbir yetki bulunamadı!" }).sil(15)
}
if(yt > data.ranks.length) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Lütfen geçerli bir yetki sırası belirtin!" }).sil(15)
}
data = data.ranks.find((r, i) => i+1 === Number(yt))
if(!data) {
await message.react(message.guild.emojiGöster(emojis.no))
return message.reply({ content: "Lütfen geçerli bir yetki sırası belirtin!" }).sil(15)
}
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.RoleSelectMenuBuilder().setCustomId("permRolesSelectMenu").setPlaceholder("Yetkili Rol Düzenle").setMinValues(1).setMaxValues(20))
const row3 = new Discord.ActionRowBuilder().addComponents(
new Discord.RoleSelectMenuBuilder().setCustomId("permRolesSelectMenu3").setPlaceholder("Hammer Rol Ekle").setMinValues(1).setMaxValues(20))
const row4 = new Discord.ActionRowBuilder().addComponents(
new Discord.RoleSelectMenuBuilder().setCustomId("permRolesSelectMenu4").setPlaceholder("Hammer Rol Kaldır").setMinValues(1).setMaxValues(20))
const row5 = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder().setCustomId("permRolesSelectMenu5").setPlaceholder("Puanı Düzenle").addOptions([{ label: "Puanı Düzenle", value: "duzenle" }]).setMinValues(1).setMaxValues(1))
if(data.hammer.length === 1) {
row4.components[0].setDisabled(true)
}
const msg = await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} **${yt}** Sıradaki Yetki Bilgileri Aşağıda Belirtilmiştir.

Yetkili Rol: ${message.guild.roles.cache.get(data.roleID) || "Bulunamadı."}
Hammer Rol: ${data.hammer.map(x => message.guild.roles.cache.get(x)).join(", ") || "Bulunamadı."}
Puan: **${data.puan || "Bulunamadı."}**`)], components: [row, row3, row4, row5] })
let filter = (i) => i.user.id === message.member.id
const collector = msg.createMessageComponentCollector({ filter, time: 60000 })
collector.on("collect", async i => {
if(i.customId === "permRolesSelectMenu") {
if(!i.values[0]) return;
let data = await rankDB.findOne({ guildID: message.guild.id });
if(!data) return await i.reply({ content: "Veritabanında hiçbir yetki bulunamadı!", ephemeral: true })
if(!data.ranks) return await i.reply({ content: "Veritabanında hiçbir yetki bulunamadı!", ephemeral: true })
data = data.ranks.find((r, i) => i+1 === Number(yt))
if(!data) return await i.reply({ content: "Lütfen geçerli bir yetki sırası belirtin!", ephemeral: true })
if(data.roleID === i.values[0]) return await i.reply({ content: "Lütfen farklı bir yetki seçin!", ephemeral: true })
data.roleID = i.values[0]
await rankDB.updateOne({ guildID: message.guild.id }, { $set: { ranks: data } });
await i.reply({ content: "Yetki basarıyla ayarlandı!", ephemeral: true })
await msg.edit({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} **${yt}** Sıradaki Yetki Bilgileri Aşağıda Belirtilmiştır.

Yetkili Rol: ${message.guild.roles.cache.get(data.roleID) || "Bulunamadı."}
Hammer Rol: ${data.hammer.map(x => message.guild.roles.cache.get(x)).join(", ") || "Bulunamadı."}
Puan: **${data.puan || "Bulunamadı."}**`)], components: [row, row3, row4, row5] })
}
if(i.customId === "permRolesSelectMenu3") {
if(!i.values[0]) return;
let data = await rankDB.findOne({ guildID: message.guild.id });
if(!data) return await i.reply({ content: "Veritabanında hiçbir yetki bulunamadı!", ephemeral: true })
if(!data.ranks) return await i.reply({ content: "Veritabanında hiçbir yetki bulunamadı!", ephemeral: true })
data = data.ranks.find((r, i) => i+1 === Number(yt))
if(!data) return await i.reply({ content: "Lütfen geçerli bir yetki sırası belirtin!", ephemeral: true })
if(data.hammer.includes(i.values[0])) return await i.reply({ content: "Lütfen farklı bir hammer seçin!", ephemeral: true })
data.hammer.push(i.values[0])
await rankDB.updateOne({ guildID: message.guild.id }, { $set: { ranks: data } });
await i.reply({ content: "Hammer rol basarıyla eklendi!", ephemeral: true })
if(data.hammer.length > 1) {
row4.components[0].setDisabled(false)
}
await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} **${yt}** Sıradaki Yetki Bilgileri Aşağıda Belirtilmiştir.

Yetkili Rol: ${message.guild.roles.cache.get(data.roleID) || "Bulunamadı."}
Hammer Rol: ${data.hammer.map(x => message.guild.roles.cache.get(x)).join(", ") || "Bulunamadı."}
Puan: **${data.puan || "Bulunamadı."}**`)], components: [row, row3, row4, row5] })
}
if(i.customId === "permRolesSelectMenu4") {
if(!i.values[0]) return;
let data = await rankDB.findOne({ guildID: message.guild.id });
if(!data) return await i.reply({ content: "Veritabanında hiçbir yetki bulunamadı!", ephemeral: true })
if(!data.ranks) return await i.reply({ content: "Veritabanında hiçbir yetki bulunamadı!", ephemeral: true })
data = data.ranks.find((r, i) => i+1 === Number(yt))
if(!data) return await i.reply({ content: "Lütfen geçerli bir yetki sırası belirtin!", ephemeral: true })
if(!data.hammer.includes(i.values[0])) return await i.reply({ content: "Lütfen sistemde olan bir hammer seçin!", ephemeral: true })
data.hammer = data.hammer.filter(x => x !== i.values[0])
await rankDB.updateOne({ guildID: message.guild.id }, { $set: { ranks: data } });
await i.reply({ content: "Hammer rol basarıyla kaldırıldı!", ephemeral: true })
if(data.hammer.length === 1) {
row4.components[0].setDisabled(true)
}
await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} **${yt}** Sıradaki Yetki Bilgileri Aşağıda Belirtilmiştır.

Yetkili Rol: ${message.guild.roles.cache.get(data.roleID) || "Bulunamadı."}
Hammer Rol: ${data.hammer.map(x => message.guild.roles.cache.get(x)).join(", ") || "Bulunamadı."}
Puan: **${data.puan || "Bulunamadı."}**`)], components: [row, row3, row4, row5] })
}
if(i.customId === "permRolesSelectMenu5") {
const Modal = new Discord.ModalBuilder()
.setTitle("Rank Puan Düzenleme")
.setCustomId("ranksystemedit");
const puans = new Discord.TextInputBuilder()
.setCustomId("puans")
.setPlaceholder("Puan Belirt.")
.setLabel("Puan Belirt.")
.setMinLength(1)
.setMaxLength(10)
.setStyle(1);
const actionRow1 = new Discord.ActionRowBuilder().addComponents(puans);
Modal.addComponents(actionRow1);
await i.showModal(Modal);
let data = await rankDB.findOne({ guildID: message.guild.id });
if(!data) return await i.reply({ content: "Veritabanında hiçbir yetki bulunamadı!", ephemeral: true })
if(!data.ranks) return await i.reply({ content: "Veritabanında hiçbir yetki bulunamadı!", ephemeral: true })
data = data.ranks.find((r, i) => i+1 === Number(yt))
if(!data) return await i.reply({ content: "Lütfen geçerli bir yetki sırası belirtin!", ephemeral: true })
const modal = await i.awaitModalSubmit({ time: 60000 }).catch(() => {});
if (!modal) {
return i.followUp({ content: "Modal zaman aşımına uğradı veya iptal edildi.", ephemeral: true });
}
const puan = modal.fields.getTextInputValue("puans");
data.puan = puan
if(!puan) return await modal.reply({ content: "Lütfen bir puan belirtin!", ephemeral: true })
await rankDB.updateOne({ guildID: message.guild.id }, { $set: { ranks: data } });
await modal.reply({ content: "Puan basarıyla ayarlandı!", ephemeral: true })
await msg.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} **${yt}** Sıradaki Yetki Bilgileri Aşağıda Belirtilmiştır.

Yetkili Rol: ${message.guild.roles.cache.get(data.roleID) || "Bulunamadı."}
Hammer Rol: ${data.hammer.map(x => message.guild.roles.cache.get(x)).join(", ") || "Bulunamadı."}
Puan: **${puan || "Bulunamadı."}**`)], components: [row, row3, row4, row5] })
}
})
} else if (args[0] === "ayarla") {
if(!args[1]) return message.reply({ content: "Lütfen geçerli bir değer belirtin!\n\n`messageCount`, `messageCoin`, `voiceCount`, `voiceCoin`, `streamCount`, `streamCoin`, `cameraCount`, `cameraCoin`, `inviteCount`, `inviteCoin`, `tagCount`, `tagCoin`, `staffCount`, `staffCoin`" }).sil(15)
if(args[1] == "liste") {
let data = await rankDB.findOne({ guildID: message.guild.id });
if (!data) data = await new rankDB({ guildID: message.guild.id }).save();
if(data.RankSystem === false) return message.reply({ content: "Rank sistemi aktif değil!" }).sil(15)
await message.react(message.guild.emojiGöster(emojis.yes))
return await message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.member} Puan Ayarları Aşağıda Belirtilmiştir.

Mesaj Miktarı: **${data.messageCount || "Bulunamadı."}**
Mesaj Puanı: **${data.messageCoin || "Bulunamadı."}**
Ses Miktarı: **${data.voiceCount || "Bulunamadı."} Dakika**
Ses Puanı: **${data.voiceCoin || "Bulunamadı."}**
Stream Miktarı: **${data.streamCount || "Bulunamadı."} Dakika**
Stream Puanı: **${data.streamCoin || "Bulunamadı."}**
Kamera Miktarı: **${data.cameraCount || "Bulunamadı."} Dakika**
Kamera Puanı: **${data.cameraCoin || "Bulunamadı."}**
Davet Miktarı: **${data.inviteCount || "Bulunamadı."}**
Davet Puanı: **${data.inviteCoin || "Bulunamadı."}**
Taglı Çekme Miktarı: **${data.tagCount || "Bulunamadı."}**
Taglı Çekme Puanı: **${data.tagCoin || "Bulunamadı."}**
Yetkili Çekme Miktarı: **${data.staffCount || "Bulunamadı."}**
Yetkili Çekme Puanı: **${data.staffCoin || "Bulunamadı."}**`)]})
}
if(["messageCount", "messageCoin", "voiceCount", "voiceCoin", "streamCount", "streamCoin", "cameraCount", "cameraCoin", "inviteCount", "inviteCoin", "tagCount", "tagCoin", "staffCount", "staffCoin"].includes(args[1])) {
if(!args[2]) return message.reply({ content: "Lütfen geçerli bir değer belirtin!" }).sil(15)
if(isNaN(args[2])) return message.reply({ content: "Lütfen geçerli bir değer belirtin!" }).sil(15)
let data = await rankDB.findOne({ guildID: message.guild.id });
if (!data) data = await new rankDB({ guildID: message.guild.id }).save();
if(data.RankSystem === false) return message.reply({ content: "Rank sistemi aktif değil!" }).sil(15)
if (args[1] === "messageCount") {
data.messageCount = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **messageCount** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "messageCoin") {
data.messageCoin = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **messageCoin** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "voiceCount") {
data.voiceCount = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **voiceCount** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "voiceCoin") {
data.voiceCoin = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **voiceCoin** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "streamCount") {
data.streamCount = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **streamCount** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "streamCoin") {
data.streamCoin = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **streamCoin** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "cameraCount") {
data.cameraCount = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **cameraCount** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "cameraCoin") {
data.cameraCoin = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **cameraCoin** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "inviteCount") {
data.inviteCount = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **inviteCount** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "inviteCoin") {
data.inviteCoin = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **inviteCoin** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "tagCount") {
data.tagCount = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **tagCount** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "tagCoin") {
data.tagCoin = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **tagCoin** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "staffCount") {
data.staffCount = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **staffCount** değeri **"+args[2]+"** olarak ayarlandı!" })
} else if (args[1] === "staffCoin") {
data.staffCoin = Number(args[2]);
data.save();
await message.reply({ content: "Başarılı bir şekilde **staffCoin** değeri **"+args[2]+"** olarak ayarlandı!" })
}
}
}
}
}