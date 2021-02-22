const BanList = require('./Models/BanList.js');
const Mongo = require('./Mongo.js');

const cache = {}; // {serverID: banListData}

module.exports.getBanList = async (serverID) => {
    if(cache[serverID]){
        return cache[serverID];
    }
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                cache[serverID] = {
                    serverID: result.serverID,
                    pokemon: result.pokemon,
                    dynamax: result.dynamax,
                    abilities: result.abilities,
                    moves: result.moves,
                    clauses: result.clauses
                }
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getBannedPokemon = async (serverID) => {
    if(cache[serverID]){
        return cache[serverID].pokemon;
    }
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                cache[serverID] = {
                    serverID: result.serverID,
                    pokemon: result.pokemon,
                    dynamax: result.dynamax,
                    abilities: result.abilities,
                    moves: result.moves,
                    clauses: result.clauses
                }
                return result.pokemon;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getBannedDynamax = async (serverID) => {
    if(cache[serverID]){
        return cache[serverID].dynamax;
    }
    
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                cache[serverID] = {
                    serverID: result.serverID,
                    pokemon: result.pokemon,
                    dynamax: result.dynamax,
                    abilities: result.abilities,
                    moves: result.moves,
                    clauses: result.clauses
                }
                return result.dynamax;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getBannedAbilities = async (serverID) => {
    if(cache[serverID]){
        return cache[serverID].abilities;
    }
    
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                cache[serverID] = {
                    serverID: result.serverID,
                    pokemon: result.pokemon,
                    dynamax: result.dynamax,
                    abilities: result.abilities,
                    moves: result.moves,
                    clauses: result.clauses
                }
                return result.abilities;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getBannedMoves = async (serverID) => {
    if(cache[serverID]){
        return cache[serverID].moves;
    }
    
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                cache[serverID] = {
                    serverID: result.serverID,
                    pokemon: result.pokemon,
                    dynamax: result.dynamax,
                    abilities: result.abilities,
                    moves: result.moves,
                    clauses: result.clauses
                }
                return result.moves;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getClauses = async (serverID) => {
    if(cache[serverID]){
        return cache[serverID].clauses;
    }

    return await Mongo().then(async (mongoose) => {
        try {
            const result = await BanList.findOne({serverID: serverID});

            if(result){
                cache[serverID] = {
                    serverID: result.serverID,
                    pokemon: result.pokemon,
                    dynamax: result.dynamax,
                    abilities: result.abilities,
                    moves: result.moves,
                    clauses: result.clauses
                }
                return result.clauses;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.updateCache = async () => {
    return await Mongo().then(async (mongoose) => {
        try{
            const results = await BanList.find();

            if(results){
                for(const result of results){
                    cache[result.serverID] = {
                        serverID: result.serverID,
                        pokemon: result.pokemon,
                        dynamax: result.dynamax,
                        abilities: result.abilities,
                        moves: result.moves,
                        clauses: result.clauses
                    }
                }
            }
        } finally {
            mongoose.connection.close();
        }
    })
}