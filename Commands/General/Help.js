
const { MessageEmbed } = require("discord.js");

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
    message.channel.send(getCategoryEmbed(client, categoryNames, index)).then(msg => {
      //Add Reactions to msg
      let reactions = ["⬅", "➡", "⏹"];
      reactions.forEach(function(r, i){
        setTimeout(function(){
          msg.react(r);
        }, i*800)
      })

      //set filter to only let only set reactions and message author to respond
      const filter = (reaction, user) => {
        return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
      }

      //create reactionCollector
      const collector = msg.createReactionCollector(filter, {});

      collector.on('collect', (reaction) => {
        switch(reaction.emoji.name){
          case '⬅':{
            index = (index-1) < 0? categoryNames.length-1 :index-1;
            msg.edit(getCategoryEmbed(client, categoryNames, index));
            break;
          }
          case '➡':{
            index = (index+1)%categoryNames.length;
            msg.edit(getCategoryEmbed(client, categoryNames, index));
            break;
          }
          case '⏹':{
            collector.emit('end');
            break;
          }
        }
      })

      collector.on('end', collected => {
        msg.delete();
      })
    })
  }
}

function getCategoryEmbed(client, categoryNames, index){
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
