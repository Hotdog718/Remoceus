
module.exports = {
	name: "kill",
	aliases: [],
	category: "Moderation",
	description: "Takes the bot offline",
	usage: "",
	permissions: ["Bot Owner"],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
        if(message.author.id === client.config.botowner){
    		await message.react('✅');
			client.destory();	
        }
	}
}
