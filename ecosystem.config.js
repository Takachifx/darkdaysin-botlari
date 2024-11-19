let Bots = [
{
name: "Moderation",
namespace: "Moderation",
script: 'index.js',
watch: true,
exec_mode: "cluster",
max_memory_restart: "2G",
cwd: "./Moderation/"
},
{
name: "Guard",
namespace: "Guard",
script: 'index.js',
watch: true,
exec_mode: "cluster",
max_memory_restart: "2G",
cwd: "./Guard/"
},
]
module.exports = { apps: Bots }