module.exports = function (userProcess, servers, app) {
  app.get('/track/:id/:time', function (req, res) {
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

    var data = process.data;
    if (req.params.time != "0") {
      data = process.data.filter(function (data) {
        return data.time > req.params.time
      });
    }

    res.send(data);
  });
};