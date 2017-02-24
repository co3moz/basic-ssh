module.exports = function (userProcess, servers, app) {
  app.get('/terminate/:id', function (req, res) {
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

    process.spawn.end();
    userProcess[user].splice(index, 1);
    res.redirect('/');
  });
};