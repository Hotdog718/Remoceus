module.exports = {
  name: "iam",
  aliases: [],
  category: "Roles",
  description: "Adds a role to the user",
  usage: "[rolename]",
  permissions: [],
  run: async (client, message, args) => {
    let rolename = args.join(" ");
    
    const roles = await client.roles.getRoles(message.guild.id);

    if(!roles){
      message.channel.send("No self assignable roles found");
      message.react('❌')
						 .catch(console.error);
      return;
    }

    let helpEmbed = require("../../Utils/iamroles.js")(client, message.guild, roles.roles);
    if(!rolename){
      return message.channel.send(helpEmbed);
    }

    let assignableRole = roles.roles[rolename.toLowerCase()];
    if(!assignableRole) return message.channel.send(helpEmbed);
    let role = message.guild.roles.cache.get(assignableRole.id);
    if(!role) return message.channel.send(`Could not find ${role.name} role`);
    const prom = message.member.roles.add(role)
    prom.then(() => message.react('✅'))
				.catch(console.error);
    prom.then(r => message.channel.send(`Added ${role.name} role to ${message.author.tag}`));
    prom.catch((err) => message.channel.send(`Failed to add ${role.name} role to ${message.author.tag}`));
    prom.catch((err) => message.react('❌'))
				.catch(console.error);
  }
}
