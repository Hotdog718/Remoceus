const { readdirSync } = require("fs");

module.exports = (client) => {
    // Read every commands subfolder
    readdirSync("./Commands/").forEach(dir => {
        // Filter so we only have .js command files
        const commands = readdirSync(`./Commands/${dir}/`).filter(file => file.endsWith(".js"));

        // Loop over the commands, and add all of them to a collection
        // If there's no name found, prevent it from returning an error,
        // By using a cross in the table we made.
        for (let file of commands) {
            let pull = require(`../Commands/${dir}/${file}`);

            if (pull.name) {
                client.commands.set(pull.name, pull);
                console.log(`${file}: ✅`)
            } else {
                console.log(`${file}: ❌  -> missing a help.name, or help.name is not a string.`)
                continue;
            }

            // If there's an aliases key, read the aliases.
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    // Log the table
}
