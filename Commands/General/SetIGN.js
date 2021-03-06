module.exports = {
	name: "setign",
	aliases: [],
	category: "General",
	description: "Sets your In Game Name for !fc command",
	usage: "<ign>",
	permissions: [],
	run: async (client, message, args) => {
		let myNewIGN = args.length > 0 ? args.join(" "): "No IGN set, use !setign <ign> to set your ign (ex. !setign John)";

		try{
			await client.gameinfo.setIGN(message.author.id, myNewIGN);
			message.channel.send(`Set IGN to ${myNewIGN}`);
		}catch(e){
			message.channel.send("An error occurred, please try again");
			console.error(e);
		}
	}
}
