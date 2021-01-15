module.exports = {
	name: "reset",
	aliases: [],
	category: "Gym Challenge",
	description: "Resets badges for the entire server",
	usage: "",
	permissions: ["Server Owner"],
	run: async (client, message, args) => {
		if(message.author.id !== message.guild.ownerID) {
      client.errors.noPerms(message, "Owner");
      return;
    }

    message.channel.send(`You are about to revoke the badges of every member on the server, do you wish to continue? (Yes/No)`);
    const filter = m => m.author.id === message.author.id && (m.content.toLowerCase() === "yes" || m.content.toLowerCase() === "no");

    message.channel.awaitMessages(filter, {max: 1, time: 60000})
    .then(async collected => {
      if(collected.first().content.toLowerCase() === "yes"){
        await client.badges.reset(message.guild.id);
        message.channel.send(`All badges on the server have been reset`);
        message.react('✅')
						   .catch(console.error);
      }
    })
    .catch(console.error);
	}
}
