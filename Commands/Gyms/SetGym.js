const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const Gyms = require("../../Models/GymRules.js")

module.exports = {
	name: "setgym",
	aliases: [],
	category: "Gyms",
	description: "Sets a gym open or closed",
	usage: "[open/closed]",
	permissions: [],
	run: async (client, message, args) => {
		//let type = args[0];
		let status = args[0];

		let gymAnnouncements = message.guild.channels.cache.find(channel => channel.name === "announcements") || message.channel;

		let type = client.helpers.getGymType(client, message.member);

		if(!type){
			client.errors.noType(message);
			return;
		}

		if(!status || !(status.toLowerCase() === "open" || status.toLowerCase() === "closed")){
			message.channel.send(`Status must be either Open or Closed`);
			message.react('❌');
			return;
		}

		if(!client.helpers.checkGyms(client, type, message.member)){
			message.channel.send("You aren't a gym leader");
			message.react('❌');
			return;
		}
		
		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let gym = await Gyms.findOne({type: type, serverID: message.guild.id});
		if(!gym){
			const newGym = new Gyms({
				type: type,
				serverID: message.guild.id,
				rules: {
					singles: {
						bannedPokemon: "",
						bannedDynamax: "",
						itemClause: "",
						noLegends: false,
						battleReadyClause: false
					},
					doubles: {
						bannedPokemon: "",
						bannedDynamax: "",
						itemClause: "",
						noLegends: false,
						battleReadyClause: false
					}
				},
				banner: "",
				title: "COMING SOON",
				location: "Location TBA",
				separateRules: false,
				open: (status.toLowerCase() === "open") ? true : false,
				majorLeague: client.major.includes(type)
			})
			const prom = newGym.save()
			prom.then(() => db.disconnect());
			prom.then(() => message.guild.roles.cache.find(r => r.name === "Gym Challenger"))
				.then((role) => gymAnnouncements.send(`The ${type.toLowerCase()} gym is now ${status.toLowerCase()}${(status.toLowerCase() === "open" && role ? ` ${role}`: '')}`));
			prom.then(() => message.react('✅'));
			prom.catch(console.error);
			prom.catch(message.react('❌'));
		}else{
			gym.open = (status.toLowerCase() === "open") ? true : false;
			const prom = gym.save();
			prom.then(() => db.disconnect());
			prom.then(() => message.guild.roles.cache.find(r => r.name === "Gym Challenger"))
				.then((role) => gymAnnouncements.send(`The ${type.toLowerCase()} gym is now ${status.toLowerCase()}${(status.toLowerCase() === "open" && role ? ` ${role}`: '')}`));
			prom.then(() => message.react('✅'));
			prom.catch(console.error);
			prom.catch((err) => message.react('❌'));
		}
	}
}
