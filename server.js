var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);


var buttonStatus = false;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


app.get('/status', (req, res) => {
  res.json({status: buttonStatus});
});

app.get('/toggle', async (req, res) => {
  buttonStatus = !buttonStatus;
  res.json({status: buttonStatus});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
