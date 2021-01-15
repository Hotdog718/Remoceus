module.exports = {
  name: "addrole",
  aliases: [],
  category: "Roles",
  description: "Adds a new self assignable role",
  usage: "<@role> <description>",
  permissions: ["Mange Roles"],
  run: async (client, message, args) => {
    // Check user permissions
    if(!message.member.hasPermission("MANAGE_ROLES", {checkOwner: true, checkAdmin: true})){
      client.errors.noPerms(message, "Manage Roles");
      return;
    }

    // Get role
    let role = message.mentions.roles.first();
    if(!role){
      message.channel.send("You must provide a role");
      message.react('❌')
      .catch(console.error);
      return;
    }

    // Get description
    let description = args.slice(1).join(" ") || "";
    
    await client.roles.addRole(message.guild.id, role.name.toLowerCase(), {id: role.id, description: description});
    message.channel.send(`Added ${role.name} to assignable role list!`)
    message.react('✅')
    .catch(console.error);
  }
}
