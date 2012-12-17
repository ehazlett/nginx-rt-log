try {
    var local = require('./local_settings').settings;
} catch(err) {
    var local = {};
}

var env = process.env.VCAP_SERVICES ? JSON.parse(process.env.VCAP_SERVICES) : {};
var redis =  env.hasOwnProperty('redis-2.2') ? env['redis-2.2'][0]['credentials'] : {};
exports.settings = {
    APP_TITLE: 'nginx-rt',
    EXCLUDED_HOSTS: [],
    PORT: 3000,
    REDIS_HOST: redis.host || '127.0.0.1',
    REDIS_PORT: redis.port || 6379,
    REDIS_DB: redis.name || 0,
    REDIS_PASS: redis.password || '',
    SECRET_KEY: '1q2w3e4r5t6y7u8i9o0pAbCdOIUYT234fdrtjfjru7839d',
    SESSION_SECRET: 'sessionkey'
}
