function create_map() {
    var mapOptions = {
        center: new google.maps.LatLng(38.3, 10.78),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        zoomControl: false,
        scaleControl: false,
        zoomControl: true,
        draggableCursor: "default",
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        },
        streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById("mymap"), mapOptions);

    google.maps.event.addListener(map, 'click', function (event) {
        var latLon = event.latLng;
        reverseGeocode(latLon);
        var lat = latLon.lat();
        var lon = latLon.lng();
        map.setCenter(latLon);
        clearMarker();
        clearImages();
        ajaxLatLonPost(lat, lon);
        placeMarker(event.latLng);
    });
}

function addMarkerDragListener(marker) {
    google.maps.event.addListener(marker, 'dragend', function (event) {
        var latLon = marker.getPosition();
        reverseGeocode(latLon);
        var lat = latLon.lat();
        var lon = latLon.lng();
        clearImages();
        ajaxLatLonPost(lat, lon);
    })
}

function addSubmitListener(marker) {
    $('#searchsubmit').parent().addClass("active");
    $('#searchsubmit').click(function (e) {
        var latLon = marker.getPosition();
        reverseGeocode(latLon);
        var lat = latLon.lat();
        var lon = latLon.lng();
        clearImages();
        ajaxLatLonPost(lat, lon);
    })
}


function ajaxLatLonPost(lat, lon) {
    chunksarray = [];
    collectLicenseData();
    var tag = $('#tags').val().split(" ")

    var obj = {
        lat: lat,
        lon: lon,
        tag: tag,
        licenses: licenses
    };

    $.ajax({
        url: "/flickrapi",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(obj),
        success: function (data) {
            if (data.pages === 0) {
                $('#photos').text('Apologies - no response from Flickr - this app can be a little temperamental so please try again')
            }
            else { 

                chunksarray = chunks(data.photo, 30);
                numberofphotos = data.perpage;
                currentarray = 0;
                firstarray = chunksarray[currentarray];
                processFlickrData(firstarray);}
        }
    });
};

function placeMarker(location) {
    marker = new google.maps.Marker({
        position: location,
        map: map,
        flat: true,
        draggable: true
    });
    if (map.getZoom() < 13) {
        map.setZoom(13)
    }
    addSubmitListener(marker);
    addMarkerDragListener(marker);
};

function clearMarker() {
    if (marker) {
        marker.setMap(null);
    }
};

function clearImages() {
    $('#previousbutton').text("");
    $('#nextbutton').text("");
    $('#nextbatch').text("");
    $('#previousbatch').text("");
    $('#photonumber').children().remove().end();
    $('#photos').children().remove().end();
    $('.bigimage').children().remove().end();
    $('#photos').text('Loading (this can take some time due to the amount of data)...')
}

function geolocate(pos) {

    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
    center = new google.maps.LatLng(lat, lon);
    reverseGeocode(center);
    map.setCenter(center);
    clearMarker();
    clearImages();
    ajaxLatLonPost(lat, lon);
    placeMarker(center);

};

// geocode function if user inputs location

function geocodeAddress() {
    var address = $("#userlocation").val();
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

            $('#locations').append("<li> - " + results[0].formatted_address + "</li>");
            var userloc = results[0].geometry.location;
            map.setCenter(userloc);
            var lat = userloc.lat();
            var lon = userloc.lng();
            clearMarker();
            clearImages();
            console.log(lat + lon);
            ajaxLatLonPost(lat, lon);
            placeMarker(userloc);
            $('#userlocation').val("");

        } else {
            alert("Sorry, we didn't recognise this location");
        }
    });
};

function reverseGeocode(latLon) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        location: latLon
    }, function (results, status) {
        $('#locations').append("<li> - " + results[0].formatted_address + "</li>");
    })
}

function processFlickrData(photos) {
    $('#photos').text('')

    if (currentarray === 0) {
        $('#previousbatch').text('Start');
        $('#nextbatch').text('Next 30');
    }

    if (currentarray > 0) {
        $('#previousbatch').text('Previous');
        $('#nextbatch').removeClass('display-none').text('Next 30');
    }

    if (currentarray >= chunksarray.length - 1){
        $('#nextbatch').addClass('display-none');
        $('#previousbatch').text('Previous');
    }

    if (photos.length === 0) {
        $('#photos').append("<span>" + "Sorry, no photos for here (although this app can be a little temperamental so you might like to try again)." + "</span>");
    } else {

        if (numberofphotos === 1) {
            $('#photonumber').append("<span><b>" + numberofphotos + " lonely photo - click to enlarge" + "</b></span>");
        } else {
            $('#photonumber').append("<span><b>" + numberofphotos + " photos" + "</b></span><span>" + " - click to enlarge" + "</span>");
        }

        for (var i = 0; i < photos.length; i++) {
            var farmId = photos[i].farm;
            var serverId = photos[i].server;
            var photoId = photos[i].id;
            var photoSecret = photos[i].secret;

            var thumbnail = "http://farm" + farmId + ".staticflickr.com/" + serverId + "/" + photoId + "_" + photoSecret + "_t.jpg"
            var mainurl = "http://farm" + farmId + ".staticflickr.com/" + serverId + "/" + photoId + "_" + photoSecret + ".jpg"
           
            $('#photos').append("<span>" + "<a href=" + mainurl + ">" + "<img photoid=" + photoId + " " + "src=" + thumbnail + "></a></span>");

        };
    }
}

function collectLicenseData() {
    licenses = [];
    var buttonsChecked = $('#licenseform :checked');

    if (buttonsChecked.length) {
        $('#licenseform :checked').each(function () {
            licenses.push($(this).val())
        })
    } else {
        licenses = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    }

}

var chunks = function(array, size) {
  
  while (array.length) {
    chunksarray.push(array.splice(0, size));
  }
  return chunksarray;
};

