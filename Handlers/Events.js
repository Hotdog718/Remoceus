const token = require("../token.json")

module.exports = (client) => {

	client.on("ready", () => {
		console.log(`${client.user.tag} is online!`);
	});


	client.login(token.token);

}