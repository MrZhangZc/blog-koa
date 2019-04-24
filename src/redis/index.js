const Redis = require('ioredis');
let redis = {}

const redisCilct = () => {
    return redis = new Redis()
}

module.exports = redisCilct