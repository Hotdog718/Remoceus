const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");

const Gyms = require("../../Models/Gyms.js")

module.exports = {
	name: "setgym",
	aliases: [],
	category: "Gyms",
	description: "Sets a gym open or closed",
	usage: "[open/closed]",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
		let type = args[0];
		let status = args[1];

		let gymAnnouncements = message.guild.channels.cache.find(channel => channel.name === "announcements") || message.channel;

		if(!type) return client.errors.noType(message);
		if(!status || !(status.toLowerCase() === "open" || status.toLowerCase() === "closed")) return message.channel.send(`Status must be either Open or Closed`).then(m => m.delete({timeout: 5000}));

		if(client.helpers.checkGyms(client, type, message.member)){
			const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
			await Gyms.findOne({
				serverID: message.guild.id
			}, (err, gyms) => {
				if(err) console.log(err);
				if(!gyms){
					const newGyms = new Gyms({
		        bug: "Closed",
		        dark: "Closed",
		        dragon: "Closed",
		        electric: "Closed",
		        fairy: "Closed",
		        fighting: "Closed",
		        fire: "Closed",
		        flying: "Closed",
		        ghost: "Closed",
		        grass: "Closed",
		        ground: "Closed",
		        ice: "Closed",
		        normal: "Closed",
		        poison: "Closed",
		        psychic: "Closed",
		        rock: "Closed",
		        steel: "Closed",
		        water: "Closed"
	        })
					newGyms[type.toLowerCase()] = status;
          gymAnnouncements.send(`The ${type.toLowerCase()} gym is now ${status.toLowerCase()}!`);
          newGyms.save().catch(err => console.log(err));
				}else{
					gyms[type.toLowerCase()] = status;
          gymAnnouncements.send(`The ${type.toLowerCase()} gym is now ${status.toLowerCase()}!`);
          gyms.save().catch(err => console.log(err));
				}
			})
			db.disconnect();
		}else{
			message.channel.send("You don't own this gym").then(m => m.delete({timeout: 5000}));
		}
	}
}
