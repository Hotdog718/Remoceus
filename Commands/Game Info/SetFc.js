const FC = require("../../Models/FC.js");

module.exports = {
	name: "setfc",
	aliases: [],
	category: "Game Info",
	description: "Sets your Friend Code for !fc command",
	usage: "<fc>",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
		let myNewFC = args.length > 0 ? args.join(" "): "No FC set, use !setfc <fc> to set your fc (ex. !setfc 3883-7141-8049)";
		FC.findOne({
			userID: message.author.id,
		}, (err, fc) => {
			if(err) console.log(err);
			if(!fc){
				const newFC = new FC({
					userID: message.author.id,
					fc: myNewFC,
					ign: "No IGN set, use !setign <ign> to set your ign (ex. !setign Thot Slayer)"
				});
				newFC.save().catch(err => console.log(err));
			}else{
				fc.fc = myNewFC;
				fc.save().catch(err => console.log(err));
			}
			message.channel.send(`Set Friend Code to: ${myNewFC}`);
		})
	}
}
