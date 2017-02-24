module.exports = function (userProcess, servers, app) {
  app.get('/connect', function (req, res) {
    var user = req.auth.user;

    res.render('connect', {
      user: user,
      servers: servers.filterServers(user),
      userProcess: userProcess[user],
      page: 'connect'
    });
  });
};