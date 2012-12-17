var PORT = process.env.VCAP_APP_PORT || 3000;
var express = require("express")
  , settings = require("./settings").settings
  , i18n = require("i18n")
  , app = express()
  , http = require("http")
  , server = http.createServer(app)
  , redis = require("redis")
  , io = require("socket.io").listen(server);

var db = redis.createClient(settings.REDIS_PORT, settings.REDIS_HOST);

// i18n configuration
i18n.configure({
    locales:["en", "fr"],
    register: global
});

app.use(express.static(__dirname + '/static'));
app.engine('html', require('ejs').renderFile);

app.configure(function(){
  app.set('APP_TITLE', settings.APP_TITLE);
  app.set('APP_VERSION', settings.APP_VERSION);
  app.set('view engine', 'ejs');
});

makeLocals = function(req, options) {
  var locals = {
    'appTitle': app.set('APP_TITLE'),
    'appVersion': app.set('APP_VERSION'),
    'title': null,
    'req': req
  }
  for (var k in options) {
    locals[k] = options[k] || "";
  }
  return locals;
};

// redis
db.on("message", function(channel, message){
  try {
    var data = message.split(":");
    var client = data[0];
    if (settings.EXCLUDED_HOSTS.indexOf(client) != -1) {
      console.log("Skipping excluded host " + client);
    } else {
      io.sockets.emit('data', { client: client, value: data[1]});
    }
  } catch (err) {
    console.log('Error parsing message: ' + err);
  }
});
db.subscribe("nginx-rt");

// sockets
io.sockets.on('connection', function (socket) {
  socket.emit('data', { response: 'connected' });
});

app.get('/', function(req, res){
  res.render('index.ejs', {
    locals: makeLocals(req, { 'title': 'home' })
  });
});

server.listen(PORT);
