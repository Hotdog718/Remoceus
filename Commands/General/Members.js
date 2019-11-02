const { RichEmbed } = require("discord.js");
const membersPerPage = 10;
let page = 1;

module.exports = {
  name: "members",
  aliases: [],
  category: "General",
  description: "Displays all non bot members in the current server",
  usage: "",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let guildMembers = message.guild.members.array().filter(member => !member.user.bot);
    let maxPages = Math.ceil(guildMembers.length/membersPerPage);
    message.channel.send(getMemberPage(client, message.guild))
    .then(msg => {
      let filter = (reaction, user) => {
        return (reaction.emoji.name === "❌" || reaction.emoji.name === "⬅" || reaction.emoji.name === "➡") && user.id === message.author.id;
      }
      const collector = msg.createReactionCollector(filter, {});
      collector.on('collect', (reaction, reactionCollector) => {
        setTimeout(function(){
          reaction.remove(message.author).catch(err => {});
        }, 100)
        switch(reaction.emoji.name){
          case "➡": {
            page = ((page%maxPages)+1);
            msg.edit(getMemberPage(client, message.guild));
            break;
          }
          case "⬅": {
            page = page-1 <= 0 ? maxPages : (page-1);
            msg.edit(getMemberPage(client, message.guild));
            break;
          }
          case "❌":{
            collector.emit("end", reactionCollector);
            break;
          }
        }
      })
      collector.on('end', collected => {
        msg.delete();
      })
      var reactions = ["⬅","➡","❌"];
      reactions.forEach((r, i) => {
        setTimeout(function(){
          msg.react(r);
        }, i*800)
      })
    })
    .catch(err => {});
  }
}


function getMemberPage(client, guild){
  let guildMembers = guild.members.array().filter(member => !member.user.bot);
  let maxPages = Math.ceil(guildMembers.length/membersPerPage);
  let guildEmbed = new RichEmbed()
  .setTitle(`${guild.name}'s Members`)
  .setThumbnail(guild.iconURL)
  .setColor(client.config.color)
  .setFooter(`Page ${page} out of ${maxPages}`);
  for(let i = (page-1)*membersPerPage; i<page*membersPerPage && i<guildMembers.length; i++){
    let leMember = guildMembers[i];
    guildEmbed.addField(`#${i+1}: ${leMember.user.username}`, leMember.user.tag);
  }
  return guildEmbed;
}
