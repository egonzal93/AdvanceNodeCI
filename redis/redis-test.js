/**
 * Created by Jason Gonzales on 3/29/2018.
 */

const redis  = require('redis');

const redisUrl = 'redis://127.0.0.1:6379';

const redisClient = redis.createClient(redisUrl);

redisClient.set('hi', 'there');

redisClient.get('hi', (err, value) => {console.log(value)});

redisClient.get('hi', console.log);

redisClient.hset('german', 'red', 'rot');

redisClient.hget('german', 'red', console.log);

redisClient.set('colors', { red: 'rojo'});

redisClient.get('colors', console.log);

// Output null '[object Object]'

redisClient.set('colors', JSON.stringify({ red: 'rojo'}));

redisClient.get('colors', (err, val) => {console.log(JSON.parse(val))});

//Output true
//Output {red: 'rojo'}

// expire cach after 5 seconds
redisClient('colors', 'red', 'EX', 5);

redisClient.flushall();
