const mongo = require('./Mongo.js');
const ACLA = require('./Models/MOTW.js');

const cache = {movesets: [], updated: false} // {"movesets": Array<movesets>, "updated": boolean}

module.exports.getMoveset = async () => {
    if(cache.updated){
        return cache.movesets;
    }
    return await mongo().then(async (mongoose) => {
        try {
            const result = await ACLA.find();
            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getMovesetWithSpecies = async (species) => {
    if(cache.updated){
        return cache.movesets.filter((val) => val.pokemon === species.toLowerCase());
    }
    return await mongo().then(async (mongoose) => {
        try {
            const result = await ACLA.find({pokemon: species.toLowerCase()});
            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.updateCache = async () => {
    return await mongo().then(async (mongoose) => {
        const result = await ACLA.find();
        if(result){
            cache.movesets = [];
            for(const moveset of result){
                cache.movesets.push({
                    setName: moveset.setName,
                    pokemon: moveset.pokemon,
                    nature: moveset.nature,
                    ability: moveset.ability,
                    item: moveset.item,
                    evs: moveset.evs,
                    move1: moveset.move1,
                    move2: moveset.move2,
                    move3: moveset.move3,
                    move4: moveset.move4,
                    forme: moveset.forme,
                    year: moveset.year,
                    ytLink: moveset.ytLink
                });
            }
            cache.updated = true;
        }
    })
}