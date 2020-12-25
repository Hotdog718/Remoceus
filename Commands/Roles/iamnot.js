const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "iamnot",
  aliases: [],
  category: "Roles",
  description: "Removes a role from the user",
  usage: "[rolename]",
  permissions: [],
  run: async (client, message, args) => {
    let helpEmbed = require("../../Utils/iamroles.js")(client);
    let rolename = args.join(" ");
    if(!rolename){
      return message.channel.send(helpEmbed);
    }
    switch(rolename.toLowerCase()){
      case 'spoilers': {
        let role = message.guild.roles.cache.find(r => r.name === "Spoilers");
        if(!role) return message.channel.send("Could not find spoilers role").then(m => m.delete({timeout: 5000}).catch(err => {}));
        message.member.roles.remove(role)
          .then(r => message.channel.send(`Removed Spoilers role from ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})))
          .catch(err => message.channel.send(`Failed to remove Spoilers role from ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})));
        break;
      }

      default: {
        message.channel.send(helpEmbed);
        break;
      }
    }
  }
}
