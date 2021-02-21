module.exports = {
	name: "setfc",
	aliases: [],
	category: "General",
	description: "Sets your Friend Code for !fc command",
	usage: "<fc>",
	permissions: [],
	run: async (client, message, args) => {
		let myNewFC = args.length > 0 ? args.join(" "): "No FC set, use !setfc <fc> to set your fc (ex. !setfc 1234-5678-9012)";

		try{
			await client.gameinfo.setFC(message.author.id, myNewFC);
			message.channel.send(`Set FC to ${myNewFC}`);
		}catch(e){
			message.channel.send("An error occurred, please try again.");
			console.error(e);
		}
	}
}
