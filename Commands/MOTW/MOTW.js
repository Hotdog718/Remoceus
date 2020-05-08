const { RichEmbed } = require("discord.js");
const MOTW = require("../../Models/MOTW.js");
let index = 0;

module.exports = {
	name: "motw",
	aliases: [],
	category: "MOTW",
	description: "Displays most recent MOTW moveset, or all movesets to a specific pokemon (Only has pokemon in motws after 2020)",
	usage: "<none or PokemonName>",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
		let motws = args[0] ? await getMOTWWithSpecies(args[0]) : await getMOTW();
		if(motws && motws.length > 1){
			motws = motws.reverse();
		}
		let embed = createMOTWEmbed(client, message, motws);
		message.channel.send(embed).then(msg => {
			let reactions = ["⬅", "➡", "⏹"];
			if(motws){
				reactions.forEach(function(r, i){
					setTimeout(function(){
						msg.react(r);
					}, i*800)
				})
			}

			const filter = (reaction, user) => {
				return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
			}

			const collector = msg.createReactionCollector(filter, {});

			collector.on('collect', (reaction) => {
				setTimeout(function(){
					reaction.remove(message.author.id).catch(err => {});
				}, 250)
				switch(reaction.emoji.name){
					case '⬅':{
						index = (index - 1) < 0 ? motws.length - 1 : index - 1;
						embed = createMOTWEmbed(client, message, motws);
						msg.edit(embed);
						break;
					}
					case '➡':{
						index = (index + 1) % motws.length;
						embed = createMOTWEmbed(client, message, motws);
						msg.edit(embed);
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

const createMOTWEmbed = (client, message, motws) => {
	let embed = new RichEmbed()
	.setThumbnail(message.guild.iconURL)
	.setColor(client.config.color);
	if(!motws || motws.length === 0 || !motws[index]){
		embed.addField("No MOTWs", "Come back later!");
	}else{
		let currentSet = motws[index];
		embed.setTitle(currentSet.setName)
				 .addField("Pokemon", client.helpers.getTitleCase(currentSet.pokemon))
				 .addField("Ability(s)", currentSet.ability)
				 .addField("Item(s)", currentSet.item)
				 .addField("EVs", `${formatEVSpread(currentSet)}`)
				 .addField("Moveset", `${currentSet.move1}\n${currentSet.move2}\n${currentSet.move3}\n${currentSet.move4}`)
				 .setFooter(`Set #${index+1} of ${motws.length}`);
				 if(currentSet.ytLink){
           embed.setURL(currentSet.ytLink);
         }
	}
	return embed;
}

const formatEVSpread = ({evs}) => {
	let res = ``;
	let stat = ["HP", "Atk", "Def", "Sp Atk", "Sp Def", "Speed"];
	for(let i = 0; i < evs.length; i++){
		if(evs[i] != 0){
			res += `${evs[i]} ${stat[i]}, `;
		}
	}
	return res.substring(0, res.length - 2);
}

const getMOTW = async () => {
	let motws = await new Promise(function(resolve, reject) {
		MOTW.find().exec((err, res) => {
			if(err) console.log(err);
			if(!res) resolve([]);
			resolve(res);
		})
	});
	return motws;
}

const getMOTWWithSpecies = async (species) => {
	let motws = await new Promise(function(resolve, reject) {
		MOTW.find({
			pokemon: species.toLowerCase()
		}).exec((err, res) => {
			if(err) console.log(err);
			if(!res) resolve([]);
			resolve(res);
		})
	});
	return motws;
}
