# Nginx Realtime Log
This is a simple Flask app that will report (near)realtime visitors and the
number of requests.

# Setup
The app uses Redis.  This assumes Redis is on localhost.  Update the settings
in `config.py`.

```
pip install -r requirements.txt
python application.py

```

Then open browser to http://localhost:5000/

# Nginx Setup
In order to log requests, the following LUA script needs to be put into the
Nginx config.  You will need a modern version of Nginx along with LUA and
the redis-lua library.  Here is an example setup for Ubuntu 12.04:

```
apt-get install -y nginx-extras liblua5.1-socket2
mkdir -p /usr/share/lua/5.1/
wget https://raw.github.com/nrk/redis-lua/version-2.0/src/redis.lua -O /usr/share/lua/5.1/redis.lua

```

Then add the following LUA script to the Nginx config:

```
location / {
    access_by_lua '
      local redis = require "redis";
      local r = redis.connect("127.0.0.1", 6379);
      if not r:ping() then
        ngx.log(ngx.WARN, "Redis error");
      else
        local key = "clients:" .. ngx.var.remote_addr;
        r:incr(key);
        r:expire(key, 600);
      end
    ';
    try_files $uri $uri/ /index.html;
}
```

Note: This is for the default location (`/`).  To add to an existing block, simply
add the `access_by_lua` script before the `try_files`, `root`, or `proxy_pass`.

By default, the Redis keys are set to expire in 10 minutes.  Depending on your
traffic and your preference of to how long you want data, you can change the
`r:expire(key, 600);` to a different threshold (in seconds).

Note: if you want a different Redis key (other than the default `client:<ip>`)
you will need to change it in `config.py` as well as in the Nginx LUA script.

# Screenshots

![Graph](http://i.imgur.com/6aOf4.png)
