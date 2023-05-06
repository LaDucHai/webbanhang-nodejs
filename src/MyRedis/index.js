const { createClient } = require('redis'); 
const pubClient = createClient({ url: 'redis://:20111995Hai@103.178.233.184:6379' });

class MyRedis {
    constructor () {}
}

exports.MyRedis = MyRedis;