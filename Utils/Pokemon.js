// const fetch = require('node-fetch');
// const fs = require('fs');
const PokemonInfo = require('./Pokemon/Pokemon Info.json');

const getFormLetter = (species, form) => {
  if(!form) return '';
  form = form.toLowerCase().trim();
  let types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'poison', 'psychic', 'rock', 'steel', 'water'];
  if((species == 'arceus' || species == 'silvally') && types.includes(form)){
    return form;
  }
  switch(form){
    case '10%': return '10';
    case 'attack': case 'autumn': case 'ash': return 'a';
    case 'blue-striped': case 'black': case 'blade': case 'busted': return 'b';
    case 'complete': case 'core': case 'crowned': return 'c';
    case 'defense': case 'dusk': case 'dada': return 'd';
    case 'dawn wings': return 'dw';
    case 'dusk mane': return 'dm';
    case 'east': case 'electric': case 'eternal': case 'eternamax': return 'e';
    case 'frost': case 'fire': return 'f';
    case 'galar': return 'g';
    case 'galar-zen': return 'gz';
    case 'gmax': case 'gigantimax': return 'gi';
    case 'heat': case 'super': case 'hangry': return 'h';
    case 'snowy': case 'ice': return 'i';
    case 'large': case 'low key': return 'l';
    case 'primal': case 'mega': case 'mow': case 'midnight': case 'ultra': return 'm';
    case 'average': case 'noice': return 'n';
    case 'origin': case 'original': return 'o';
    case 'plant': case 'pom-pom': return 'p';
    case 'pa\'u': return 'pau';
    case 'rainy': case 'resolute': case 'rapid-strike': return 'r';
    case 'sunny': case 'speed': case 'sunshine': case 'fan': case 'sky': case 'summer': case 'pirouette': case 'small': case 'sensu': case 'school': case 'shadow': return 's';
    case 'trash': case 'therian': return 't';
    case 'unbound': return 'u';
    case 'wash': case 'winter': case 'white': case 'water': return 'w';
    case 'zen': return 'z';
    default: return '';
  }
  return '';
}
const GetNum = (number) => {
  if(number < 10){
    return `00${number}`;
  }else if(number < 100){
    return `0${number}`;
  }else{
    return number;
  }
}

module.exports = {
  PokemonInfo: PokemonInfo,
  TypeColors: require("./Pokemon/Type Colors.js"),
  MoveInfo: require('./Pokemon/Move Info.json'),
  LearnSets: require("./Pokemon/Learn Sets.json"),
  GetNum: GetNum,
  GetSerebiiURL: (pokemon, form, shiny) => {
    let poke = PokemonInfo[pokemon.replace(/[^a-z0-9]/gi, '').toLowerCase()];

    let forme = form ? `-${getFormLetter(pokemon, form)}` : '';
    if(shiny){
      return `https://serebii.net/Shiny/home/${GetNum(poke.num)}${forme}.png`;
    }else{
      return `https://www.serebii.net/pokemonhome/pokemon/small/${GetNum(poke.num)}${forme}.png`;
    }
  },
  getFormLetter: getFormLetter
}
