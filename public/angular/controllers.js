angular.module('app')

    .controller("mainController", ['$scope', 'geoCoder', 'flickr', '$rootScope', '$http', 'returnArrayOfSelectedBoxesFilter',
        function($scope, geoCoder, flickr, $rootScope, $http, returnArrayOfSelectedBoxesFilter) {
        var $ = $scope;

        $.showAdvancedOptions = false;
        $.showRecentLocations = false;
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
            geoCoder.reverseGeocode(new google.maps.LatLng(l.lat, l.lng)).then(function(data){
                $.locations.push(data.results[0].formatted_address)
            })

            flickr.search({ lat: l.lat, lon: l.lon, tags: $.tag, licenses: returnArrayOfSelectedBoxesFilter($scope.licenses) })
                .success(function(data){
                    $.arrayOfPhotos = data;
                })
                .error(function(err){
                    console.log(err)
                })
        });

        $.submitSearchForm = function(){
            flickr.search({ lat: $rootScope.coordinates.lat, lon: $rootScope.coordinates.lon, tags: $.tag, licenses: returnArrayOfSelectedBoxesFilter($scope.licenses) })
                .success(function(data){
                    $.arrayOfPhotos = data;
                })
                .error(function(err){
                    console.log(err)
                })
            }) 

        $.submitLocationForm = function(){
            $.locations.push($.location);
            $.location = "";
            geoCoder.geocodeAddress($.location).then(function(data){
                var latLng = data.results[0].geometry.location;
                flickr.search({ lat: latLng.lat(), lon: latLng.lng(), tags: $.tag, licenses: returnArrayOfSelectedBoxesFilter($scope.licenses) })
                    .success(function(data){
                        $scope.arrayOfPhotos = data;
                    });
                }, function(err){
                    $.error = "Sorry, we did not recognise this location";
                });
            }

        $.geolocateUser = function(){
            // use html5 geolocation tool to obtain coordinates
            // flickr.search({ lat: [ ], lon: [ ], tag: $.tag, licenses: returnArrayOfSelectedBoxesFilter($scope.licenses) })
        }

    }])

    .filter("returnArrayOfSelectedBoxes", function(){
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
                var deferred = $q.defer;
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
                 var deferred = $q.defer;
                 geocoder.geocode({
                    address: address
                 }, function(results, status){
                    if (status == google.maps.GeocoderStatus.OK){
                        return deferred.resolve(results);
                    }
                    return deferred.reject());
                 })
                 return deferred.promise;
            }
        }
        return geoCoder;

    }])
