angular.module('app')

    .controller("mainController", ['$scope', '$window', 'geoCoder', 'flickr', '$rootScope', '$http', 'returnSelectedBoxesFilter',
        function($scope, $window, geoCoder, flickr, $rootScope, $http, returnSelectedBoxesFilter) {
        var $ = $scope;

        $.showAdvancedOptions = false;
        $.showRecentLocations = false;
        $.tag = "";
        $.location = "";
        $.locations = [];

        $.licenses = [
        { checked: true, number: 0, type: "All rights reserved"}, 
        { checked: true, number: 1, type: "Attribution-Non-Commercial-Share Alike Licence"}, 
        { checked: true, number: 2, type: "Attribution-Non-Commercial Licence"}, 
        { checked: true, number: 3, type: "Attribution-Non-Commercial-NoDerivs Licence"}, 
        { checked: true, number: 4, type:"Attribution Licence"}, 
        { checked: true, number: 5, type:"Attribution-Share Alike Licence"}, 
        { checked: true, number: 6, type:"Attribution-No Derivs Licence"}, 
        { checked: true, number: 7, type:"No known copyright restrictions"}, 
        { checked: true, number: 8, type: "United States Government Work"}]

        $.tag = "";

        $.$on('coords.change', function(e, l){ 
            geoCoder.reverseGeocode(new google.maps.LatLng(l.lat, l.lon)).then(function(data){
                $.locations.push(data[0].formatted_address);
            })

            flickr.search({ lat: l.lat, lon: l.lon, tags: $.tag, licenses: returnSelectedBoxesFilter($scope.licenses) })
                .success(function(data){
                    console.log(data);
                    $.arrayOfPhotos = data;
                })
                .error(function(err){
                    console.log(err);
                })
        });

        $.submitSearchForm = function(){
            var latLng = $rootScope.marker.getPosition();
            console.log(latLng)
            flickr.search({ lat: latLng.lat(), lon: latLng.lng(), tags: $.tag, licenses: returnSelectedBoxesFilter($scope.licenses) })
                .success(function(data){
                    console.log(data);
                    $.arrayOfPhotos = data;
                })
                .error(function(err){
                    console.log(err)
                })
            } 

        $.submitLocationForm = function(){
            $.locations.push($.location);
            var location = $.location;
            $.location = "";
            geoCoder.geocodeAddress(location).then(function(data){
                var latLng = data[0].geometry.location;
                $.coords = { lat: latLng.lat(), lon: latLng.lng() };
                flickr.search({ lat: latLng.lat(), lon: latLng.lng(), tags: $.tag, licenses: returnSelectedBoxesFilter($scope.licenses) })
                    .success(function(data){
                        console.log(data);
                        $scope.arrayOfPhotos = data;
                    });
                }, function(err){
                    $.error = "Sorry, we did not recognise this location";
                });
            }

        $.geolocateUser = function(){
              $window.navigator.geolocation.getCurrentPosition(function(pos){
                    var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
                    $.coords = { lat: latLng.lat(), lon: latLng.lng() };
                    geoCoder.reverseGeocode(latLng).then(function(data){
                         $.locations.push(data[0].formatted_address)
                    })
                    flickr.search({ lat: pos.coords.latitude, lon: pos.coords.longitude, tags: $.tag, licenses: returnSelectedBoxesFilter($scope.licenses)})
                        .success(function(data){
                            $scope.arrayOfPhotos = data;
                        })
                    })
                }
           }])

    .filter("returnSelectedBoxes", function(){
        return function(ar){
            var arr = [];
            ar.forEach(function(a){
                if (a.checked === true){
                    arr.push(a.number);
                }
            })
            return arr;
        }
    })

    .factory('flickr', ['$http', function($http){
        var flickr = {
            search: function(search){
                return $http.post('/api/flickrapi', search);
            }
        }
        return flickr;
    }])

    .factory('geoCoder', ['$q', function($q){
         geocoder = new google.maps.Geocoder();
         var geoCoder = {
            reverseGeocode: function(latLon){
                var deferred = $q.defer();
                geocoder.geocode({ latLng: latLon }, 
                function(results, status){ 
                        if (status == google.maps.GeocoderStatus.OK){
                            return deferred.resolve(results);
                        }
                        return deferred.reject();
                })
                return deferred.promise;
            },
            geocodeAddress: function(address){
                 var deferred = $q.defer();
                 geocoder.geocode({
                    address: address
                 }, function(results, status){
                    if (status == google.maps.GeocoderStatus.OK){
                        return deferred.resolve(results);
                    }
                    return deferred.reject();
                 })
                 return deferred.promise;
            }
        }
        return geoCoder;

    }])
