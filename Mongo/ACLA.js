const mongo = require('./Mongo.js');
const ACLA = require('./Models/MOTW.js');

module.exports.getMoveset = async () => {
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