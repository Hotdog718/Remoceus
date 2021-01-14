const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const FC = require("../../Models/FC.js");

module.exports = {
	name: "setign",
	aliases: [],
	category: "General",
	description: "Sets your In Game Name for !fc command",
	usage: "<ign>",
	permissions: [],
	run: async (client, message, args) => {
		let myNewIGN = args.length > 0 ? args.join(" "): "No IGN set, use !setign <ign> to set your ign (ex. !setign Thot Slayer)";

		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let friendCard = await FC.findOne({userID: message.author.id});

		if(!friendCard){
			const newFC = new FC({
				userID: message.author.id,
				fc: "No FC set, use !setfc <fc> to set your fc (ex. !setfc 3883-7141-8049)",
				ign: myNewIGN
			});
			const prom = newFC.save();
			prom.then(() => db.disconnect());
			prom.then(() => message.channel.send(`Set IGN to: ${myNewIGN}`));
			prom.catch(console.error);
			prom.catch((err) => message.react('❌'));
		}else{
			friendCard.ign = myNewIGN;
			const prom = friendCard.save()
			prom.then(() => db.disconnect());
			prom.then(() => message.channel.send(`Set IGN to: ${myNewIGN}`));
			prom.catch(console.error);
			prom.catch((err) => message.react('❌'));
		}
	}
}
