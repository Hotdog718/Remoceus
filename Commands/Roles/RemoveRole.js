module.exports = {
  name: "removerole",
  aliases: [],
  category: "Roles",
  description: "Removes a self assignable role",
  usage: "<rolename>",
  permissions: ["Mange Roles"],
  run: async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_ROLES", {checkOwner: true, checkAdmin: true})){
      client.error.noPerms(message, "Manage Roles");
      return;
    }

    let roleName = args.join(" ").toLowerCase();
    if(!roleName){
      message.channel.send("No role found");
      message.react('❌')
      .catch(console.error);
      return;
    }

    const assignableRoles = await client.roles.getRoles(message.guild.id);
    if(!assignableRoles){
      message.channel.send("No data found for assignable roles");
      message.react('❌')
      .catch(console.error);
      return;
    }

    if(assignableRoles.roles[roleName]){
      Roles.removeRole(message.guild.id, roleName)
      message.react('✅')
      .catch(console.error);
      message.channel.send(`Removed ${roleName} from assignable roles.`);
    }else{
      message.channel.send(`${roleName} was not a self assignable role.`);
      message.react('❌')
      .catch(console.error);
    }
  }
}
