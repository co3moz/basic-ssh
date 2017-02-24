var Client = require('ssh2').Client;
var md5 = require('js-md5');

module.exports = function (userProcess, servers, app) {
  app.get('/connect/:id', function (req, res) {
    var user = req.auth.user;

    var id = req.params.id;
    var server = servers.find(function (server) {
      return server.id == id;
    });

    if (server == null) {
      return res.render('error', {
        user: user,
        userProcess: userProcess[user],
        message: 'Invalid server id',
        page: 'error'
      });
    }


    var process = {
      server: server,
      id: md5(Math.random().toString() + Date.now().toString()),
      data: []
    };

    var s = new Client();
    s.connect({
      host: server.ip,
      port: server.port || 22,
      username: server.login,
      password: server.password
    });

    s.on('error', function (error) {
      console.log(error);
    });

    s.on('end', function () {
      process.alive = false;
    });

    const StringDecoder = require('string_decoder').StringDecoder;
    const decoder = new StringDecoder('utf8');
    s.on('ready', function () {
      s.shell({term: 'xterm-256color'}, function (err, stream) {
        if (err) {
          return pushData(process, 'stderr', err.message);
        }

        stream.on('close', function () {
          pushData(process, 'exit', '');
          s.end();
        }).on('data', function (data) {
          pushData(process, 'stdout', decoder.write(data));
        }).stderr.on('data', function (data) {
          pushData(process, 'stderr', decoder.write(data));
        });

        // stream.stdin.write('htop\n');
        process.stream = stream;
        global.stream = stream;
      });
    });

    process.spawn = s;
    userProcess[user].push(process);

    res.redirect('/control/' + process.id);
  });
};

function pushData(process, pipe, data) {
  var last = process.data[process.data.length - 1];

  if (last && (last.time == Date.now())) {
    last.data += data;
  } else {
    process.data.push({
      time: Date.now(),
      pipe: pipe,
      data: data
    });


    if (process.data.length > 200) {
      process.data.shift();
    }
  }
}