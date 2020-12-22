const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "iam",
  aliases: [],
  category: "Roles",
  description: "Adds a role to the user",
  usage: "[rolename]",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let rolename = args.join(" ");
    let helpEmbed = require("../../Utils/iamroles.js")(client);
    if(!rolename){
      return message.channel.send(helpEmbed);
    }
    switch(rolename.toLowerCase()){
      case 'spoilers': {
        let role = message.guild.roles.cache.find(r => r.name === "Spoilers");
        if(!role) return message.channel.send("Could not find spoilers role").then(m => m.delete({timeout: 5000}).catch(err => {}));
        message.member.roles.add(role)
          .then(r => message.channel.send(`Added Spoilers role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})))
          .catch(err => message.channel.send(`Failed to add Spoilers role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})));
        break;
      }

      default: {
        message.channel.send(helpEmbed);
        break;
      }
    }
  }
}
