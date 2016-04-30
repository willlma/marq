var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser')
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send({hello: 'world'});
});

app.post('/', function(req, res) {
  console.log('req: ');
  console.log(req);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});