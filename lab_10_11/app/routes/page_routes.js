var ObjectID = require('mongodb').ObjectID;
var _dirname = 'E:/Games/web_labs/lab_10_11';
module.exports = function(app, db) {
  app.get('/', (req, res) => {
    res.sendFile(_dirname + '/Main.html');
  });
  app.get('/Main.html', (req, res) => {
    res.sendFile(_dirname + '/Main.html');
  });
  app.get('/Feedback.html', (req, res) => {
    res.sendFile(_dirname + '/Feedback.html');
  });
  app.get('/News.html', (req, res) => {
    res.sendFile(_dirname + '/News.html');
  });
  app.get('/Admin.html', (req, res) => {
    res.sendFile(_dirname + '/Admin.html');
  });
};