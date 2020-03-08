const Pokemon = require("../../Utils/Pokemon.js");
const { RichEmbed } = require("discord.js");
const movesPerPage = 3;

module.exports = {
  name: "learnset",
  aliases: [],
  category: "Pokemon",
  description: "Displays the learnset for a pokemon",
  usage: "<Pokemon Name>",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    const learnsets = Pokemon.LearnSets;
    let pokemon = args.join("").split("-").join("").toLowerCase();
    if(!pokemon) return message.channel.send("Could not find argument").then(m => m.delete(5000));
    let MoveSets = learnsets[pokemon].learnset;
    if(!MoveSets) return message.channel.send(`Could not find moveset for ${pokemon}`).then(m => m.delete(5000));
    let maxPages = Math.ceil(Object.keys(MoveSets).length/movesPerPage);
    let index = 0;
    message.channel.send(await getMoveSetEmbed(client, Pokemon.PokemonInfo[pokemon], MoveSets, index)).then(msg => {
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

      collector.on('collect', async (reaction) => {
        setTimeout(function(){
          reaction.remove(message.author.id).catch(err => {});
        }, 250)
        switch(reaction.emoji.name){
          case '⬅':{
            index = (index-1) < 0? maxPages-1 :index-1;
            msg.edit(await getMoveSetEmbed(client, Pokemon.PokemonInfo[pokemon], MoveSets, index));
            break;
          }
          case '➡':{
            index = (index+1)%maxPages;
            msg.edit(await getMoveSetEmbed(client, Pokemon.PokemonInfo[pokemon], MoveSets, index));
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

async function getMoveSetEmbed(client, poke, learnset, index){
  let url = `https://www.serebii.net/pokemon/art/${getNum(poke.num)}${getforme(poke)}.png`;

  let maxPages = Math.ceil(Object.keys(learnset).length/movesPerPage);

  const embed = new RichEmbed()
  .setTitle(poke.species)
  .setThumbnail(url)
  .setColor(Pokemon.TypeColors[poke.types[0]])
  .setFooter(`Page ${index+1} of ${maxPages}`);

  let moves = Object.keys(learnset);

  for(let i = index*movesPerPage; i<(index+1)*movesPerPage && i<moves.length; i++){
    let move = Pokemon.MoveInfo[moves[i]];
    embed.addField(`${move.name}`, `Type: ${move.type}\nPP: ${move.pp >= 5?`${move.pp} to ${move.pp+(move.pp/5)*3}`:move.pp}\n${move.basePower?`Power: ${move.basePower} `:''}${move.accuracy?`Accuracy: ${move.accuracy.toString() == "true"?'--':`${move.accuracy}%`}`:''}\nCategory: ${move.category}\n${move.zMovePower?`Z-Move Power: ${move.zMovePower}\n`:``}`)
  }

  return embed;
}

function getforme(obj){
  if(obj.formeLetter){
    return `-${obj.formeLetter.toLowerCase()}`;
  }else{
    return '';
  }
}

function getNum(number){
  if(number < 10){
    return `00${number}`;
  }else if(number < 100){
    return `0${number}`;
  }else{
    return number;
  }
}
