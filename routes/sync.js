module.exports = function (userProcess, servers, app) {
  app.post('/sync/:id/:time', function (req, res) {
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
	
    try {
		if (process.alive) {
			if(req.body.message != "") {
				process.stream.stdin.write(req.body.message);
			}
		}
	} catch(e) {
		pushData(process, 'stderr', 'ERROR:' + e.stack);
	}

    res.send(data);
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