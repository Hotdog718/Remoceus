const { RichEmbed } = require("discord.js");
const MOTW = require("../../Models/MOTW.js");

module.exports = {
	name: "newmotw",
	aliases: [],
	category: "MOTW",
	description: "Creates a new MOTW",
	usage: "",
	permissions: ["Bot Owner"],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
    if(message.author.id !== client.config.botowner) return client.errors.noPerms(mmessage, "Bot Owner");
    let movesetName = await getUserResponse("What is the name of the moveset?", message, 60000);
    if(!movesetName) return message.channel.send("Error, could not find message").then(m => m.delete(5000));
    let species = await getUserResponse("What is the species of the pokemon?", message, 60000);
    if(!species) return message.channel.send("Error, could not find message").then(m => m.delete(5000));
    let ability = await getUserResponse("What is the pokemon's ability?", message, 60000);
    if(!ability) return message.channel.send("Error, could not find message").then(m => m.delete(5000));
    let nature = await getUserResponse("What is the pokemon's nature?", message, 60000);
    if(!nature) return message.channel.send("Error, could not find message").then(m => m.delete(5000));
    let item = await getUserResponse("What is the pokemon's held item?", message, 60000);
    if(!item) return message.channel.send("Error, could not find message").then(m => m.delete(5000));
    let evs = await getUserResponse("What is the pokemon's evs? (enter in order of hp, attack, defense, sp attack, sp defense, and speed (Ex: 252 0 252 0 0 0))", message, 60000);
    if(!evs) return message.channel.send("Error, could not find message").then(m => m.delete(5000));
    let move1 = await getUserResponse("What is the pokemon's first move (separate options with \"/\")", message, 60000);
    if(!move1) return message.channel.send("Error, could not find message").then(m => m.delete(5000));
    let move2 = await getUserResponse("What is the pokemon's second move (separate options with \"/\")", message, 60000);
    if(!move2) return message.channel.send("Error, could not find message").then(m => m.delete(5000));
    let move3 = await getUserResponse("What is the pokemon's third move (separate options with \"/\")", message, 60000);
    if(!move3) return message.channel.send("Error, could not find message").then(m => m.delete(5000));
    let move4 = await getUserResponse("What is the pokemon's fourth move (separate options with \"/\")", message, 60000);
    if(!move4) return message.channel.send("Error, could not find message").then(m => m.delete(5000));
    let ytLink = await getUserResponse("What is link to the YouTube video (Just enter \"none\" if there is none)", message, 60000);
    if(!ytLink || ytLink === "none"){
      ytLink = "";
    }
    let evArray = getEVArray(evs);
    const newMOTW = new MOTW({
      setName: movesetName,
      pokemon: species.toLowerCase(),
      ability: ability,
      nature: nature,
      item: item,
      evs: evArray,
      move1: move1,
      move2: move2,
      move3: move3,
      move4: move4,
      ytLink: ytLink
    })
    newMOTW.save()
      .then(() => {
        message.channel.send("New MOTW published, use !motw to view");
      })
      .catch(err => console.log(err));
	}
}

function getEVArray(evs){
  let newEvs = [];
  let temp = evs.split(" ");
  for(let i = 0; i < 6; i++){
    if(!temp[i]){
      newEvs.push("0");
    }else{
      newEvs.push(temp[i]);
    }
  }
  return newEvs;
}

async function getUserResponse(sendMessage, message, maxTime){
  message.channel.send(sendMessage).then(m => m.delete(maxTime)).catch(err => console.log(err));
  const filter = m => m.author.id === message.author.id;
  const collectorOptions = {
    max: 1,
    time: maxTime,
    errors: ['time']
  }
  let collected = await message.channel.awaitMessages(filter, collectorOptions);
  if(!collected) return null;
  return collected.first().content;
}
