const BanList = require('./Models/BanList.js');
const Mongo = require('./Mongo.js');

module.exports.getBanList = async (serverID) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getBannedPokemon = async (serverID) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                return result.pokemon;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getBannedDynamax = async (serverID) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                return result.dynamax;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getBannedAbilities = async (serverID) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                return result.abilities;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getBannedMoves = async (serverID) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                return result.moves;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getClauses = async (serverID) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                return result.clauses;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}