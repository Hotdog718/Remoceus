const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const FC = require("../../Models/FC.js");

module.exports = {
	name: "setign",
	aliases: [],
	category: "Game Info",
	description: "Sets your In Game Name for !fc command",
	usage: "<ign>",
	permissions: [],
	run: async (client, message, args) => {
		let myNewIGN = args.length > 0 ? args.join(" "): "No IGN set, use !setign <ign> to set your ign (ex. !setign Thot Slayer)";

		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let friendCard = await FC.findOne({userID: message.author.id});

		if(!fc){
			const newFC = new FC({
				userID: message.author.id,
				fc: "No FC set, use !setfc <fc> to set your fc (ex. !setfc 3883-7141-8049)",
				ign: myNewIGN
			});
			await newFC.save()
								 .then(() => message.channel.send(`Set IGN to: ${myNewIGN}`))
								 .catch(err => console.log(err));
		}else{
			fc.ign = myNewIGN;
			await fc.save()
							.then(() => message.channel.send(`Set IGN to: ${myNewIGN}`))
							.catch(err => console.log(err));
		}

		db.disconnect();
	}
}
