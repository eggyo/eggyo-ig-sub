var express = require('express');
var app = express();
var http = require('http');

var ig = require('instagram-node').instagram();

ig.use({ client_id: 'f0b52d7c5aa6422ca15e4822d1ebd830',
         client_secret: '71ffe85517bf49998481021048b5e2dc' });

var webhook_url = 'http://eggyo-ig-sub.herokuapp.com/webhook';
var redirect_uri = 'http://eggyo-ig-sub.herokuapp.com/handleauth';

exports.authorize_user = function(req, res) {
  res.redirect(ig.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log("error"+err);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.send('You made it!!');
    }
  });
};


// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI
app.get('/handleauth', exports.handleauth);


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/testDog', function(request, response) {

  ig.tag('tag', function(err, result, remaining, limit) {
    if (err) {
      console.log("error"+err);
      res.send(err);
    } else {
      console.log('Yay! Access token is ' + result);
      res.send(result);
    }  });
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
