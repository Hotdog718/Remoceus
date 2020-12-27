

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
		return (checkAdmin && member.hasPermission("MANAGE_ROLES", false, true, true)) || (client.gymTypes.includes(type.toLowerCase()) && member.roles.cache.find(role => role.name === `${client.helpers.toTitleCase(type)} Gym Leader`));
	},
	getGymType: (client, member) => {
		// client.gymTypes
		for(let i = 0; i < client.gymTypes.length; i++){
			//console.log(client.helpers.toTitleCase(client.gymTypes[i]));
			if(member.roles.cache.find(role => role.name === `${client.helpers.toTitleCase(client.gymTypes[i])} Gym Leader`)){
				return client.gymTypes[i];
			}
		}
		return;
	},
	getGymLeaders: async (message, type) => {
		let guildMembers = await message.guild.members.fetch();
		let typeRole = message.guild.roles.cache.find(r => r.name === `${type} Gym Leader`);
		let typeGymLeaders = guildMembers.filter(member => member.roles.cache.has(typeRole.id) && member.roles.cache.has("687405133927284742"))
		return typeGymLeaders;
	},
	getGymSubs: async (message, type) => {
		let guildMembers = await message.guild.members.fetch();
		let typeRole = message.guild.roles.cache.find(r => r.name === `${type} Gym Leader`);
		let typeGymLeaders = guildMembers.filter(member => member.roles.cache.has(typeRole.id) && member.roles.cache.has("791863866702692392"))
		return typeGymLeaders;
	},
	createMenuEmbed: (client, message, data, embedFunction) => {
		const { MessageCollector } = require('discord.js');
		let index = 0;
		let embed = embedFunction(client, index, data);
		message.channel.send(embed).then(msg => {
			//set filter to only let only set reactions and message author to respond
      const filter = (m) => {
        return m.author.id === message.author.id;
      }

			//create msgCollector
      const collector = new MessageCollector(message.channel, filter, {idle: 60000});

			collector.on('collect', (m) => {
        switch(m.content){
          case '!back': {
            if(m.deletable) m.delete();
            index = (index-1) < 0 ? data.length-1 : index-1;
            msg.edit(embedFunction(client, index, data)).catch(err => collector.stop());
            break;
          }
          case '!next': {
            if(m.deletable) m.delete();
            index = (index+1)%data.length;
            msg.edit(embedFunction(client, index, data)).catch(err => collector.stop());
            break;
          }
          case '!stop': {
						if(m.deletable) m.delete();
            collector.stop("Manually Stopped");
            break;
          }
					default: break;
        }
      })

			collector.on('end', (collected, reason) => {
				if(reason === "Manually Stopped" && msg.deletable){
					msg.delete();
				}
			});
		})
	}
}
