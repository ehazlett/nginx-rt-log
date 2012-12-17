try {
    var local = require('./local_settings').settings;
} catch(err) {
    var local = {};
}

exports.settings = {
    APP_TITLE: 'nginx-rt',
    EXCLUDED_HOSTS: local.EXCLUDED_HOSTS || [],
    PORT: local.PORT || 3000,
    REDIS_HOST: local.REDIS_HOST || '127.0.0.1',
    REDIS_PORT: local.REDIS_PORT || 6379,
    REDIS_DB: local.REDIS_DB || 0,
    REDIS_PASS: local.REDIS_PASS || '',
    SECRET_KEY: local.SECRET_KEY || '1q2w3e4r5t6y7u8i9o0pAbCdOIUYT234fdrtjfjru7839d',
    SESSION_SECRET: local.SESSION_SECRET || 'sessionkey'
}
