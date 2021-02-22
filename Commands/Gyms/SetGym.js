module.exports = {
	name: "setgym",
	aliases: [],
	category: "Gyms",
	description: "Sets a gym open or closed",
	usage: "[open/closed]",
	permissions: [],
	run: async (client, message, args) => {
		let status, type;
		type = args[0];
		const types = Object.keys(client.config.gymTypes);
		if(type && types.includes(type) && message.member.hasPermission("MANAGE_ROLES", {checkOwner: true, checkAdmin: true})){
			status = args[1];
			if(status.toLowerCase() !== 'closed' && !client.helpers.checkGyms(client, type, message.member)){
				message.channel.send('Non-Gym-Leaders can only set gym status to closed.');
				message.react('❌')
				   .catch(console.error);
				return;
			}
		}else{
			status = args[0];
			type = client.helpers.getGymType(client, message.member);
		}

		let gymAnnouncements = message.guild.channels.cache.find(channel => channel.name === "announcements") || message.channel;

		if(!type){
			client.errors.noType(message);
			return;
		}

		if(!status || !(status.toLowerCase() === "open" || status.toLowerCase() === "closed")){
			message.channel.send(`Status must be either Open or Closed`);
			message.react('❌')
				   .catch(console.error);
			return;
		}

		if(!client.helpers.checkGyms(client, type, message.member, true)){
			message.channel.send("You aren't a gym leader");
			message.react('❌')
				   .catch(console.error);
			return;
		}
		
		try{
			await client.gymrules.setGymStatus(type, message.guild.id, ((status.toLowerCase() === "open") ? true : false));
			const role = message.guild.roles.cache.find(r => r.name === "Gym Challenger")
			gymAnnouncements.send(`The ${type.toLowerCase()} gym is now ${status.toLowerCase()}${(status.toLowerCase() === "open" && role ? ` ${role}`: '')}`);
			message.react('✅')
			.catch(console.error);
		}catch(err){
			message.channel.send('No data was found for this gym. Annoy Hotdog in DMs for help.')
			message.react('❌')
			.catch(console.error);
		}

	}
}
