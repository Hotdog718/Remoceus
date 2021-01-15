const mongo = require('./Mongo.js');
const Roles = require('./Models/AssignableRoles.js');

module.exports.getRoles = async (serverID) => {
    return await mongo().then(async (mongoose) => {
        try {
            const result = await Roles.findOne({serverID});

            if(result){
                return result;
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.addRole = async(serverID, rolename, roleInfo) => {
    return await mongo().then(async (mongoose) => {
        try {
            const result = await Roles.findOne({serverID});

            if(result){
                result.roles[rolename] = roleInfo;
                result.markModified('roles');
                return await result.save();
            }else{
                const newRoles = new Roles({
                    serverID: serverID,
                    roles: {}
                });
                newRoles.roles[rolename] = roleInfo;
                return await newRoles.save();
            }
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.removeRole = async (serverID, rolename) => {
    return await mongo().then(async (mongoose) => {
        try {
            const result = await Roles.findOne({serverID});

            if(result && result.roles[rolename]){
                delete result.roles[rolename];
                result.markModified('roles');
                return await result.save();
            }
        } finally {
            mongoose.connection.close();
        }
    })
}