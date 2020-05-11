
module.exports = {
  name: "someone",
  aliases: [],
  category: "Fun",
  description: "Selects a random member from the chat",
  usage: "<none or @role>",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let role = message.mentions.roles.first();
    let membersArray = message.guild.members.cache.array();
    let guildMembers = !args[0] || !role? membersArray.filter(member => !member.user.bot): membersArray.filter(member => member.roles.cache.find(r => r.id === role.id) && !member.user.bot);
    if(guildMembers.size <= 0) return message.channel.send("Not enough members in role").then(m => m.delete({timeout: 5000}));
    let member = guildMembers[Math.floor(Math.random()*guildMembers.length)];
    message.channel.send(`The randomly selected member is: ${member?member.user.tag:"No one"}`);
  }
}
