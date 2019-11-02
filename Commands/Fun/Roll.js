const { RichEmbed } = require("discord.js");

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
      if(!num || isNaN(num) || !type || isNaN(type)) return message.channel.send("Error").then(m => m.delete(5000).catch(err => {}));
      if(num > 24) return message.channel.send("Cannot roll more than 24 dice at a time").then(m => m.delete(5000).catch(err => {}))
      var promise = new Promise(function(resolve, reject){
        let rollEmbed = new RichEmbed()
        .setTitle("Dice Rolls")
        .setColor(client.config.color);
        let sum = 0;
        for(let i = 0; i<num; i++){
          let roll = Math.floor((Math.random()*type)+1);
          rollEmbed.addField(`#${i+1}`, roll, true);
          sum+=roll;
          if(i === num-1){
            if(num%3 === 1){
              rollEmbed.addBlankField(true).addBlankField(true);
            }else if(num%3 === 2){
              rollEmbed.addBlankField(true);
            }
            rollEmbed.setDescription(`Average of rolled dice: ${Math.round(sum/num)}, Sum of rolled dice: ${sum}`);
            resolve(rollEmbed);
          }
        }
      });
      promise.then((embed) => {
        return message.channel.send(embed);
      })
      .catch(err => {})
    }catch(e){
      message.channel.send("error");
    }
  }
}
