const otherShield = global.mainShield
module.exports = async(member) => {
await otherShield.WhitelistRemove(member.id)
}
module.exports.conf = {
name: "guildMemberRemove",
};