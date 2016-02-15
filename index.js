express = require('express');

var app = express();
var port = process.env.PORT || 3000;

app.listen(port);

console.log('Server listening on port ' + port0);

app.get('/*', function(req, res){
  res.send('hello world');
});
