const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const FC = require("../../Models/FC.js");

module.exports = {
	name: "setfc",
	aliases: [],
	category: "General",
	description: "Sets your Friend Code for !fc command",
	usage: "<fc>",
	permissions: [],
	run: async (client, message, args) => {
		let myNewFC = args.length > 0 ? args.join(" "): "No FC set, use !setfc <fc> to set your fc (ex. !setfc 3883-7141-8049)";

		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let friendCard = await FC.findOne({userID: message.author.id});

		if(!friendCard){
			const newFC = new FC({
				userID: message.author.id,
				fc: myNewFC,
				ign: "No IGN set, use !setign <ign> to set your ign (ex. !setign Thot Slayer)"
			});
			const prom = newFC.save()
			prom.then(() => db.disconnect());
			prom.then(() => message.channel.send(`Set Friend Code to: ${myNewFC}`));
			prom.catch(err => console.log(err));
			prom.catch((err) => message.react('❌'));
		}else{
			friendCard.fc = myNewFC;
			const prom = friendCard.save();
			prom.then(() => db.disconnect());
			prom.then(() => message.channel.send(`Set Friend Code to: ${myNewFC}`));
			prom.catch(err => console.log(err));
			prom.catch((err) => message.react('❌'));
		}
	}
}
