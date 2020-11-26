const { MessageEmbed, MessageCollector } = require("discord.js");

module.exports = {
  name: "help",
  aliases: [],
  category: "General",
  description: "Displays help menu",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let categoryNames = [];
    let index = 0;
    client.commands.forEach(function(object, key, map){
      if(!categoryNames.includes(object.category)){
        categoryNames.push(object.category);
      }
    })

    client.helpers.createMenuEmbed(client, message, categoryNames, getCategoryEmbed);
  }
}

function getCategoryEmbed(client, index, categoryNames){
  let commands = [];
  client.commands.filter(r => r.category === categoryNames[index]).forEach(function(object, key, map){
    let obj = {
      name: object.name,
      description: object.description,
      usage: object.usage,
      permissions: object.permissions.join(", "),
      aliases: object.aliases
    }
    commands.push(obj);
  })
  let embed = new MessageEmbed()
  .setTitle(`${categoryNames[index]} Commands`)
  .setColor(client.config.color)
  .setThumbnail(client.user.displayAvatarURL())
  .setFooter(`Page ${index+1} of ${categoryNames.length}`);
  if(commands.length == 0){
    embed.addField("No Commands", "No Commands Listed");
  }else{
    for(let i = 0; i<commands.length; i++){
      let temp = commands[i];
      embed.addField(`${client.config.prefix}${temp.name} ${temp.usage}`, `Description: ${temp.description}${temp.permissions? `\nPermissions: ${temp.permissions}`: ``}${temp.aliases.length > 0?`\nAliases: !${temp.aliases.join(", !")}`: ``}`)
    }
  }
  return embed;
}
