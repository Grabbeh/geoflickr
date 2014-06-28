var FlickrAPI = require('../flickrnode/lib/flickr').FlickrAPI
, sys = require('sys')
, api = require('../config/api.js')
, flickr = new FlickrAPI(api.details.key);

exports.home = function(req, res){
  res.render('home');
};

exports.api = function(req, res){
	req.body.min_date_upload = 946706400;
	flickr.photos.search(req.body, function(error, results) {
		if (error){
			res.status(500).send();
		}
		else {
			if (results.pages === 0){
				res.status(204).send();
			}
			else {
				addUrlsToPhotos(results.photo, function(err, photos){
					res.json(photos);
				})
			}
		}
		
	});
}

function addUrlsToPhotos(arr, fn){
    arr.forEach(function(p){
    	var thumbnail = "http://farm" + p.farm + ".staticflickr.com/" + p.server + "/" + p.id + "_" + p.secret + "_t.jpg";
        var mainurl = "http://farm" + p.farm + ".staticflickr.com/" + p.server + "/" + p.id + "_" + p.secret + ".jpg";
        var flickrurl = "http://flickr.com/photo.gne?id=" + p.id + "/";
    	p.thumbUrl = thumbnail;
    	p.mainUrl = mainurl
    	p.flickrUrl = flickrurl;
    })
	fn(null, arr)
}

exports.privacy = function(req, res){
  res.render('privacy');
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

