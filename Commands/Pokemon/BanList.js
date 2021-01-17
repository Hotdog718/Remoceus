const { MessageEmbed } = require('discord.js');
const Pokemon = require('../../Utils/Pokemon.js');

module.exports = {
	name: "banlist",
	aliases: [],
	category: "Pokemon",
	description: "Displays Pokemon banned on the Server",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
        let embed = await getBannedPokemonEmbed(client, message);
        message.channel.send(embed).then(async msg => {
            let reactions = ['🇵', '🇩', '🇦', '🇲', '🇨', '⏹'];
			reactions.forEach(function(r, i){
				setTimeout(function(){
					msg.react(r);
				}, i*500)
			})
      
            // set filter to only let only set reactions and message author to respond
			const filter = (reaction, user) => {
				return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
			}

			// create Reaction Collector
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
					case `🇵`:{
                        msg.edit(await getBannedPokemonEmbed(client, message));
                        break;
					}
					case `🇩`:{
                        msg.edit(await getBannedDynamaxEmbed(client, message));
                        break;
                    }
                    case `🇦`:{
                        msg.edit(await getBannedAbilitiesEmbed(client, message));
                        break;
                    }
                    case `🇲`:{
                        msg.edit(await getBannedMovesEmbed(client, message));
                        break;
                    }
                    case `🇨`:{
                        msg.edit(await getClausesEmbed(client, message));
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

async function getBannedPokemonEmbed(client, message){
    const bannedPokemon = await client.banlist.getBannedPokemon(message.guild.id);
    let embed = new MessageEmbed()
    .setTitle(`${message.guild.name}\'s banlist`)
    .setColor(client.config.color)
    .addField('Banned Pokemon', bannedPokemon ? (formatPokemonNames(bannedPokemon) || 'None') : 'None');
    return embed;
}

async function getBannedDynamaxEmbed(client, message){
    const bannedDynamax = await client.banlist.getBannedDynamax(message.guild.id);
    let embed = new MessageEmbed()
    .setTitle(`${message.guild.name}\'s banlist`)
    .setColor(client.config.color)
    .addField('Banned Dynamax', bannedDynamax ? (formatPokemonNames(bannedDynamax) || 'None') : 'None');
    return embed;
}

async function getBannedAbilitiesEmbed(client, message){
    const bannedAbilities = await client.banlist.getBannedAbilities(message.guild.id);
    let embed = new MessageEmbed()
    .setTitle(`${message.guild.name}\'s banlist`)
    .setColor(client.config.color)
    .addField('Banned Abilities', bannedAbilities ? (formatAbilityNames(bannedAbilities) || 'None') : 'None');
    return embed;
}

async function getBannedMovesEmbed(client, message){
    const bannedMoves = await client.banlist.getBannedMoves(message.guild.id);
    let embed = new MessageEmbed()
    .setTitle(`${message.guild.name}\'s banlist`)
    .setColor(client.config.color)
    .addField('Banned Moves', bannedMoves ? (formatMoveNames(bannedMoves) || 'None') : 'None');
    return embed;
}

async function getClausesEmbed(client, message){
    const clauses = await client.banlist.getClauses(message.guild.id);
    let embed = new MessageEmbed()
    .setTitle(`${message.guild.name}\'s banlist`)
    .setColor(client.config.color);
    for(let i = 0; i < clauses.length; i++){
        embed.addField(clauses[i].name, clauses[i].description);
    }
    return embed;
}


function formatPokemonNames(bannedPokemon){
    if(!bannedPokemon) return;
    if(bannedPokemon.length <= 0) return;
    let arr = [];
    for(let i = 0; i < bannedPokemon.length; i++){
        let poke = Pokemon.PokemonInfo[bannedPokemon[i]];
        if(!poke) continue;
        arr.push(poke.name);
    }
    arr.sort((a, b) => {
        let aName = a.toUpperCase();
        let bName = b.toUpperCase();

        if(aName > bName){
            return 1;
        }
        if(aName < bName){
            return -1;
        }
        return 0;
    })
    return arr.join('\n');
}

function formatMoveNames(moves){
    if(!moves) return;
    if(moves.length <= 0) return;
    let arr = [];
    for(let i = 0; i < moves.length; i++){
        let move = Pokemon.MoveInfo[moves[i]];
        if(!move) continue;
        arr.push(move.name);
    }
    arr.sort((a, b) => {
        let aName = a.toUpperCase();
        let bName = b.toUpperCase();

        if(aName > bName){
            return 1;
        }
        if(aName < bName){
            return -1;
        }
        return 0;
    })
    return arr.join('\n')
}

function formatAbilityNames(abilities){
    if(!abilities) return;
    if(abilities.length <= 0) return;
    abilities.sort((a, b) => {
        let aName = a.toUpperCase();
        let bName = b.toUpperCase();

        if(aName > bName){
            return 1;
        }
        if(aName < bName){
            return -1;
        }
        return 0;
    })
    return abilities.join('\n');
}