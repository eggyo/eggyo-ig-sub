var express = require('express');
var app = express();
var Instagram = require('instagram-node-lib');

Instagram.set('client_id', 'f0b52d7c5aa6422ca15e4822d1ebd830');
Instagram.set('client_secret', '71ffe85517bf49998481021048b5e2dc');
Instagram.set('callback_url', 'http://eggyo-ig-sub.herokuapp.com/webhook');


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/testPop', function(request, response) {
  Instagram.media.popular();
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'myVerifyToken') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (request, response) {
  var data = response.body;
  console.log("post data received :"+data);
  response.sendStatus(200);
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
