const { RichEmbed } = require("discord.js");
const { PokemonInfo, TypeColors } = require("../../Utils/Pokemon.js");

module.exports = {
  name: "pokemon",
  aliases: [],
  category: "Pokemon",
  description: "Gives stat infomation and more on a pokemon",
  usage: "<pokemon name>",
  permissions: [],
  run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let pokemon = args.join("").split("-").join("").toLowerCase().trim();
    if(!pokemon) return message.channel.send("No name given").then(m => m.delete(5000));
    let PokeObject = PokemonInfo[pokemon];
    if(!PokeObject) return message.channel.send("Could not find pokemon").then(m => m.delete(5000));
    message.channel.send(getPokeEmbed(PokeObject, client))
  }
}

function getPokeEmbed(obj, client, page = "stats"){
  let url = `https://www.serebii.net/pokemon/art/${getNum(obj.num)}${getforme(obj)}.png`;
  let numOfPokemon = getMaxDex();
  const { forme, baseSpecies, species, types, num, heightm, weightkg, baseStats, abilities, eggGroups, color, evos, prevo } = obj;
  let embed = new RichEmbed()
  .setTitle(`${(forme?`${baseSpecies}-${forme}`:species)}`)
  .setThumbnail(url)
  .setColor(TypeColors[types[0]])
  .setFooter(`Pokemon #${num < 10?`00${num}`: (num < 100? `0${num}`: num)} of ${getMaxDex()}`)
  .addField("Typing", types.join("/\n"), true)
  .addField("Height/ Weight", `Height: ${heightm} m\nWeight: ${weightkg} kg`, true)
  .addField("Base Stats",`HP: ${baseStats.hp}\nAttack: ${baseStats.atk}\nDefense: ${baseStats.def}\nSp. Attack: ${baseStats.spa}\nSp. Defense: ${baseStats.spd}\nSpeed: ${baseStats.spe}`, true)
  .addField("Abilities", getAbilities(abilities), true)
  .addField("Egg Groups", eggGroups, true)
  .addField("Color", color, true)
  if(prevo || evos){
    embed.addField("Evolutions", `${prevo? `Evolves from: ${PokemonInfo[prevo].species} (${getEvoType(obj)})\n`: ``}${evos?`Evolves into: ${getEvos(evos).join(" or ")}`: ''}`);
  }
  return embed;
}

function getEvos(evos){
  for(let i = 0; i<evos.length; i++){
    let evo = evos[i];
    evos[i] = `${PokemonInfo[evo].species} (${getEvoType(PokemonInfo[evo])})`;
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
  var keys = Object.keys(PokemonInfo);
  var max = 0;
  keys.forEach(function(r, i){
    if(PokemonInfo[r].num > max){
      max = PokemonInfo[r].num;
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

function getforme(obj){
  if(obj.formeLetter){
    return `-${obj.formeLetter.toLowerCase()}`;
  }else{
    return '';
  }
}

function getNum(number){
  if(number < 10){
    return `00${number}`;
  }else if(number < 100){
    return `0${number}`;
  }else{
    return number;
  }
}
