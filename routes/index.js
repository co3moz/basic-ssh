module.exports = function (userProcess, servers, app) {
  app.get('/', function (req, res) {
    var user = req.auth.user;

    res.render('index', {
      user: user,
      servers: servers.filterServers(user),
      userProcess: userProcess[user],
      page: 'index'
    });
  });
};