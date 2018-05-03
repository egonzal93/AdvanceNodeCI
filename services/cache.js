/**
 * Created by Jason Gonzales on 3/29/2018.
 */

// Monkey patch a function on mongoose to intercept the exec function

const mongoose = require('mongoose');
const redis = require('redis');

const keys = require('../config/keys');
// const redisUrl = 'redis://127.0.0.1:6379';

const redisClient = redis.createClient(redisUrl);
const util = require('util');

redisClient.hget = util.promisify(redisClient.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}){
    this._useCache = true;
    this._hashKey  = JSON.stringify( options.key || '');

    //make it a chain-able function

    return this;
}

mongoose.Query.prototype.exec = async function() {

    if (!this._useCache){
        return exec.apply(this, arguments);
    }

    // console.log('IM ABOUT TO RUN A QUERY');
    // console.log(this.getQuery() );
    // console.log(this.mongooseCollection.name);
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    // See if we have a value for 'key' in redis
    const cachedValue = await redisClient.hget(this._hashKey,key);

    console.log('key:', key);

    console.log('hash-key:', this._hashKey);

    console.log('cached:', cachedValue);

    // If we do, return that
    if (cachedValue) {
      // console.log(cachedValue);
      // convert to mongodb model instances with an array of objects (HYDRATING)
      // const doc = new this.model(JSON.parse(cachedValue));

      const doc = JSON.parse(cachedValue);

      // Hydrate an array or a flattened object
      Array.isArray(doc)
        ? doc.map( d => new this.model(d))
        : new this.model(doc);

      // result is returned as type model instances or documents
      return doc;
    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);

    console.log('result:', result);

    // if (result === undefined || result.length == 0) {
    //     return result;
    // }

    // set expiration to 10 seconds (not retroactive)
    // redisClient.hset(this._hashKey, key, JSON.stringify(result), 'EX', 10);

    redisClient.hset(this._hashKey, key, JSON.stringify(result));
    redisClient.expire(this._hashKey, 10);

    return result;

}

module.exports = {
    clearHash(hashKey) {
        redisClient.del(JSON.stringify(hashKey));
    }
}