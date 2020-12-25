const { MessageEmbed, MessageCollector } = require("discord.js");

module.exports = {
  name: "help",
  aliases: [],
  category: "General",
  description: "Displays help menu",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    let categoryNames = [];
    let index = 0;
    client.commands.forEach(function(object, key, map){
      if(!categoryNames.includes(object.category)){
        categoryNames.push(object.category);
      }
    })
    if(args.length === 0){
      client.helpers.createMenuEmbed(client, message, categoryNames, getCategoryEmbed);
    }else{
      if(args[0].toLowerCase() === "list"){
        let embed = new MessageEmbed()
        .setTitle("Category Listing")
        .setDescription(categoryNames.join(",\n"))
        .setColor(client.config.color)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Use "${client.config.prefix}help <Category Name>" to find commands for a specific category\nUse "${client.config.prefix}help list" to display categories\nAnd use "${client.config.prefix}help" for the generic help menu`);
        message.channel.send(embed);
        return;
      }
      let page = args.join(" ");
      let embed = getCategoryEmbed(client, 0, [page]).setFooter(`Use "${client.config.prefix}help <Category Name>" to find commands for a specific category\nUse "${client.config.prefix}help list" to display categories\nAnd use "${client.config.prefix}help" for the generic help menu`);

      message.channel.send(embed);
    }
  }
}

function getCategoryEmbed(client, index, categoryNames){
  let commands = [];
  client.commands.filter(r => r.category.toLowerCase() === categoryNames[index].toLowerCase()).forEach(function(object, key, map){
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
  .setTitle(`${client.helpers.toTitleCase(categoryNames[index])} Commands`)
  .setColor(client.config.color)
  .setThumbnail(client.user.displayAvatarURL())
  .setFooter(`Page ${index+1} of ${categoryNames.length}\nUse "${client.config.prefix}next" to go to the next page\nUse "${client.config.prefix}back" to go to the last page\nAnd use "${client.config.prefix}stop" to stop the help dialog box.`);
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
