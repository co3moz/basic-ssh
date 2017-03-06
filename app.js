var config = require('config');
var express = require('express');
var bodyParser = require('body-parser');
var md5 = require('js-md5');
var basicAuth = require('express-basic-auth');
var app = express();

app.set('view engine', 'ejs');
app.use(basicAuth({
  challenge: true,
  realm: md5(Math.random().toString()),
  authorizer: function (username, password) {
    return users.some(function (user) {
      return user.login == username && user.password == password;
    });
  }
}));

app.use(bodyParser.json());

var users = config.get('users');
var servers = config.get('servers');
servers.forEach(function (server) {
  server.id = md5(Math.random().toString());
});

var userProcess = {};

app.use(function (req, res, next) {
  var user = req.auth.user;
  if (!userProcess[user]) {
    userProcess[user] = [];
  }
  next();
});

servers.filterServers = function (user) {
  return servers.filter(function (server) {
    if (!server.responsible) return false;
    if (server.responsible == user) return true;
    if (server.responsible.constructor == Array) {
      return server.responsible.some(function (responsible) {
        return responsible == user;
      });
    }
    return false;
  })
};

([require('./routes/index'),
  require('./routes/connect'),
  require('./routes/connect_id'),
  require('./routes/control'),
  require('./routes/terminate'),
  require('./routes/sync'),
  require('./routes/clear')
]).forEach(function (route) {
  route(userProcess, servers, app);
});


app.listen(config.get('port'));
console.log('basic-ssh started on %d', config.get('port'));

