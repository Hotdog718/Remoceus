module.exports = {
	name: "takebadge",
	aliases: ["tb"],
	category: "Gyms",
	description: "Takes a badge from a user",
	usage: "<type> <@user>",
	permissions: [],
	run: async (client, message, args) => {
		let pUser = message.guild.member(message.mentions.users.first());
		let type = args[0];
		
		const types = Object.keys(client.config.gymTypes);
    	if(!types.includes(type)){
			type = client.helpers.getGymType(client, message.member);
		}

		if(!pUser){
			client.errors.noUser(message);
			return;
		}
		if(!type || !types.includes(type)){
			client.errors.noType(message);
			return;
		}
		
		const gymTypes = Object.keys(client.config.gymTypes);

		if(!gymTypes.includes(type.toLowerCase())) {
			message.channel.send(`Sorry, but ${type} is not a gym type.`);
			message.react('❌')
				   .catch(console.error);
			return;
		}

		if(!client.helpers.checkGyms(client, type, message.member, true)){
			message.channel.send("You do not have permission for this action.")
			message.react('❌')
				   .catch(console.error);
			return;
		}

		try{
			await client.badges.takeBadge(pUser.id, message.guild.id, type);
			message.channel.send(`${message.author.tag} has taken ${pUser.user.tag}\'s ${type.toLowerCase()} badge!`);
			message.react('✅')
			.catch(console.error);
		}catch(err){
			if(err === 'No badge'){
				message.channel.send(`${pUser.user.tag} didn't have the ${type.toLowerCase()} badge.`);
			}else{
				message.channel.send('This user is not registered for the gym challenge, use !register [hometown] to sign up!');
			}
			message.react('❌').catch(console.error);
		}

	}
}
