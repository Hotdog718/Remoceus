const { MessageEmbed } = require("discord.js");

module.exports = (client, guild, roles) => {
  let help = new MessageEmbed()
  .setTitle("Assignable Roles")
  .setThumbnail(client.user.displayAvatarURL())
  .setColor(client.config.color);
  let keys = Object.keys(roles);
  keys.sort((a, b) => {
    if(a.toUpperCase() < b.toUpperCase()){
      return -1;
    }
    if(a.toUpperCase() > b.toUpperCase()){
      return 1;
    }
    return 0;
  })

  for(let i = 0; i < keys.length; i++){
    let roleInfo = roles[keys[i]];
    let role = guild.roles.cache.get(roleInfo.id);
    if(!role) continue;
    help.addField(role.name, roleInfo.description);
  }
  return help;
}
