const { MessageEmbed } = require("discord.js");
const Pokemon = require("../../Utils/Pokemon.js");

module.exports = {
  name: "pokemon",
  aliases: [],
  category: "Pokemon",
  description: "Gives stat infomation and more on a pokemon",
  usage: "<pokemon name>",
  permissions: [],
  run: async (client, message, args) => {
    let str = args.join(" ");
    let pokemon = str.replace(/[^a-z0-9]/gi, "").toLowerCase().trim();
    if(!pokemon) return message.channel.send("No name given");
    let PokeObject = Pokemon.PokemonInfo[pokemon];
    if(!PokeObject) return message.channel.send("Could not find pokemon");
    message.channel.send(getPokeEmbed(PokeObject, client, message.member))
  }
}

function getPokeEmbed(obj, client, member){
  let numOfPokemon = getMaxDex();
  const { forme, baseSpecies, name, types, num, heightm, weightkg, baseStats, abilities, eggGroups, color, evos, prevo } = obj;
  let shiny = (Math.floor(Math.random() * 100) == 0)
  if(client.config.shinies[member.id] && client.config.shinies[member.id].includes(obj.name.toLowerCase())){
    shiny = true;
  }
  let url = Pokemon.GetSerebiiURL(name, forme || '', shiny);
  let embed = new MessageEmbed()
  .setTitle(`${(forme?`${baseSpecies}-${forme}`:name)}`)
  .setThumbnail(url)
  .setColor(Pokemon.TypeColors[types[0]])
  .setFooter(`Pokemon #${num < 10?`00${num}`: (num < 100? `0${num}`: num)} of ${getMaxDex()}`)
  .addField("Typing", types.join("/\n"), true)
  .addField("Height/ Weight", `Height: ${heightm} m\nWeight: ${weightkg} kg`, true)
  .addField("Base Stats",`HP: ${baseStats.hp}\nAttack: ${baseStats.atk}\nDefense: ${baseStats.def}\nSp. Attack: ${baseStats.spa}\nSp. Defense: ${baseStats.spd}\nSpeed: ${baseStats.spe}`, true)
  .addField("Abilities", getAbilities(abilities), true)
  .addField("Egg Groups", eggGroups, true)
  .addField("Color", color, true)
  if(prevo || evos){
    embed.addField("Evolutions", `${prevo ? `Evolves from: ${prevo} (${getEvoType(obj)})\n`: ``}${evos?`Evolves into: ${evos.join(" or ")}`: ''}`);
  }
  return embed;
}

function getEvos(evos){
  for(let i = 0; i<evos.length; i++){
    let evo = evos[i];
    evos[i] = `${Pokemon.PokemonInfo(evo).name} (${getEvoType(Pokemon.PokemonInfo(evo))})`;
  }
  return evos;
}

function getEvoType(poke){
  if(poke.evoLevel){
    return `Level: ${poke.evoLevel}`;
  }
  if(poke.evoItem){
    return poke.evoItem;
  }
  return poke.evoType;
}

function getMaxDex(){
  var keys = Object.keys(Pokemon.PokemonInfo);
  var max = 0;
  keys.forEach(function(r, i){
    if(Pokemon.PokemonInfo[r].num > max){
      max = Pokemon.PokemonInfo[r].num
    }
  })
  return max;
}

function getAbilities(abilities){
  let abilityArray = [];
  if(abilities[0]){
    abilityArray.push(`Ability 1: ${abilities[0]}`);
  }
  if(abilities[1]){
    abilityArray.push(`Ability 2: ${abilities[1]}`);
  }
  if(abilities.H){
    abilityArray.push(`Hidden Ability: ${abilities.H}`)
  }
  if(abilities.S){
    abilityArray.push(`Special Ability: ${abilities.S}`)
  }
  if(abilityArray.length > 0){
    return abilityArray;
  }else{
    return "No Special Abilities";
  }
}
