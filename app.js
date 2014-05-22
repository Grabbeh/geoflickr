var express = require('express')
, bodyParser = require('body-parser')
, serveStatic = require('serve-static')
, util = require('util')
, routes = require('./routes/main')
, app = express()
, FlickrAPI = require('./flickrnode/lib/flickr').FlickrAPI
, sys = require('sys')
, api = require('./config/api.js')
, flickr = new FlickrAPI(api.details.key);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(serveStatic(__dirname + '/public'));

// Routes

app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/views/index.html')
});

app.post('/api/flickrapi', routes.api);

app.get('*', function(req, res){
  res.sendfile(__dirname + '/public/views/index.html');
});

app.listen(4000);
