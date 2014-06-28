
var Photos= function Photos(request) {
    this._request= request;
};

Photos.prototype.search= function(arguments, callback) {
    console.log("Search request made")
    this._request.executeRequest("flickr.photos.search", arguments, false, null, callback);

};

exports.Photos= Photos;
