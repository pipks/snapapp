//Query resolvers
const Query = require('./queries/Query');
const Snap = require('./queries/Snap');
const User = require('./queries/User');

//Mutation resolvers
const Mutation = require('./mutations');

module.exports ={ 
    Query,
    Snap,
    User,
    Mutation
};