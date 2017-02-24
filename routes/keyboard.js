module.exports = function (userProcess, servers, app) {
  app.post('/keyboard/:id', function (req, res) {
    var user = req.auth.user;

    var index;
    var process = userProcess[user].find(function (process, i) {
      if (process.id == req.params.id) {
        index = i;
        return true;
      }
      return false;
    });

    if (process == null) {
      return res.render('error', {
        user: user,
        userProcess: userProcess[user],
        message: 'Invalid process id',
        page: 'error'
      });
    }

    if (process.stream == null) {
      return res.render('error', {
        user: user,
        userProcess: userProcess[user],
        message: 'Process stream is null',
        page: 'error'
      });
    }

    if (process.err != null) {
      return res.render('error', {
        user: user,
        userProcess: userProcess[user],
        message: 'Process throwed error! ' + process.err,
        page: 'error'
      });
    }

    var key = req.body;
    if(key.ctrl) {
      if(key.key == 'c') {
        process.stream.stdin.write('\x03');
      }
    }
    res.send('ok');
  });
};