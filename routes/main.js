var FlickrAPI = require('../flickrnode/lib/flickr').FlickrAPI
, sys = require('sys')
, api = require('../config/api.js')
, flickr = new FlickrAPI(api.details.key);

exports.home = function(req, res){
  res.render('home', {title: "Geoflickr"});
};

exports.test = function(req, res){

	function searchObject(obj) {
		this.lat = obj.lat;
		this.lon = obj.lon;
		this.license = obj.licenses;
		this.min_date_upload = 946706400;
		this.tags = obj.tag;
	}

	var sO = new searchObject(req.body);
	flickr.photos.search(sO, function(error, results) {
		res.json(results);
	});
}

