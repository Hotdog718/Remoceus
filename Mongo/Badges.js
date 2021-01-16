const Mongo = require('./Mongo.js');
const Badges = require('./Models/Badges.js');

module.exports.getBadges = async (userID, serverID) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await Badges.findOne({userID: userID, serverID: serverID});

            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getDocumentWithBadge = async (serverID, type) => {
    return await Mongo().then(async (mongoose) => {
        try {
            let query = {
                serverID: serverID
            }
            query[type] = true;
            const result = await Badges.find(query);

            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.getAllBadges = async (serverID) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const result = await Badges.find({serverID: serverID});

            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.giveBadge = async (userID, serverID, type) => {
    return await Mongo().then(async (mongoose) => {
        try{
            const result = await Badges.findOne({userID: userID, serverID: serverID});

            if(result) {
                if(result[type]){
                    throw 'User has badge';
                }
                result[type] = true;
                result.count++;
                return await result.save();
            }else{
                throw 'No Document';
            }
        }finally{
            mongoose.connection.close();
        }
    })
}

module.exports.takeBadge = async (userID, serverID, type) => {
    return await Mongo().then(async (mongoose) => {
        try{
            const result = await Badges.findOne({userID: userID, serverID: serverID});

            if(result) {
                if(!result[type]){
                    throw 'No badge';
                }
                result[type] = false;
                result.count--;
                return await result.save();
            }else{
                throw 'No Document';
            }
        }finally{
            mongoose.connection.close();
        }
    })
}

module.exports.takeAllBadges = async (userID, serverID) => {
    return await Mongo().then(async (mongoose) => {
        try{
            return await Badges.findOneAndDelete({userID: userID, serverID: serverID});
        }finally{
            mongoose.connection.close();
        }
    })
};

module.exports.givePoints = async (userID, serverID, points) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const results = await Badges.findOne({userID: userID, serverID: serverID});

            if(results){
                results.points += points;
                return await results.save();
            }else{
                throw 'No Document';
            }
        } finally {
            mongoose.connection.close();
        }
    })
};

module.exports.takePoints = async (userID, serverID, points) => {
    return await Mongo().then(async (mongoose) => {
        try {
            const results = await Badges.findOne({userID: userID, serverID: serverID});

            if(results){
                results.points -= points;
                if(results.points < 0){
                    results.points = 0;
                }
                return await results.save();
            }else{
                throw 'No Document';
            }
        } finally {
            mongoose.connection.close();
        }
    })
};

module.exports.reset = async (serverID) => {
    return await Mongo().then(async (mongoose) => {
        try{
            return await Badges.deleteMany({serverID: serverID});
        }finally{
            mongoose.connection.close();
        }
    })
}

module.exports.register = async (userID, serverID, hometown) => {
    return await Mongo().then(async (mongoose) => {
        try{
            return await new Badges({
                userID: userID,
                serverID: serverID,
                bug: false,
                dark: false,
                dragon: false,
                electric: false,
                fairy: false,
                fighting: false,
                fire: false,
                flying: false,
                ghost: false,
                grass: false,
                ground: false,
                ice: false,
                normal: false,
                poison: false,
                psychic: false,
                rock: false,
                steel: false,
                water: false,
                count: 0,
                hometown: hometown,
                points: 100
            }).save();
        }finally{
            mongoose.connection.close();
        }
    })
}

module.exports.changeHometown = async (userID, serverID, hometown) => {
    return await Mongo().then(async (mongoose) => {
        try{
            let results = await Badges.findOne({userID: userID, serverID: serverID});
            if(results){
                results.hometown = hometown;
                await results.save();
            }
        }finally{
            mongoose.connection.close();
        }
    })
}