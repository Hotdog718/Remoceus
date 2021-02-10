

module.exports = {
	toTitleCase: (word) => {
		//takes a string as an argument and returns a string (toTitleCase("hello") => returns "Hello")
		if(word.length === 0) return word;
		let wordArr = word.split(" ");
		for(let i = 0; i < wordArr.length; i++){
			wordArr[i] = wordArr[i].charAt(0).toUpperCase() + wordArr[i].substring(1).toLowerCase();
		}
		return wordArr.join(" ");
	},
	rankLinks: {
		"SS": "https://i.imgur.com/DQun29l.png",
		"S": "https://i.imgur.com/tdHZnt4.png",
		"A": "https://i.imgur.com/hCcIx73.png",
		"B": "https://i.imgur.com/Q32a9Ys.png",
		"C": "https://i.imgur.com/JFbzol2.png",
		"D": "https://i.imgur.com/TSAzjav.png",
	},
	checkGyms: (client, type, member, checkAdmin=false) => {
		const gymTypes = Object.keys(client.config.gymTypes);
		return (checkAdmin && member.hasPermission("MANAGE_ROLES", {checkOwner: true, checkAdmin: true})) || (gymTypes.includes(type.toLowerCase()) && member.roles.cache.find(role => role.name === `${client.helpers.toTitleCase(type)} Gym Leader`));
	},
	getGymType: (client, member) => {
		const gymTypes = Object.keys(client.config.gymTypes);
		for(let i = 0; i < gymTypes.length; i++){
			let type = gymTypes[i];
			if(member.roles.cache.find(role => role.name === `${client.config.gymTypes[type].name} Gym Leader`)){
				return type;
			}
		}
		return;
	},
	getGymLeaders: async (message, type) => {
		let guildMembers = await message.guild.members.fetch();
		let typeRole = message.guild.roles.cache.find(r => r.name === `${type} Gym Leader`);
		let leaderRole = message.guild.roles.cache.find(r => r.name === "Gym Leaders")
		let typeGymLeaders = guildMembers.filter(member => member.roles.cache.has(typeRole.id) && member.roles.cache.has(leaderRole.id))
		return typeGymLeaders;
	},
	getGymSubs: async (message, type) => {
		let guildMembers = await message.guild.members.fetch();
		let typeRole = message.guild.roles.cache.find(r => r.name === `${type} Gym Leader`);
		let subRole = message.guild.roles.cache.find(r => r.name === "Gym Subs")
		let typeGymLeaders = guildMembers.filter(member => member.roles.cache.has(typeRole.id) && member.roles.cache.has(subRole.id))
		return typeGymLeaders;
	},
	getClass: (points) => {
		if(points < 1000){
			return 'Normal';
		}else if(points < 100000){
			return 'Great';
		}else if(points < 1000000){
			return 'Ultra';
		}else{
			return 'Master';
		}
	},
	getRanking: (points, pointsArray) => {
		const isUser = (user) => points.userID == user.userID && points.serverID == user.serverID;
		pointsArray.sort((a, b) => {
			let aPoints = isUser(a) ? points.points : a.points;
			let bPoints = isUser(b) ? points.points : b.points;
			if(aPoints > bPoints){
				return -1;
			}
			if(a.points < b.points){
				return 1;
			}
			return 0;
		})

		let ranking = 1;
		for(let i = 0; i < pointsArray.length; i++){
			if(i > 0 && pointsArray[i-1].points > pointsArray[i].points) ranking++;
			if(points.userID == pointsArray[i].userID && points.serverID == pointsArray[i].serverID) break;
		}
		return ranking;
	},
	createListEmbed: (client, message, data, resultsPerPage, embedFunction) => {
		let index = 0;
		let maxPages = Math.ceil(data.length/resultsPerPage);

		message.channel.send(embedFunction(client, message, data, resultsPerPage, index))
		.then(msg => {
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
			const collector = msg.createReactionCollector(filter, {idle: 60000});

			collector.on('collect', async (reaction, user) => {
				const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
				try {
					for (const reaction of userReactions.values()) {
						await reaction.users.remove(message.author.id);
					}
				} catch (error) {
					console.error('Failed to remove reactions.');
				}
				switch(reaction.emoji.name){
					case '⬅':{
						index = (index-1) < 0? maxPages-1 :index-1;
						msg.edit(embedFunction(client, message, data, resultsPerPage, index));
						break;
					}
					case '➡':{
						index = (index+1)%maxPages;
						msg.edit(embedFunction(client, message, data, resultsPerPage, index));
						break;
					}
					case '⏹':{
						collector.emit('end');
						break;
					}
				}
			})

			collector.on('end', collected => {
				msg.delete().catch(() => {});
			})
		})
		.catch(() => {});
	},
	createMenuEmbed: (client, message, data, embedFunction) => {
		const { MessageCollector } = require('discord.js');
		let index = 0;
		let embed = embedFunction(client, index, data);
		message.channel.send(embed).then(msg => {
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
					case '⬅': {
						index = (index-1) < 0 ? data.length-1 : index-1;
						msg.edit(embedFunction(client, index, data)).catch(err => collector.stop());
						break;
					}
					case '➡': {
						index = (index+1)%data.length;
						msg.edit(embedFunction(client, index, data)).catch(err => collector.stop());
						break;
					}
					case '⏹': {
						collector.stop();
						break;
					}
					default: break;
				}
			})

			collector.on('end', collected => {
				msg.delete().catch(() => {});
			})
		})
		.catch(() => {});
	}
}
