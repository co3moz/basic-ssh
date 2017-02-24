module.exports = function (userProcess, servers, app) {
  app.get('/control/:id', function (req, res) {
    var user = req.auth.user;

    var process = userProcess[user].find(function (process) {
      return process.id == req.params.id;
    });

    if (process == null) {
      return res.render('error', {
        user: user,
        userProcess: userProcess[user],
        message: 'Invalid process id',
        page: 'error'
      });
    }

    res.render('control', {
      user: user,
      userProcess: userProcess[user],
      id: req.params.id,
      page: req.params.id
    });
  });
};