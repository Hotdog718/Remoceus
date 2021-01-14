const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "roll",
  aliases: ["r"],
  category: "Fun",
  description: "Rolls dice",
  usage: "[number of dice]d[sides of dice] ex. !roll 2d20",
  permissions: [],
  run: async (client, message, args) => {
    try{
      let diceRolls = args[0].split("d");
      let num = parseInt(diceRolls[0]);
      let type = parseInt(diceRolls[1]);
      
      if(!num || isNaN(num) || !type || isNaN(type)) return message.channel.send("Error");
      if(num > 24) return message.channel.send("Cannot roll more than 24 dice at a time");
      
      var promise = new Promise(function(resolve, reject){
        let rollEmbed = new MessageEmbed()
        .setTitle("Dice Rolls")
        .setColor(client.config.color);
        let sum = 0;
        for(let i = 0; i<num; i++){
          let roll = Math.floor((Math.random()*type)+1);
          rollEmbed.addField(`#${i+1}`, roll, true);
          sum += roll;
          if(i === num-1){
            rollEmbed.setDescription(`Average of rolled dice: ${Math.round(sum/num)}, Sum of rolled dice: ${sum}`);
            resolve(rollEmbed);
          }
        }
      });
      promise.then((embed) => message.channel.send(embed))
             .catch(console.error())
    }catch(e){
			message.react('❌');
      message.channel.send("error");
    }
  }
}
