const Pokemon = require("../../Utils/Pokemon.js");
const { MessageEmbed } = require("discord.js");
const movesPerPage = 5;
let isShiny = false;

module.exports = {
  name: "learnset",
  aliases: [],
  category: "Pokemon",
  description: "Displays the learnset for a pokemon",
  usage: "<Pokemon Name>",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    isShiny = (Math.floor(Math.random() * 100) == 0);
    const learnsets = Pokemon.LearnSets;
    let pokemon = args.join(" ").replace(/[^a-z]/gi, "").toLowerCase();
    if(!pokemon) return message.channel.send("Could not find argument");
    if(!learnsets[pokemon]) return message.channel.send(`Could not find moveset for ${pokemon}`);
    let MoveSets = learnsets[pokemon].learnset;
    if(!MoveSets) return message.channel.send(`Could not find moveset for ${pokemon}`);
    let maxPages = Math.ceil(Object.keys(MoveSets).length/movesPerPage);
    let index = 0;
    let search = Pokemon.PokemonInfo[pokemon];
    if(!search) return message.channel.send(`Could not find pokemon`);
    message.channel.send(await getMoveSetEmbed(client, search, MoveSets, index)).then(msg => {
      let reactions = ["⬅", "➡", '⏹'];
			reactions.forEach(function(r, i){
				setTimeout(function(){
					msg.react(r);
				}, i*800)
			})
      
      //set filter to only let only set reactions and message author to respond
			const filter = (reaction, user) => {
				return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
			}

			//create Reaction Collector
			const collector = msg.createReactionCollector(filter, {idle: 60000});

			collector.on('collect', async(reaction, user) => {
        const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
				try {
					for (const reaction of userReactions.values()) {
						await reaction.users.remove(message.author.id);
					}
				} catch (error) {
					console.error('Failed to remove reactions.');
				}
				switch(reaction.emoji.name){
					case `⬅`:{
            index = (index-1) < 0? maxPages-1 :index-1;
            msg.edit(await getMoveSetEmbed(client, Pokemon.PokemonInfo[pokemon], MoveSets, index));
            break;
					}
					case `➡`:{
            index = (index+1)%maxPages;
            msg.edit(await getMoveSetEmbed(client, Pokemon.PokemonInfo[pokemon], MoveSets, index));
            break;
					}
					case `⏹`:{
						collector.stop();
						break;
					}
				}
			})

      collector.on('end', collected => {
        msg.delete().catch(() => {});
      })
    })
  }
}

async function getMoveSetEmbed(client, poke, learnset, index){
  let url = Pokemon.GetSerebiiURL(poke.name, poke.form, isShiny)

  let maxPages = Math.ceil(Object.keys(learnset).length/movesPerPage);

  const embed = new MessageEmbed()
  .setTitle(poke.name)
  .setThumbnail(url)
  .setColor(Pokemon.TypeColors[poke.types[0]])
  .setFooter(`Page ${index+1} of ${maxPages}`);

  let moves = Object.keys(learnset);

  for(let i = index*movesPerPage; i<(index+1)*movesPerPage && i<moves.length; i++){
    let move = Pokemon.MoveInfo[moves[i]];
    if(move)
      embed.addField(`${move.name}`, `Type: ${move.type}\nPP: ${move.pp >= 5?`${move.pp} to ${move.pp+(move.pp/5)*3}`:move.pp}\n${move.basePower?`Power: ${move.basePower} `:''}${move.accuracy?`Accuracy: ${move.accuracy.toString() == "true"?'--':`${move.accuracy}%`}`:''}\nCategory: ${move.category}\n${move.zMovePower?`Z-Move Power: ${move.zMovePower}\n`:``}`)
  }

  return embed;
}
