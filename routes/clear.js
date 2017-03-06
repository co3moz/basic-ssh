module.exports = function (userProcess, servers, app) {
  app.get('/clear/:id', function (req, res) {
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

	process.stream.stdin.write('\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\bclear\n');
    process.data = [];
	res.redirect('/control/' + process.id);
  });
};