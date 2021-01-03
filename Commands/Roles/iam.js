const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "iam",
  aliases: [],
  category: "Roles",
  description: "Adds a role to the user",
  usage: "[rolename]",
  permissions: [],
  run: async (client, message, args) => {
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

      case 'gym challenger': {
        let role = message.guild.roles.cache.find(r => r.name === "Gym Challenger");
        if(!role) return message.channel.send("Could not find Gym Challenger role").then(m => m.delete({timeout: 5000}).catch(err => {}));
        message.member.roles.add(role)
          .then(r => message.channel.send(`Added Gym Challenger role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})))
          .catch(err => message.channel.send(`Failed to add Gym Challenger role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})));
        break;
      }

      case 'singles': {
        let roleTitle = "Singles"
        let role = message.guild.roles.cache.find(r => r.name === roleTitle);
        if(!role) return message.channel.send(`Could not find ${roleTitle} role`).then(m => m.delete({timeout: 5000}).catch(err => {}));
        message.member.roles.add(role)
          .then(r => message.channel.send(`Added ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})))
          .catch(err => message.channel.send(`Failed to add ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})));
        break;
      }

      case 'doubles': {
        let roleTitle = "Doubles"
        let role = message.guild.roles.cache.find(r => r.name === roleTitle);
        if(!role) return message.channel.send(`Could not find ${roleTitle} role`).then(m => m.delete({timeout: 5000}).catch(err => {}));
        message.member.roles.add(role)
          .then(r => message.channel.send(`Added ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})))
          .catch(err => message.channel.send(`Failed to add ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})));
        break;
      }

      case 'multi': {
        let roleTitle = "Multi"
        let role = message.guild.roles.cache.find(r => r.name === roleTitle);
        if(!role) return message.channel.send(`Could not find ${roleTitle} role`).then(m => m.delete({timeout: 5000}).catch(err => {}));
        message.member.roles.add(role)
          .then(r => message.channel.send(`Added ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})))
          .catch(err => message.channel.send(`Failed to add ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})));
        break;
      }

      case 'ffas': {
        let roleTitle = "FFAs"
        let role = message.guild.roles.cache.find(r => r.name === roleTitle);
        if(!role) return message.channel.send(`Could not find ${roleTitle} role`).then(m => m.delete({timeout: 5000}).catch(err => {}));
        message.member.roles.add(role)
          .then(r => message.channel.send(`Added ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})))
          .catch(err => message.channel.send(`Failed to add ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})));
        break;
      }

      case 'smash': {
        let roleTitle = "Smash"
        let role = message.guild.roles.cache.find(r => r.name === roleTitle);
        if(!role) return message.channel.send(`Could not find ${roleTitle} role`).then(m => m.delete({timeout: 5000}).catch(err => {}));
        message.member.roles.add(role)
          .then(r => message.channel.send(`Added ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})))
          .catch(err => message.channel.send(`Failed to add ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})));
        break;
      }

      case 'spriter': {
        let roleTitle = "Spriters"
        let role = message.guild.roles.cache.find(r => r.name === roleTitle);
        if(!role) return message.channel.send(`Could not find ${roleTitle} role`).then(m => m.delete({timeout: 5000}).catch(err => {}));
        message.member.roles.add(role)
          .then(r => message.channel.send(`Added ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})))
          .catch(err => message.channel.send(`Failed to add ${roleTitle} role to ${message.author.tag}`).then(m => m.delete({timeout: 5000}).catch(err => {})));
        break;
      }

      default: {
        message.channel.send(helpEmbed);
        break;
      }
    }
  }
}
