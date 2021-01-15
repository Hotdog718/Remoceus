module.exports = {
  name: "iamnot",
  aliases: [],
  category: "Roles",
  description: "Removes a role from the user",
  usage: "[rolename]",
  permissions: [],
  run: async (client, message, args) => {
    let rolename = args.join(" ");
    const assignableRoles = await client.roles.getRoles(message.guild.id);

    if(!assignableRoles){
      message.channel.send("No self assignable roles found");
      message.react('❌')
						 .catch(console.error);
      return;
    }

    let helpEmbed = require("../../Utils/iamroles.js")(client, message.guild, assignableRoles.roles);
    if(!rolename){
      return message.channel.send(helpEmbed);
    }

    let assignableRole = assignableRoles.roles[rolename.toLowerCase()];
    if(!assignableRole) return message.channel.send(helpEmbed);
    let role = message.guild.roles.cache.get(assignableRole.id);
    if(!role) return message.channel.send(`Could not find ${role.name} role`);
    const prom = message.member.roles.remove(role);
    prom.then(() => message.react('✅'))
				.catch(console.error);
    prom.then(r => message.channel.send(`Removed ${role.name} role from ${message.author.tag}`));
    prom.catch((err) => message.channel.send(`Failed to remove ${role.name} role from ${message.author.tag}`));
    prom.catch((err) => message.react('❌'))
				.catch(console.error);
  }
}
