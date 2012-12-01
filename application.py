#!/usr/bin/env python
# Copyright 2012 Evan Hazlett
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import sys
from flask import Flask, redirect, render_template, url_for, jsonify, json
from flask.ext.babel import Babel
from flask.ext.cache import Cache
from flask.ext import redis
import config

app = config.create_app()
cache = Cache(app)
redis = redis.init_redis(app)
babel = Babel(app)

@app.route('/')
def index():
    ctx = {
        'update_interval': app.config.get('UPDATE_INTERVAL')
    }
    return render_template('index.html', **ctx)

@app.route('/stats')
def stats():
    key = config.CLIENT_KEY.format('*')
    stat_keys = redis.keys(key)
    stats = []
    for k in stat_keys:
        client = k
        if k.find(':') > -1:
            client = k.split(':')[-1]
        # check for excluded host
        if client not in app.config.get('EXCLUDED_HOSTS'):
            req = redis.get(k)
            if req == None:
              req = 0
            d = {'client': client, 'requests': int(req)}
            stats.append(d)
    return json.dumps(stats)

@app.route('/stats/reset')
def reset_stats():
    redis.flushdb()
    return redirect(url_for('index'))

if __name__=='__main__':
    from optparse import OptionParser
    op = OptionParser()
    op.add_option('--host', dest='host', action='store', default='127.0.0.1', \
        help='Hostname/IP on which to listen')
    op.add_option('--port', dest='port', action='store', type=int, \
        default=5000, help='Port on which to listen')
    opts, args = op.parse_args()

    app.run(host=opts.host, port=opts.port, debug=True)
